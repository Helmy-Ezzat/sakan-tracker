"use client";

import {
  AddExpenseForm,
  type AddExpenseValues,
} from "@/components/dashboard/AddExpenseForm";
import { ar } from "@/lib/i18n/ar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface AddExpenseBottomSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: AddExpenseValues) => Promise<void>;
}

export function AddExpenseBottomSheet({
  open,
  onClose,
  onSave,
}: AddExpenseBottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  async function handleSave(values: AddExpenseValues) {
    await onSave(values);
    onClose();
  }

  return (
    <div
      className={cn("fixed inset-0 z-50", !open && "pointer-events-none")}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label={ar.dashboard.closeAddExpense}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ease-out",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-expense-title"
        className={cn(
          "absolute inset-x-0 bottom-0 mx-auto w-full max-w-[var(--app-max-width)]",
          "rounded-t-2xl border-t border-border bg-surface-elevated shadow-[0_-8px_40px_rgba(0,0,0,0.45)]",
          "transition-transform duration-300 ease-out will-change-transform",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex justify-center pt-3 pb-1" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-border" />
        </div>

        <div className="px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-2">
          <h2
            id="add-expense-title"
            className="mb-1 text-lg font-semibold tracking-tight text-foreground"
          >
            {ar.dashboard.addExpenseTitle}
          </h2>
          <p className="mb-5 text-sm text-muted">{ar.dashboard.addExpenseSubtitle}</p>

          {open ? (
            <AddExpenseForm
              key="add-expense-form"
              onCancel={onClose}
              onSave={handleSave}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
