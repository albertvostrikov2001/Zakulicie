"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { interpolateHex } from "@/hooks/useColorInterpolation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CTALink } from "@/components/ui/CTALink";
import Image from "@/components/ui/SiteImage";
import type { CaseStudy } from "@/lib/types";
import { useRef, useState, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const LIGHT        = "#B5611C";
const DARK         = "#0a0a0a";
const WORD_ON_LIGHT = "#F5F5F5";
const WORD_ON_DARK  = "#f5f5f5";
/** Descriptor + CTA label: светлая / тёмная фазы hero (≈ rgba(17,17,17,0.88) → rgba(242,239,233,0.82)) */
const TAG_ON_LIGHT  = "#ECE8E0";
const TAG_ON_DARK   = "#ECE8E0";

const WORDMARK = "ЗАКУЛИСЬЕ";

/** Hero headline — левый нижний угол (как на референсе) */
const HERO_HEADLINE_LINES = [
  "Ивент-агентство",
  "полного цикла",
  "для корпоративных",
  "и деловых событий",
] as const;

const SLIDE_DURATION_MS = 3800;

interface TransitionSectionProps {
  cases?: CaseStudy[];
}

export function TransitionSection({ cases = [] }: TransitionSectionProps) {
  const sectionRef    = useRef<HTMLElement>(null);
  const bgRef         = useRef<HTMLDivElement>(null);
  const wordRef       = useRef<HTMLParagraphElement>(null);
  const tagWrapRef    = useRef<HTMLDivElement>(null);
  const ctaRef        = useRef<HTMLAnchorElement>(null);
  const scrollRef     = useRef<HTMLDivElement>(null);
  const motionDotRef  = useRef<HTMLSpanElement>(null);
  const mobile        = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  /* ── Mobile hero slideshow ─────────────────────────────── */
  const photoSlides = cases.filter((c) => c.heroImage?.src).slice(0, 6);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    if (photoSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setSlideIdx((i) => (i + 1) % photoSlides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoSlides.length]);

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
        {/* Colour interpolation background (desktop) */}
        <div
          ref={bgRef}
          className="absolute inset-0 z-0"
          style={{ backgroundColor: LIGHT }}
          aria-hidden
        />

        {/* Mobile hero photo slideshow ───────────────────── */}
        {photoSlides.length > 0 && (
          <div className="absolute inset-0 z-[1] overflow-hidden md:hidden" aria-hidden>
            {photoSlides.map((c, i) => (
              <div
                key={c.slug}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: i === slideIdx ? 1 : 0 }}
              >
                <Image
                  src={c.heroImage.src}
                  alt={c.title}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="100vw"
                />
              </div>
            ))}
            {/* gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/72" />
          </div>
        )}

        {/* Motion accent element — pulsing dot */}
        <span
          ref={motionDotRef}
          className="absolute right-6 top-[38%] z-[2] h-1.5 w-1.5 rounded-full bg-accent shimmer-pulse md:right-12"
          aria-hidden
        />

        <div className="relative z-[3] flex min-h-0 flex-1 flex-col justify-between px-4 pb-12 pt-[clamp(5.5rem,12vh,8rem)] md:px-8 md:pb-14 md:pt-[clamp(6rem,14vh,9rem)]">

          {/* Wordmark — dominant, left-anchored */}
          <div className="pointer-events-none relative w-[min(100%,96vw)] max-w-[1600px] overflow-hidden">
            <p
              ref={wordRef}
              data-transition-wordmark
              className="m-0 font-display font-black uppercase leading-[0.9] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(40px, 10.5vw, 180px)",
                color: WORD_ON_LIGHT,
              }}
            >
              {WORDMARK}
            </p>
          </div>

          {/* Bottom-right: headline + CTA */}
          <div
            ref={tagWrapRef}
            className="relative z-[3] mt-auto flex w-full justify-center px-5 pb-11 pt-1 md:static md:mt-0 md:justify-end md:px-0 md:pb-0 md:pt-0"
          >
            <div className="flex w-full max-w-[min(540px,94vw)] flex-col items-start md:absolute md:bottom-[52px] md:right-14 md:w-auto">
              <div className="flex w-full gap-4 self-stretch sm:gap-5">
                {/* Accent bar — desktop only */}
                <div
                  className="hidden w-px shrink-0 self-stretch rounded-full bg-accent md:block"
                  aria-hidden
                />
                <div className="flex min-w-0 flex-1 flex-col gap-5">
                  {/* Headline — desktop only */}
                  <h1
                    data-trans-tag
                    className="m-0 hidden font-display font-black text-[color:inherit] md:block"
                    style={{
                      fontSize: "clamp(14px, 2.4vw, 32px)",
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                      color: TAG_ON_LIGHT,
                    }}
                  >
                    {HERO_HEADLINE_LINES.map((line, i) => (
                      <span
                        key={line}
                        className={
                          i === 0 ? undefined :
                          i === 1 ? "inline md:block" :
                          "block"
                        }
                      >
                        {i === 1 ? " " + line : line}
                      </span>
                    ))}
                  </h1>

                  <CTALink
                    ref={ctaRef}
                    className="group inline-flex w-full justify-center md:w-fit md:justify-start scroll-mt-28 cursor-pointer items-center gap-[10px] border-[1.5px] border-solid border-[color:var(--hero-cta-border)] bg-transparent px-7 py-3.5 md:px-9 md:py-4 font-medium uppercase text-[color:var(--hero-cta-fg)] no-underline transition-[background-color,color,border-color,transform,box-shadow] duration-[250ms] ease-out hover:border-[#F2EFE9] hover:bg-[#F2EFE9] hover:text-[#1A1A1A] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:hover:shadow-2xl"
                    style={{
                      fontSize: "clamp(13px, 1.6vw, 20px)",
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
                  </CTALink>
                </div>
              </div>

              {/* Slideshow dots — mobile only */}
              {photoSlides.length > 1 && (
                <div
                  className="mt-5 flex justify-center gap-1.5 self-center md:hidden"
                  aria-hidden
                >
                  {photoSlides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSlideIdx(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        height: "3px",
                        width: i === slideIdx ? "20px" : "6px",
                        background:
                          i === slideIdx
                            ? "var(--color-accent)"
                            : "rgba(255,255,255,0.38)",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator — desktop */}
        <div
          ref={scrollRef}
          className="absolute bottom-8 left-1/2 z-[3] hidden -translate-x-1/2 flex-col items-center gap-1 md:flex"
          aria-hidden
        >
          <div
            className="h-12 w-px bg-accent opacity-50"
            style={{ animation: "scroll-hint 2.2s ease-in-out 0.8s infinite" }}
          />
        </div>

        {/* Scroll indicator — mobile */}
        <div
          className="absolute bottom-5 left-0 right-0 z-[3] flex justify-center md:hidden"
          aria-hidden
        >
          <div
            className="flex flex-col items-center gap-1"
            style={{ animation: "scroll-hint-mobile 2s ease-in-out 1.2s infinite" }}
          >
            <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-white/50">
              листай
            </span>
            <svg width="10" height="7" viewBox="0 0 10 7" fill="none" aria-hidden>
              <path
                d="M1 1.5l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/50"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
