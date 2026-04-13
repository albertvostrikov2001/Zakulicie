import { cn } from "@/lib/cn";

export function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-content px-4 pb-section-mobile pt-28 md:px-8 md:pb-section md:pt-32", className)}>
      {children}
    </div>
  );
}
