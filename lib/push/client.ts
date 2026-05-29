"use client";

import { savePushSubscription } from "@/app/actions/push";
import type { PushSubscriptionInput } from "@/lib/push/types";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

function subscriptionToInput(
  subscription: PushSubscription,
): PushSubscriptionInput {
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error("Invalid push subscription");
  }
  return {
    endpoint: json.endpoint,
    keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
  };
}

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> {
  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
    updateViaCache: "none",
  });
  await navigator.serviceWorker.ready;
  return registration;
}

async function subscribeWithCurrentVapid(
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string,
): Promise<PushSubscription> {
  const options = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
  };

  try {
    return await registration.pushManager.subscribe(options);
  } catch {
    const stale = await registration.pushManager.getSubscription();
    if (stale) {
      await stale.unsubscribe();
    }
    return registration.pushManager.subscribe(options);
  }
}

/** Re-save an existing browser subscription to Supabase (e.g. after DB reset). */
export async function syncPushSubscription(): Promise<boolean> {
  if (!isPushSupported() || Notification.permission !== "granted") {
    return false;
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) return false;

  try {
    const registration = await getServiceWorkerRegistration();
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return false;

    const result = await savePushSubscription(subscriptionToInput(subscription));
    return result.success;
  } catch {
    return false;
  }
}

export async function registerForPushNotifications(): Promise<
  "granted" | "denied" | "unsupported" | "misconfigured"
> {
  if (!isPushSupported()) return "unsupported";

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) return "misconfigured";

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return "denied";

  const registration = await getServiceWorkerRegistration();

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await subscribeWithCurrentVapid(registration, vapidPublicKey);
  }

  const result = await savePushSubscription(subscriptionToInput(subscription));
  if (!result.success) {
    throw new Error(result.error);
  }

  return "granted";
}
