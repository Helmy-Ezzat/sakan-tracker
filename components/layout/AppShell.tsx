import { BottomNav } from "@/components/layout/BottomNav";
import { APP_NAME } from "@/lib/constants";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  title?: string;
}

export function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pt-[env(safe-area-inset-top)]">
        <div className="app-container flex h-14 items-center px-4">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            {title ?? APP_NAME}
          </h1>
        </div>
      </header>

      <main className="app-container flex-1 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-4">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
