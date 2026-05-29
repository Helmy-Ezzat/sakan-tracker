import { createAdminClient } from "@/lib/supabase/admin";
import type { Expense, Session, User } from "@/types/database";

export type DashboardData = {
  session: Session;
  expenses: Expense[];
  members: User[];
  usersById: Record<string, User>;
};

export async function getOrCreateActiveSession(roomCode: string): Promise<Session> {
  const supabase = createAdminClient();

  const { data: existing, error: selectError } = await supabase
    .from("sessions")
    .select("*")
    .eq("room_code", roomCode)
    .eq("status", "active")
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing;

  const { data: created, error: insertError } = await supabase
    .from("sessions")
    .insert({ status: "active", room_code: roomCode })
    .select()
    .single();

  if (insertError) throw insertError;
  return created;
}

export async function ensureSessionMember(
  sessionId: string,
  userId: string,
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("session_members")
    .upsert(
      { session_id: sessionId, user_id: userId },
      { onConflict: "session_id,user_id" },
    );

  if (error) throw error;
}

export async function getDashboardData(
  sessionId: string,
): Promise<Omit<DashboardData, "session"> & { session: Session }> {
  const supabase = createAdminClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("status", "active")
    .maybeSingle();

  if (sessionError) throw sessionError;
  if (!session) {
    throw new Error("No active session found.");
  }

  const [expensesResult, membersResult] = await Promise.all([
    supabase
      .from("expenses")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false }),
    supabase
      .from("session_members")
      .select("user_id, users(*)")
      .eq("session_id", sessionId),
  ]);

  if (expensesResult.error) throw expensesResult.error;
  if (membersResult.error) throw membersResult.error;

  const members: User[] = (membersResult.data ?? [])
    .map((row) => {
      const user = row.users as unknown;
      if (!user || Array.isArray(user)) return null;
      return {
        ...(user as User),
        role: ((user as User).role ?? "user") as User["role"],
      };
    })
    .filter((u): u is User => u != null);

  const usersById = Object.fromEntries(members.map((u) => [u.id, u]));

  return {
    session,
    expenses: expensesResult.data ?? [],
    members,
    usersById,
  };
}

export async function insertExpense(params: {
  sessionId: string;
  userId: string;
  roomCode: string;
  amount: number;
  description: string;
}): Promise<Expense> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      session_id: params.sessionId,
      user_id: params.userId,
      room_code: params.roomCode,
      amount: params.amount,
      description: params.description,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteOwnExpense(
  expenseId: string,
  callerUserId: string,
): Promise<void> {
  const supabase = createAdminClient();

  const { data: expense, error: fetchError } = await supabase
    .from("expenses")
    .select("id, user_id, session_id")
    .eq("id", expenseId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!expense) {
    throw new Error("expense_not_found");
  }
  if (expense.user_id !== callerUserId) {
    throw new Error("forbidden");
  }

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("status")
    .eq("id", expense.session_id)
    .maybeSingle();

  if (sessionError) throw sessionError;
  if (!session || session.status !== "active") {
    throw new Error("session_not_active");
  }

  const { error: deleteError } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId);

  if (deleteError) throw deleteError;
}

export async function settleAndStartNewSession(
  callerUserId: string,
  roomCode: string,
): Promise<string> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("settle_and_start_new_session", {
    caller_user_id: callerUserId,
    p_room_code: roomCode,
  });

  if (error) throw error;
  return data as string;
}
