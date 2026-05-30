"use client";

import { Button } from "@/components/ui/Button";
import { ar } from "@/lib/i18n/ar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  error?: string | null;
  confirmLabel: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  error,
  confirmLabel,
  variant = "primary",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
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
      if (e.key === "Escape" && !isLoading) onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isLoading, onCancel]);

  return (
    <div
      className={cn("fixed inset-0 z-[60] h-full", !open && "pointer-events-none")}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label={ar.dashboard.cancel}
        tabIndex={open ? 0 : -1}
        onClick={onCancel}
        disabled={isLoading}
        className={cn(
          "absolute inset-0 bg-black/65 backdrop-blur-[2px] transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className={cn(
          "absolute bottom-0 inset-x-0 sm:inset-x-4 sm:top-1/2 sm:bottom-auto mx-auto w-full max-w-sm sm:-translate-y-1/2",
          "rounded-t-2xl sm:rounded-2xl border-t sm:border border-border bg-surface-elevated p-6 shadow-xl",
          "transition-all duration-200",
          open ? "translate-y-0 sm:scale-100 opacity-100" : "translate-y-full sm:scale-95 opacity-0",
        )}
      >
        <h2
          id="confirm-dialog-title"
          className={cn(
            "text-lg font-semibold",
            variant === "danger" ? "text-danger" : "text-warning"
          )}
        >
          {title}
        </h2>
        <p id="confirm-dialog-desc" className="mt-2 text-sm text-foreground/80">
          {description}
        </p>
        {error ? (
          <p className="mt-3 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3">
          <Button
            type="button"
            variant={variant === "danger" ? "danger" : "primary"}
            fullWidth
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? ar.dashboard.saving : confirmLabel}
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={isLoading}
            onClick={onCancel}
          >
            {ar.dashboard.cancel}
          </Button>
        </div>
      </div>
    </div>
  );
}
