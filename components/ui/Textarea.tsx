import { cn } from "@/lib/cn";
import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full resize-y rounded-card border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition duration-base ease-base focus:border-accent/60 focus:ring-1 focus:ring-accent/40",
        className
      )}
      {...props}
    />
  );
});
