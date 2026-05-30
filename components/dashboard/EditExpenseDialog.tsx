"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ar } from "@/lib/i18n/ar";
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

  if (!expense) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave(amount, description);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onCancel();
      }}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-surface p-6 sm:rounded-2xl"
        role="dialog"
        aria-labelledby="edit-expense-title"
      >
        <h2 id="edit-expense-title" className="text-lg font-semibold">
          {ar.dashboard.editExpenseTitle}
        </h2>
        <p className="mt-1 text-sm text-muted">
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

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onCancel}
              disabled={isLoading}
            >
              {ar.dashboard.cancel}
            </Button>
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? ar.dashboard.updating : ar.dashboard.updateExpense}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
