"use client";

import { logoutUser } from "@/app/actions/logout";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ar } from "@/lib/i18n/ar";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try {
      await logoutUser();
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="danger"
        fullWidth
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center justify-center gap-2">
          <LogOut size={18} strokeWidth={2} />
          <span>{ar.settings.logout}</span>
        </span>
      </Button>

      <ConfirmDialog
        open={open}
        title={ar.settings.logoutConfirmTitle}
        description={ar.settings.logoutConfirmBody}
        confirmLabel={ar.settings.logoutConfirmAction}
        variant="danger"
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!isLoading) setOpen(false);
        }}
      />
    </>
  );
}
