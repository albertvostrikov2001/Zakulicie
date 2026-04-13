"use client";

import { CounterUp } from "@/components/motion/CounterUp";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";

export function StatBlock() {
  return (
    <Section muted className="grain relative border-y border-border">
      <RevealOnScroll>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">Цифры</p>
      </RevealOnScroll>
      <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <RevealOnScroll>
          <div className="border-l border-border pl-6">
            <div className="font-display text-4xl font-semibold text-text-primary md:text-5xl lg:text-6xl">
              <CounterUp value={20} suffix="" /> лет
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">на рынке</p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.06}>
          <div className="border-l border-border pl-6">
            <div className="font-display text-4xl font-semibold text-text-primary md:text-5xl lg:text-6xl">
              <CounterUp value={3000} suffix="+" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">мероприятий реализовано</p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.12}>
          <div className="border-l border-border pl-6">
            <p className="font-display text-2xl font-medium leading-snug text-text-primary md:text-3xl">
              Сибирь и федеральные бренды
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Региональная база — федеральная дисциплина исполнения
            </p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.18}>
          <div className="border-l border-border pl-6">
            <p className="font-display text-2xl font-medium leading-snug text-text-primary md:text-3xl">
              Собственный реквизит
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Производство и парк для аренды — скорость и предсказуемость
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </Section>
  );
}
