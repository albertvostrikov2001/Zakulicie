"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { interpolateHex } from "@/hooks/useColorInterpolation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const LIGHT = "#f2efe9";
const DARK = "#0a0a0a";
const WORD_ON_LIGHT = "#1a1a1a";
const WORD_ON_DARK = "#f5f5f5";
const TAG_ON_LIGHT = "#1a1a1a";
const TAG_ON_DARK = "#9a9a9a";

const OFFER = ["АГЕНТСТВО ПОЛНОГО ЦИКЛА", "ДЛЯ КОМПАНИЙ, КОТОРЫЕ", "НЕ ИДУТ НА КОМПРОМИСС"] as const;
const WORDMARK = "ЗАКУЛИСЬЕ";

export function TransitionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const tagWrapRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const mobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const bg = bgRef.current;
      if (!section || !bg) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: mobile ? 1 : 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            const col = interpolateHex(LIGHT, DARK, p);
            bg.style.backgroundColor = col;
            document.documentElement.style.setProperty("--scene-bg", col);
            document.documentElement.style.setProperty("--page-bg", col);

            const w = interpolateHex(WORD_ON_LIGHT, WORD_ON_DARK, p);
            if (wordRef.current) wordRef.current.style.color = w;

            const lines = tagWrapRef.current?.querySelectorAll<HTMLElement>("[data-trans-tag]");
            const tw = interpolateHex(TAG_ON_LIGHT, TAG_ON_DARK, p);
            lines?.forEach((el) => {
              el.style.color = tw;
            });

            const ctaColor = interpolateHex(TAG_ON_LIGHT, WORD_ON_DARK, p);
            if (ctaRef.current) ctaRef.current.style.color = ctaColor;

            const fadeOutStart = 0.78;
            const wordOp =
              p < fadeOutStart ? 1 : Math.max(0, 1 - (p - fadeOutStart) / (1 - fadeOutStart));
            if (wordRef.current) wordRef.current.style.opacity = String(wordOp);

            const tagOp =
              p < fadeOutStart ? 1 : Math.max(0, 1 - (p - fadeOutStart) / (1 - fadeOutStart));
            if (tagWrapRef.current) tagWrapRef.current.style.opacity = String(tagOp);
          },
        });
      }, section);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [mobile] }
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      const word = wordRef.current;
      const tags = tagWrapRef.current;
      const cta = ctaRef.current;
      if (!section || !word || !tags || !cta) return;

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
        tl.from(word, { opacity: 0, y: 24, duration: 0.6 }, 0.2)
          .from(tagEls, { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 }, 0.35)
          .from(cta, { opacity: 0, y: 12, duration: 0.45 }, 0.5);
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
      className="relative z-10 min-h-[165vh] scroll-mt-0"
      aria-label="Переход сцены"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full flex-col overflow-hidden">
        <div ref={bgRef} className="absolute inset-0 z-0" style={{ backgroundColor: LIGHT }} aria-hidden />

        <div className="relative z-[1] flex min-h-0 flex-1 flex-col justify-between px-4 pb-12 pt-[clamp(5.5rem,12vh,8rem)] md:px-8 md:pb-14 md:pt-[clamp(6rem,14vh,9rem)]">
          <div className="pointer-events-none relative w-[min(100%,92vw)] max-w-[1600px] md:top-[4vh]">
            <h2
              ref={wordRef}
              data-transition-wordmark
              className="font-display text-[clamp(48px,14vw,72px)] font-black uppercase leading-[0.9] tracking-tight md:text-[clamp(70px,11vw,170px)]"
              style={{ color: WORD_ON_LIGHT }}
            >
              {WORDMARK}
            </h2>
          </div>

          <div ref={tagWrapRef} className="mt-auto flex w-full justify-end">
            <div className="max-w-[min(100%,440px)] text-right">
              {OFFER.map((line) => (
                <p
                  key={line}
                  data-trans-tag
                  className="font-body text-[13px] font-medium uppercase leading-relaxed tracking-[0.08em] md:text-[17px] md:leading-relaxed"
                  style={{ color: TAG_ON_LIGHT }}
                >
                  {line}
                </p>
              ))}
              <div className="mt-8 md:mt-10">
                <Link
                  ref={ctaRef}
                  href="#contact"
                  className="inline-flex border border-accent bg-transparent px-7 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-[background-color,color] duration-300 ease-out hover:bg-accent hover:!text-text-dark focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--scene-bg)] max-md:px-8 max-md:py-3.5 max-md:text-sm"
                  style={{ color: TAG_ON_LIGHT }}
                >
                  Обсудить проект
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
