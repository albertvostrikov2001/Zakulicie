"use client";

import { CounterUp } from "@/components/motion/CounterUp";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    value: 20,
    suffix: "",
    unit: "лет",
    label: "на рынке",
    detail: "с 2004 года",
  },
  {
    value: 3000,
    suffix: "+",
    unit: "",
    label: "мероприятий",
    detail: "реализовано",
  },
  {
    value: 50,
    suffix: "+",
    unit: "",
    label: "федеральных брендов",
    detail: "среди клиентов",
  },
  {
    value: 8000,
    suffix: "",
    unit: "",
    label: "максимальный охват",
    detail: "участников в одном событии",
  },
] as const;

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-bg py-24 md:py-36" aria-label="Цифры">
      {/* Фоновая типографика */}
      <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden" aria-hidden>
        <span className="font-display text-[20vw] font-bold leading-none tracking-tighter text-white/[0.025] select-none whitespace-nowrap">
          ЗАКУЛИСЬЕ
        </span>
      </div>

      <div className="relative mx-auto max-w-content px-4 md:px-8">
        <RevealOnScroll>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            В числах
          </p>
        </RevealOnScroll>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 md:gap-x-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.75,
                delay: 0.1 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="border-l-2 border-accent/40 pl-5">
                <div className="font-display leading-none tracking-tight text-text-primary">
                  <span className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold">
                    <CounterUp value={s.value} suffix={s.suffix} />
                  </span>
                  {s.unit && (
                    <span className="ml-1 text-[clamp(1.5rem,3vw,2.5rem)] font-medium">
                      {s.unit}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-text-primary/80">{s.label}</p>
                <p className="mt-1 text-xs text-text-muted">{s.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Разделитель-цитата */}
        <RevealOnScroll delay={0.2}>
          <div className="mt-20 border-t border-border pt-10">
            <p className="max-w-3xl font-display text-xl leading-snug text-text-secondary md:text-2xl">
              «Сибирская база, федеральная дисциплина, режиссёрский подход.»
            </p>
            <p className="mt-3 text-sm text-text-muted">— позиционирование агентства</p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
