"use client";

import { BrandDisplay } from "@/components/ui/BrandDisplay";
import { CTALink } from "@/components/ui/CTALink";
import { FlipCard } from "@/components/ui/FlipCard";
import type { ClientData } from "@/data/clients";
import { clients } from "@/data/clients";
import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const MAX_SIMULTANEOUS = 3;

/* ─── Mobile flip card ─────────────────────────────────────── */
function MobileFlipCard({
  data,
  hintFlip = false,
}: {
  data: ClientData;
  hintFlip?: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Auto-flip hint when parent signals the card to reveal itself */
  useEffect(() => {
    if (!hintFlip) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsFlipped(true);
    timerRef.current = setTimeout(() => setIsFlipped(false), 2300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hintFlip]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleTap = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isFlipped) {
      setIsFlipped(false);
    } else {
      setIsFlipped(true);
      timerRef.current = setTimeout(() => setIsFlipped(false), 2000);
    }
  };

  return (
    <div
      onClick={handleTap}
      role="button"
      tabIndex={0}
      aria-label={`${data.brandName} — ${data.backText}`}
      aria-pressed={isFlipped}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTap();
        }
      }}
      style={{
        height: "clamp(100px, 32vw, 140px)",
        width: "100%",
        touchAction: "manipulation",
        cursor: "pointer",
      }}
    >
      <div className="flip-card-perspective">
        <div className={`flip-card-inner${isFlipped ? " is-flipped" : ""}`}>
          <div className="flip-card-face">
            <BrandDisplay display={data.display} brandName={data.brandName} />
            {!isFlipped && (
              <span
                className="pointer-events-none absolute bottom-1.5 right-2 text-[9px] font-medium uppercase tracking-[0.12em] text-text-muted/60 select-none"
                aria-hidden
              >
                нажми
              </span>
            )}
          </div>
          <div className="flip-card-face flip-card-back-face" aria-live="polite">
            <p className="flip-back-text">{data.backText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main section ─────────────────────────────────────────── */
export function ClientsShowcase() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const flippingCount = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [hintFired, setHintFired] = useState(false);
  const [showHint, setShowHint] = useState(false);

  /* Hint: flip first card automatically when section scrolls into view */
  useEffect(() => {
    if (hintFired) return;
    const el = sectionRef.current;
    if (!el) return;

    let delayTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHintFired(true);
          observer.disconnect();
          delayTimer = setTimeout(() => {
            setShowHint(true);
            hideTimer = setTimeout(() => setShowHint(false), 2400);
          }, 700);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(delayTimer);
      clearTimeout(hideTimer);
    };
  }, [hintFired]);

  const requestAutoFlip = useCallback((): boolean => {
    if (flippingCount.current >= MAX_SIMULTANEOUS) return false;
    flippingCount.current++;
    return true;
  }, []);

  const releaseFlip = useCallback((): void => {
    flippingCount.current = Math.max(0, flippingCount.current - 1);
  }, []);

  const handleHoverStart = useCallback((id: string) => setHoveredId(id), []);
  const handleHoverEnd = useCallback(() => setHoveredId(null), []);

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--color-surface-elevated)] py-section"
      aria-label="Наши клиенты"
      id="clients"
    >
      <div className="mx-auto max-w-content px-4 md:px-8">
        {/* Desktop: 2-row grid */}
        <div className="clients-grid-wrapper hidden md:block">
          <div className="clients-grid">
            {clients.map((client, i) => (
              <FlipCard
                key={client.id}
                data={client}
                index={i}
                isDimmed={hoveredId !== null && hoveredId !== client.id}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                requestAutoFlip={requestAutoFlip}
                releaseFlip={releaseFlip}
              />
            ))}
          </div>
        </div>

        {/* Mobile: tap-to-flip Swiper with auto-flip hint on first card */}
        <div className="block md:hidden">
          <Swiper
            slidesPerView={2.2}
            spaceBetween={12}
            grabCursor
            modules={[Pagination]}
            pagination={{ clickable: true }}
            className="clients-swiper !pb-8"
          >
            {clients.map((client, index) => (
              <SwiperSlide key={client.id} style={{ height: "auto" }}>
                <MobileFlipCard
                  data={client}
                  hintFlip={index === 0 && showHint}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <p className="mt-1 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
            Свайпайте для просмотра
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center md:text-left">
          <CTALink className="clients-cta-btn">Обсудить проект</CTALink>
        </div>
      </div>
    </section>
  );
}
