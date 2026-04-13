"use client";

import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/providers/ContactModalProvider";

export function CaseEndCTA() {
  const { openContact } = useContactModal();
  return (
    <div className="mt-16 flex flex-wrap items-center gap-4 border border-border bg-elevated/50 p-8">
      <p className="max-w-md text-sm text-text-secondary">
        Нужен похожий уровень организации под вашу задачу — начнём с короткого созвона и понятного тайминга.
      </p>
      <Button type="button" onClick={openContact} className="uppercase tracking-widest">
        Обсудить похожий проект
      </Button>
    </div>
  );
}
