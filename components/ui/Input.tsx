import { cn } from "@/lib/cn";
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-card border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition duration-base ease-base focus:border-accent/60 focus:ring-1 focus:ring-accent/40",
          className
        )}
        {...props}
      />
    );
  }
);
