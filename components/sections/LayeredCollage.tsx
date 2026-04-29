"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { motion, AnimatePresence } from "framer-motion";
import Image from "@/components/ui/SiteImage";
import { useCallback, useEffect, useRef, useState } from "react";
import { unsplashPhoto } from "@/lib/content/unsplash";

const PHRASE = "СОБЫТИЕ БЕЗ КОМПРОМИССОВ";

type Token =
  | { kind: "space"; key: string }
  | { kind: "letter"; char: string; letterIndex: number; key: string };

function buildTokens(phrase: string): Token[] {
  const out: Token[] = [];
  let letterIndex = 0;
  for (let i = 0; i < phrase.length; i++) {
    const ch = phrase[i];
    if (ch === " ") out.push({ kind: "space", key: `sp-${i}` });
    else out.push({ kind: "letter", char: ch, letterIndex: letterIndex++, key: `L-${i}-${ch}` });
  }
  return out;
}

const WORD_TOKENS = buildTokens(PHRASE);

/** 7 кадров — циклически по индексу буквы */
const letterPhotos = [
  unsplashPhoto("1511578314322-379afb476865", 900),
  unsplashPhoto("1504384308090-c894fdcc538d", 900),
  unsplashPhoto("1556761175-5973dc0f32e7", 900),
  unsplashPhoto("1514525253161-7a46d19cd819", 900),
  unsplashPhoto("1589903308904-1010c2294adc", 900),
  unsplashPhoto("1492684223066-81342ee5ebb9", 900),
  unsplashPhoto("1540575467063-27a9d141e482", 900),
] as const;

/** Safe zones: компактные кадры, позиции укладываются при min-height ~200px без обрезки */
const safeZones = [
  { top: "6%", left: "3%", w: 118, h: 132, rot: -4, tx: -6, ty: 4 },
  { top: "5%", left: "22%", w: 108, h: 122, rot: 3, tx: 6, ty: -4 },
  { top: "34%", left: "4%", w: 126, h: 128, rot: -2, tx: -6, ty: 5 },
  { top: "36%", left: "22%", w: 118, h: 126, rot: 2, tx: 6, ty: -5 },
  { top: "10%", left: "36%", w: 102, h: 118, rot: -3, tx: -5, ty: 5 },
  { top: "32%", left: "34%", w: 118, h: 128, rot: 4, tx: 6, ty: 5 },
  { top: "20%", left: "11%", w: 114, h: 136, rot: -2, tx: -6, ty: -5 },
] as const;

const N_ZONES = safeZones.length;

export function LayeredCollage() {
  const [activeLetter, setActiveLetter] = useState<number | null>(null);
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const zoneIdx = activeLetter !== null ? activeLetter % N_ZONES : null;

  const clearLeave = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
  }, []);

  const onLetterEnter = (letterIndex: number) => {
    if (mobile) return;
    clearLeave();
    setActiveLetter(letterIndex);
  };

  const onSectionLeave = () => {
    if (mobile) return;
    clearLeave();
    leaveTimer.current = setTimeout(() => setActiveLetter(null), 120);
  };

  const onLetterTap = (letterIndex: number) => {
    if (!mobile) return;
    setActiveLetter((prev) => (prev === letterIndex ? null : letterIndex));
  };

  useEffect(() => {
    if (!mobile || activeLetter === null || reduced) return;
    const t = setTimeout(() => setActiveLetter(null), 2600);
    return () => clearTimeout(t);
  }, [mobile, activeLetter, reduced]);

  return (
    <div onMouseLeave={onSectionLeave}>
      <div
        className="relative z-[1] mx-auto flex max-w-content justify-center overflow-x-hidden overflow-y-visible bg-bg px-4 py-6 md:px-8 md:py-9"
        role="region"
        aria-label={PHRASE}
      >
        <div className="relative flex min-h-[200px] w-full flex-col justify-center md:min-h-[min(26vh,280px)]">
          <div className="pointer-events-none absolute inset-0 z-[5] overflow-visible" aria-hidden>
            <AnimatePresence mode="sync">
              {zoneIdx !== null && safeZones[zoneIdx] && (
                <motion.div
                  key={`${activeLetter}-${zoneIdx}`}
                  initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
                  animate={
                    reduced
                      ? { opacity: 1, scale: 1, x: safeZones[zoneIdx].tx, y: safeZones[zoneIdx].ty }
                      : {
                          opacity: 1,
                          scale: 1,
                          x: safeZones[zoneIdx].tx,
                          y: safeZones[zoneIdx].ty,
                        }
                  }
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                  transition={
                    reduced
                      ? { duration: 0.15 }
                      : {
                          opacity: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
                          scale: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
                        }
                  }
                  className="absolute will-change-[opacity,transform]"
                  style={{
                    top: safeZones[zoneIdx].top,
                    left: safeZones[zoneIdx].left,
                    width: safeZones[zoneIdx].w,
                    height: safeZones[zoneIdx].h,
                    zIndex: 5,
                  }}
                >
                  <div
                    className="h-full w-full overflow-hidden border border-border shadow-2xl will-change-transform"
                    style={{ transform: `rotate(${safeZones[zoneIdx].rot}deg)` }}
                  >
                    <Image
                      src={letterPhotos[zoneIdx]}
                      alt="Атмосфера делового мероприятия"
                      width={safeZones[zoneIdx].w * 2}
                      height={safeZones[zoneIdx].h * 2}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 768px) 45vw, 220px"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative z-[10] flex flex-wrap justify-center gap-x-[0.015em] gap-y-2 px-1 text-center font-display text-[clamp(1.15rem,3.4vw,2.85rem)] font-bold uppercase leading-[1.05] tracking-tight text-text-primary md:gap-x-[0.02em] md:px-2 md:text-[clamp(1.35rem,3.8vw,3.35rem)] md:leading-none md:tracking-tighter">
            {WORD_TOKENS.map((t) =>
              t.kind === "space" ? (
                <span key={t.key} className="inline-block w-[0.22em] shrink-0 md:w-[0.28em]" aria-hidden />
              ) : (
                <span
                  key={t.key}
                  className={cn(
                    "relative z-[10] inline-flex min-h-[44px] min-w-[36px] cursor-default select-none items-center justify-center px-0.5 transition-colors duration-200 md:inline-block md:min-h-0 md:min-w-0 md:px-0",
                    mobile && "cursor-pointer",
                    activeLetter === t.letterIndex && "text-accent"
                  )}
                  onMouseEnter={() => onLetterEnter(t.letterIndex)}
                  onFocus={() => onLetterEnter(t.letterIndex)}
                  onBlur={() => {
                    if (!mobile) setActiveLetter(null);
                  }}
                  onClick={() => onLetterTap(t.letterIndex)}
                  role={mobile ? "button" : undefined}
                  tabIndex={mobile ? 0 : -1}
                  aria-label={`Буква ${t.char}`}
                >
                  {t.char}
                </span>
              )
            )}
          </div>

          {mobile && (
            <p className="relative z-[10] mt-6 text-center text-xs text-text-muted">
              Нажмите на букву, чтобы увидеть кадр
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
