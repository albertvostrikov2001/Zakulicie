"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { cn } from "@/lib/cn";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { serviceNav, staticServices } from "@/lib/content/services";
import type { ServiceSlug } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "@/components/ui/SiteImage";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const SERVICE_PRIMARY_HEADINGS: Partial<Record<ServiceSlug, string>> = {
  "korporativnye-meropriyatiya":
    "Корпоративные события для сотрудников, партнёров и клиентских сообществ",
  "delovye-meropriyatiya": "Деловые мероприятия с чёткой бизнес-задачей",
  timbilding: "Тимбилдинг и командные форматы",
};

export function ServicesSection() {
  const defaultSlug = (serviceNav[0]?.slug ?? "korporativnye-meropriyatiya") as ServiceSlug;
  const [hovered, setHovered] = useState<ServiceSlug | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const activeSlug = hovered ?? defaultSlug;
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  /* На мобильном: фоновое фото меняется по мере скролла (IntersectionObserver) */
  useEffect(() => {
    if (!mobile) return;
    setHovered(defaultSlug);

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const idx = itemRefs.current.indexOf(best.target as HTMLLIElement);
        if (idx >= 0 && serviceNav[idx]) {
          setHovered(serviceNav[idx]!.slug as ServiceSlug);
        }
      },
      { threshold: [0.3, 0.6], rootMargin: "-20% 0px -20% 0px" }
    );

    itemRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [mobile, defaultSlug]);

  const activeRow = staticServices[activeSlug];
  const hero      = activeRow?.heroImage;

  return (
    <section
      className="group/services relative overflow-hidden bg-[var(--color-bg)] py-section md:min-h-[680px]"
      aria-label="Услуги"
      id="services"
      onMouseLeave={() => { if (!mobile) setHovered(null); }}
    >
      {/* ── DESKTOP-ONLY: photo + overlays ─────────────────── */}
      <div className="absolute inset-0 z-0 hidden md:block bg-[var(--color-bg)]" aria-hidden />

      <div className="absolute inset-0 z-0 hidden md:block">
        <AnimatePresence initial={false} mode="sync">
          {hero ? (
            <motion.div
              key={activeSlug}
              className="absolute inset-0"
              initial={reducedMotion ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: hovered === null ? 0.25 : 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={activeSlug === defaultSlug}
                placeholder={hero.blurDataURL ? "blur" : undefined}
                blurDataURL={hero.blurDataURL}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0.55) 100%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block bg-black/30"
        aria-hidden
      />

      {/* ══════════════════════════════════════════════════════
          MOBILE layout — compact Swiper cards
      ══════════════════════════════════════════════════════ */}
      <div className="block md:hidden">
        {/* Compact header */}
        <div className="mb-5 px-4">
          <p className="caption-text">Услуги</p>
          <h2 className="mt-2 font-display text-[clamp(22px,6.5vw,32px)] font-bold leading-snug tracking-tight text-text-primary">
            Корпоративные, деловые<br />и командные мероприятия
          </h2>
        </div>

        {/* Service cards swiper */}
        <Swiper
          slidesPerView={1.1}
          spaceBetween={10}
          grabCursor
          centeredSlides={false}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          style={{
            paddingLeft: "16px",
            paddingRight: "8px",
            paddingBottom: "28px",
            // Swiper CSS variables for accent pagination
            ["--swiper-pagination-color" as string]: "var(--color-accent)",
            ["--swiper-pagination-bullet-inactive-color" as string]: "rgba(255,255,255,0.3)",
            ["--swiper-pagination-bullet-inactive-opacity" as string]: "1",
          }}
        >
          {serviceNav.map((s, idx) => {
            const row      = staticServices[s.slug as ServiceSlug];
            const cardHero = row?.heroImage;
            return (
              <SwiperSlide key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group relative block overflow-hidden rounded-sm"
                  style={{
                    height: "min(72vw, 330px)",
                    boxShadow: "0 8px 36px rgba(0,0,0,0.45)",
                  }}
                >
                  {/* Background image */}
                  {cardHero ? (
                    <Image
                      src={cardHero.src}
                      alt={cardHero.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-active:scale-[1.03]"
                      sizes="(max-width: 640px) 95vw, 50vw"
                      placeholder={cardHero.blurDataURL ? "blur" : undefined}
                      blurDataURL={cardHero.blurDataURL}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[var(--color-surface)]" />
                  )}

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 35%, rgba(0,0,0,0.78) 75%, rgba(0,0,0,0.92) 100%)",
                    }}
                    aria-hidden
                  />

                  {/* Service number — top-left */}
                  <div className="absolute left-4 top-4 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Text — bottom */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                    <h3 className="font-display text-[19px] font-bold leading-snug tracking-tight text-white">
                      {s.title}
                    </h3>

                    {/* Thin accent divider */}
                    <div className="my-2.5 h-px w-8 bg-accent opacity-70" aria-hidden />

                    {row?.shortDescription && (
                      <p className="text-[12px] leading-relaxed text-white/65 line-clamp-2">
                        {row.shortDescription}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                      Смотреть
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP layout — unchanged
      ══════════════════════════════════════════════════════ */}
      <div className="relative z-10 mx-auto hidden max-w-content px-4 md:block md:px-8">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <RevealOnScroll>
            <p className="caption-text">Услуги</p>
            <h2 className="mt-3 font-display text-[clamp(28px,3.5vw,48px)] font-bold leading-snug tracking-tight text-text-primary">
              Корпоративные, деловые и командные мероприятия
            </h2>
          </RevealOnScroll>
        </div>

        {/* Service list */}
        <ul className="relative z-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {serviceNav.map((s, i) => {
            const row      = staticServices[s.slug];
            const isActive = activeSlug === s.slug;
            return (
              <motion.li
                key={s.slug}
                ref={(el: HTMLLIElement | null) => { itemRefs.current[i] = el; }}
                initial={{ opacity: 1, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2, margin: "0px 0px 5% 0px" }}
                transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/services/${s.slug}`}
                  className={cn(
                    "group flex min-h-[52px] flex-col gap-3 py-4 transition-[opacity,color] duration-[250ms] ease-out",
                    "md:flex-row md:items-center md:justify-between md:gap-6 md:py-8",
                    isActive ? "opacity-100" : "opacity-[0.35] hover:opacity-75"
                  )}
                  onMouseEnter={() => { if (!mobile) setHovered(s.slug); }}
                  onFocus={() => setHovered(s.slug)}
                >
                  <div className="flex min-w-0 flex-1 items-baseline gap-6 md:gap-10">
                    {/* Number */}
                    <span
                      className={cn(
                        "w-8 shrink-0 font-display text-[14px] font-bold tabular-nums transition-colors duration-200",
                        isActive ? "text-accent" : "text-text-muted"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Title + description */}
                    <div className="min-w-0 flex-1">
                      {SERVICE_PRIMARY_HEADINGS[s.slug] ? (
                        <h3
                          className={cn(
                            "font-display font-bold transition-colors duration-200",
                            "text-[clamp(18px,2.2vw,32px)] leading-snug tracking-tight",
                            isActive ? "text-accent" : "text-text-primary"
                          )}
                        >
                          {SERVICE_PRIMARY_HEADINGS[s.slug]}
                        </h3>
                      ) : (
                        <span
                          className={cn(
                            "block font-display font-bold transition-colors duration-200",
                            "text-[clamp(18px,2.2vw,32px)] leading-snug tracking-tight",
                            isActive ? "text-accent" : "text-text-primary"
                          )}
                        >
                          {s.title}
                        </span>
                      )}
                      {row?.shortDescription && (
                        <p
                          className={cn(
                            "mt-2 max-w-xl text-[13px] leading-relaxed transition-opacity duration-200 md:text-[14px]",
                            isActive ? "text-white/75 opacity-100" : "text-text-secondary opacity-70"
                          )}
                        >
                          {row.shortDescription}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    className={cn(
                      "flex h-12 w-12 md:h-11 md:w-11 shrink-0 items-center justify-center self-end transition-colors duration-200 md:self-center",
                      isActive ? "text-accent" : "text-text-muted"
                    )}
                    animate={{ x: isActive ? 5 : 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                      <path
                        d="M4 10h12M11 5l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
