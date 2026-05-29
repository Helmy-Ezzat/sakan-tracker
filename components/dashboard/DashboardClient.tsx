"use client";

import { addExpense, deleteExpense } from "@/app/actions/expenses";
import { AddExpenseBottomSheet } from "@/components/dashboard/AddExpenseBottomSheet";
import { ExpenseList } from "@/components/dashboard/ExpenseList";
import { SessionHeader } from "@/components/dashboard/SessionHeader";
import { SettleCycleButton } from "@/components/dashboard/SettleCycleButton";
import { SettlementSummary } from "@/components/dashboard/SettlementSummary";
import { EnableNotificationsBanner } from "@/components/dashboard/EnableNotificationsBanner";
import { FAB } from "@/components/ui/FAB";
import { useToast } from "@/components/ui/Toast";
import type { DashboardData } from "@/lib/data/session";
import { ar } from "@/lib/i18n/ar";
import { createClient } from "@/lib/supabase/client";
import { calculateSettlement, formatCurrency } from "@/lib/utils";
import type { Expense, User } from "@/types/database";
import { useCallback, useEffect, useMemo, useState } from "react";

type DashboardClientProps = DashboardData & {
  currentUser: User;
};

function mergeExpense(list: Expense[], expense: Expense): Expense[] {
  const idx = list.findIndex((e) => e.id === expense.id);
  if (idx === -1) {
    return [expense, ...list].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }
  const next = [...list];
  next[idx] = expense;
  return next;
}

export function DashboardClient({
  session,
  expenses: initialExpenses,
  members,
  usersById,
  currentUser,
}: DashboardClientProps) {
  const { notifyExpense } = useToast();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);

  useEffect(() => {
    setExpenses(initialExpenses);
  }, [initialExpenses]);

  const applyRealtime = useCallback(
    (payload: { eventType: string; new: Expense; old: Expense }) => {
      if (payload.eventType === "INSERT") {
        const expense = payload.new;
        setExpenses((prev) => mergeExpense(prev, expense));
        if (expense.user_id !== currentUser.id) {
          const name =
            usersById[expense.user_id]?.name ?? ar.dashboard.unknownUser;
          notifyExpense({
            id: expense.id,
            userName: name,
            amount: formatCurrency(Number(expense.amount)),
            description: expense.description,
          });
        }
      } else if (payload.eventType === "UPDATE") {
        setExpenses((prev) => mergeExpense(prev, payload.new));
      } else if (payload.eventType === "DELETE") {
        setExpenses((prev) => prev.filter((e) => e.id !== payload.old.id));
      }
    },
    [currentUser.id, notifyExpense, usersById],
  );

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`expenses:${session.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "expenses",
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          applyRealtime({
            eventType: payload.eventType,
            new: payload.new as Expense,
            old: payload.old as Expense,
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [session.id, applyRealtime]);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [expenses],
  );

  const settlement = useMemo(
    () => calculateSettlement(expenses, members),
    [expenses, members],
  );

  async function handleSaveExpense(values: {
    amount: string;
    description: string;
  }) {
    const result = await addExpense(values);
    if (!result.success) {
      throw new Error(result.error);
    }
    setExpenses((prev) => mergeExpense(prev, result.expense));
  }

  async function handleDeleteExpense(expenseId: string) {
    const result = await deleteExpense(expenseId);
    if (!result.success) {
      throw new Error(result.error);
    }
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  }

  return (
    <div className="space-y-6">
      <EnableNotificationsBanner />
      <SessionHeader
        totalExpenses={totalExpenses}
        memberCount={members.length}
      />
      <SettlementSummary lines={settlement} />
      <ExpenseList
        expenses={expenses}
        usersById={usersById}
        currentUserId={currentUser.id}
        onDelete={handleDeleteExpense}
      />
      <SettleCycleButton isAdmin={currentUser.role === "admin"} />

      <FAB
        label={ar.dashboard.addExpense}
        onClick={() => setAddExpenseOpen(true)}
      />

      <AddExpenseBottomSheet
        open={addExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        onSave={handleSaveExpense}
      />
    </div>
  );
}
