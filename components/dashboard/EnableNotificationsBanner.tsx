"use client";

import { Button } from "@/components/ui/Button";
import { ar } from "@/lib/i18n/ar";
import {
  completePushSetup,
  isPushSupported,
  registerForPushNotifications,
} from "@/lib/push/client";
import {
  getPushSetupState,
  isIOSSafari,
  isStandalonePwa,
  type PushSetupState,
} from "@/lib/push/permission";
import { useCallback, useEffect, useState } from "react";

export function EnableNotificationsBanner() {
  const [state, setState] = useState<PushSetupState | "loading">("loading");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isPushSupported()) {
      setState("unsupported");
      return;
    }
    const next = await getPushSetupState();
    setState(next);
  }, []);

  useEffect(() => {
    void refresh();

    function onVisible() {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refresh]);

  if (state === "loading" || state === "ready" || state === "unsupported") {
    return null;
  }

  async function handleEnable() {
    setLoading(true);
    setStatus(null);
    try {
      const register =
        state === "needs_subscription"
          ? completePushSetup
          : registerForPushNotifications;

      const result = await register();

      if (result === "granted") {
        setStatus(ar.notifications.enabled);
        await refresh();
        return;
      }
      if (result === "denied") {
        setState("denied");
        setStatus(ar.notifications.denied);
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

  if (state === "denied") {
    const showIosInstall = isIOSSafari() && !isStandalonePwa();

    return (
      <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4">
        <p className="font-medium text-foreground">{ar.notifications.denied}</p>
        <p className="mt-2 text-sm text-muted">{ar.notifications.deniedHintChrome}</p>
        <p className="mt-2 text-sm text-muted">{ar.notifications.deniedHintSafari}</p>
        {showIosInstall ? (
          <p className="mt-2 text-xs text-muted">
            {ar.notifications.deniedHintIosInstall}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-primary">
          بعد ما تفتح الإذن من الإعدادات، ارجع للتطبيق — هيتحدث لوحده.
        </p>
      </div>
    );
  }

  if (state === "misconfigured") {
    return (
      <div className="rounded-2xl border border-danger/40 bg-danger/10 p-4">
        <p className="text-sm text-danger">{ar.notifications.pushNotConfigured}</p>
      </div>
    );
  }

  const isResume = state === "needs_subscription";
  const title = isResume
    ? ar.notifications.needsSubscriptionTitle
    : ar.notifications.enableTitle;
  const body = isResume
    ? ar.notifications.needsSubscriptionBody
    : ar.notifications.enableBody;
  const action = isResume
    ? ar.notifications.completeSetupAction
    : ar.notifications.enableAction;

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
      {!isResume ? (
        <p className="mt-2 text-xs text-muted">{ar.notifications.installHint}</p>
      ) : null}
      {status ? (
        <p
          className={`mt-2 text-sm ${status === ar.notifications.denied ? "text-warning" : "text-success"}`}
        >
          {status}
        </p>
      ) : (
        <div className="mt-3">
          <Button type="button" fullWidth disabled={loading} onClick={handleEnable}>
            {loading ? ar.notifications.enabling : action}
          </Button>
        </div>
      )}
    </div>
  );
}
