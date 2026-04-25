"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { staticClientWordmarks } from "@/lib/content/clients";

export function ClientsSection() {
  const row = [...staticClientWordmarks, ...staticClientWordmarks, ...staticClientWordmarks];

  return (
    <section className="bg-bg py-20 md:py-28" aria-label="Клиенты">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <RevealOnScroll>
          <div className="mb-12 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                Нам доверяют
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-text-primary md:text-3xl">
                Федеральные бренды и региональные лидеры
              </h2>
            </div>
            <p className="max-w-sm text-sm text-text-secondary">
              Среди наших клиентов — крупнейшие компании Сибири и федеральные структуры.
            </p>
          </div>
        </RevealOnScroll>
      </div>

      {/* Полноширинный marquee */}
      <div className="marquee-track relative overflow-hidden border-y border-border py-6">
        <div className="marquee-inner flex w-max animate-marquee items-center gap-20 pr-20">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap font-display text-sm font-medium uppercase tracking-widest text-text-secondary/60 transition-colors hover:text-text-secondary md:text-base"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 md:px-8">
        <RevealOnScroll>
          <p className="mt-6 text-xs text-text-muted">
            Логотипы и названия представлены в формате плейсхолдеров до согласования публичного использования с брендами.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
