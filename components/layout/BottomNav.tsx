"use client";

import { ROUTES } from "@/lib/constants";
import { ar } from "@/lib/i18n/ar";
import { cn } from "@/lib/utils";
import { Home, ShoppingCart, Scale, Archive, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: ROUTES.dashboard, label: ar.nav.dashboard, icon: Home },
  { href: ROUTES.expenses, label: ar.nav.expenses, icon: ShoppingCart },
  { href: ROUTES.settlement, label: ar.nav.settlement, icon: Scale },
  { href: ROUTES.archive, label: ar.nav.archive, icon: Archive },
  { href: ROUTES.settings, label: ar.nav.settings, icon: Settings },
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
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors touch-manipulation",
                isActive ? "text-primary" : "text-muted hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} strokeWidth={2} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
