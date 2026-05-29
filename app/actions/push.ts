"use server";

import { getUserIdFromCookies } from "@/lib/auth/cookies";
import { upsertPushSubscription } from "@/lib/data/push";
import { getErrorMessage } from "@/lib/errors";
import { ar } from "@/lib/i18n/ar";
import type { PushSubscriptionInput } from "@/lib/push/types";
import { isPushConfigured } from "@/lib/push/vapid";

export type SavePushResult =
  | { success: true }
  | { success: false; error: string };

export async function savePushSubscription(
  subscription: PushSubscriptionInput,
): Promise<SavePushResult> {
  if (!isPushConfigured()) {
    return { success: false, error: ar.notifications.pushNotConfigured };
  }

  const userId = await getUserIdFromCookies();
  if (!userId) {
    return { success: false, error: ar.dashboard.errors.signInAgain };
  }

  try {
    await upsertPushSubscription(userId, subscription);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err, ar.notifications.pushSaveFailed),
    };
  }
}
