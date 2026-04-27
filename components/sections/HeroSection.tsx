"use client";

import { useContactModal } from "@/components/providers/ContactModalProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "framer-motion";

const WORDMARK = "ЗАКУЛИСЬЕ";
const OFFER = ["АГЕНТСТВО ПОЛНОГО ЦИКЛА", "ДЛЯ КОМПАНИЙ, КОТОРЫЕ", "НЕ ИДУТ НА КОМПРОМИСС"] as const;

export function HeroSection() {
  const { openContact } = useContactModal();
  const reduced = usePrefersReducedMotion();

  return (
    <section
      className="relative flex min-h-[92dvh] flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-light)" }}
      aria-label="Главный экран"
    >
      <div className="flex flex-1 flex-col justify-between px-4 pb-10 pt-28 md:px-8 md:pt-32">
        <div className="pointer-events-none relative left-0 top-[6vh] w-[min(100%,92vw)] max-w-[1400px]">
          {reduced ? (
            <h1
              className="font-display text-[clamp(2.5rem,12vw,11rem)] font-semibold leading-[0.9] tracking-tight"
              style={{ color: "#0a0a0a" }}
            >
              {WORDMARK}
            </h1>
          ) : (
            <h1
              className="font-display text-[clamp(2.5rem,12vw,11rem)] font-semibold leading-[0.9] tracking-tight"
              style={{ color: "#0a0a0a" }}
            >
              {WORDMARK.split("").map((ch, i) => (
                <motion.span
                  key={`${ch}-${i}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.04 * i,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </h1>
          )}
        </div>

        <div className="mt-auto flex w-full flex-col items-end justify-end gap-8 md:mt-0 md:flex-row md:items-end md:justify-between">
          <div className="hidden md:block" aria-hidden />

          <div className="w-full max-w-[380px] text-right">
            {OFFER.map((line) => (
              <p
                key={line}
                className="font-body text-xs font-semibold uppercase leading-relaxed tracking-[0.2em] md:text-sm"
                style={{ color: "#1a1a1a" }}
              >
                {line}
              </p>
            ))}
            <div className="mt-8">
              <button
                type="button"
                onClick={openContact}
                className="inline-flex items-center border-2 border-[#0a0a0a] bg-transparent px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#0a0a0a] hover:text-[#f2efe9] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2"
              >
                Обсудить проект
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-6">
        <div className="flex flex-col items-center gap-2" aria-hidden>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: "#2d2d2d" }}>
            Скролл
          </span>
          <div
            className="h-12 w-px animate-scroll-hint"
            style={{ backgroundColor: "rgba(10,10,10,0.35)" }}
          />
        </div>
      </div>
    </section>
  );
}
