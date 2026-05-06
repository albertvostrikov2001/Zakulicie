"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { interpolateHex } from "@/hooks/useColorInterpolation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const LIGHT = "#f2efe9";
const DARK  = "#0a0a0a";
const WORD_ON_LIGHT = "#1a1a1a";
const WORD_ON_DARK  = "#f5f5f5";
const TAG_ON_LIGHT  = "#3a3a3a";
const TAG_ON_DARK   = "rgba(245,245,245,0.65)";

const OFFER    = ["АГЕНТСТВО ПОЛНОГО ЦИКЛА", "ДЛЯ КОМПАНИЙ, КОТОРЫЕ", "НЕ ИДУТ НА КОМПРОМИСС"] as const;
const WORDMARK = "ЗАКУЛИСЬЕ";
const TRUST    = "20 лет · 3 000+ мероприятий · Сибирь";

export function TransitionSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const bgRef        = useRef<HTMLDivElement>(null);
  const wordRef      = useRef<HTMLHeadingElement>(null);
  const tagWrapRef   = useRef<HTMLDivElement>(null);
  const trustRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLAnchorElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);
  const motionDotRef = useRef<HTMLSpanElement>(null);
  const mobile       = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  /* ── Scroll-driven color interpolation ────────────────── */
  useGSAP(
    () => {
      const section = sectionRef.current;
      const bg      = bgRef.current;
      if (!section || !bg) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end:   "bottom bottom",
          scrub: mobile ? 1 : 0.8,
          onUpdate: (self) => {
            const p = self.progress;

            bg.style.backgroundColor = interpolateHex(LIGHT, DARK, p);
            document.documentElement.style.setProperty("--scene-bg", interpolateHex(LIGHT, DARK, p));
            document.documentElement.style.setProperty("--page-bg",  interpolateHex(LIGHT, DARK, p));

            if (wordRef.current)  wordRef.current.style.color  = interpolateHex(WORD_ON_LIGHT, WORD_ON_DARK, p);
            if (trustRef.current) trustRef.current.style.color = interpolateHex(TAG_ON_LIGHT, "rgba(245,245,245,0.40)", p);

            const tagEls = tagWrapRef.current?.querySelectorAll<HTMLElement>("[data-trans-tag]");
            const tw     = interpolateHex(TAG_ON_LIGHT, TAG_ON_DARK, p);
            tagEls?.forEach((el) => { el.style.color = tw; });

            const ctaColor = interpolateHex(TAG_ON_LIGHT, WORD_ON_DARK, p);
            if (ctaRef.current) ctaRef.current.style.color = ctaColor;

            const fadeStart = 0.80;
            const opacity   = p < fadeStart ? 1 : Math.max(0, 1 - (p - fadeStart) / (1 - fadeStart));
            if (wordRef.current)    wordRef.current.style.opacity    = String(opacity);
            if (tagWrapRef.current) tagWrapRef.current.style.opacity = String(opacity);
          },
        });
      }, section);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [mobile] }
  );

  /* ── Stagger entrance animation ───────────────────────── */
  useGSAP(
    () => {
      const word   = wordRef.current;
      const tags   = tagWrapRef.current;
      const cta    = ctaRef.current;
      const scroll = scrollRef.current;
      const trust  = trustRef.current;
      if (!word || !tags || !cta || !trust) return;

      const ctx = gsap.context(() => {
        const tagEls = Array.from(tags.querySelectorAll<HTMLElement>("[data-trans-tag]"));

        if (reducedMotion) {
          gsap.from([word, trust, ...tagEls, cta], {
            opacity: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.12,
          });
          return;
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(word,    { opacity: 0, y: 28, duration: 0.7  }, 0.25)
          .from(trust,   { opacity: 0, y: 12, duration: 0.55 }, 0.40)
          .from(tagEls,  { opacity: 0, y: 18, duration: 0.55, stagger: 0.08 }, 0.50)
          .from(cta,     { opacity: 0, y: 14, duration: 0.5  }, 0.65)
          .from(scroll,  { opacity: 0, scaleY: 0, duration: 0.6, transformOrigin: "top center" }, 0.80);
      });

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      data-transition
      data-transition-section
      className="relative z-10 min-h-[116vh] scroll-mt-0"
      aria-label="Закулисье — Agentство событий"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full flex-col overflow-hidden">
        {/* Colour interpolation background */}
        <div
          ref={bgRef}
          className="absolute inset-0 z-0"
          style={{ backgroundColor: LIGHT }}
          aria-hidden
        />

        {/* Motion accent element — pulsing dot */}
        <span
          ref={motionDotRef}
          className="absolute right-6 top-[38%] z-[2] h-1.5 w-1.5 rounded-full bg-accent shimmer-pulse md:right-12"
          aria-hidden
        />

        <div className="relative z-[1] flex min-h-0 flex-1 flex-col justify-between px-4 pb-12 pt-[clamp(5.5rem,12vh,8rem)] md:px-8 md:pb-14 md:pt-[clamp(6rem,14vh,9rem)]">

          {/* Wordmark */}
          <div className="pointer-events-none relative w-[min(100%,96vw)] max-w-[1600px]">
            <h1
              ref={wordRef}
              data-transition-wordmark
              className="font-display font-black uppercase leading-[0.9] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(60px, 14vw, 170px)",
                color: WORD_ON_LIGHT,
              }}
            >
              {WORDMARK}
            </h1>

            {/* Trust line directly under wordmark */}
            <p
              ref={trustRef}
              className="mt-4 font-body text-[12px] font-medium uppercase tracking-[0.12em] md:mt-5 md:text-[13px]"
              style={{ color: TAG_ON_LIGHT }}
            >
              {TRUST}
            </p>
          </div>

          {/* Bottom-right: description + CTA */}
          <div ref={tagWrapRef} className="mt-auto flex w-full justify-end">
            <div className="max-w-[min(100%,480px)] text-right">
              {OFFER.map((line) => (
                <p
                  key={line}
                  data-trans-tag
                  className="font-body font-semibold uppercase leading-relaxed tracking-[0.1em]"
                  style={{
                    fontSize: "clamp(12px, 1.2vw, 16px)",
                    color: TAG_ON_LIGHT,
                  }}
                >
                  {line}
                </p>
              ))}

              <div className="mt-8 md:mt-10">
                <a
                  ref={ctaRef}
                  href="#contact-form"
                  className="inline-flex items-center border-[1.5px] border-accent bg-transparent px-8 py-[14px] text-[13px] font-semibold uppercase tracking-[0.12em] transition-[background-color,color,border-color] duration-[250ms] ease-out hover:bg-accent hover:!text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent max-md:px-7 max-md:py-4"
                  style={{ color: TAG_ON_LIGHT }}
                >
                  Обсудить проект
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollRef}
          className="absolute bottom-8 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-1"
          aria-hidden
        >
          <div
            className="h-12 w-px bg-accent opacity-50"
            style={{ animation: "scroll-hint 2.2s ease-in-out 0.8s infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
