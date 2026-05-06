"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { interpolateHex } from "@/hooks/useColorInterpolation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const LIGHT        = "#f2efe9";
const DARK         = "#0a0a0a";
const WORD_ON_LIGHT = "#1a1a1a";
const WORD_ON_DARK  = "#f5f5f5";
const TAG_ON_LIGHT  = "#3a3a3a";
const TAG_ON_DARK   = "rgba(245,245,245,0.65)";

const OFFER    = [
  "АГЕНТСТВО ПОЛНОГО ЦИКЛА",
  "ДЛЯ КОМПАНИЙ, КОТОРЫЕ НЕ ИДУТ НА КОМПРОМИСС",
] as const;
const WORDMARK = "ЗАКУЛИСЬЕ";

export function TransitionSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const bgRef         = useRef<HTMLDivElement>(null);
  const wordRef       = useRef<HTMLHeadingElement>(null);
  const tagWrapRef    = useRef<HTMLDivElement>(null);
  const ctaRef        = useRef<HTMLAnchorElement>(null);
  const scrollRef     = useRef<HTMLDivElement>(null);
  const motionDotRef  = useRef<HTMLSpanElement>(null);
  const mobile        = useIsMobile();
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
      if (!word || !tags || !cta) return;

      const ctx = gsap.context(() => {
        const tagEls = Array.from(tags.querySelectorAll<HTMLElement>("[data-trans-tag]"));

        if (reducedMotion) {
          gsap.from([word, ...tagEls, cta], {
            opacity: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.12,
          });
          return;
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(word,   { opacity: 0, y: 28, duration: 0.8  }, 0.25)
          .from(tagEls, { opacity: 0, y: 16, duration: 0.6,  stagger: 0.08 }, 0.50)
          .from(cta,    { opacity: 0, scale: 0.97, duration: 0.5 }, 0.65)
          .from(scroll, { opacity: 0, scaleY: 0, duration: 0.8, transformOrigin: "top center" }, 0.90);
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
      aria-label="Закулисье — Агентство событий"
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

        <div className="relative z-[3] flex min-h-0 flex-1 flex-col justify-between px-4 pb-12 pt-[clamp(5.5rem,12vh,8rem)] md:px-8 md:pb-14 md:pt-[clamp(6rem,14vh,9rem)]">

          {/* Wordmark — dominant, left-anchored */}
          <div className="pointer-events-none relative w-[min(100%,96vw)] max-w-[1600px]">
            <h1
              ref={wordRef}
              data-transition-wordmark
              className="font-display font-black uppercase leading-[0.9] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(80px, 14vw, 180px)",
                color: WORD_ON_LIGHT,
              }}
            >
              {WORDMARK}
            </h1>
          </div>

          {/* Bottom-right: description + CTA */}
          <div ref={tagWrapRef} className="mt-auto flex w-full justify-end">
            {/* Accent vertical bar + text block */}
            <div
              className="flex max-w-[min(100%,480px)] flex-col gap-7 pl-5 md:max-w-[520px] md:pl-6"
              style={{ borderLeft: "3px solid var(--color-accent)" }}
            >
              <div className="space-y-1">
                {OFFER.map((line) => (
                  <p
                    key={line}
                    data-trans-tag
                    className="font-body font-medium uppercase leading-[1.3]"
                    style={{
                      fontSize:      "clamp(18px, 2vw, 26px)",
                      letterSpacing: "0.04em",
                      color:         TAG_ON_LIGHT,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Text CTA with arrow + underline reveal */}
              <a
                ref={ctaRef}
                href="#contact-form"
                className="group relative inline-flex w-fit items-center gap-2 bg-transparent pb-[3px] font-medium uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                style={{
                  fontSize:      "clamp(15px, 1.6vw, 20px)",
                  letterSpacing: "0.08em",
                  color:         TAG_ON_LIGHT,
                  gap:           "8px",
                }}
              >
                <span>Обсудить проект</span>
                <span
                  className="inline-block transition-transform duration-[250ms] ease-out group-hover:translate-x-[6px]"
                  aria-hidden
                >
                  →
                </span>
                <span
                  className="absolute bottom-0 left-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[250ms] ease-out group-hover:scale-x-100"
                  style={{ width: "100%" }}
                  aria-hidden
                />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollRef}
          className="absolute bottom-8 left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-1"
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
