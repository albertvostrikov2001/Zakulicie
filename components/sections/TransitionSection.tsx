"use client";

import { useContactModal } from "@/components/providers/ContactModalProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { interpolateHex } from "@/hooks/useColorInterpolation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const LIGHT = "#f2efe9";
const DARK = "#0a0a0a";
const WORD_ON_LIGHT = "#1a1a1a";
const WORD_ON_DARK = "#f5f5f5";
const TAG_ON_LIGHT = "#2d2d2d";
const TAG_ON_DARK = "#9a9a9a";

const OFFER = ["АГЕНТСТВО ПОЛНОГО ЦИКЛА", "ДЛЯ КОМПАНИЙ, КОТОРЫЕ", "НЕ ИДУТ НА КОМПРОМИСС"] as const;
const WORDMARK = "ЗАКУЛИСЬЕ";

export function TransitionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const tagWrapRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const mobile = useIsMobile();
  const { openContact } = useContactModal();

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
          scrub: mobile ? 1.2 : 1,
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
            if (ctaRef.current) ctaRef.current.style.color = tw;

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

  return (
    <section
      ref={sectionRef}
      data-transition-section
      className="relative z-10 min-h-[300vh] scroll-mt-0"
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
            <div className="max-w-[400px] text-right">
              {OFFER.map((line) => (
                <p
                  key={line}
                  data-trans-tag
                  className="font-body text-[11px] font-semibold uppercase leading-relaxed tracking-[0.2em] md:text-sm"
                  style={{ color: TAG_ON_LIGHT }}
                >
                  {line}
                </p>
              ))}
              <div className="mt-8 md:mt-10">
                <button
                  ref={ctaRef}
                  type="button"
                  onClick={openContact}
                  className="group border-0 bg-transparent text-xs font-semibold uppercase tracking-[0.22em] transition-colors duration-300 hover:text-accent focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--scene-bg)]"
                  style={{ color: TAG_ON_LIGHT }}
                >
                  <span className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-current/35 after:transition after:duration-300 after:ease-out group-hover:after:bg-accent">
                    Обсудить проект
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
