import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

/** Floating action button — add expense. */
export function FAB({ label, className, children, ...props }: FABProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] end-4 z-40 flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95 touch-manipulation",
        "max-w-[var(--app-max-width)] sm:end-[calc(50%-var(--app-max-width)/2+1rem)]",
        className,
      )}
      {...props}
    >
      <span className="text-2xl font-light leading-none">{children ?? "+"}</span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}
