import { cn } from "@/lib/cn";
import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-card border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition duration-base ease-base focus:border-accent/60 focus:ring-1 focus:ring-accent/40",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
