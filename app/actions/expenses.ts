"use server";

import { getUserIdFromCookies } from "@/lib/auth/cookies";
import {
  deleteOwnExpense,
  ensureSessionMember,
  getDashboardData,
  getOrCreateActiveSession,
  insertExpense,
} from "@/lib/data/session";
import { getUserById } from "@/lib/data/users";
import { getErrorMessage } from "@/lib/errors";
import { ar } from "@/lib/i18n/ar";
import { sendExpensePushNotifications } from "@/lib/push/send";
import { formatCurrency } from "@/lib/utils";
import { parseExpenseAmount } from "@/lib/validation/expense";
import type { Expense } from "@/types/database";
import { revalidatePath } from "next/cache";

export type AddExpenseResult =
  | { success: true; expense: Expense }
  | { success: false; error: string };

export async function addExpense(input: {
  amount: string;
  description: string;
}): Promise<AddExpenseResult> {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return { success: false, error: ar.dashboard.errors.signInAgain };
  }

  const user = await getUserById(userId);
  if (!user) {
    return { success: false, error: ar.dashboard.errors.signInAgain };
  }

  const amount = parseExpenseAmount(input.amount);
  if (amount == null) {
    return { success: false, error: ar.dashboard.errors.amountInvalid };
  }

  const description = input.description.trim();
  if (!description) {
    return { success: false, error: ar.dashboard.errors.descriptionRequired };
  }

  try {
    const session = await getOrCreateActiveSession();
    await ensureSessionMember(session.id, userId);

    const expense = await insertExpense({
      sessionId: session.id,
      userId,
      amount,
      description,
    });

    void sendExpensePushNotifications({
      sessionId: session.id,
      excludeUserId: userId,
      expenseId: expense.id,
      userName: user.name,
      amountLabel: formatCurrency(amount),
      description,
    }).catch(() => {
      /* push is best-effort */
    });

    revalidatePath("/dashboard");
    return { success: true, expense };
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err, ar.dashboard.errors.saveExpenseFailed),
    };
  }
}

export type DeleteExpenseResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteExpense(
  expenseId: string,
): Promise<DeleteExpenseResult> {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return { success: false, error: ar.dashboard.errors.signInAgain };
  }

  try {
    await deleteOwnExpense(expenseId, userId);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err, ar.dashboard.errors.deleteFailed),
    };
  }
}

export async function loadDashboardForUser() {
  const userId = await getUserIdFromCookies();
  if (!userId) return null;

  const user = await getUserById(userId);
  if (!user) return null;

  const session = await getOrCreateActiveSession();
  await ensureSessionMember(session.id, userId);

  const data = await getDashboardData(session.id);
  return { ...data, currentUser: user };
}
