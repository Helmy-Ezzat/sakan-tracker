"use client";

import { settleSession } from "@/app/actions/settle";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { ar } from "@/lib/i18n/ar";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface SettleCycleButtonProps {
  isAdmin: boolean;
  hasExpenses: boolean;
}

export function SettleCycleButton({ isAdmin, hasExpenses }: SettleCycleButtonProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAdmin) return null;

  async function handleConfirm() {
    setError(null);
    setIsLoading(true);
    try {
      const result = await settleSession();
      if (!result.success) {
        setError(result.error);
        setIsLoading(false);
        setOpen(false);
      } else {
        toast(ar.dashboard.settlementCompletedToast);
      }
      // If success, redirect happens automatically in the action
    } catch {
      setError("حصل خطأ غير متوقع");
      setIsLoading(false);
      setOpen(false);
    }
  }

  function handleOpenDialog() {
    if (!hasExpenses) {
      setError("مفيش مصاريف في الميز عشان تقفله. سجل مصاريف الأول.");
      return;
    }
    setError(null);
    setOpen(true);
  }

  return (
    <>
      {error ? (
        <p
          className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        variant="primary"
        fullWidth
        onClick={handleOpenDialog}
        className="shadow-lg shadow-primary/20"
      >
        <span className="flex items-center justify-center gap-2">
          <CheckCircle2 size={18} strokeWidth={2} />
          <span>{ar.dashboard.settleCycle}</span>
        </span>
      </Button>

      <ConfirmDialog
        open={open}
        title={ar.dashboard.settleConfirmTitle}
        description={ar.dashboard.settleConfirmBody}
        confirmLabel={ar.dashboard.settleConfirmAction}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!isLoading) {
            setOpen(false);
            setError(null);
          }
        }}
      />
    </>
  );
}
