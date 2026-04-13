"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import type { Testimonial } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Props = { items: Testimonial[] };

export function TestimonialSlider({ items }: Props) {
  const [i, setI] = useState(0);
  const t = items[i];
  if (!t) return null;

  const next = () => setI((v) => (v + 1) % items.length);
  const prev = () => setI((v) => (v - 1 + items.length) % items.length);

  return (
    <Section>
      <RevealOnScroll>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
          Отношения и репутация
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold text-text-primary md:text-4xl">
          Что говорят заказчики
        </h2>
      </RevealOnScroll>

      <div className="relative mt-12 min-h-[280px] border border-border bg-surface/40 p-8 md:min-h-[240px] md:p-12">
        <AnimatePresence mode="wait">
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <blockquote className="font-display text-xl font-normal leading-snug text-text-primary md:text-2xl">
              «{t.text}»
            </blockquote>
            <figcaption className="mt-8 text-sm text-text-secondary">
              <span className="text-text-primary">{t.author}</span>
              {t.position ? `, ${t.position}` : ""}
              {t.company ? ` · ${t.company}` : ""}
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={prev}
            className="flex h-10 w-10 items-center justify-center rounded border border-border text-text-secondary transition hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Предыдущий отзыв"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="flex h-10 w-10 items-center justify-center rounded border border-border text-text-secondary transition hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Следующий отзыв"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <span className="ml-2 text-xs text-text-muted">
            {i + 1} / {items.length}
          </span>
        </div>
      </div>

      <RevealOnScroll>
        <p className="mt-10 max-w-2xl text-sm text-text-secondary">
          Отраслевые отметки и благодарности доступны по запросу — публикуем только то, что согласовано
          с брендами заказчиков.
        </p>
      </RevealOnScroll>
    </Section>
  );
}
