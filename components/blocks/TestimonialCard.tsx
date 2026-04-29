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
    .filter(Boolean)
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <article
      className={cn(
        "flex min-h-[320px] flex-1 flex-col rounded-[2px] border border-white/[0.08] bg-white/[0.04] p-8 md:p-10",
        className
      )}
    >
      <blockquote className="flex-1 font-body text-[clamp(16px,1.5vw,20px)] font-medium leading-[1.55] text-[#F5F5F5]">
        &laquo;{item.text}&raquo;
      </blockquote>

      <div className="mt-8 flex gap-4 border-t border-white/[0.08] pt-6 md:mt-8 md:pt-6">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-white/10 bg-white/[0.03] md:h-8 md:w-8">
          {item.logoUrl ? (
            <Image
              src={item.logoUrl}
              alt={`Логотип ${item.company}`}
              width={64}
              height={64}
              unoptimized
              className="h-8 max-h-8 w-auto object-contain brightness-0 invert filter opacity-60"
            />
          ) : (
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-white/50" aria-hidden>
              {initials || "—"}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-semibold text-[#F5F5F5]">{item.author}</p>
          <p className="mt-1 text-xs text-white/45">{item.position}</p>
          <p className="mt-0.5 text-xs text-white/45">{item.company}</p>
        </div>
      </div>
    </article>
  );
}
