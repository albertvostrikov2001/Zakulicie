"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ─── Letter-to-image map ─────────────────────────────────── */
interface LetterEntry {
  char: string;
  imageSrc: string;
  imageAlt: string;
}

const PHRASE = "СОБЫТИЕ БЕЗ КОМПРОМИССОВ";

const IMAGE_SOURCES: string[] = [
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=480&q=80",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=480&q=80",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=480&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=480&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=480&q=80",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=480&q=80",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=480&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=480&q=80",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=480&q=80",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=480&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=480&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=480&q=80",
];

const LETTERS: LetterEntry[] = PHRASE.split("").map((char, i) => ({
  char,
  imageSrc: IMAGE_SOURCES[i % IMAGE_SOURCES.length],
  imageAlt: `Событие без компромиссов — кадр ${i + 1}`,
}));

/** Pre-filtered list used in mobile auto-cycle — stable reference */
const INTERACTIVE_LETTERS: LetterEntry[] = LETTERS.filter((l) => l.char !== " ");

/* ─── Image overlay — positioned in safe zone ────────────── */
interface ImageOverlayProps {
  entry: LetterEntry | null;
  anchorRef: React.RefObject<HTMLElement | null>;
}

function ImageOverlay({ entry, anchorRef }: ImageOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!entry || !anchorRef.current || !containerRef.current) return;
    const section = anchorRef.current;
    const sRect   = section.getBoundingClientRect();
    const sW = sRect.width;
    const sH = sRect.height;

    // Safe zone: image appears in upper-left quadrant of the section
    // to never overlap bottom-right CTA / подпись regions
    const W = Math.min(220, sW * 0.18);
    const H = W * (4 / 3);
    const x = sW * 0.05;
    const y = sH * 0.08;

    const el = containerRef.current;
    el.style.width  = `${W}px`;
    el.style.height = `${H}px`;
    el.style.left   = `${x}px`;
    el.style.top    = `${y}px`;
  }, [entry, anchorRef]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute z-[5] overflow-hidden rounded-[2px]" aria-hidden>
      <AnimatePresence mode="wait">
        {entry && (
          <motion.div
            key={entry.imageSrc}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={entry.imageSrc}
              alt={entry.imageAlt}
              fill
              sizes="240px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/25" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Desktop: hover-letter mechanic ─────────────────────── */
function DesktopPhrase({ reduced }: { reduced: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const activeEntry = activeIndex !== null ? LETTERS[activeIndex] : null;

  return (
    <div ref={sectionRef} className="relative">
      <ImageOverlay entry={activeEntry} anchorRef={sectionRef} />

      <h2
        className="relative z-[10] inline-block font-display font-bold uppercase leading-[1.05]"
        style={{
          fontSize:      "clamp(22px, 3.4vw, 48px)",
          letterSpacing: "-0.02em",
          whiteSpace:    "nowrap",
          color:         "var(--color-text-primary)",
        }}
      >
        {LETTERS.map((entry, i) => {
          if (entry.char === " ") {
            return <span key={i} className="inline-block w-[0.25em]" aria-hidden />;
          }
          return (
            <motion.span
              key={i}
              className="relative inline-block cursor-default select-none"
              onHoverStart={!reduced ? () => setActiveIndex(i) : undefined}
              onHoverEnd={!reduced ? () => setActiveIndex(null) : undefined}
              whileHover={!reduced ? { color: "var(--color-accent)" } : undefined}
              transition={{ duration: 0.15 }}
            >
              {entry.char}
            </motion.span>
          );
        })}
      </h2>
    </div>
  );
}

/* ─── Mobile: auto-cycle mechanic ────────────────────────── */
function MobilePhrase({ reduced }: { reduced: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) return;
    let idx = 0;
    cycleRef.current = setInterval(() => {
      setActiveIndex(idx % INTERACTIVE_LETTERS.length);
      idx++;
    }, 1300);
    return () => { if (cycleRef.current) clearInterval(cycleRef.current); };
  }, [reduced]);

  const activeLetter = activeIndex !== null ? INTERACTIVE_LETTERS[activeIndex] : null;

  return (
    <div className="relative">
      {/* Mini photo strip — mobile equivalent */}
      <div className="mb-6 flex justify-center gap-3 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeLetter && (
            <motion.div
              key={activeLetter.imageSrc}
              className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[2px]"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.35 }}
            >
              <Image
                src={activeLetter.imageSrc}
                alt={activeLetter.imageAlt}
                fill
                sizes="64px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <h2
        className="font-display font-bold uppercase leading-[1.05]"
        style={{
          fontSize:      "clamp(32px, 8vw, 52px)",
          letterSpacing: "-0.02em",
          color:         "var(--color-text-primary)",
        }}
      >
        {PHRASE}
      </h2>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────── */
export function EventPhrase() {
  const mobile  = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const ref     = useRef<HTMLElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--color-bg)] py-section"
      aria-label="Событие без компромиссов"
    >
      <div className="mx-auto max-w-content px-4 md:px-8 text-center">
        {/* Section micro-label */}
        <motion.p
          className="caption-text mb-8 md:mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Наш принцип
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {mobile ? (
            <MobilePhrase reduced={reduced} />
          ) : (
            <DesktopPhrase reduced={reduced} />
          )}
        </motion.div>

        {/* Accent rule */}
        <motion.div
          className="mt-10 h-px origin-center bg-[var(--color-accent)] md:mt-14"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        />
      </div>
    </section>
  );
}
