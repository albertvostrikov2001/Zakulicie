"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Image from "@/components/ui/SiteImage";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Letter-to-image map ─────────────────────────────────── */
interface LetterEntry {
  char: string;
  imageSrc: string;
  imageAlt: string;
}

const PHRASE = "Творчески. Системно. Про людей";

function isInteractiveChar(char: string): boolean {
  return char !== " " && char !== ".";
}

const IMAGE_SOURCES: string[] = [
  "/cases/blagotvoritelnyj-bal-detskaya-ploshchadka/gallery/01.webp",
  "/cases/semejnyj-korporativ-varmix-warmax/gallery/02.webp",
  "/cases/syezd-dilerov-metall-profil/gallery/05.webp",
  "/cases/spartakiada-metall-profil/gallery/03.webp",
  "/cases/dr-zolotoe-yabloko-master-klassy/gallery/04.webp",
  "/cases/yubilej-sts-25-let/gallery/02.webp",
  "/cases/otkrytie-lerua-merlen-kemerovo/gallery/01.webp",
  "/cases/timbilding-promeko/gallery/06.webp",
  "/cases/otkrytie-ofisov-alfa-bank/gallery/02.webp",
  "/cases/den-shahtera-prokopevsk/gallery/04.webp",
  "/cases/artdom-dizajn-konferenciya/gallery/03.webp",
  "/cases/korporativ-lyubimaya-kuhnya/gallery/05.webp",
];

const LETTERS: LetterEntry[] = PHRASE.split("").map((char, i) => ({
  char,
  imageSrc: IMAGE_SOURCES[i % IMAGE_SOURCES.length] ?? "",
  imageAlt: `Творчески. Системно. Про людей — кадр ${i + 1}`,
}));

const INTERACTIVE_INDICES = LETTERS.map((_, i) => i).filter((i) =>
  isInteractiveChar(LETTERS[i]!.char)
);

function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return coarse;
}

/* ─── RAF-based float loop (compositor-only transforms) ─────── */
function launchFloat(
  image: HTMLDivElement,
  onId: (id: number) => void
): void {
  // Each image gets its own random float personality
  const ampX = 2 + Math.random() * 4;          // 2–6 px horizontal drift
  const ampY = 3 + Math.random() * 6;          // 3–9 px vertical float
  const ampR = 0.4 + Math.random() * 1.8;      // 0.4–2.2° rotation swing
  const fX   = 0.20 + Math.random() * 0.20;    // 0.20–0.40 Hz
  const fY   = 0.17 + Math.random() * 0.18;    // 0.17–0.35 Hz
  const pX   = Math.random() * Math.PI * 2;    // random phase offset
  const pY   = Math.random() * Math.PI * 2;
  const t0   = performance.now();

  const tick = (now: number) => {
    const t  = (now - t0) / 1000;
    const dx = Math.sin(t * fX * Math.PI * 2 + pX) * ampX;
    const dy = Math.sin(t * fY * Math.PI * 2 + pY) * ampY;
    const r  = Math.sin(t * 0.48 + pX * 0.65) * ampR;
    image.style.transform = `translate(${dx}px, ${dy}px) rotate(${r}deg)`;
    onId(requestAnimationFrame(tick));
  };
  onId(requestAnimationFrame(tick));
}

/* ─── Desktop: absolute image layer ─────────────────────────── */
function DesktopImageLayer({
  imageRefs,
}: {
  imageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5]" aria-hidden>
      {LETTERS.map((entry, i) => {
        if (!isInteractiveChar(entry.char)) return null;
        return (
          <div
            key={i}
            ref={(el) => { imageRefs.current[i] = el; }}
            className="overflow-hidden rounded-[2px]"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "200px",
              height: "260px",
              opacity: 0,
              visibility: "hidden",
              transform: "scale(0.88) translateY(28px) rotate(0deg)",
              willChange: "transform, opacity",
              boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 4px 18px rgba(0,0,0,0.35)",
            }}
          >
            <Image
              src={entry.imageSrc}
              alt={entry.imageAlt}
              fill
              sizes="260px"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
          </div>
        );
      })}
    </div>
  );
}

