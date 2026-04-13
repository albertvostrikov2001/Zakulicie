"use client";

import { staticClientWordmarks } from "@/lib/content/clients";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";

export function ClientMarquee() {
  const row = [...staticClientWordmarks, ...staticClientWordmarks];

  return (
    <Section className="!py-10 md:!py-14">
      <RevealOnScroll>
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
          Нам доверяют
        </p>
      </RevealOnScroll>
      <div className="marquee-track relative mt-8 overflow-hidden border-y border-border py-6">
        <div className="marquee-inner flex w-max animate-marquee gap-16 pr-16">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap font-display text-sm font-medium text-text-secondary md:text-base"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-text-muted">
        Логотипы и названия на сайте представлены в формате плейсхолдеров до согласования публичного
        использования с брендами.
      </p>
    </Section>
  );
}
