import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
  muted?: boolean;
};

export function Section({ children, className, id, as: Tag = "section", muted }: Props) {
  return (
    <Tag
      id={id}
      className={cn(
        "px-4 py-section-mobile md:px-8 md:py-section",
        muted && "bg-surface/50",
        className
      )}
    >
      <div className="mx-auto w-full max-w-content">{children}</div>
    </Tag>
  );
}
