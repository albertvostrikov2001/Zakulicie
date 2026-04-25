"use client";

import { MagneticButton } from "@/components/motion/MagneticButton";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { useContactModal } from "@/components/providers/ContactModalProvider";

export function CTASectionNew() {
  const { openContact } = useContactModal();

  return (
    <section className="relative overflow-hidden bg-surface py-28 md:py-40" aria-label="Обсудить проект">
      {/* Фоновые диагонали */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-1/4 -top-1/4 h-[150%] w-[80%] -rotate-12 bg-accent/[0.03]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[150%] w-[80%] -rotate-12 bg-accent/[0.02]" />
      </div>

      <div className="relative mx-auto max-w-content px-4 md:px-8">
        <RevealOnScroll>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            Начать работу
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08}>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-text-primary md:text-5xl lg:text-6xl xl:text-7xl">
            Расскажите
            <br />
            о задаче.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-text-secondary md:text-lg">
            Мы не работаем с потоком. Мы выбираем проекты, в которые можем вложить полный ресурс команды и 20 лет опыта.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <div className="mt-12 flex flex-wrap gap-4">
            <MagneticButton>
              <button
                type="button"
                onClick={openContact}
                className="group relative inline-flex items-center gap-3 bg-accent px-10 py-5 text-sm font-medium uppercase tracking-widest text-bg transition-all duration-300 hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Оставить заявку
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </MagneticButton>

            <a
              href="tel:+73833339797"
              className="inline-flex items-center gap-2 border border-border px-10 py-5 text-sm font-medium uppercase tracking-widest text-text-secondary transition-all duration-300 hover:border-text-secondary hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent"
            >
              Позвонить
            </a>
          </div>
        </RevealOnScroll>

        {/* Дополнительный текст */}
        <RevealOnScroll delay={0.25}>
          <p className="mt-10 text-xs text-text-muted">
            Средний горизонт входа в проект — 8–12 недель. Работаем по Новосибирску, Сибири и федеральным брифам.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
