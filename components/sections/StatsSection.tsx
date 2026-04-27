"use client";

import { GsapCounterUp } from "@/components/motion/GsapCounterUp";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { siteStats } from "@/data/stats";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-border bg-[#141414] py-24 md:py-36"
      aria-label="Цифры"
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
        <span className="max-w-full select-none whitespace-nowrap text-center font-display text-[20vw] font-bold leading-none tracking-tighter text-white/[0.04]">
          ЗАКУЛИСЬЕ
        </span>
      </div>

      <div className="relative mx-auto max-w-content px-4 md:px-8">
        <RevealOnScroll>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">В числах</p>
        </RevealOnScroll>

        <div className="mt-20 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
          {siteStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduced ? false : { opacity: 0, y: 40 }}
              animate={inView || reduced ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-left">
                <p className="font-display text-[clamp(3.5rem,10vw,7.5rem)] font-semibold leading-none tracking-tight text-text-primary">
                  {reduced ? (
                    <>
                      {s.value.toLocaleString("ru-RU")}
                      {s.suffix}
                    </>
                  ) : (
                    <GsapCounterUp value={s.value} suffix={s.suffix} />
                  )}
                  {s.unit && <span className="ml-1 text-[0.4em] font-medium text-accent">{s.unit}</span>}
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">{s.label}</p>
                <p className="mt-2 text-sm text-text-muted">{s.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <RevealOnScroll delay={0.2}>
          <div className="mt-24 border-t border-border pt-12">
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
