"use client";

import { CTALink } from "@/components/ui/CTALink";

export function BlogArticleCTA() {
  return (
    <section
      className="mt-16 border border-border bg-surface/50 p-8 md:p-10"
      aria-labelledby="blog-article-cta"
    >
      <h2 id="blog-article-cta" className="font-display text-2xl font-semibold text-text-primary">
        Хотите организовать корпоративное мероприятие?
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
        Обсудим вашу задачу, предложим формат и тайминг — без шаблонных коммерческих и лишних
        обязательств.
      </p>
      <CTALink className="mt-6 inline-flex border border-accent px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-text-primary transition-colors hover:bg-accent hover:text-[#0A0A0A]">
        Обсудить проект
      </CTALink>
    </section>
  );
}
