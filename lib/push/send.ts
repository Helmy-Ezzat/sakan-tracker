import {
  deletePushSubscription,
  getPushSubscriptionsForSession,
} from "@/lib/data/push";
import { ar } from "@/lib/i18n/ar";
import type { ExpensePushPayload } from "@/lib/push/types";
import { configureWebPush, isPushConfigured } from "@/lib/push/vapid";
import webpush from "web-push";

function getWebPushStatusCode(err: unknown): number | undefined {
  if (err && typeof err === "object" && "statusCode" in err) {
    const code = (err as { statusCode: unknown }).statusCode;
    return typeof code === "number" ? code : undefined;
  }
  return undefined;
}

/** Subscription expired or VAPID keys changed — remove so user can re-register. */
function isStaleSubscriptionError(status: number | undefined): boolean {
  return status === 401 || status === 403 || status === 404 || status === 410;
}

export type PushSendResult = {
  sent: number;
  failed: number;
  skipped: boolean;
  reason?: string;
};

export async function sendExpensePushNotifications(params: {
  sessionId: string;
  roomCode: string;
  excludeUserId: string;
  expenseId: string;
  userName: string;
  amountLabel: string;
  description: string;
}): Promise<PushSendResult> {
  if (!isPushConfigured()) {
    return { sent: 0, failed: 0, skipped: true, reason: "vapid_not_configured" };
  }

  configureWebPush();

  const subscriptions = await getPushSubscriptionsForSession(
    params.sessionId,
    params.roomCode,
    params.excludeUserId,
  );

  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0, skipped: true, reason: "no_subscriptions" };
  }

  const payload: ExpensePushPayload = {
    title: ar.appName,
    body: ar.dashboard.expenseAddedToast(
      params.userName,
      params.amountLabel,
      params.description,
    ),
    tag: `expense-${params.expenseId}`,
    url: "/dashboard",
  };

  const body = JSON.stringify(payload);
  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth_key },
          },
          body,
        );
        sent += 1;
      } catch (err) {
        failed += 1;
        const status = getWebPushStatusCode(err);
        if (process.env.NODE_ENV === "development") {
          console.error("[push] send failed", { status, endpoint: sub.endpoint, err });
        }
        if (isStaleSubscriptionError(status)) {
          await deletePushSubscription(sub.endpoint);
        }
      }
    }),
  );

  return { sent, failed, skipped: false };
}
