"use server";

import { getUserIdFromCookies } from "@/lib/auth/cookies";
import { settleAndStartNewSession } from "@/lib/data/session";
import { getUserById } from "@/lib/data/users";
import { getErrorMessage } from "@/lib/errors";
import { ar } from "@/lib/i18n/ar";
import { ROUTES } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type SettleResult =
  | { success: true }
  | { success: false; error: string };

export async function settleSession(): Promise<SettleResult> {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return { success: false, error: ar.dashboard.errors.signInAgain };
  }

  const user = await getUserById(userId);
  if (!user) {
    return { success: false, error: ar.dashboard.errors.signInAgain };
  }

  if (user.role !== "admin") {
    return { success: false, error: ar.dashboard.errors.adminRequired };
  }

  try {
    await settleAndStartNewSession(userId);
    revalidatePath("/dashboard");
    revalidatePath("/archive");
    redirect(ROUTES.dashboard);
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err, ar.dashboard.errors.settleFailed),
    };
  }
}
