"use server";

import { getRoomCodeFromCookies, getUserIdFromCookies } from "@/lib/auth/cookies";
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
  const roomCode = await getRoomCodeFromCookies();
  if (!userId || !roomCode) {
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
    await settleAndStartNewSession(userId, roomCode);
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err, ar.dashboard.errors.settleFailed),
    };
  }

  // Revalidate after successful settlement
  revalidatePath(ROUTES.dashboard);
  revalidatePath(ROUTES.expenses);
  revalidatePath(ROUTES.settlement);
  revalidatePath(ROUTES.archive);
  
  // Redirect throws, so it should be outside try/catch
  redirect(ROUTES.dashboard);
}
