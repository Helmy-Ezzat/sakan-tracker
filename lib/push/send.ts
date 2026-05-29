import {
  deletePushSubscription,
  getPushSubscriptionsForSession,
} from "@/lib/data/push";
import { ar } from "@/lib/i18n/ar";
import type { ExpensePushPayload } from "@/lib/push/types";
import { configureWebPush, isPushConfigured } from "@/lib/push/vapid";
import webpush from "web-push";

export async function sendExpensePushNotifications(params: {
  sessionId: string;
  excludeUserId: string;
  expenseId: string;
  userName: string;
  amountLabel: string;
  description: string;
}): Promise<void> {
  if (!isPushConfigured()) return;

  configureWebPush();

  const subscriptions = await getPushSubscriptionsForSession(
    params.sessionId,
    params.excludeUserId,
  );

  if (subscriptions.length === 0) return;

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

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth_key },
          },
          body,
        );
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await deletePushSubscription(sub.endpoint);
        }
      }
    }),
  );
}
