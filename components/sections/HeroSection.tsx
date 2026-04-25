"use client";

import { MagneticButton } from "@/components/motion/MagneticButton";
import { useContactModal } from "@/components/providers/ContactModalProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { unsplashPhoto } from "@/lib/content/unsplash";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const POSTER = unsplashPhoto("1511578314322-379afb476865", 2400);

const HEADLINE_LINES = ["Агентство,", "которому доверяют", "крупные бренды."];

export function HeroSection() {
  const { openContact } = useContactModal();
  const reduced = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOn, setVideoOn] = useState(false);
  const src = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;

  useEffect(() => {
    if (reduced || !src) return;
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.src = src;
          el.load();
          void el.play().catch(() => {});
          setVideoOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, src]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const lineVariants = {
    hidden: { y: "105%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-bg-light"
      aria-label="Главный экран"
    >
      {/* Фоновое изображение/видео */}
      <div className="absolute inset-0">
        <Image
          src={POSTER}
          alt="Атмосфера премиального мероприятия"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {src && !reduced && (
          <video
            ref={videoRef}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
              videoOn ? "opacity-100" : "opacity-0"
            )}
            playsInline
            muted
            loop
            poster={POSTER}
            preload="none"
            aria-hidden
          />
        )}
        {/* Градиент: светлый оверлей сверху, тёмный снизу для текста */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-bg-light/80 via-bg/30 to-bg/95"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden />
      </div>

      {/* Контент */}
      <div className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-20 pt-32 md:px-8 md:pb-28">
        <div className="mx-auto w-full max-w-content">
          {/* Надпись над заголовком */}
          <motion.p
            className="mb-8 text-xs font-medium uppercase tracking-[0.25em] text-white/60"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Новосибирск · 20 лет · 3000+ событий
          </motion.p>

          {/* Главный заголовок */}
          <motion.div
            variants={reduced ? undefined : containerVariants}
            initial={reduced ? false : "hidden"}
            animate="visible"
            className="overflow-hidden"
          >
            {HEADLINE_LINES.map((line, i) => (
              <div key={line} className="overflow-hidden">
                <motion.h1
                  variants={reduced ? undefined : lineVariants}
                  className={cn(
                    "block font-display font-semibold leading-[1.0] tracking-tight text-text-primary",
                    "text-[clamp(2.8rem,7vw,5.5rem)]"
                  )}
                  style={{ transitionDelay: reduced ? "0ms" : `${i * 120}ms` }}
                >
                  {line}
                </motion.h1>
              </div>
            ))}
          </motion.div>

          {/* Подзаголовок */}
          <motion.p
            className="mt-8 max-w-xl text-base text-white/70 md:text-lg"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Корпоративные события, деловые форумы и брендовые активности полного цикла — в Новосибирске и по всей Сибири.
          </motion.p>

          {/* CTA кнопки */}
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <MagneticButton>
              <button
                type="button"
                onClick={openContact}
                className="group relative inline-flex items-center gap-2 overflow-hidden bg-accent px-8 py-4 text-sm font-medium uppercase tracking-widest text-bg transition-all duration-300 hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Обсудить проект
              </button>
            </MagneticButton>
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 border border-white/25 px-8 py-4 text-sm font-medium uppercase tracking-widest text-white/80 transition-all duration-300 hover:border-white/50 hover:text-white focus-visible:ring-2 focus-visible:ring-accent"
            >
              Смотреть кейсы
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Скролл-индикатор */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll</span>
          <div className="h-12 w-px animate-[scroll-hint_2.2s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-accent to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
