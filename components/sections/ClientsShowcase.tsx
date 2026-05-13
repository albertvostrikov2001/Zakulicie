"use client";

import { BrandDisplay } from "@/components/ui/BrandDisplay";
import { FlipCard } from "@/components/ui/FlipCard";
import type { ClientData } from "@/data/clients";
import { clients } from "@/data/clients";
import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const MAX_SIMULTANEOUS = 3;

function MobileFlipCard({ data }: { data: ClientData }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = () => {
    if (isFlipped) return;
    setIsFlipped(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsFlipped(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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
        height: "clamp(115px, 38vw, 150px)",
        width: "100%",
        touchAction: "manipulation",
        cursor: "pointer",
      }}
    >
      <div className="flip-card-perspective">
        <div className={`flip-card-inner${isFlipped ? " is-flipped" : ""}`}>
          <div className="flip-card-face">
            <BrandDisplay display={data.display} brandName={data.brandName} />
          </div>
          <div className="flip-card-face flip-card-back-face" aria-live="polite">
            <p className="flip-back-text">{data.backText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClientsShowcase() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const flippingCount = useRef(0);

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

        {/* Mobile: tap-to-flip Swiper */}
        <div className="block md:hidden">
          <Swiper
            slidesPerView={1.2}
            spaceBetween={16}
            grabCursor
          >
            {clients.map((client) => (
              <SwiperSlide key={client.id} style={{ height: "auto" }}>
                <MobileFlipCard data={client} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center md:text-left">
          <a href="#contact-form" className="clients-cta-btn">
            Обсудить проект
          </a>
        </div>
      </div>
    </section>
  );
}
