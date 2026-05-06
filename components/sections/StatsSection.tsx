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
      className="relative overflow-x-hidden border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-14 md:py-20"
      aria-label="Цифры"
    >
      {/* Ghost watermark */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex max-w-[100vw] items-center justify-center overflow-hidden"
        aria-hidden
      >
        <span className="select-none whitespace-nowrap text-center font-display text-[clamp(2.5rem,min(14vw,7rem),7rem)] font-bold leading-none tracking-tighter text-white/[0.03]">
          ЗАКУЛИСЬЕ
        </span>
      </div>

      <div className="relative z-[1] mx-auto max-w-content px-4 md:px-8">
        <RevealOnScroll>
          <p className="caption-text">В числах</p>
        </RevealOnScroll>

        <div className="mt-8 grid grid-cols-2 items-start gap-x-5 gap-y-10 md:mt-12 md:grid-cols-4 md:gap-x-8 md:gap-y-0 lg:gap-x-12">
          {siteStats.map((s, i) => (
            <motion.div
              key={s.label}
              className="min-w-0 w-full"
              initial={reduced ? false : { opacity: 0, y: 32 }}
              whileInView={!reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px 5% 0px" }}
              transition={{ duration: 0.75, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col items-start text-left">
                {/* Number */}
                <p className="font-display font-bold tabular-nums leading-[1.0] tracking-tight text-text-primary [font-size:clamp(44px,4.5vw,80px)]">
                  {reduced ? (
                    <>
                      {s.value.toLocaleString("ru-RU")}
                      {s.suffix}
                    </>
                  ) : (
                    <GsapCounterUp value={s.value} suffix={s.suffix} />
                  )}
                  {s.unit ? (
                    <span className="ml-1 inline text-[0.45em] font-semibold leading-none text-accent">
                      {s.unit}
                    </span>
                  ) : null}
                </p>

                {/* Label */}
                <p className="mt-3 max-w-full text-[11px] font-semibold uppercase leading-snug tracking-[0.12em] text-text-secondary md:mt-4">
                  {s.label}
                </p>

                {/* Detail */}
                <p className="mt-1.5 max-w-full text-[13px] leading-snug text-text-muted">
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
