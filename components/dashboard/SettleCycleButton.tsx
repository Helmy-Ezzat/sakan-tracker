"use client";

import { settleSession } from "@/app/actions/settle";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ar } from "@/lib/i18n/ar";
import { useState } from "react";

interface SettleCycleButtonProps {
  isAdmin: boolean;
}

export function SettleCycleButton({ isAdmin }: SettleCycleButtonProps) {
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
      }
    } catch {
      setIsLoading(false);
    }
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
        variant="secondary"
        fullWidth
        onClick={() => setOpen(true)}
      >
        {ar.dashboard.settleCycle}
      </Button>

      <ConfirmDialog
        open={open}
        title={ar.dashboard.settleConfirmTitle}
        description={ar.dashboard.settleConfirmBody}
        confirmLabel={ar.dashboard.settleConfirmAction}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!isLoading) setOpen(false);
        }}
      />
    </>
  );
}
