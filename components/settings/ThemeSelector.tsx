"use client";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ar } from "@/lib/i18n/ar";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const options = [
  {
    value: "light" as const,
    label: ar.settings.themeLight,
    icon: <Sun/>,
  },
  {
    value: "dark" as const,
    label: ar.settings.themeDark,
    icon: <Moon/>,
  },
  {
    value: "system" as const,
    label: ar.settings.themeSystem,
    icon: <Monitor/>,
  },
];

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all touch-manipulation",
            theme === option.value
              ? "border-primary bg-primary/10"
              : "border-border bg-surface hover:bg-surface-muted"
          )}
        >
          <span className="text-2xl" aria-hidden>
            {option.icon}
          </span>
          <span className="text-xs font-medium text-center leading-tight">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
