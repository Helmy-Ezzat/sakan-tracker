"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ar } from "@/lib/i18n/ar";
import { cn } from "@/lib/utils";
import type { Expense } from "@/types/database";
import { useEffect, useState } from "react";

interface EditExpenseDialogProps {
  expense: Expense | null;
  isLoading: boolean;
  error: string | null;
  onSave: (amount: string, description: string) => Promise<void>;
  onCancel: () => void;
}

export function EditExpenseDialog({
  expense,
  isLoading,
  error,
  onSave,
  onCancel,
}: EditExpenseDialogProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (expense) {
      setAmount(String(expense.amount));
      setDescription(expense.description);
    }
  }, [expense]);

  useEffect(() => {
    if (!expense) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expense]);

  useEffect(() => {
    if (!expense) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isLoading) onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expense, isLoading, onCancel]);

  if (!expense) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave(amount, description);
  }

  return (
    <div className="fixed inset-0 z-[70] h-full">
      <button
        type="button"
        aria-label={ar.dashboard.cancel}
        onClick={onCancel}
        disabled={isLoading}
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px] transition-opacity duration-200"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-expense-title"
        className={cn(
          "absolute bottom-0 inset-x-0 sm:inset-x-4 sm:top-1/2 sm:bottom-auto mx-auto w-full max-w-sm sm:-translate-y-1/2",
          "rounded-t-2xl sm:rounded-2xl border-t sm:border border-border bg-surface-elevated p-6 shadow-xl"
        )}
      >
        <h2 id="edit-expense-title" className="text-lg font-semibold">
          {ar.dashboard.editExpenseTitle}
        </h2>
        <p className="mt-1 text-sm text-foreground/80">
          {ar.dashboard.editExpenseSubtitle}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label={ar.dashboard.amount}
            type="number"
            step="0.01"
            min="0"
            placeholder={ar.dashboard.amountPlaceholder}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
            required
          />

          <Input
            label={ar.dashboard.description}
            type="text"
            placeholder={ar.dashboard.descriptionPlaceholder}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            required
          />

          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3">
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? ar.dashboard.updating : ar.dashboard.updateExpense}
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onCancel}
              disabled={isLoading}
            >
              {ar.dashboard.cancel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
