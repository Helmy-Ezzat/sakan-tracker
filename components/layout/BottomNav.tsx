"use client";

import { ROUTES } from "@/lib/constants";
import { ar } from "@/lib/i18n/ar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: ROUTES.dashboard, label: ar.nav.dashboard, icon: "◉" },
  { href: ROUTES.expenses, label: ar.nav.expenses, icon: "🛒" },
  { href: ROUTES.settlement, label: ar.nav.settlement, icon: "⚖️" },
  { href: ROUTES.archive, label: ar.nav.archive, icon: "▤" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 pb-[env(safe-area-inset-bottom)]"
      aria-label={ar.nav.main}
    >
      <div className="app-container flex h-16 items-stretch justify-around">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors touch-manipulation",
                isActive ? "text-primary" : "text-muted hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-lg leading-none" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
