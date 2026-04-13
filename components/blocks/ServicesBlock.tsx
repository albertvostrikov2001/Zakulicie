"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import { serviceNav, staticServices } from "@/lib/content/services";
import { cn } from "@/lib/cn";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function ServicesBlock() {
  const [hover, setHover] = useState<string | null>(null);
  const active = hover ?? serviceNav[0].slug;
  const bg = staticServices[active as keyof typeof staticServices]?.heroImage;

  return (
    <Section>
      <RevealOnScroll>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">Услуги</p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold text-text-primary md:text-4xl">
          Направления работы
        </h2>
        <p className="mt-4 max-w-xl text-text-secondary">
          Каждое направление — с отдельной командой сопровождения и понятным стандартом качества.
          Режиссура и постановка — как уровень экспертизы, когда задача требует синхронной работы
          сцены, света и смысла.
        </p>
      </RevealOnScroll>

      <div className="relative mt-12 min-h-[420px] md:min-h-[480px]">
        {bg && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-card">
            <Image
              src={bg.src}
              alt=""
              fill
              className={cn(
                "object-cover opacity-25 transition-opacity duration-700",
                hover && "opacity-35"
              )}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/92 to-bg/85" aria-hidden />
          </div>
        )}
        <ul className="relative z-10 divide-y divide-border border-y border-border">
          {serviceNav.map((s, i) => {
            const row = staticServices[s.slug];
            return (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex flex-col gap-2 py-6 transition md:flex-row md:items-center md:justify-between md:gap-8"
                  onMouseEnter={() => setHover(s.slug)}
                  onFocus={() => setHover(s.slug)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div className="flex items-baseline gap-4 md:gap-8">
                    <span className="font-display text-sm text-text-muted tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl text-text-primary transition group-hover:text-accent md:text-2xl">
                      {s.title}
                    </span>
                  </div>
                  <p className="max-w-md pl-10 text-sm text-text-secondary md:pl-0 md:text-right">
                    {row.shortDescription}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
