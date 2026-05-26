"use client";

import { MagneticButton } from "@/components/motion/MagneticButton";
import { useContactModal } from "@/components/providers/ContactModalProvider";
import { motion } from "framer-motion";
import Image from "@/components/ui/SiteImage";
import { useRef, useState } from "react";

import { getShowreelVideoUrl, SHOWREEL_POSTER } from "@/lib/video";
import { useIsMobile } from "@/hooks/useIsMobile";

export function VideoSplitBlock() {
  const { openContact } = useContactModal();
  const mobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [hover, setHover] = useState(false);
  const videoUrl = getShowreelVideoUrl(mobile);
  const POSTER = SHOWREEL_POSTER;

  const onPlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (!el.src) el.src = videoUrl;
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
            {videoUrl && (
              <video
                ref={videoRef}
                className={
                  playing && videoReady
                    ? "relative z-10 h-full w-full object-cover"
                    : "pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
                }
                controls={playing}
                playsInline
                poster={POSTER}
                preload="none"
                onLoadedData={() => setVideoReady(true)}
                aria-label="Showreel агентства Закулисье"
              />
            )}
            <Image
              src={POSTER}
              alt="Showreel агентства Закулисье — превью"
              fill
              className={playing && videoReady ? "hidden" : "object-cover"}
              sizes="(max-width:768px) 100vw, 65vw"
            />
            <div
              className={playing && videoReady ? "hidden" : "absolute inset-0 bg-bg/40"}
              aria-hidden
            />
            {(!playing || !videoReady) && (
              <div className="absolute inset-0 z-[2] flex items-center justify-center">
                <button
                  type="button"
                  onClick={onPlay}
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Воспроизвести видео"
                >
                  <span className="ml-1 inline-block h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
                </button>
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
            <MagneticButton>
                <button
                  type="button"
                  onClick={onPlay}
                  className="border border-accent/50 bg-transparent px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-text-primary transition hover:border-accent hover:bg-accent/10 focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Смотреть showreel
                </button>
              </MagneticButton>
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
