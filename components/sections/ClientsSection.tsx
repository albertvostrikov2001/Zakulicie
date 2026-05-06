"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { staticClients } from "@/lib/content/clients";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const INTERVAL_MS = 3500;

export function ClientsSection() {
  const reduced  = usePrefersReducedMotion();
  const [active, setActive]   = useState(0);
  const [paused, setPaused]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = staticClients.length;

  useEffect(() => {
    if (reduced || paused) return;
    timerRef.current = setInterval(() => setActive((prev) => (prev + 1) % total), INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [reduced, paused, total]);

  const current = staticClients[active];

  return (
    <section
      className="bg-[var(--color-surface-elevated)] py-section"
      aria-label="Клиенты"
      id="clients"
    >
      <div className="mx-auto max-w-content px-4 md:px-8">
        {/* Header */}
        <RevealOnScroll>
          <p className="caption-text">Нам доверяют</p>
          <h2 className="mt-3 font-display text-[clamp(28px,3.5vw,48px)] font-bold leading-snug tracking-tight text-text-primary">
            Федеральные бренды<br className="hidden sm:block" /> и лидеры региона
          </h2>
        </RevealOnScroll>

        {/* Auto-cycling featured client */}
        <div
          className="mt-12 md:mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="relative h-[180px] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] sm:h-[200px] md:h-[220px]"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center"
              >
                <p className="font-display text-[clamp(24px,3.5vw,52px)] font-bold tracking-tight text-text-primary">
                  {current?.name}
                </p>
                {current?.sector && (
                  <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-text-muted">
                    {current.sector}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Клиенты">
            {staticClients.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={staticClients[i]?.name}
                onClick={() => { setActive(i); setPaused(true); }}
                className="h-1.5 transition-[width,background-color] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                style={{
                  width:           i === active ? "20px" : "6px",
                  background:      i === active ? "var(--color-accent)" : "rgba(255,255,255,0.2)",
                  borderRadius:    "9999px",
                }}
              />
            ))}
          </div>
        </div>

        {/* Marquee strip of all clients */}
        <div className="mt-14 overflow-hidden border-t border-[var(--color-border)] pt-10">
          <div className="flex animate-marquee gap-16 will-change-transform md:gap-24">
            {[...staticClients, ...staticClients].map((c, i) => (
              <span
                key={`${c.name}-${i}`}
                className="shrink-0 whitespace-nowrap font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-text-secondary/40 md:text-[14px]"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
