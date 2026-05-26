"use client";

import { cn } from "@/lib/cn";
import { useIsMobile } from "@/hooks/useIsMobile";
import { motion } from "framer-motion";
import Image from "@/components/ui/SiteImage";
import { useEffect, useRef, useState } from "react";

export type VideoPlaceholderProps = {
  src?: string;
  /** Lighter variant for mobile; falls back to src */
  mobileSrc?: string;
  posterSrc?: string;
  caption?: string;
  description?: string;
  className?: string;
  /** Светлый фон секции — тёмные подписи под кадром */
  captionsOnLightBg?: boolean;
};

export function VideoPlaceholder({
  src,
  mobileSrc,
  posterSrc,
  caption,
  description,
  className,
  captionsOnLightBg = false,
}: VideoPlaceholderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const mobile = useIsMobile();
  const resolvedSrc = (mobile && mobileSrc ? mobileSrc : src) || mobileSrc || src;
  const showVideo = Boolean(resolvedSrc && playing);

  const onPlay = () => {
    if (!resolvedSrc) return;
    setPlaying(true);
  };

  useEffect(() => {
    if (!showVideo || !resolvedSrc) return;
    const el = videoRef.current;
    if (!el) return;
    setVideoReady(false);
    el.src = resolvedSrc;
    el.load();
    void el.play().catch(() => setPlaying(false));
  }, [showVideo, resolvedSrc]);

  return (
    <div className={cn("flex w-full flex-col gap-5", className)}>
      <div className="group relative isolate aspect-video w-full overflow-hidden rounded-sm md:max-h-[min(56vh,520px)] md:aspect-[16/9]">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#222] via-[#121212] to-[#070707]"
          aria-hidden
        />
        {posterSrc && (!showVideo || !videoReady) ? (
          <Image
            src={posterSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 62vw"
            priority={false}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 grain opacity-[0.22]" aria-hidden />

        {showVideo && resolvedSrc ? (
          <video
            ref={videoRef}
            className={cn(
              "relative z-10 h-full w-full object-cover transition-opacity duration-500",
              videoReady ? "opacity-100" : "opacity-0"
            )}
            controls
            playsInline
            preload="metadata"
            poster={posterSrc}
            onLoadedData={() => setVideoReady(true)}
            aria-label="Showreel агентства Закулисье"
          />
        ) : null}

        {!showVideo ? (
          <>
            <div
              className="pointer-events-none absolute inset-0 z-[1] bg-black/30 transition-opacity duration-300 group-hover:bg-black/20"
              aria-hidden
            />
            <div className="absolute inset-0 z-[2] flex items-center justify-center">
              <motion.button
                type="button"
                onClick={onPlay}
                disabled={!resolvedSrc}
                className="group flex h-[4.25rem] w-[4.25rem] cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/[0.07] text-white shadow-[0_12px_48px_rgba(0,0,0,0.55)] backdrop-blur-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-45 md:h-20 md:w-20"
                aria-label={resolvedSrc ? "Воспроизвести видео" : "Видео временно недоступно"}
                whileHover={resolvedSrc ? { scale: 1.1, opacity: 0.9 } : undefined}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <svg
                  className="ml-1 h-8 w-8 md:h-9 md:w-9"
                  viewBox="0 0 56 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <circle cx="28" cy="28" r="26.5" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  <path
                    d="M23 18L40 28L23 38V18Z"
                    fill="currentColor"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </svg>
                <span className="sr-only">Play</span>
              </motion.button>
            </div>
          </>
        ) : null}
      </div>

      {caption || description ? (
        <div className="flex flex-col gap-2.5">
          {caption ? (
            <p
              className={
                captionsOnLightBg
                  ? "text-[10px] font-semibold uppercase tracking-[0.32em] text-[rgba(26,26,26,0.55)] md:text-[11px]"
                  : "text-[10px] font-semibold uppercase tracking-[0.32em] text-text-secondary md:text-[11px]"
              }
            >
              {caption}
            </p>
          ) : null}
          {description ? (
            <p
              className={
                captionsOnLightBg
                  ? "max-w-lg text-sm leading-relaxed text-[rgba(26,26,26,0.72)] md:text-base"
                  : "max-w-lg text-sm leading-relaxed text-text-secondary md:text-base"
              }
            >
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
