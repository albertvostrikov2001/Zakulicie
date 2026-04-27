"use client";

import { MagneticButton } from "@/components/motion/MagneticButton";
import { useContactModal } from "@/components/providers/ContactModalProvider";
import { unsplashPhoto } from "@/lib/content/unsplash";
import { motion } from "framer-motion";
import Image from "@/components/ui/SiteImage";
import { useRef, useState } from "react";

const POSTER = unsplashPhoto("1514525253161-7a46d19cd819", 2400);
const VIDEO_URL = process.env.NEXT_PUBLIC_SHOWREEL_VIDEO_URL;

export function VideoSplitBlock() {
  const { openContact } = useContactModal();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState(false);

  const onPlay = () => {
    if (!VIDEO_URL) return;
    const el = videoRef.current;
    if (!el) return;
    if (!el.src) el.src = VIDEO_URL;
    void el.play().then(() => setPlaying(true));
  };

  return (
    <section className="bg-bg py-section-mobile md:py-section" aria-label="Showreel">
      <div className="mx-auto grid max-w-content gap-10 px-4 md:grid-cols-[1fr_minmax(260px,38%)] md:items-center md:gap-14 md:px-8">
        <motion.div
          className="relative aspect-[16/10] overflow-hidden md:aspect-[5/3]"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          animate={hover && !playing ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0">
            {VIDEO_URL && (
              <video
                ref={videoRef}
                className={
                  playing ? "relative z-10 h-full w-full object-cover" : "pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
                }
                controls={playing}
                playsInline
                poster={POSTER}
                preload="none"
                aria-label="Showreel агентства Закулисье"
              />
            )}
            <Image
              src={POSTER}
              alt="Атмосферное мероприятие — превью showreel агентства Закулисье"
              fill
              className={playing && VIDEO_URL ? "hidden" : "object-cover"}
              sizes="(max-width:768px) 100vw, 65vw"
            />
            <div
              className={playing && VIDEO_URL ? "hidden" : "absolute inset-0 bg-bg/40"}
              aria-hidden
            />
            {(!playing || !VIDEO_URL) && (
              <div className="absolute inset-0 z-[2] flex items-center justify-center">
                {VIDEO_URL ? (
                  <button
                    type="button"
                    onClick={onPlay}
                    className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Воспроизвести видео"
                  >
                    <span className="ml-1 inline-block h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
                  </button>
                ) : (
                  <p className="max-w-xs px-4 text-center text-xs text-text-secondary">
                    Добавьте NEXT_PUBLIC_SHOWREEL_VIDEO_URL для воспроизведения.
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <div>
          <h2 className="font-display text-3xl font-semibold leading-tight text-text-primary md:text-4xl lg:text-5xl">
            Мы делаем события,
            <br />
            которые помнят
          </h2>
          <p className="mt-6 text-base leading-relaxed text-text-secondary md:text-lg">
            20 лет. Более 3000 мероприятий. Корпоративные события, деловые форумы, тимбилдинги и брендовые активности
            для крупных компаний Сибири — на уровне федерального стандарта.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {VIDEO_URL ? (
              <MagneticButton>
                <button
                  type="button"
                  onClick={onPlay}
                  className="border border-accent/50 bg-transparent px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-text-primary transition hover:border-accent hover:bg-accent/10 focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Смотреть showreel
                </button>
              </MagneticButton>
            ) : null}
            <MagneticButton>
              <button
                type="button"
                onClick={openContact}
                className="border border-border px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-text-secondary transition hover:border-text-primary hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent"
              >
                Обсудить проект
              </button>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
