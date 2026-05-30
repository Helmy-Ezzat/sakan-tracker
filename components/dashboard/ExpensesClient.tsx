"use client";

import { addExpense, deleteExpense, updateExpense } from "@/app/actions/expenses";
import { AddExpenseBottomSheet } from "@/components/dashboard/AddExpenseBottomSheet";
import { ExpenseList } from "@/components/dashboard/ExpenseList";

import { FAB } from "@/components/ui/FAB";
import { useToast } from "@/components/ui/Toast";
import type { DashboardData } from "@/lib/data/session";
import { ar } from "@/lib/i18n/ar";
import { syncPushSubscription } from "@/lib/push/client";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import type { Expense, User } from "@/types/database";
import { useCallback, useEffect, useMemo, useState } from "react";

type ExpensesClientProps = DashboardData & {
  currentUser: User;
  roomCode: string;
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

export function ExpensesClient({
  session,
  expenses: initialExpenses,
  members,
  usersById,
  currentUser,
  roomCode,
}: ExpensesClientProps) {
  const { notifyExpense } = useToast();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);

  useEffect(() => {
    setExpenses(initialExpenses);
  }, [initialExpenses]);

  useEffect(() => {
    void syncPushSubscription();
  }, []);

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
          filter: `room_code=eq.${roomCode}`,
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
  }, [session.id, roomCode, applyRealtime]);

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

  async function handleUpdateExpense(
    expenseId: string,
    amount: string,
    description: string,
  ) {
    const result = await updateExpense({ expenseId, amount, description });
    if (!result.success) {
      throw new Error(result.error);
    }
    setExpenses((prev) => mergeExpense(prev, result.expense));
  }

  return (
    <div className="space-y-6">
      <ExpenseList
        expenses={expenses}
        usersById={usersById}
        currentUserId={currentUser.id}
        onDelete={handleDeleteExpense}
        onUpdate={handleUpdateExpense}
      />

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
