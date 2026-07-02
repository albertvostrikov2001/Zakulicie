"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CTALink } from "@/components/ui/CTALink";
import Image from "@/components/ui/SiteImage";
import { useRef } from "react";
import type { CaseStudy } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

const DARK = "#0a0a0a";

interface TransitionSectionProps {
  cases?: CaseStudy[];
}

export function TransitionSection({}: TransitionSectionProps) {
  const sectionRef    = useRef<HTMLElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);
  const reducedMotion  = usePrefersReducedMotion();

  /* ── Entrance animation ─────────────────────────────────── */
  useGSAP(
    () => {
      const content = contentRef.current;
      if (!content) return;
      const ctx = gsap.context(() => {
        const els = content.querySelectorAll<HTMLElement>("[data-hero-el]");
        gsap.from(els, {
          opacity: 0,
          y: reducedMotion ? 0 : 28,
          duration: reducedMotion ? 0.3 : 0.85,
          stagger: reducedMotion ? 0.04 : 0.14,
          ease: "power3.out",
          delay: 0.2,
        });
      });
      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  /* ── Scroll-driven photo → black fade ───────────────────── */
  useGSAP(
    () => {
      const section = sectionRef.current;
      const overlay = fadeOverlayRef.current;
      if (!section || !overlay) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: reducedMotion ? 0 : 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            overlay.style.opacity = String(p);
            document.documentElement.style.setProperty("--scene-bg", DARK);
            document.documentElement.style.setProperty("--page-bg",  DARK);
          },
        });
      }, section);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      data-transition
      data-transition-section
      aria-label="Закулисье — Архитектура безупречных событий"
      className="relative z-10 min-h-[140vh]"
    >
      {/* Sticky viewport — остаётся на экране пока родитель скроллится */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">

        {/* Background photo */}
        <Image
          src="/SiteView.webp"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />

        {/* Static semi-transparent overlay для читаемости текста */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.28) 60%, rgba(0,0,0,0.55) 100%)",
          }}
          aria-hidden
        />

        {/* Scroll-driven black fade overlay */}
        <div
          ref={fadeOverlayRef}
          className="absolute inset-0"
          style={{ backgroundColor: DARK, opacity: 0 }}
          aria-hidden
        />

        {/* Hero content — по центру */}
        <div
          ref={contentRef}
          className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center"
        >
          {/* Headline */}
          <h1
            data-hero-el
            className="m-0 font-display font-black uppercase leading-[0.92] tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(36px, 7vw, 108px)" }}
          >
            Архитектура
            <br />
            безупречных событий
          </h1>

          {/* Subtitle */}
          <p
            data-hero-el
            className="mt-[clamp(18px,3vh,32px)] max-w-[min(1300px,92vw)] font-semibold text-white"
            style={{ fontSize: "clamp(20px,2.5vw,32px)", lineHeight: 1.55 }}
          >
            ЗАКУЛИСЬЕ: Проектирование, менеджмент, реализация ваших идей.
            <br />
            Полный контроль от концепции до финальных аккордов.
          </p>

          {/* CTA */}
          <div data-hero-el className="mt-[clamp(24px,4vh,40px)]">
            <CTALink
              className="inline-flex items-center gap-3 border border-white bg-transparent px-[clamp(28px,4vw,52px)] py-[clamp(12px,1.6vh,20px)] font-semibold uppercase tracking-[0.14em] text-white transition-[background-color,color,border-color] duration-[240ms] ease-out hover:border-white hover:bg-white hover:text-[#1A1A1A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              style={{ fontSize: "clamp(12px,1.1vw,16px)" }}
            >
              Обсудить проект
            </CTALink>
          </div>
        </div>
      </div>
    </section>
  );
}
