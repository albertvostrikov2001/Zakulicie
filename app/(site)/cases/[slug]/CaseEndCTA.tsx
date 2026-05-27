"use client";

import { CTAButton } from "@/components/ui/CTAButton";

export function CaseEndCTA() {
  return (
    <section className="mt-16 border border-border bg-elevated/50 p-8" aria-labelledby="case-end-cta">
      <h2 id="case-end-cta" className="font-display text-xl font-semibold text-text-primary md:text-2xl">
        Обсудить похожее мероприятие
      </h2>
      <p className="mt-3 max-w-md text-sm text-text-secondary">
        Нужен похожий уровень организации под вашу задачу — начнём с короткого созвона и понятного тайминга.
      </p>
      <CTAButton className="mt-6 inline-flex items-center border border-accent bg-transparent px-8 py-3 text-xs font-medium uppercase tracking-widest text-text-primary transition-colors hover:bg-accent hover:text-[#0A0A0A]">
        Обсудить похожий проект
      </CTAButton>
    </section>
  );
}
