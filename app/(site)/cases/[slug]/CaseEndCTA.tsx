"use client";

import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/providers/ContactModalProvider";

export function CaseEndCTA() {
  const { openContact } = useContactModal();
  return (
    <section className="mt-16 border border-border bg-elevated/50 p-8" aria-labelledby="case-end-cta">
      <h2 id="case-end-cta" className="font-display text-xl font-semibold text-text-primary md:text-2xl">
        Обсудить похожее мероприятие
      </h2>
      <p className="mt-3 max-w-md text-sm text-text-secondary">
        Нужен похожий уровень организации под вашу задачу — начнём с короткого созвона и понятного тайминга.
      </p>
      <Button type="button" onClick={openContact} className="mt-6 uppercase tracking-widest">
        Обсудить похожий проект
      </Button>
    </section>
  );
}
