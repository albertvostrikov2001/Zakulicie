"use client";

import { useContactModal } from "@/components/providers/ContactModalProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";

const WORDMARK = "ЗАКУЛИСЬЕ";
const OFFER = ["АГЕНТСТВО ПОЛНОГО ЦИКЛА", "ДЛЯ КОМПАНИЙ, КОТОРЫЕ", "НЕ ИДУТ НА КОМПРОМИСС"] as const;

export function HeroSection() {
  const { openContact } = useContactModal();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.18 });
        tl.from("[data-wordmark]", {
          y: 52,
          opacity: 0,
          duration: 0.88,
          ease: "power3.out",
        })
          .from(
            "[data-tagline] [data-tagline-line]",
            {
              y: 28,
              opacity: 0,
              duration: 0.52,
              stagger: 0.09,
              ease: "power3.out",
            },
            "-=0.48"
          )
          .from(
            "[data-cta]",
            {
              y: 18,
              opacity: 0,
              duration: 0.48,
              ease: "power3.out",
            },
            "-=0.32"
          );
      }, rootRef);
      return () => ctx.revert();
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={rootRef}
      className="relative z-20 flex min-h-[100dvh] flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-light)" }}
      aria-label="Главный экран"
    >
      <div className="flex flex-1 flex-col justify-between px-4 pb-12 pt-[clamp(5.5rem,12vh,8rem)] md:px-8 md:pb-14 md:pt-[clamp(6rem,14vh,9rem)]">
        <div className="pointer-events-none relative w-[min(100%,92vw)] max-w-[1600px] md:top-[4vh]">
          <h1
            data-wordmark
            className="font-display text-[clamp(48px,14vw,72px)] font-black uppercase leading-[0.9] tracking-tight text-[#1a1a1a] md:text-[clamp(70px,11vw,170px)] md:font-black"
          >
            {WORDMARK}
          </h1>
        </div>

        <div className="mt-auto flex w-full flex-col items-stretch gap-10 md:mt-0 md:flex-row md:items-end md:justify-between">
          <div className="hidden md:block" aria-hidden />

          <div data-tagline className="w-full max-w-[400px] self-end text-right">
            {OFFER.map((line) => (
              <p
                key={line}
                data-tagline-line
                className="font-body text-[11px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-[#2d2d2d] md:text-sm"
              >
                {line}
              </p>
            ))}
            <div className="mt-8 md:mt-10">
              <button
                type="button"
                data-cta
                onClick={openContact}
                className="group border-0 bg-transparent text-xs font-semibold uppercase tracking-[0.22em] text-[#1a1a1a] transition-colors duration-300 hover:text-accent focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#f2efe9]"
              >
                <span className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-[#1a1a1a]/35 after:transition after:duration-300 after:ease-out group-hover:after:scale-x-100 group-hover:after:bg-accent">
                  Обсудить проект
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
