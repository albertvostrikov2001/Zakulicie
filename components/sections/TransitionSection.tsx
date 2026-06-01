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
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const LIGHT         = "#B5611C";
const DARK          = "#0a0a0a";
const WORD_ON_LIGHT = "#F5F5F5";
const WORD_ON_DARK  = "#f5f5f5";
const TAG_ON_LIGHT  = "#ECE8E0";
const TAG_ON_DARK   = "#ECE8E0";

const WORDMARK = "ЗАКУЛИСЬЕ";

const HERO_HEADLINE_LINES = [
  "Ивент-агентство",
  "полного цикла",
  "для корпоративных",
  "и деловых событий",
] as const;

interface TransitionSectionProps {
  cases?: CaseStudy[];
}

export function TransitionSection({ cases = [] }: TransitionSectionProps) {
  const sectionRef   = useRef<HTMLElement>(null);
  const bgRef        = useRef<HTMLDivElement>(null);
  const wordRef      = useRef<HTMLParagraphElement>(null);
  const tagWrapRef   = useRef<HTMLDivElement>(null);
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

            if (wordRef.current) wordRef.current.style.color = interpolateHex(WORD_ON_LIGHT, WORD_ON_DARK, p);

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

  /* ── Hero case marquee speed (300 px/sec device-independent) ── */
  const trackRef      = useRef<HTMLDivElement>(null);
  const [animDur, setAnimDur] = useState(9); // fallback SSR value

  useEffect(() => {
    const el = trackRef.current;
    if (!el || cases.length === 0) return;
    const id = requestAnimationFrame(() => {
      const half = (trackRef.current?.scrollWidth ?? 0) / 2;
      if (half > 0) setAnimDur(Math.max(4, half / 300)); // 300 px/sec
    });
    return () => cancelAnimationFrame(id);
  }, [cases.length]);

  /* ── Hero case marquee data ────────────────────────────── */
  const marqueeItems = cases.length > 0
    ? [...cases, ...cases]   // duplicate for seamless loop
    : [];

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

        {/* ── Main content layout ───────────────────────────── */}
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

          {/* ── Hero cases marquee strip ─────────────────────── */}
          {marqueeItems.length > 0 && (
            <div className="-mx-4 overflow-hidden md:-mx-8" aria-hidden>
              <div
                ref={trackRef}
                className="flex gap-3 md:gap-4"
                style={
                  reducedMotion
                    ? { overflowX: "auto", paddingLeft: "1rem" }
                    : { animation: `hero-marquee-ltr ${animDur.toFixed(1)}s linear infinite` }
                }
              >
                {marqueeItems.map((c, i) => (
                  <Link
                    key={`hm-${c.slug}-${i}`}
                    href={`/cases/${c.slug}`}
                    tabIndex={-1}
                    className="relative block shrink-0 overflow-hidden"
                    style={{
                      width:  "clamp(320px, 82vw, 560px)",
                      height: "clamp(210px, 53vw, 365px)",
                      borderRadius: "var(--border-radius-card)",
                    }}
                  >
                    <Image
                      src={c.heroImage.src}
                      alt={c.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 42vw, 290px"
                    />
                    {/* Dark gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(10,10,10,0.72) 0%, transparent 55%)",
                      }}
                    />
                    {/* Title */}
                    <p className="absolute bottom-2 left-2.5 right-2.5 m-0 line-clamp-2 text-[10px] font-semibold leading-snug text-white/90 md:bottom-3 md:left-3 md:right-3 md:text-[11px]">
                      {c.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Bottom-right: headline + CTA ─────────────────── */}
          <div
            ref={tagWrapRef}
            className="relative z-[3] flex w-full justify-center pt-1 md:static md:justify-end md:pt-0"
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
