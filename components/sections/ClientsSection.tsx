"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { staticClientWordmarks } from "@/lib/content/clients";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";

const line = [...staticClientWordmarks, ...staticClientWordmarks];

export function ClientsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const el = trackRef.current;
      if (!el) return;
      const ctx = gsap.context(() => {
        const tl = gsap.fromTo(
          el,
          { x: "0%" },
          {
            x: "-50%",
            duration: 45,
            ease: "none",
            repeat: -1,
          }
        );
        const s = sectionRef.current;
        if (s) {
          const p = () => gsap.to(tl, { timeScale: 0, duration: 0.35 });
          const r = () => gsap.to(tl, { timeScale: 1, duration: 0.5 });
          s.addEventListener("mouseenter", p);
          s.addEventListener("mouseleave", r);
        }
        return () => {
          tl.kill();
        };
      });
      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section ref={sectionRef} className="bg-bg py-20 md:py-28" aria-label="Клиенты">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <RevealOnScroll>
          <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">Нам доверяют</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-text-primary md:text-3xl">
                Федеральные бренды и лидеры региона
              </h2>
            </div>
            <p className="max-w-sm text-sm text-text-secondary">Названия — плейсхолдеры до публичного согласования.</p>
          </div>
        </RevealOnScroll>
      </div>

      <div
        className={`relative overflow-hidden border-y border-border py-6 ${
          reduced ? "" : "group/mar"
        }`}
      >
        <div
          ref={trackRef}
          className="flex w-max min-w-full flex-nowrap will-change-transform gap-16 pr-16 md:gap-24"
        >
          {line.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap font-display text-sm font-medium uppercase tracking-widest text-text-secondary/50 md:text-base"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-content px-4 text-center text-xs text-text-muted md:px-8">
        Логотипы брендов — после отдельного согласования.
      </p>
    </section>
  );
}