/* ─── Desktop: interactive letter row ───────────────────────── */
function DesktopLetterRow({
  sectionRef,
  letterRefs,
  imageRefs,
  reduced,
}: {
  sectionRef: React.RefObject<HTMLElement>;
  letterRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  imageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  reduced: boolean;
}) {
  const floatRafs   = useRef<Map<number, number>>(new Map());
  const floatTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  // Cleanup all pending RAF / timers on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      floatRafs.current.forEach((id) => cancelAnimationFrame(id));
      // eslint-disable-next-line react-hooks/exhaustive-deps
      floatTimers.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  /** Stop float RAF + pending timer for a given letter index */
  const killFloat = useCallback((idx: number) => {
    const raf = floatRafs.current.get(idx);
    if (raf !== undefined) { cancelAnimationFrame(raf); floatRafs.current.delete(idx); }
    const tim = floatTimers.current.get(idx);
    if (tim !== undefined) { clearTimeout(tim); floatTimers.current.delete(idx); }
  }, []);

  const handleLetterEnter = useCallback((idx: number) => {
    if (reduced) return;
    const section = sectionRef.current;
    const letter  = letterRefs.current[idx];
    const image   = imageRefs.current[idx];
    if (!section || !letter || !image) return;
    if (!isInteractiveChar(LETTERS[idx]?.char ?? "")) return;

    killFloat(idx);

    const sR = section.getBoundingClientRect();
    const lR = letter.getBoundingClientRect();

    const imgW  = Math.min(Math.max(lR.width * 3.5, 160), 260);
    const imgH  = imgW * 1.3;
    const safeM = 16;

    /* ── chaotic position jitter ── */
    const jitterX = (Math.random() - 0.5) * 52;  // ±26 px
    const jitterY = (Math.random() - 0.5) * 30;  // ±15 px

    let x = lR.left - sR.left + lR.width / 2 - imgW / 2 + jitterX;
    let y = lR.top  - sR.top  - imgH - 14    + jitterY;

    x = Math.max(safeM, Math.min(sR.width  - imgW - safeM, x));
    if (y < safeM) y = lR.top - sR.top + lR.height + 10;
    y = Math.min(sR.height - imgH - safeM, y);

    /* ── random entry personality ── */
    const eRot   = (Math.random() - 0.5) * 18;   // −9°…+9°
    const eScale = 0.78 + Math.random() * 0.14;  // 0.78–0.92
    const eY     = 22  + Math.random() * 26;      // 22–48 px below final pos
    const eDur   = 0.34 + Math.random() * 0.22;  // 0.34–0.56 s

    image.style.width  = `${imgW}px`;
    image.style.height = `${imgH}px`;
    image.style.left   = `${x}px`;
    image.style.top    = `${y}px`;

    /* snap to start state without any transition */
    image.style.transition = "none";
    image.style.opacity    = "0";
    image.style.transform  = `scale(${eScale}) translateY(${eY}px) rotate(${eRot}deg)`;
    image.style.visibility = "visible";

    /* double-RAF: let browser paint the "start" state first */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
        image.style.transition = `opacity ${eDur}s ${ease}, transform ${eDur}s ${ease}`;
        image.style.opacity    = "1";
        image.style.transform  = "scale(1) translateY(0px) rotate(0deg)";

        /* after entry animation, hand off to the float loop */
        const timer = setTimeout(() => {
          floatTimers.current.delete(idx);
          image.style.transition = "opacity 0.22s ease"; // only opacity transitions from here
          launchFloat(image, (id) => floatRafs.current.set(idx, id));
        }, Math.round(eDur * 1000));

        floatTimers.current.set(idx, timer);
      });
    });
  }, [reduced, sectionRef, letterRefs, imageRefs, killFloat]);

  const handleLetterLeave = useCallback((idx: number) => {
    const image = imageRefs.current[idx];
    if (!image) return;

    killFloat(idx);

    /* exit: fade + slight scale-down + random exit rotation */
    const exitRot = (Math.random() - 0.5) * 12;
    image.style.transition = "opacity 0.18s ease, transform 0.18s cubic-bezier(0.4, 0, 1, 1)";
    image.style.opacity    = "0";
    image.style.transform  = `scale(0.90) translateY(10px) rotate(${exitRot}deg)`;

    setTimeout(() => {
      if (parseFloat(image.style.opacity ?? "1") < 0.05) {
        image.style.visibility = "hidden";
      }
    }, 220);
  }, [imageRefs, killFloat]);

  return (
    <p
      className="relative z-[10] m-0 inline-flex max-w-full flex-wrap justify-center font-display font-bold leading-[1.15]"
      style={{
        fontSize: "clamp(20px, 2.8vw, 44px)",
        letterSpacing: "-0.02em",
        color: "var(--color-text-primary)",
      }}
    >
      {LETTERS.map((entry, i) => {
        if (entry.char === " ") {
          return <span key={i} className="inline-block w-[0.25em]" aria-hidden />;
        }
        if (!isInteractiveChar(entry.char)) {
          return (
            <span key={i} className="inline-block select-none">
              {entry.char}
            </span>
          );
        }
        return (
          <span
            key={i}
            ref={(el) => { letterRefs.current[i] = el; }}
            className="relative inline-block cursor-default select-none transition-colors duration-150 ease-out hover:text-accent"
            onMouseEnter={reduced ? undefined : () => handleLetterEnter(i)}
            onMouseLeave={reduced ? undefined : () => handleLetterLeave(i)}
          >
            {entry.char}
          </span>
        );
      })}
    </p>
  );
}

