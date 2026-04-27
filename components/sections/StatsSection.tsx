"use client";

import { GsapCounterUp } from "@/components/motion/GsapCounterUp";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { siteStats } from "@/data/stats";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "framer-motion";

export function StatsSection() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      className="relative overflow-x-hidden border-t border-border bg-[#141414] py-24 md:py-36"
      aria-label="Цифры"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 flex max-w-[100vw] items-center justify-center overflow-hidden"
        aria-hidden
      >
        <span className="max-w-[100vw] select-none whitespace-nowrap text-center font-display text-[clamp(3rem,min(18vw,9rem),9rem)] font-bold leading-none tracking-tighter text-white/[0.05]">
          ЗАКУЛИСЬЕ
        </span>
      </div>

      <div className="relative z-[1] mx-auto max-w-content px-4 md:px-8">
        <RevealOnScroll>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">В числах</p>
        </RevealOnScroll>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 md:mt-20 md:gap-x-10 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-0">
          {siteStats.map((s, i) => (
            <motion.div
              key={s.label}
              className="min-w-0"
              initial={reduced ? false : { opacity: 1, y: 32 }}
              whileInView={!reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px 5% 0px" }}
              transition={{ duration: 0.75, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col items-start text-left">
                <p className="font-display text-[clamp(2.5rem,8vw,6.5rem)] font-semibold leading-none tracking-tight text-text-primary">
                  {reduced ? (
                    <>
                      {s.value.toLocaleString("ru-RU")}
                      {s.suffix}
                    </>
                  ) : (
                    <GsapCounterUp value={s.value} suffix={s.suffix} />
                  )}
                  {s.unit ? (
                    <span className="ml-1 text-[0.4em] font-medium text-accent">{s.unit}</span>
                  ) : null}
                </p>
                <p className="mt-4 max-w-[14rem] text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
                  {s.label}
                </p>
                <p className="mt-2 max-w-[14rem] text-sm text-text-muted">{s.detail}</p>
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
