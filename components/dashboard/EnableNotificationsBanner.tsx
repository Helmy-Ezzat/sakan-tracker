"use client";

import { Button } from "@/components/ui/Button";
import { ar } from "@/lib/i18n/ar";
import { isPushSupported, registerForPushNotifications } from "@/lib/push/client";
import { useEffect, useState } from "react";

const DISMISS_KEY = "sakan_push_dismissed";

export function EnableNotificationsBanner() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function check() {
      if (!isPushSupported()) return;
      if (localStorage.getItem(DISMISS_KEY) === "1") return;

      const permission = Notification.permission;
      if (permission === "denied") return;

      if (permission === "granted") {
        const registration = await navigator.serviceWorker.getRegistration("/");
        const existing = await registration?.pushManager.getSubscription();
        if (existing) return;
      }

      setVisible(true);
    }

    void check();
  }, []);

  if (!visible) return null;

  async function handleEnable() {
    setLoading(true);
    setStatus(null);
    try {
      const result = await registerForPushNotifications();
      if (result === "granted") {
        setStatus(ar.notifications.enabled);
        window.setTimeout(() => setVisible(false), 1800);
        return;
      }
      if (result === "denied") {
        setStatus(ar.notifications.denied);
        localStorage.setItem(DISMISS_KEY, "1");
        window.setTimeout(() => setVisible(false), 2500);
        return;
      }
      if (result === "misconfigured") {
        setStatus(ar.notifications.pushNotConfigured);
        return;
      }
      setStatus(ar.notifications.pushUnsupported);
    } catch {
      setStatus(ar.notifications.pushSaveFailed);
    } finally {
      setLoading(false);
    }
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
      <p className="font-medium text-foreground">{ar.notifications.enableTitle}</p>
      <p className="mt-1 text-sm text-muted">{ar.notifications.enableBody}</p>
      <p className="mt-2 text-xs text-muted">{ar.notifications.installHint}</p>
      {status ? (
        <p className="mt-2 text-sm text-success">{status}</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button type="button" fullWidth disabled={loading} onClick={handleEnable}>
            {loading ? ar.notifications.enabling : ar.notifications.enableAction}
          </Button>
          <Button
            type="button"
            variant="ghost"
            fullWidth
            disabled={loading}
            onClick={handleDismiss}
          >
            {ar.dashboard.cancel}
          </Button>
        </div>
      )}
    </div>
  );
}
