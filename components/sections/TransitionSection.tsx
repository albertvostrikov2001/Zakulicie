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
/** Descriptor + CTA label: светлая / тёмная фазы hero (≈ rgba(17,17,17,0.88) → rgba(242,239,233,0.82)) */
const TAG_ON_LIGHT  = "#111111";
const TAG_ON_DARK   = "#ECE8E0";

const WORDMARK = "ЗАКУЛИСЬЕ";

/** Hero: короткая «надстройка» над supporting — без дублирования ниже */
const HERO_CAPTION = "ивент-агентство полного цикла";
/** Основной supporting-текст hero (единственное развёрнутое пояснение) */
const HERO_SUPPORTING = "организация корпоративных и деловых событий для вашего бизнеса";

export function TransitionSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const bgRef         = useRef<HTMLDivElement>(null);
  const wordRef       = useRef<HTMLParagraphElement>(null);
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

            const ctaFg = interpolateHex(WORD_ON_LIGHT, WORD_ON_DARK, p);
            if (ctaRef.current) {
              ctaRef.current.style.setProperty("--hero-cta-fg", ctaFg);
              ctaRef.current.style.setProperty("--hero-cta-border", ctaFg);
            }

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
          .from(cta,    { opacity: 0, scale: 0.97, duration: 0.5 }, 0.58)
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
      <div
        data-section="hero"
        className="sticky top-0 flex h-[100dvh] w-full flex-col overflow-hidden"
      >
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

          {/* Wordmark — dominant, left-anchored (отступ к текстовому блоку, без наезда) */}
          <div className="pointer-events-none relative mb-8 w-[min(100%,96vw)] max-w-[1600px] md:mb-10">
            <p
              ref={wordRef}
              data-transition-wordmark
              className="m-0 font-display font-black uppercase leading-[0.9] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(80px, 14vw, 180px)",
                color: WORD_ON_LIGHT,
              }}
            >
              {WORDMARK}
            </p>
          </div>

          {/* Bottom-right: descriptor + CTA — mobile: flow; md+: absolute */}
          <div
            ref={tagWrapRef}
            className="relative z-[3] mt-auto flex w-full justify-center px-5 pb-11 pt-1 md:static md:mt-0 md:flex md:justify-end md:px-0 md:pb-0 md:pt-0"
          >
            <div className="flex w-full max-w-[min(540px,94vw)] flex-col items-start md:absolute md:bottom-[52px] md:right-14 md:max-w-[min(520px,40ch)] md:w-auto">
              <div className="flex w-full gap-3 self-stretch sm:gap-4 md:gap-5">
                <div
                  className="w-px shrink-0 self-stretch rounded-full bg-accent"
                  aria-hidden
                />
                <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5">
                  <p
                    data-trans-tag
                    className="m-0 max-w-full font-body font-semibold uppercase leading-snug tracking-[0.18em] text-[color:inherit] [text-wrap:balance] md:tracking-[0.2em]"
                    style={{
                      fontSize: "clamp(11px, 2.85vw, 12px)",
                      lineHeight: 1.45,
                      color: TAG_ON_LIGHT,
                    }}
                  >
                    {HERO_CAPTION}
                  </p>
                  <h1
                    data-trans-tag
                    className="m-0 max-w-full font-body font-medium leading-snug tracking-[-0.015em] text-[color:inherit] md:leading-[1.5]"
                    style={{
                      fontSize: "clamp(16px, 3.95vw, 22px)",
                      lineHeight: 1.45,
                      color: TAG_ON_LIGHT,
                    }}
                  >
                    {HERO_SUPPORTING.charAt(0).toUpperCase()}
                    {HERO_SUPPORTING.slice(1)}
                  </h1>

                  {/* Bordered CTA with arrow */}
                  <a
                    ref={ctaRef}
                    href="#contact-form"
                    className="group mt-0.5 inline-flex w-fit scroll-mt-28 cursor-pointer items-center gap-[10px] border-[1.5px] border-solid border-[color:var(--hero-cta-border)] bg-transparent px-9 py-4 font-medium uppercase text-[color:var(--hero-cta-fg)] no-underline transition-[background-color,color,border-color,transform,box-shadow] duration-[250ms] ease-out hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F2EFE9] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:mt-0 md:hover:shadow-2xl"
                    style={{
                      fontSize: "clamp(15px, 1.6vw, 20px)",
                      letterSpacing: "0.08em",
                      ["--hero-cta-fg" as string]: WORD_ON_LIGHT,
                      ["--hero-cta-border" as string]: WORD_ON_LIGHT,
                    }}
                  >
                    <span>Обсудить проект</span>
                    <span
                      className="inline-block transition-transform duration-[250ms] ease-out group-hover:translate-x-[6px]"
                      aria-hidden
                    >
                      →
                    </span>
                  </a>
                </div>
              </div>
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
