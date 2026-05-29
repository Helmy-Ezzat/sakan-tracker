"use client";

import {
  isPushSupported,
  syncPushSubscription,
} from "@/lib/push/client";

export type PushSetupState =
  | "unsupported"
  | "misconfigured"
  | "denied"
  | "needs_permission"
  | "needs_subscription"
  | "ready";

/** Current push setup step — use to drive the dashboard banner. */
export async function getPushSetupState(): Promise<PushSetupState> {
  if (!isPushSupported()) return "unsupported";

  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    return "misconfigured";
  }

  const permission = Notification.permission;

  if (permission === "denied") return "denied";
  if (permission === "default") return "needs_permission";

  const registration = await navigator.serviceWorker.getRegistration("/");
  const subscription = await registration?.pushManager.getSubscription();

  if (!subscription) return "needs_subscription";

  const synced = await syncPushSubscription();
  return synced ? "ready" : "needs_subscription";
}

export function isIOSSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|Chrome/.test(ua);
  return isIOS && isSafari;
}

export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).standalone === true
  );
}
