"use client";

import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EditExpenseDialog } from "@/components/dashboard/EditExpenseDialog";
import { useToast } from "@/components/ui/Toast";
import { ar } from "@/lib/i18n/ar";
import { formatCurrency } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
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
  const { toast } = useToast();
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
      toast(ar.dashboard.expenseDeletedToast);
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
      toast(ar.dashboard.expenseUpdatedToast);
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
                <Card className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{expense.description}</p>
                      <p className="text-xs text-muted">
                        {usersById[expense.user_id]?.name ??
                          ar.dashboard.unknownUser}
                      </p>
                    </div>
                    <span className="shrink-0 font-semibold tabular-nums">
                      {formatCurrency(Number(expense.amount))}
                    </span>
                  </div>
                  {isOwn ? (
                    <div className="flex gap-2 pt-1 border-t border-border/50">
                      <button
                        type="button"
                        onClick={() => setPendingEdit(expense)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20 touch-manipulation"
                      >
                        <Pencil size={14} strokeWidth={2} />
                        <span>{ar.dashboard.editExpense}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(expense)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger transition-colors hover:bg-danger/20 touch-manipulation"
                      >
                        <Trash2 size={14} strokeWidth={2} />
                        <span>{ar.dashboard.deleteExpense}</span>
                      </button>
                    </div>
                  ) : null}
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
