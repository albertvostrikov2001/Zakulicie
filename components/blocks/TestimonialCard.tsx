"use client";

import type { Testimonial } from "@/lib/types";
import Image from "@/components/ui/SiteImage";
import { cn } from "@/lib/cn";

type Props = {
  item: Testimonial;
  className?: string;
};

export function TestimonialCard({ item, className }: Props) {
  const initials = item.company
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <article
      className={cn(
        "flex h-full min-h-[280px] flex-col rounded-[2px] border border-white/[0.08] bg-white/[0.04] p-8 md:min-h-[320px] md:p-10",
        className
      )}
    >
      <blockquote className="flex-1 font-body text-[clamp(1.05rem,1.35vw,1.375rem)] font-medium leading-[1.5] text-text-primary">
        &laquo;{item.text}&raquo;
      </blockquote>

      <div className="mt-8 flex items-end gap-4 border-t border-white/[0.06] pt-8">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-white/10 bg-white/[0.03] text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          {item.logoUrl ? (
            <Image
              src={item.logoUrl}
              alt=""
              width={80}
              height={80}
              unoptimized
              className="h-10 w-10 object-contain brightness-0 invert filter"
            />
          ) : (
            <span aria-hidden>{initials || "—"}</span>
          )}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-[15px] font-semibold text-text-primary">{item.author}</p>
          <p className="mt-1 text-[13px] text-text-secondary">{item.position}</p>
          <p className="mt-0.5 text-[13px] text-text-secondary">{item.company}</p>
        </div>
      </div>
    </article>
  );
}
