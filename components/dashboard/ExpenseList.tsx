"use client";

import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EditExpenseDialog } from "@/components/dashboard/EditExpenseDialog";
import { ar } from "@/lib/i18n/ar";
import { formatCurrency } from "@/lib/utils";
import type { Expense, User } from "@/types/database";
import { useState } from "react";

interface ExpenseListProps {
  expenses: Expense[];
  usersById: Record<string, User>;
  currentUserId: string;
  onDelete: (expenseId: string) => Promise<void>;
  onUpdate: (expenseId: string, amount: string, description: string) => Promise<void>;
}

export function ExpenseList({
  expenses,
  usersById,
  currentUserId,
  onDelete,
  onUpdate,
}: ExpenseListProps) {
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [pendingEdit, setPendingEdit] = useState<Expense | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(pendingDelete.id);
      setPendingDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : ar.dashboard.errors.deleteFailed,
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleUpdate(amount: string, description: string) {
    if (!pendingEdit) return;
    setIsUpdating(true);
    setUpdateError(null);
    try {
      await onUpdate(pendingEdit.id, amount, description);
      setPendingEdit(null);
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : ar.dashboard.errors.updateExpenseFailed,
      );
    } finally {
      setIsUpdating(false);
    }
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">{ar.dashboard.noExpenses}</p>
      </Card>
    );
  }

  return (
    <>
      <section className="space-y-2" aria-labelledby="expenses-heading">
        <h2 id="expenses-heading" className="text-sm font-medium text-muted">
          {ar.dashboard.recentExpenses}
        </h2>
        <ul className="space-y-2">
          {expenses.map((expense) => {
            const isOwn = expense.user_id === currentUserId;

            return (
              <li key={expense.id}>
                <Card className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{expense.description}</p>
                    <p className="text-xs text-muted">
                      {usersById[expense.user_id]?.name ??
                        ar.dashboard.unknownUser}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="font-semibold tabular-nums">
                      {formatCurrency(Number(expense.amount))}
                    </span>
                    {isOwn ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPendingEdit(expense)}
                          className="text-xs font-medium text-primary touch-manipulation hover:underline"
                        >
                          {ar.dashboard.editExpense}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(expense)}
                          className="text-xs font-medium text-danger touch-manipulation hover:underline"
                        >
                          {ar.dashboard.deleteExpense}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <ConfirmDialog
        open={pendingDelete != null}
        title={ar.dashboard.deleteConfirmTitle}
        description={ar.dashboard.deleteConfirmBody}
        error={deleteError}
        confirmLabel={ar.dashboard.deleteConfirmAction}
        variant="danger"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!isDeleting) {
            setPendingDelete(null);
            setDeleteError(null);
          }
        }}
      />

      <EditExpenseDialog
        expense={pendingEdit}
        isLoading={isUpdating}
        error={updateError}
        onSave={handleUpdate}
        onCancel={() => {
          if (!isUpdating) {
            setPendingEdit(null);
            setUpdateError(null);
          }
        }}
      />
    </>
  );
}
