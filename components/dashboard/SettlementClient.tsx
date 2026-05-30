"use client";

import { SettleCycleButton } from "@/components/dashboard/SettleCycleButton";
import { SettlementSummary } from "@/components/dashboard/SettlementSummary";

import type { DashboardData } from "@/lib/data/session";
import { createClient } from "@/lib/supabase/client";
import { calculateSettlement } from "@/lib/utils";
import type { Expense, User } from "@/types/database";
import { useCallback, useEffect, useMemo, useState } from "react";

type SettlementClientProps = DashboardData & {
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

export function SettlementClient({
  session,
  expenses: initialExpenses,
  members,
  currentUser,
  roomCode,
}: SettlementClientProps) {
  const [expenses, setExpenses] = useState(initialExpenses);

  useEffect(() => {
    setExpenses(initialExpenses);
  }, [initialExpenses]);

  const applyRealtime = useCallback(
    (payload: { eventType: string; new: Expense; old: Expense }) => {
      if (payload.eventType === "INSERT") {
        setExpenses((prev) => mergeExpense(prev, payload.new));
      } else if (payload.eventType === "UPDATE") {
        setExpenses((prev) => mergeExpense(prev, payload.new));
      } else if (payload.eventType === "DELETE") {
        setExpenses((prev) => prev.filter((e) => e.id !== payload.old.id));
      }
    },
    [],
  );

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`expenses:${session.id}:settlement`)
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

  const settlement = useMemo(
    () => calculateSettlement(expenses, members),
    [expenses, members],
  );

  return (
    <div className="space-y-6">
      <SettlementSummary lines={settlement} />
      <SettleCycleButton 
        isAdmin={currentUser.role === "admin"} 
        hasExpenses={expenses.length > 0}
      />
    </div>
  );
}
