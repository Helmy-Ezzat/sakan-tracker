import { APP_NAME } from "@/lib/constants";
import { ar } from "@/lib/i18n/ar";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background pt-[env(safe-area-inset-top)]">
      <div className="app-container flex flex-1 flex-col justify-center px-4 py-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-primary">{APP_NAME}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {ar.auth.signInTitle}
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
