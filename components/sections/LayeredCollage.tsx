"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { unsplashPhoto } from "@/lib/content/unsplash";

const cols = [
  { src: unsplashPhoto("1511578314322-379afb476865", 900), rot: -3, w: 280, h: 360, t: 12, l: 6 },
  { src: unsplashPhoto("1504384308090-c894fdcc538d", 900), rot: 2, w: 200, h: 260, t: 8, l: 38 },
  { src: unsplashPhoto("1556761175-5973dc0f32e7", 900), rot: -2, w: 220, h: 300, t: 38, l: 12 },
  { src: unsplashPhoto("1514525253161-7a46d19cd819", 900), rot: 3, w: 260, h: 200, t: 42, l: 55 },
  { src: unsplashPhoto("1589903308904-1010c2294adc", 900), rot: -4, w: 180, h: 240, t: 58, l: 35 },
] as const;

export function LayeredCollage() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
      if (items.length === 0) return;
      if (reduced) {
        items.forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "translate3d(0,0,0) rotate(0deg)";
        });
        return;
      }
      if (mobile) {
        items.forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "translate3d(0,0,0) rotate(0deg)";
        });
        return;
      }
      items.forEach((el, i) => {
        gsap.set(el, { y: 48, opacity: 1, rotation: (i % 2 === 0 ? 1 : -1) * 3 });
      });
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          once: true,
          onEnter: () => {
            gsap.to(items, {
              y: 0,
              opacity: 1,
              rotation: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "power3.out",
            });
          },
        });
      });
      return () => ctx.revert();
    },
    { dependencies: [reduced, mobile] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-bg py-section-mobile md:py-section"
      aria-label="События"
    >
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <span className="max-w-full select-none whitespace-nowrap text-center font-display text-[16vw] font-bold leading-none tracking-tighter text-text-primary/[0.07]">
          СОБЫТИЯ
        </span>
      </div>
      <div className="relative z-[1] mx-auto max-w-content px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:min-h-[70vh] md:grid-cols-[1fr,320px] md:items-end">
          <div className="relative min-h-[420px] md:min-h-[520px]">
            {cols.map((c, i) => (
              <div
                key={c.src}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="absolute will-change-transform"
                style={{
                  top: `${c.t}%`,
                  left: `${c.l}%`,
                  width: c.w,
                  height: c.h,
                }}
              >
                <div
                  className="h-full w-full overflow-hidden border border-border shadow-2xl"
                  style={{ transform: `rotate(${c.rot}deg)` }}
                >
                  <Image
                    src={c.src}
                    alt="Корпоративное мероприятие в Сибири — event-агентство Закулисье Новосибирск"
                    width={c.w * 2}
                    height={c.h * 2}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 768px) 90vw, 400px"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="self-end text-right md:pb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">Масштаб</p>
            <p className="mt-4 font-body text-2xl font-medium leading-relaxed text-text-primary md:text-3xl">
              От камерного формата до десятков тысяч гостей — без снижения дисциплины сценария.
            </p>
            <p className="mt-6 text-sm text-text-secondary">
              Федеральные брифы и сибирские площадки. Один стандарт исполнения.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
