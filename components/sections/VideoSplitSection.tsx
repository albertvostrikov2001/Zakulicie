"use client";

import { VideoPlaceholder } from "@/components/ui/VideoPlaceholder";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getShowreelVideoUrl, SHOWREEL_POSTER } from "@/lib/video";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

/** Relative luminance 0–1 (sRGB), для контраста текста к `background-color`. */
function luminanceFromRgb(r: number, g: number, b: number): number {
  const lin = [r, g, b].map((c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0]! + 0.7152 * lin[1]! + 0.0722 * lin[2]!;
}

function parseSceneBgLuminance(): number | null {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--scene-bg").trim();
  const comma = raw.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (comma) {
    return luminanceFromRgb(Number(comma[1]), Number(comma[2]), Number(comma[3]));
  }
  const space = raw.match(/^rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)/i);
  if (space) {
    return luminanceFromRgb(Number(space[1]), Number(space[2]), Number(space[3]));
  }
  if (/^#([0-9a-f]{6})$/i.test(raw)) {
    const h = raw.slice(1);
    return luminanceFromRgb(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
  }
  return null;
}

const OFFER = ["АГЕНТСТВО ПОЛНОГО ЦИКЛА", "ДЛЯ КОМПАНИЙ, КОТОРЫЕ", "НЕ ИДУТ НА КОМПРОМИСС"] as const;

export function VideoSplitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [lightScene, setLightScene] = useState(false);

  useEffect(() => {
    const tick = () => {
      const L = parseSceneBgLuminance();
      setLightScene(L !== null && L > 0.45);
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    const mo = new MutationObserver(tick);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    return () => {
      window.removeEventListener("scroll", tick);
      mo.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el || reduced) return;

      const videoEl = el.querySelector<HTMLElement>("[data-video-reveal]");
      const textEl = el.querySelector<HTMLElement>("[data-text-reveal]");
      if (!videoEl || !textEl) return;

      const vShift = mobile ? 0 : -72;
      const tShift = mobile ? 0 : 36;

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
      <div className="mx-auto grid min-h-[min(88dvh,920px)] max-w-[min(98vw,1720px)] grid-cols-1 gap-8 px-4 py-10 md:grid-cols-[minmax(0,1fr)_min(240px,26%)] md:items-center md:gap-7 md:px-6 md:py-[clamp(2.25rem,4.5vh,3.75rem)] lg:grid-cols-[minmax(0,1fr)_min(280px,24%)] lg:gap-9 lg:px-8">
        <div data-video-reveal className="w-full min-w-0 md:col-start-1">
          <VideoPlaceholder
            autoPlayInView
            frameClassName="max-h-[min(58vh,440px)] md:max-h-[min(74vh,780px)]"
            imageSizes="(max-width: 768px) 100vw, 76vw"
            src={getShowreelVideoUrl(false)}
            mobileSrc={getShowreelVideoUrl(true)}
            posterSrc={SHOWREEL_POSTER}
            caption="SHOWREEL"
            description="Фрагменты постановок, сцен и продакшна для брендов, которые задают планку на уровне страны."
            captionsOnLightBg={lightScene}
          />
        </div>

        <div
          data-text-reveal
          className={
            lightScene
              ? "flex w-full min-w-0 flex-col justify-center text-[#1a1a1a] md:col-start-2 md:pl-1 lg:pl-3"
              : "flex w-full min-w-0 flex-col justify-center md:col-start-2 md:pl-1 lg:pl-3"
          }
        >
          <h2
            className={
              lightScene
                ? "font-display text-[clamp(1.1rem,1.75vw,2rem)] font-black leading-[1.14] tracking-tight text-[#1a1a1a]"
                : "font-display text-[clamp(1.1rem,1.75vw,2rem)] font-black leading-[1.14] tracking-tight text-text-primary"
            }
          >
            Организация мероприятий полного цикла
          </h2>
          <p
            className={
              lightScene
                ? "mt-4 text-[13px] leading-relaxed text-[rgba(26,26,26,0.72)] md:text-sm"
                : "mt-4 text-[13px] leading-relaxed text-text-secondary md:text-sm"
            }
          >
            Двадцать лет в индустрии и свыше трёх тысяч реализованных форматов — от корпоративной повестки до
            федеральных сборов. База в Новосибирске, стандарты и команда — как у столичных лидеров: смета,
            сроки и смысл остаются под контролем на каждом этапе.
          </p>
          <Link
            href="#contact-form"
            className={
              lightScene
                ? "mt-7 inline-flex w-fit items-center border-[1.5px] border-[#1a1a1a] bg-transparent px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#1a1a1a] transition-[background-color,color] duration-[250ms] ease-out hover:bg-[#1a1a1a] hover:text-[#f2efe9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
                : "mt-7 inline-flex w-fit items-center border-[1.5px] border-accent bg-transparent px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-text-primary transition-[background-color,color] duration-[250ms] ease-out hover:bg-accent hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
            }
          >
            Обсудить проект
          </Link>

          <div
            className={
              lightScene
                ? "mt-8 hidden max-w-[240px] text-right md:mt-10 md:block [&_p]:text-[rgba(26,26,26,0.45)]"
                : "mt-8 hidden max-w-[240px] text-right md:mt-10 md:block"
            }
          >
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
