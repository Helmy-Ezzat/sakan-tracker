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
        "fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] end-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-light text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95 touch-manipulation",
        "max-w-[var(--app-max-width)] sm:end-[calc(50%-var(--app-max-width)/2+1rem)]",
        className,
      )}
      {...props}
    >
      {children ?? "+"}
    </button>
  );
}
