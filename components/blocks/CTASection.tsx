"use client";

import { ContactForm } from "@/components/blocks/ContactForm";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";

export function CTASection() {
  return (
    <Section className="min-h-[85vh] border-t border-border !py-20 md:!py-28">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-start">
        <RevealOnScroll>
          <h2 className="font-display text-3xl font-semibold leading-tight text-text-primary md:text-4xl lg:text-5xl">
            Расскажите о задаче —
            <span className="text-text-secondary"> мы предложим формат и команду</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-text-secondary">
            Короткая заявка без лишних полей. Мы отвечаем по делу и заранее готовим вопросы, чтобы первый
            созвон был продуктивным.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <ContactForm idPrefix="cta" className="rounded-card border border-border bg-elevated/60 p-6 md:p-8" />
        </RevealOnScroll>
      </div>
    </Section>
  );
}
