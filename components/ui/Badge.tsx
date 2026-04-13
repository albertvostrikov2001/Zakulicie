import { cn } from "@/lib/cn";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-wider text-text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}
