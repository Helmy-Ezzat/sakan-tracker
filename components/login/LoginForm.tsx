"use client";

import { loginUser, type LoginResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ar } from "@/lib/i18n/ar";
import { useActionState } from "react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginResult | null, FormData>(
    loginUser,
    null,
  );

  return (
    <form action={formAction} className="flex w-full flex-col gap-5">
      {state && !state.success ? (
        <p
          className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <Input
        label={ar.auth.nameLabel}
        name="name"
        autoComplete="name"
        placeholder={ar.auth.namePlaceholder}
        required
        disabled={isPending}
      />
      <Input
        label={ar.auth.phoneLabel}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder={ar.auth.phonePlaceholder}
        required
        disabled={isPending}
      />
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? ar.auth.signingIn : ar.auth.continue}
      </Button>
    </form>
  );
}
