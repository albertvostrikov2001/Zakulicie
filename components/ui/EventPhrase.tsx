"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Image from "@/components/ui/SiteImage";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/* ─── Letter-to-image map ─────────────────────────────────── */
interface LetterEntry {
  char: string;
  imageSrc: string;
  imageAlt: string;
}

const PHRASE = "СОБЫТИЕ БЕЗ КОМПРОМИССОВ";

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
  imageAlt: `Событие без компромиссов — кадр ${i + 1}`,
}));

const INTERACTIVE_LETTERS: LetterEntry[] = LETTERS.filter((l) => l.char !== " ");

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

/* ─── Desktop: absolute image layer (child of section) ───── */
function DesktopImageLayer({
  imageRefs,
}: {
  imageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5]" aria-hidden>
      {LETTERS.map((entry, i) => {
        if (entry.char === " ") return null;
        return (
          <div
            key={i}
            ref={(el) => {
              imageRefs.current[i] = el;
            }}
            className="overflow-hidden rounded-[2px]"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "200px",
              height: "260px",
              opacity: 0,
              transform: "scale(0.94)",
              transition: "opacity 0.28s ease, transform 0.28s ease",
            }}
          >
            <Image
              src={entry.imageSrc}
              alt={entry.imageAlt}
              fill
              sizes="260px"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/25" />
          </div>
        );
      })}
    </div>
  );
}

/* ─── Desktop: letter row (inside motion / content flow) ──── */
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
  const handleLetterEnter = useCallback(
    (index: number) => {
      if (reduced) return;
      const section = sectionRef.current;
      const letter = letterRefs.current[index];
      const image = imageRefs.current[index];
      if (!section || !letter || !image) return;
      if (LETTERS[index]?.char === " ") return;

      const sR = section.getBoundingClientRect();
      const lR = letter.getBoundingClientRect();

      const imgW = Math.min(Math.max(lR.width * 3.5, 160), 260);
      const imgH = imgW * 1.3;
      const safeM = 16;

      let x = lR.left - sR.left + lR.width / 2 - imgW / 2;
      let y = lR.top - sR.top - imgH - 12;

      x = Math.max(safeM, Math.min(sR.width - imgW - safeM, x));
      if (y < safeM) y = lR.top - sR.top + lR.height + 8;
      y = Math.min(sR.height - imgH - safeM, y);

      image.style.width = `${imgW}px`;
      image.style.height = `${imgH}px`;
      image.style.left = `${x}px`;
      image.style.top = `${y}px`;
      image.style.opacity = "1";
      image.style.transform = "scale(1)";
    },
    [reduced, sectionRef, letterRefs, imageRefs]
  );

  const handleLetterLeave = useCallback((index: number) => {
    const image = imageRefs.current[index];
    if (!image) return;
    image.style.opacity = "0";
    image.style.transform = "scale(0.94)";
  }, [imageRefs]);

  return (
    <p
      className="relative z-[10] m-0 inline-block font-display font-bold uppercase leading-[1.05]"
      style={{
        fontSize: "clamp(22px, 3.4vw, 48px)",
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
        color: "var(--color-text-primary)",
      }}
    >
      {LETTERS.map((entry, i) => {
        if (entry.char === " ") {
          return <span key={i} className="inline-block w-[0.25em]" aria-hidden />;
        }
        return (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
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

/* ─── Touch: auto-cycle + зона под фразой ─────────────────── */
function TouchPhrase({ reduced }: { reduced: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) return;
    cycleRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % INTERACTIVE_LETTERS.length);
    }, 1800);
    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, [reduced]);

  const activeLetter = INTERACTIVE_LETTERS[activeIndex] ?? INTERACTIVE_LETTERS[0];

  return (
    <div className="relative flex w-full flex-col items-center">
      <p
        className="m-0 font-display font-bold uppercase leading-[1.05]"
        style={{
          fontSize: "clamp(32px, 8vw, 52px)",
          letterSpacing: "-0.02em",
          color: "var(--color-text-primary)",
        }}
      >
        {PHRASE}
      </p>

      <div
        className="relative mt-6 flex w-full justify-center"
        style={{ minHeight: "min(106vw, 400px)" }}
        aria-hidden
      >
        <AnimatePresence mode="wait">
          {activeLetter ? (
            <motion.div
              key={`${activeLetter.imageSrc}-${activeIndex}`}
              className="relative overflow-hidden rounded-[2px]"
              style={{
                width: "min(80vw, 300px)",
                aspectRatio: "3 / 4",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Image
                src={activeLetter.imageSrc}
                alt={activeLetter.imageAlt}
                fill
                sizes="300px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/30" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────── */
export function EventPhrase() {
  const coarsePointer = useCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--color-bg)] py-section"
      aria-label="Событие без компромиссов"
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
