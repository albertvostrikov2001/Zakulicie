"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";

type Opt = { slug: string; title: string };

export function CasesFilter({ options, active }: { options: Opt[]; active: string }) {
  return (
    <nav
      className="mt-10 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:gap-3"
      aria-label="Фильтр по типу мероприятия"
    >
      {options.map((o) => {
        const href = o.slug === "all" ? "/cases" : `/cases?service=${o.slug}`;
        const isOn = active === o.slug;
        return (
          <Link
            key={o.slug}
            href={href}
            scroll={false}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition",
              isOn
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-text-secondary hover:border-white/20 hover:text-text-primary"
            )}
          >
            {o.title}
          </Link>
        );
      })}
    </nav>
  );
}
