"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { motion, AnimatePresence } from "framer-motion";
import Image from "@/components/ui/SiteImage";
import { useCallback, useEffect, useRef, useState } from "react";
import { unsplashPhoto } from "@/lib/content/unsplash";

const LETTERS = ["С", "О", "Б", "Ы", "Т", "И", "Я"] as const;

const letterPhotos = [
  unsplashPhoto("1511578314322-379afb476865", 900),
  unsplashPhoto("1504384308090-c894fdcc538d", 900),
  unsplashPhoto("1556761175-5973dc0f32e7", 900),
  unsplashPhoto("1514525253161-7a46d19cd819", 900),
  unsplashPhoto("1589903308904-1010c2294adc", 900),
  unsplashPhoto("1492684223066-81342ee5ebb9", 900),
  unsplashPhoto("1540575467063-27a9d141e482", 900),
] as const;

/** Safe zones: верх/низ слева, без пересечения с правой колонкой и центром букв */
const safeZones = [
  { top: "6%", left: "2%", w: 180, h: 240, rot: -4, tx: -8, ty: 6 },
  { top: "4%", left: "28%", w: 160, h: 200, rot: 3, tx: 10, ty: -6 },
  { top: "52%", left: "4%", w: 200, h: 220, rot: -2, tx: -10, ty: 8 },
  { top: "58%", left: "32%", w: 170, h: 230, rot: 2, tx: 8, ty: -8 },
  { top: "10%", left: "48%", w: 150, h: 190, rot: -3, tx: -6, ty: 10 },
  { top: "48%", left: "46%", w: 185, h: 210, rot: 4, tx: 10, ty: 6 },
  { top: "22%", left: "14%", w: 175, h: 255, rot: -2, tx: -10, ty: -6 },
] as const;

export function LayeredCollage() {
  const [active, setActive] = useState<number | null>(null);
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLeave = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
  }, []);

  const onLetterEnter = (i: number) => {
    if (mobile) return;
    clearLeave();
    setActive(i);
  };

  const onSectionLeave = () => {
    if (mobile) return;
    clearLeave();
    leaveTimer.current = setTimeout(() => setActive(null), 120);
  };

  const onLetterTap = (i: number) => {
    if (!mobile) return;
    setActive((prev) => (prev === i ? null : i));
  };

  useEffect(() => {
    if (!mobile || active === null) return;
    const t = setTimeout(() => setActive(null), 2600);
    return () => clearTimeout(t);
  }, [mobile, active]);

  return (
    <section
      className="relative overflow-hidden bg-bg py-section-mobile md:py-section"
      aria-label="События"
      onMouseLeave={onSectionLeave}
    >
      <div className="relative z-[1] mx-auto max-w-content px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:min-h-[72vh] md:grid-cols-[1fr,minmax(260px,300px)] md:items-center md:gap-10">
          <div className="relative flex min-h-[380px] flex-col justify-center md:min-h-[520px]">
            <div
              className="pointer-events-none absolute inset-0 z-[1] overflow-hidden md:overflow-visible"
              aria-hidden
            >
              <AnimatePresence mode="sync">
                {active !== null && safeZones[active] && (
                  <motion.div
                    key={active}
                    initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                    animate={
                      reduced
                        ? { opacity: 1 }
                        : {
                            opacity: 1,
                            scale: 1,
                            x: safeZones[active].tx,
                            y: safeZones[active].ty,
                          }
                    }
                    exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: reduced ? 0.15 : 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute will-change-[opacity,transform]"
                    style={{
                      top: safeZones[active].top,
                      left: safeZones[active].left,
                      width: safeZones[active].w,
                      height: safeZones[active].h,
                      zIndex: 1,
                    }}
                  >
                    <div
                      className="h-full w-full overflow-hidden border border-border shadow-2xl"
                      style={{ transform: `rotate(${safeZones[active].rot}deg)` }}
                    >
                      <Image
                        src={letterPhotos[active]}
                        alt=""
                        width={safeZones[active].w * 2}
                        height={safeZones[active].h * 2}
                        className="h-full w-full object-cover"
                        sizes="(max-width: 768px) 45vw, 220px"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative z-[2] flex flex-wrap justify-center gap-x-[0.02em] gap-y-1 px-2 font-display text-[clamp(2.75rem,14vw,9rem)] font-bold uppercase leading-none tracking-tighter text-text-primary">
              {LETTERS.map((ch, i) => (
                <span
                  key={`${ch}-${i}`}
                  className={cn(
                    "relative z-[3] inline-block cursor-default select-none transition-colors duration-200",
                    mobile && "cursor-pointer",
                    active === i && "text-accent"
                  )}
                  onMouseEnter={() => onLetterEnter(i)}
                  onFocus={() => onLetterEnter(i)}
                  onBlur={() => {
                    if (!mobile) setActive(null);
                  }}
                  onClick={() => onLetterTap(i)}
                  role={mobile ? "button" : undefined}
                  tabIndex={mobile ? 0 : -1}
                  aria-label={`Буква ${ch}`}
                >
                  {ch}
                </span>
              ))}
            </div>

            {mobile && (
              <p className="relative z-[2] mt-6 text-center text-xs text-text-muted">
                Нажмите на букву, чтобы увидеть кадр
              </p>
            )}
          </div>

          <div
            className="relative z-[20] self-end rounded-sm bg-black/25 px-4 py-5 text-right shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-sm md:px-5 md:py-6"
            style={{ textShadow: "0 1px 24px rgba(0,0,0,0.65)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-primary">МАСШТАБ</p>
            <p className="mt-4 font-body text-lg font-medium leading-relaxed text-text-primary md:text-xl">
              От камерного формата
              <br />
              до тысяч участников —
              <br />
              без снижения дисциплины
              <br />
              сценария.
            </p>
            <p className="mt-6 text-sm font-medium leading-relaxed text-text-secondary">
              Федеральные брифы и сибирские площадки.
              <br />
              Один стандарт исполнения.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
