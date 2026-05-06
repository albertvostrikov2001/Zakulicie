"use client";

import { staticClients } from "@/lib/content/clients";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const INTERVAL_MS = 3800;
const EASE_IN:  [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_OUT: [number, number, number, number] = [0.4, 0, 0.6, 1];

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Предыдущий клиент" : "Следующий клиент"}
      className="group flex h-12 w-12 items-center justify-center border border-white/[0.12] bg-transparent transition-[border-color,color] duration-200 ease-out hover:border-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
    >
      {direction === "prev" ? (
        <ChevronLeft
          className="h-4 w-4 text-white/40 transition-colors duration-200 group-hover:text-[var(--color-accent)]"
          aria-hidden
        />
      ) : (
        <ChevronRight
          className="h-4 w-4 text-white/40 transition-colors duration-200 group-hover:text-[var(--color-accent)]"
          aria-hidden
        />
      )}
    </button>
  );
}

export function ClientsSection() {
  const reduced   = usePrefersReducedMotion();
  const [active, setActive]   = useState(0);
  const [dir, setDir]         = useState<1 | -1>(1);
  const [paused, setPaused]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total    = staticClients.length;

  const go = useCallback(
    (next: number, direction: 1 | -1) => {
      setDir(direction);
      setActive(((next % total) + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => go(active + 1, 1), [active, go]);
  const goPrev = useCallback(() => go(active - 1, -1), [active, go]);

  /* Touch swipe */
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) { goNext(); } else { goPrev(); }
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    if (reduced || paused) return;
    timerRef.current = setInterval(goNext, INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [reduced, paused, goNext]);

  const current = staticClients[active];
  const previewIdx = (active + 1) % total;
  const preview = staticClients[previewIdx];

  const variants: Variants = {
    enter: (d: number) => ({
      opacity: 0,
      x: d > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: EASE_IN },
    },
    exit: (d: number) => ({
      opacity: 0,
      x: d > 0 ? -30 : 30,
      transition: { duration: 0.35, ease: EASE_OUT },
    }),
  };

  return (
    <section
      className="bg-[var(--color-surface-elevated)] py-section"
      aria-label="Клиенты"
      id="clients"
    >
      <div className="mx-auto max-w-content px-4 md:px-8">
        {/* Header */}
        <motion.p
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          Нам доверяют
        </motion.p>

        {/* Slider */}
        <div
          className="mt-10 md:mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-stretch gap-4 md:gap-6">
            {/* Active card */}
            <div
              className="relative flex-1 overflow-hidden"
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Accent top line on active card */}
              <div
                className="absolute left-0 right-0 top-0 z-10 h-[2px] bg-[var(--color-accent)]"
                aria-hidden
              />

              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={active}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex min-h-[160px] flex-col justify-between border border-[var(--color-border)] bg-[var(--color-surface)] p-12 md:min-h-[200px] md:p-14"
                  style={{ borderRadius: "var(--border-radius-card)" }}
                >
                  <div>
                    <p
                      className="font-display font-bold leading-snug tracking-tight text-[var(--color-text-primary)]"
                      style={{ fontSize: "clamp(28px, 3vw, 44px)" }}
                    >
                      {current?.name}
                    </p>
                    {current?.eventCaption && (
                      <p
                        className="mt-3 font-medium uppercase tracking-[0.1em] text-white/50"
                        style={{ fontSize: "13px" }}
                      >
                        {current.eventCaption}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Preview card — next client, partially visible, dimmed */}
            <motion.div
              key={`preview-${previewIdx}`}
              className="hidden w-[clamp(140px,20%,260px)] shrink-0 flex-col justify-between overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-8 opacity-45 md:flex"
              style={{
                scale: 0.94,
                borderRadius: "var(--border-radius-card)",
              }}
              aria-hidden
            >
              <p
                className="font-display font-bold leading-snug tracking-tight text-[var(--color-text-primary)]"
                style={{ fontSize: "clamp(18px, 2vw, 28px)" }}
              >
                {preview?.name}
              </p>
              {preview?.eventCaption && (
                <p
                  className="mt-2 font-medium uppercase tracking-[0.1em] text-white/40"
                  style={{ fontSize: "11px" }}
                >
                  {preview.eventCaption}
                </p>
              )}
            </motion.div>
          </div>

          {/* Controls: arrows + pagination dots */}
          <div className="mt-6 flex items-center justify-between md:mt-8">
            <div className="flex items-center gap-2" role="tablist" aria-label="Навигация по клиентам">
              {staticClients.map((client, i) => (
                <button
                  key={client.name}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={client.name}
                  onClick={() => { setDir(i > active ? 1 : -1); setActive(i); setPaused(true); }}
                  className="h-1 transition-[width,background-color] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                  style={{
                    width:        i === active ? "24px" : "6px",
                    background:   i === active ? "var(--color-accent)" : "rgba(255,255,255,0.2)",
                    borderRadius: "9999px",
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <ArrowButton direction="prev" onClick={goPrev} />
              <ArrowButton direction="next" onClick={goNext} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
