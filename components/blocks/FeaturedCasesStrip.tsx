"use client";

import { CaseCard } from "@/components/blocks/CaseCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import type { CaseStudy } from "@/lib/types";
import Link from "next/link";

type Props = { cases: CaseStudy[] };

export function FeaturedCasesStrip({ cases }: Props) {
  return (
    <Section id="cases-preview">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <RevealOnScroll>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Флагманские проекты
            </p>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold text-text-primary md:text-4xl">
              Кейсы, которые задают планку
            </h2>
          </div>
        </RevealOnScroll>
        <RevealOnScroll>
          <Link
            href="/cases"
            className="text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Все кейсы
          </Link>
        </RevealOnScroll>
      </div>

      <div className="mt-10 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:-mx-8 md:gap-6 md:px-2">
        {cases.map((c, i) => (
          <div
            key={c.slug}
            className="w-[min(88vw,420px)] flex-shrink-0 snap-center sm:w-[min(70vw,480px)] lg:w-[min(40vw,520px)]"
          >
            <CaseCard item={c} priority={i === 0} />
          </div>
        ))}
      </div>
    </Section>
  );
}