/* ─── Touch: cinematic Stories-style image cycle ─────────────── */

/** A curated subset of IMAGE_SOURCES for mobile stories */
const STORY_SRCS = IMAGE_SOURCES.slice(0, 6);
const STORY_DURATION = 2600; // ms per story slide

/** Stable per-story random transforms (generated once) */
const STORY_ROTATIONS = STORY_SRCS.map(() => (Math.random() - 0.5) * 7);
const STORY_OFFSETS   = STORY_SRCS.map(() => (Math.random() - 0.5) * 18);

function TouchPhrase({ reduced }: { reduced: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  /* RAF-driven progress + auto-advance */
  useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    if (progressFillRef.current) progressFillRef.current.style.width = "0%";

    const tick = (now: number) => {
      const pct = Math.min(((now - start) / STORY_DURATION) * 100, 100);
      if (progressFillRef.current) progressFillRef.current.style.width = `${pct}%`;
      if (pct >= 100) {
        setActiveIndex((i) => (i + 1) % STORY_SRCS.length);
        return; // cleanup will cancel; next effect run starts fresh
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced, activeIndex]);

  const currentSrc = STORY_SRCS[activeIndex] ?? "";
  const rotation   = STORY_ROTATIONS[activeIndex] ?? 0;
  const offsetX    = STORY_OFFSETS[activeIndex] ?? 0;

  /* Map activeIndex → a letter to highlight in the phrase */
  const hlLetterIndex = INTERACTIVE_INDICES[(activeIndex * 4) % INTERACTIVE_INDICES.length] ?? 0;

  return (
    <div className="relative flex w-full flex-col items-center">

      {/* Stories progress segments */}
      {!reduced && (
        <div className="mb-6 flex w-full gap-[3px] px-1" aria-hidden>
          {STORY_SRCS.map((_, i) => (
            <div
              key={i}
              className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/15"
            >
              {i < activeIndex ? (
                <div className="h-full w-full bg-accent" />
              ) : i === activeIndex ? (
                <div ref={progressFillRef} className="h-full bg-accent" style={{ width: "0%" }} />
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Phrase text */}
      <p
        className="m-0 inline-flex max-w-full flex-wrap justify-center font-display font-bold leading-[1.15]"
        style={{
          fontSize: "clamp(28px, 7vw, 48px)",
          letterSpacing: "-0.02em",
          color: "var(--color-text-primary)",
        }}
      >
        {LETTERS.map((entry, i) => {
          if (entry.char === " ") {
            return <span key={i} className="inline-block w-[0.25em]" aria-hidden />;
          }
          if (!isInteractiveChar(entry.char)) {
            return (
              <span key={i} className="inline-block select-none">
                {entry.char}
              </span>
            );
          }
          return (
            <span
              key={i}
              className={
                !reduced && hlLetterIndex === i
                  ? "text-accent transition-colors duration-500"
                  : "transition-colors duration-500"
              }
            >
              {entry.char}
            </span>
          );
        })}
      </p>

      {/* Cinematic image zone */}
      <div
        className="relative mt-6 flex w-full justify-center"
        style={{ minHeight: "min(72vw, 270px)" }}
        aria-hidden
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSrc + activeIndex}
            className="relative overflow-hidden rounded-[3px]"
            style={{
              width: "min(78vw, 280px)",
              aspectRatio: "4 / 3",
              boxShadow: "0 20px 56px rgba(0,0,0,0.55), 0 4px 14px rgba(0,0,0,0.35)",
            }}
            initial={{ opacity: 0, scale: 0.93, rotate: rotation * 0.4, x: offsetX * 0.5 }}
            animate={{ opacity: 1, scale: 1,    rotate: rotation,        x: offsetX }}
            exit={{   opacity: 0, scale: 0.96,  rotate: rotation * 1.5,  x: offsetX * 0.7 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={currentSrc}
              alt={`Закулисье — кадр ${activeIndex + 1}`}
              fill
              sizes="320px"
              className="object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────── */
export function EventPhrase() {
  const coarsePointer = useCoarsePointer();
  const reduced       = usePrefersReducedMotion();
  const sectionRef    = useRef<HTMLElement>(null);
  const letterRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const imageRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const inView        = useInView(sectionRef, { once: true, margin: "-15%" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--color-bg)] py-section"
      aria-label="Творчески. Системно. Про людей"
    >
      {!coarsePointer ? (
        <DesktopImageLayer imageRefs={imageRefs} />
      ) : null}

      <div className="relative z-[10] mx-auto max-w-content px-4 text-center md:px-8">
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
          {coarsePointer ? (
            <TouchPhrase reduced={reduced} />
          ) : (
            <DesktopLetterRow
              sectionRef={sectionRef}
              letterRefs={letterRefs}
              imageRefs={imageRefs}
              reduced={reduced}
            />
          )}
        </motion.div>

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
