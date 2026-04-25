"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import type { Testimonial } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Props = { items: Testimonial[] };

export function TestimonialsSection({ items }: Props) {
  const [idx, setIdx] = useState(0);
  const t = items[idx];
  if (!t) return null;

  const next = () => setIdx((v) => (v + 1) % items.length);
  const prev = () => setIdx((v) => (v - 1 + items.length) % items.length);

  return (
    <section className="bg-bg py-24 md:py-36" aria-label="Отзывы клиентов">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Левая колонка */}
          <RevealOnScroll>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                Репутация и доверие
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-text-primary md:text-4xl">
                Что говорят заказчики
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-text-secondary">
                Отраслевые отметки и благодарственные письма доступны по запросу.
                Публикуем только то, что согласовано с брендами заказчиков.
              </p>

              {/* Навигация */}
              <div className="mt-10 flex items-center gap-4">
                <button
                  type="button"
                  onClick={prev}
                  className="flex h-12 w-12 items-center justify-center border border-border text-text-secondary transition hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Предыдущий отзыв"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex h-12 w-12 items-center justify-center border border-border text-text-secondary transition hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Следующий отзыв"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="ml-2 font-display text-sm text-text-muted">
                  {String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Правая колонка — цитата */}
          <div className="relative min-h-[280px]">
            {/* Декоративная кавычка */}
            <span className="absolute -top-4 left-0 font-display text-[120px] leading-none text-accent/10 select-none" aria-hidden>
              &ldquo;
            </span>

            <AnimatePresence mode="wait">
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 pt-10"
              >
              <blockquote className="font-display text-xl font-normal leading-snug text-text-primary md:text-2xl lg:text-3xl">
                &laquo;{t.text}&raquo;
              </blockquote>
                <figcaption className="mt-8 border-l-2 border-accent pl-4">
                  <p className="text-sm font-medium text-text-primary">{t.author}</p>
                  {t.position && (
                    <p className="mt-1 text-sm text-text-secondary">{t.position}</p>
                  )}
                  {t.company && (
                    <p className="text-xs text-text-muted">{t.company}</p>
                  )}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
