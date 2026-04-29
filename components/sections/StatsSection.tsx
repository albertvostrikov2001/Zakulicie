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
      className="relative overflow-x-hidden border-t border-border bg-[#141414] py-14 md:py-20"
      aria-label="Цифры"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 flex max-w-[100vw] items-center justify-center overflow-hidden"
        aria-hidden
      >
        <span className="max-w-[min(100%,100vw)] select-none whitespace-nowrap text-center font-display text-[clamp(2.5rem,min(14vw,7rem),7rem)] font-bold leading-none tracking-tighter text-white/[0.04]">
          ЗАКУЛИСЬЕ
        </span>
      </div>

      <div className="relative z-[1] mx-auto max-w-content px-4 md:px-8">
        <RevealOnScroll>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-secondary/50">В числах</p>
        </RevealOnScroll>

        <div className="mt-8 grid grid-cols-2 items-start gap-x-5 gap-y-8 sm:gap-x-6 md:mt-10 md:grid-cols-4 md:gap-x-8 md:gap-y-0 lg:gap-x-10 xl:gap-x-12">
          {siteStats.map((s, i) => (
            <motion.div
              key={s.label}
              className="min-w-0 w-full max-w-full"
              initial={reduced ? false : { opacity: 0, y: 32 }}
              whileInView={!reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px 5% 0px" }}
              transition={{ duration: 0.75, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="stat-item flex min-w-0 flex-col items-start text-left">
                <p className="stat-number font-display font-bold tabular-nums leading-[1.05] tracking-tight text-text-primary [font-size:clamp(28px,3.4vw,56px)]">
                  {reduced ? (
                    <>
                      {s.value.toLocaleString("ru-RU")}
                      {s.suffix}
                    </>
                  ) : (
                    <GsapCounterUp value={s.value} suffix={s.suffix} />
                  )}
                  {s.unit ? (
                    <span className="ml-0.5 inline text-[0.5em] font-semibold leading-none text-accent md:ml-1">
                      {s.unit}
                    </span>
                  ) : null}
                </p>
                <p className="stat-label mt-3 max-w-full text-[10px] font-medium uppercase leading-snug tracking-[0.12em] text-text-secondary/50 md:mt-4">
                  {s.label}
                </p>
                <p className="stat-sub mt-2 max-w-full text-xs leading-snug text-text-muted/90 opacity-[0.35]">
                  {s.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
