"use client";

import { VideoPlaceholder } from "@/components/ui/VideoPlaceholder";
import { useContactModal } from "@/components/providers/ContactModalProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { unsplashPhoto } from "@/lib/content/unsplash";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const POSTER = unsplashPhoto("1514525253161-7a46d19cd819", 2400);
const VIDEO_URL = process.env.NEXT_PUBLIC_SHOWREEL_VIDEO_URL;

const OFFER = ["АГЕНТСТВО ПОЛНОГО ЦИКЛА", "ДЛЯ КОМПАНИЙ, КОТОРЫЕ", "НЕ ИДУТ НА КОМПРОМИСС"] as const;

export function VideoSplitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { openContact } = useContactModal();
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el || reduced) return;

      const videoEl = el.querySelector<HTMLElement>("[data-video-reveal]");
      const textEl = el.querySelector<HTMLElement>("[data-text-reveal]");
      if (!videoEl || !textEl) return;

      const vShift = mobile ? 0 : -56;
      const tShift = mobile ? 0 : 44;

      /* Только x: не трогаем opacity — иначе при сбое ScrollTrigger/Lenis на статике/GH Pages
         блок остаётся с opacity:0 и «пропадает» постер. */
      gsap.set(videoEl, { x: vShift, opacity: 1 });
      gsap.set(textEl, { x: tShift, opacity: 1 });

      const ctx = gsap.context(() => {
        gsap.to(videoEl, {
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 40%",
            scrub: 1,
          },
        });

        gsap.to(textEl, {
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 40%",
            scrub: 1,
          },
        });
      }, el);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reduced, mobile] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-10 border-t border-white/[0.06]"
      style={{ backgroundColor: "var(--scene-bg, #0a0a0a)" }}
      aria-label="Showreel и подход"
    >
      <div className="mx-auto flex min-h-[min(100dvh,920px)] max-w-content flex-col gap-12 px-4 py-14 md:flex-row md:items-center md:gap-10 md:px-8 md:py-[clamp(3.5rem,8vh,5.5rem)] lg:gap-14">
        <div
          data-video-reveal
          className="w-full md:w-[62%] md:max-w-none md:flex-[1.15] md:pr-4"
        >
          <VideoPlaceholder
            src={VIDEO_URL}
            posterSrc={POSTER}
            caption="SHOWREEL 2024"
            description="Фрагменты постановок, сцен и продакшна для брендов, которые задают планку на уровне страны."
          />
        </div>

        <div
          data-text-reveal
          className="flex w-full flex-col justify-center md:w-[38%] md:flex-[0.85] md:pl-2 lg:pl-6"
        >
          <h2 className="font-display text-[clamp(1.35rem,2.4vw,2.75rem)] font-black leading-[1.12] tracking-tight text-text-primary">
            <span className="block">Мы делаем события,</span>
            <span className="mt-1 block text-accent">которые работают</span>
            <span className="mt-1 block">на репутацию</span>
          </h2>
          <p className="mt-7 text-sm leading-relaxed text-text-secondary md:text-base">
            Двадцать лет в индустрии и свыше трёх тысяч реализованных форматов — от корпоративной повестки до
            федеральных сборов. База в Новосибирске, стандарты и команда — как у столичных лидеров: смета,
            сроки и смысл остаются под контролем на каждом этапе.
          </p>
          <button
            type="button"
            onClick={openContact}
            className="mt-10 w-fit border-0 bg-transparent text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-primary transition-colors duration-300 hover:text-accent focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
          >
            <span className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-text-secondary/50 after:transition after:duration-300 hover:after:bg-accent">
              Обсудить проект
            </span>
          </button>

          <div className="mt-12 hidden max-w-[320px] text-right md:mt-16 md:block">
            {OFFER.map((line) => (
              <p
                key={line}
                className="font-body text-[10px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-text-muted"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
