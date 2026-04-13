"use client";

import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/providers/ContactModalProvider";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const POSTER =
  "https://images.unsplash.com/photo-1478147427288-58de1a93e566?auto=format&fit=crop&w=2400&q=80";

const lines = ["Когда на кону репутация,", "считает каждая деталь"];

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOn, setVideoOn] = useState(false);
  const reduced = usePrefersReducedMotion();
  const { openContact } = useContactModal();
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

  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden pb-16 pt-32 md:items-center md:pb-24">
      <div className="absolute inset-0">
        <Image
          src={POSTER}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {src && !reduced && (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoOn ? "opacity-100" : "opacity-0"}`}
            playsInline
            muted
            loop
            poster={POSTER}
            preload="none"
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/40" aria-hidden />
        <div className="absolute inset-0 bg-black/35" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-content px-4 md:px-8">
        <div className="max-w-4xl">
          <h1 className="font-display text-hero font-semibold text-text-primary">
            {lines.map((line, i) => (
              <motion.span
                key={line}
                className="block overflow-hidden"
                initial={{ opacity: 0, y: 48, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.85,
                  delay: 0.15 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {line}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="mt-6 max-w-xl text-hero-sub text-text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.7 }}
          >
            Агентство полного цикла для компаний, которые не обсуждают компромисс по качеству.
            Новосибирск · Сибирь · федеральные брифы.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.55 }}
          >
            <Button type="button" onClick={openContact} className="uppercase tracking-widest">
              Обсудить проект
            </Button>
            <Link
              href="/cases"
              className={cn(
                "inline-flex items-center justify-center rounded-card border border-border bg-transparent px-6 py-3 text-sm font-medium uppercase tracking-widest text-text-primary transition duration-base ease-base hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              )}
            >
              Смотреть кейсы
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="mt-20 flex justify-center md:mt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          aria-hidden
        >
          <div className="h-10 w-px animate-scroll-hint bg-gradient-to-b from-transparent via-accent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
