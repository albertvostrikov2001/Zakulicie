"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

interface FloatingCard {
  src: string;
  alt: string;
  /** tailwind classes for position & size */
  className: string;
  /** parallax depth multiplier — larger = moves more */
  depth: number;
  /** entrance delay in seconds */
  delay: number;
}

const CARDS: FloatingCard[] = [
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=480&q=80",
    alt: "Масштабное корпоративное мероприятие",
    className:
      "absolute top-[8%] right-[4%] w-[clamp(120px,14vw,220px)] aspect-[3/4]",
    depth: 0.035,
    delay: 0.4,
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=480&q=80",
    alt: "Вечернее event-шоу",
    className:
      "absolute bottom-[18%] right-[18%] w-[clamp(100px,11vw,180px)] aspect-[3/4]",
    depth: 0.055,
    delay: 0.6,
  },
  {
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=480&q=80",
    alt: "Деловая конференция",
    className:
      "absolute top-[22%] right-[22%] w-[clamp(80px,9vw,150px)] aspect-[3/4]",
    depth: 0.025,
    delay: 0.8,
  },
];

function FloatingCardItem({
  card,
  mouseX,
  mouseY,
  reduced,
}: {
  card: FloatingCard;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  reduced: boolean;
}) {
  const springConfig = { stiffness: 55, damping: 20, mass: 1.2 };
  const sx = useSpring(mouseX, springConfig);
  const sy = useSpring(mouseY, springConfig);

  const x = useTransform(sx, (v) => v * card.depth);
  const y = useTransform(sy, (v) => v * card.depth);

  return (
    <motion.div
      className={`${card.className} overflow-hidden rounded-[2px] will-change-transform`}
      style={reduced ? {} : { x, y }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: card.delay,
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Image
        src={card.src}
        alt={card.alt}
        fill
        sizes="(max-width: 768px) 120px, 220px"
        className="object-cover"
        priority={card.delay < 0.6}
      />
      {/* Dark overlay to keep images subtle */}
      <div className="absolute inset-0 bg-black/35" aria-hidden />
    </motion.div>
  );
}

export function HeroImageMotion() {
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (reduced || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      rawX.set(e.clientX - rect.left - rect.width / 2);
      rawY.set(e.clientY - rect.top - rect.height / 2);
    },
    [rawX, rawY, reduced]
  );

  useEffect(() => {
    const el = containerRef.current?.closest("section") ?? window;
    el.addEventListener("mousemove", handleMouseMove as EventListener);
    return () =>
      el.removeEventListener("mousemove", handleMouseMove as EventListener);
  }, [handleMouseMove]);

  /* On mobile: static collage — 2 cards, no parallax */
  if (mobile) {
    return (
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="absolute right-[3%] top-[10%] w-[100px] overflow-hidden rounded-[2px] aspect-[3/4]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Image
            src={CARDS[0].src}
            alt={CARDS[0].alt}
            fill
            sizes="100px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" aria-hidden />
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] right-[16%] w-[72px] overflow-hidden rounded-[2px] aspect-[3/4]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Image
            src={CARDS[1].src}
            alt={CARDS[1].alt}
            fill
            sizes="72px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" aria-hidden />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {CARDS.map((card) => (
        <FloatingCardItem
          key={card.src}
          card={card}
          mouseX={rawX}
          mouseY={rawY}
          reduced={reduced}
        />
      ))}
    </div>
  );
}
