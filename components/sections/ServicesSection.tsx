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
import { useState } from "react";

export function ServicesSection() {
  const defaultSlug = (serviceNav[0]?.slug ?? "korporativnye-meropriyatiya") as ServiceSlug;
  const [hovered, setHovered] = useState<ServiceSlug | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const activeSlug = hovered ?? defaultSlug;
  const activeRow  = staticServices[activeSlug];
  const hero       = activeRow?.heroImage;

  return (
    <section
      className="group/services relative min-h-[min(100dvh,760px)] overflow-hidden bg-[var(--color-bg)] py-section md:min-h-[680px]"
      aria-label="Услуги"
      id="services"
      onMouseLeave={() => { if (!mobile) setHovered(null); }}
    >
      {/* Base background */}
      <div className="absolute inset-0 z-0 bg-[var(--color-bg)]" aria-hidden />

      {/* Photo reveal */}
      <div className="absolute inset-0 z-0">
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
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Strong overlays for text readability */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0.55) 100%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-black/30"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-content px-4 md:px-8">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <RevealOnScroll>
            <p className="caption-text">Услуги</p>
            <h2 className="mt-3 font-display text-[clamp(28px,3.5vw,48px)] font-bold leading-snug tracking-tight text-text-primary">
              Направления работы
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
                initial={{ opacity: 1, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2, margin: "0px 0px 5% 0px" }}
                transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/services/${s.slug}`}
                  className={cn(
                    "group flex min-h-[52px] flex-col gap-3 py-7 transition-[opacity,color] duration-[250ms] ease-out",
                    "md:flex-row md:items-center md:justify-between md:gap-6 md:py-8",
                    isActive ? "opacity-100" : "opacity-[0.35] hover:opacity-75"
                  )}
                  onMouseEnter={() => { if (!mobile) setHovered(s.slug); }}
                  onFocus={() => setHovered(s.slug)}
                  onClick={(e) => {
                    if (mobile && hovered !== s.slug) {
                      e.preventDefault();
                      setHovered(s.slug);
                    }
                  }}
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
                      <span
                        className={cn(
                          "block font-display font-bold transition-colors duration-200",
                          "text-[clamp(18px,2.2vw,32px)] leading-snug tracking-tight",
                          isActive ? "text-accent" : "text-text-primary"
                        )}
                      >
                        {s.title}
                      </span>
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
                      "flex h-11 w-11 shrink-0 items-center justify-center self-end transition-colors duration-200 md:self-center",
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
