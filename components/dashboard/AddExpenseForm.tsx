"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ar } from "@/lib/i18n/ar";
import { useState } from "react";

export type AddExpenseValues = {
  amount: string;
  description: string;
};

interface AddExpenseFormProps {
  onCancel: () => void;
  onSave: (values: AddExpenseValues) => Promise<void>;
}

export function AddExpenseForm({ onCancel, onSave }: AddExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSave({
        amount: amount.trim(),
        description: description.trim(),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : ar.dashboard.errors.saveFailed,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error ? (
        <p
          className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="expense-amount" className="text-sm font-medium text-muted">
          {ar.dashboard.amount}
        </label>
        <div className="relative">
          <input
            id="expense-amount"
            name="amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder={ar.dashboard.amountPlaceholder}
            required
            disabled={isSubmitting}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="min-h-12 w-full rounded-xl border border-border bg-surface-elevated py-3 ps-4 pe-16 text-base text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
          />
          <span
            className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-4 text-sm font-medium text-muted"
            aria-hidden
          >
           ريال
          </span>
        </div>
      </div>

      <Input
        label={ar.dashboard.description}
        name="description"
        id="expense-description"
        placeholder={ar.dashboard.descriptionPlaceholder}
        required
        disabled={isSubmitting}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? ar.dashboard.saving : ar.dashboard.saveExpense}
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={isSubmitting}
          onClick={onCancel}
        >
          {ar.dashboard.cancel}
        </Button>
      </div>
    </form>
  );
}
