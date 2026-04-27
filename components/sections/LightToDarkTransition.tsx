"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useContactModal } from "@/components/providers/ContactModalProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { interpolateColor } from "@/lib/utils/interpolateColor";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef, useState } from "react";
import { unsplashPhoto } from "@/lib/content/unsplash";
import { motion } from "framer-motion";

const LIGHT = "#f2efe9";
const DARK = "#0a0a0a";
const TEXT_ON_LIGHT = "#111111";
const TEXT_ON_DARK = "#f0f0f0";
const MUTED_ON_LIGHT = "#3a3a3a";
const MUTED_ON_DARK = "#9a9a9a";

const POSTER = unsplashPhoto("1514525253161-7a46d19cd819", 2400);
const VIDEO_URL = process.env.NEXT_PUBLIC_SHOWREEL_VIDEO_URL;

export function LightToDarkTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const { openContact } = useContactModal();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const onPlay = () => {
    if (!VIDEO_URL) return;
    const el = videoRef.current;
    if (!el) return;
    if (!el.src) el.src = VIDEO_URL;
    void el.play().then(() => setPlaying(true));
  };

  useGSAP(
    () => {
      if (reduced || mobile) return;
      const section = sectionRef.current;
      const bg = bgRef.current;
      const copy = copyRef.current;
      if (!section || !bg) return;
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
          onUpdate: (self) => {
            const p = self.progress;
            const col = interpolateColor(LIGHT, DARK, p);
            bg.style.backgroundColor = col;
            document.documentElement.style.setProperty("--page-bg", col);
            if (copy) {
              const t = copy.querySelectorAll<HTMLElement>("[data-l2d-text='main']");
              const t2 = copy.querySelectorAll<HTMLElement>("[data-l2d-text='accent']");
              const t3 = copy.querySelectorAll<HTMLElement>("[data-l2d-text='muted']");
              const cMain = interpolateColor(TEXT_ON_LIGHT, TEXT_ON_DARK, p);
              const cAcc = interpolateColor("#0a0a0a", "#c9a84c", Math.min(1, p * 1.15));
              const cMuted = interpolateColor(MUTED_ON_LIGHT, MUTED_ON_DARK, p);
              t.forEach((el) => {
                el.style.color = cMain;
              });
              t2.forEach((el) => {
                el.style.color = cAcc;
              });
              t3.forEach((el) => {
                el.style.color = cMuted;
              });
              const btn = copy.querySelector<HTMLButtonElement>("[data-l2d-btn]");
              if (btn) {
                const tBtn = Math.max(0, Math.min(1, (p - 0.15) / 0.7));
                btn.style.color = interpolateColor("#111111", "#f4f4f4", tBtn);
                btn.style.borderColor = interpolateColor("#111111", "#e5e5e5", tBtn);
              }
            }
          },
        });
      }, section);
      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reduced, mobile] }
  );

  const videoBlock = (
    <div className="relative w-full min-h-[220px] overflow-hidden md:min-h-0 md:h-[min(56vh,520px)]">
      <div className="absolute inset-0">
        {VIDEO_URL ? (
          <video
            ref={videoRef}
            className={
              playing
                ? "relative z-10 h-full w-full object-cover"
                : "pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
            }
            controls={playing}
            playsInline
            poster={POSTER}
            preload="none"
            aria-label="Showreel агентства Закулисье"
          />
        ) : null}
        <Image
          src={POSTER}
          alt="Атмосферное мероприятие — превью"
          fill
          className={playing && VIDEO_URL ? "hidden" : "object-cover"}
          sizes="(max-width: 768px) 100vw, 55vw"
        />
        <div
          className={playing && VIDEO_URL ? "hidden" : "absolute inset-0 bg-black/20"}
          aria-hidden
        />
        {(!playing || !VIDEO_URL) && (
          <div className="absolute inset-0 z-[2] flex items-center justify-center">
            {VIDEO_URL ? (
              <button
                type="button"
                onClick={onPlay}
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#111]/80 bg-white/30 text-[#111] backdrop-blur-sm transition hover:bg-white/50 focus-visible:ring-2 focus-visible:ring-accent md:h-20 md:w-20"
                aria-label="Воспроизвести видео"
              >
                <span className="ml-0.5 inline-block h-0 w-0 border-y-[8px] border-l-[12px] border-y-transparent border-l-[#111] md:border-y-[10px] md:border-l-[16px]" />
              </button>
            ) : (
              <p className="max-w-[200px] px-3 text-center text-[10px] text-text-dark/80">
                Задайте NEXT_PUBLIC_SHOWREEL_VIDEO_URL
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (reduced || mobile) {
    return (
      <section className="border-t border-border bg-bg py-12 md:py-16" aria-label="Showreel и смысл">
        <div className="mx-auto grid max-w-content gap-8 px-4 md:grid-cols-2 md:items-center md:gap-10 md:px-8">
          {videoBlock}
          <div>
            <p className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
              Мы не продаём шоу. Мы создаём события, которые работают.
            </p>
            <p className="mt-4 text-sm text-text-secondary">
              20 лет. 3000+ мероприятий. Один стандарт исполнения.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[120vh] scroll-mt-0"
      aria-label="Смена сцены и showreel"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full flex-col overflow-hidden">
        <div ref={bgRef} className="absolute inset-0" style={{ backgroundColor: LIGHT }} aria-hidden />

        <div className="relative z-[1] flex min-h-0 flex-1 flex-col px-4 pt-20 md:flex-row md:items-stretch md:gap-0 md:px-8 md:pt-0">
          <div className="flex w-full flex-[1.1] items-center py-4 md:max-w-[58%] md:py-8 md:pr-6">
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {videoBlock}
            </motion.div>
          </div>

          <div
            ref={copyRef}
            className="flex flex-[0.9] flex-col justify-center border-t border-black/5 py-6 md:max-w-[42%] md:border-t-0 md:py-8 md:pl-6"
          >
            <p
              data-l2d-text="main"
              className="font-display text-[clamp(1.25rem,2.1vw,1.75rem)] font-semibold leading-snug"
              style={{ color: TEXT_ON_LIGHT }}
            >
              Мы не продаём шоу.
            </p>
            <p
              data-l2d-text="accent"
              className="mt-3 font-display text-[clamp(1.5rem,2.8vw,2.5rem)] font-semibold leading-tight"
              style={{ color: "#0a0a0a" }}
            >
              Создаём события, которые работают.
            </p>
            <p
              data-l2d-text="muted"
              className="mt-6 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: MUTED_ON_LIGHT }}
            >
              20 ЛЕТ · 3000+ СОБЫТИЙ · ОДИН СТАНДАРТ
            </p>
            <button
              type="button"
              data-l2d-btn
              onClick={openContact}
              className="mt-8 w-fit border-2 border-[#111] bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#111] transition hover:bg-[#111] hover:text-[#f2efe9] focus-visible:ring-2 focus-visible:ring-accent"
            >
              Обсудить проект
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
