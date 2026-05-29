"use client";

import { ar } from "@/lib/i18n/ar";
import type { ExpenseNotificationPayload } from "@/lib/notifications/types";
import { vibrateForNotification } from "@/lib/notifications/vibrate";
import { cn } from "@/lib/utils";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";

export type ToastItem =
  | { id: string; kind: "message"; message: string }
  | { id: string; kind: "expense"; payload: ExpenseNotificationPayload };

type ToastContextValue = {
  toast: (message: string) => void;
  notifyExpense: (payload: ExpenseNotificationPayload) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 5500;
const MAX_VISIBLE = 3;

function userInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (item: ToastItem) => {
      setItems((prev) => [item, ...prev].slice(0, MAX_VISIBLE));
      window.setTimeout(() => dismiss(item.id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  const toast = useCallback(
    (message: string) => {
      push({ id: crypto.randomUUID(), kind: "message", message });
    },
    [push],
  );

  const notifyExpense = useCallback(
    (payload: ExpenseNotificationPayload) => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "visible"
      ) {
        vibrateForNotification();
        push({ id: payload.id, kind: "expense", payload });
      }
    },
    [push],
  );

  const value = useMemo(() => ({ toast, notifyExpense }), [toast, notifyExpense]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[200] flex flex-col gap-2 px-3 pt-[calc(env(safe-area-inset-top)+0.5rem)]"
        aria-live="assertive"
        aria-relevant="additions"
      >
        {items.map((item) =>
          item.kind === "expense" ? (
            <ExpenseNotificationCard
              key={item.id}
              payload={item.payload}
              onDismiss={() => dismiss(item.id)}
            />
          ) : (
            <div
              key={item.id}
              role="status"
              className={cn(
                "notify-slide-in pointer-events-auto mx-auto w-full max-w-[var(--app-max-width)]",
                "rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm shadow-xl",
              )}
            >
              {item.message}
            </div>
          ),
        )}
      </div>
    </ToastContext.Provider>
  );
}

function ExpenseNotificationCard({
  payload,
  onDismiss,
}: {
  payload: ExpenseNotificationPayload;
  onDismiss: () => void;
}) {
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef<number | null>(null);

  function onTouchStart(e: TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }

  function onTouchMove(e: TouchEvent) {
    if (touchStartY.current == null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta < 0) setDragY(delta);
  }

  function onTouchEnd() {
    if (dragY < -48) onDismiss();
    setDragY(0);
    touchStartY.current = null;
  }

  return (
    <button
      type="button"
      onClick={onDismiss}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ transform: dragY ? `translateY(${dragY}px)` : undefined }}
      className={cn(
        "notify-slide-in pointer-events-auto mx-auto flex w-full max-w-[var(--app-max-width)]",
        "items-center gap-3 rounded-2xl border border-primary/25 bg-[#1a2030]/98 p-3 text-start shadow-2xl",
        "backdrop-blur-md touch-manipulation active:scale-[0.99] transition-transform",
      )}
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground"
        aria-hidden
      >
        {userInitial(payload.userName)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-medium text-primary">
            {ar.appName}
          </span>
          <span className="shrink-0 text-[10px] text-muted">{ar.notifications.now}</span>
        </span>
        <span className="mt-0.5 block truncate text-sm font-semibold text-foreground">
          {payload.userName}
        </span>
        <span className="mt-0.5 block text-sm text-muted">
          <span className="font-medium text-foreground">{payload.amount}</span>
          {" · "}
          <span className="line-clamp-1">{payload.description}</span>
        </span>
      </span>
    </button>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
