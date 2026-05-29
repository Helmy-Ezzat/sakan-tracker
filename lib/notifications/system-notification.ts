import { ar } from "@/lib/i18n/ar";
import type { ExpenseNotificationPayload } from "@/lib/notifications/types";

function notificationBody(payload: ExpenseNotificationPayload): string {
  return ar.dashboard.expenseAddedToast(
    payload.userName,
    payload.amount,
    payload.description,
  );
}

export function canUseSystemNotifications(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!canUseSystemNotifications()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!canUseSystemNotifications()) return "denied";
  return Notification.requestPermission();
}

/** OS-level banner when the tab/app is in the background (WhatsApp-style on mobile). */
export function showSystemExpenseNotification(
  payload: ExpenseNotificationPayload,
): void {
  if (!canUseSystemNotifications() || Notification.permission !== "granted") {
    return;
  }
  if (typeof document !== "undefined" && document.visibilityState === "visible") {
    return;
  }

  try {
    const notification = new Notification(ar.appName, {
      body: notificationBody(payload),
      icon: "/icon.svg",
      badge: "/icon.svg",
      tag: `expense-${payload.id}`,
      dir: "rtl",
      lang: "ar",
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch {
    // ignore — e.g. iOS restrictions
  }
}
