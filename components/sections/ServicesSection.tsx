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
  const activeRow = staticServices[activeSlug];
  const hero = activeRow?.heroImage;

  return (
    <section
      className="group/services relative min-h-[min(100dvh,720px)] overflow-hidden bg-bg py-24 md:min-h-[640px] md:py-36"
      aria-label="Услуги"
      id="services"
      onMouseLeave={() => {
        if (!mobile) setHovered(null);
      }}
    >
      <div className="absolute inset-0 z-0 bg-bg" aria-hidden />

      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} mode="sync">
          {hero ? (
            <motion.div
              key={activeSlug}
              className="absolute inset-0"
              initial={reducedMotion ? false : { opacity: 0, scale: 1.04 }}
              animate={{
                opacity: hovered === null ? 0.32 : 1,
                scale: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
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

      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/50" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_40%,rgba(0,0,0,0.45)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-content px-4 md:px-8">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <RevealOnScroll>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">Услуги</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-text-primary md:text-4xl lg:text-5xl">
                Направления работы
              </h2>
            </div>
          </RevealOnScroll>
        </div>

        <ul className="relative z-10 divide-y divide-white/10 border-y border-white/10">
          {serviceNav.map((s, i) => {
            const row = staticServices[s.slug];
            const isActive = activeSlug === s.slug;
            return (
              <motion.li
                key={s.slug}
                initial={{ opacity: 1, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2, margin: "0px 0px 5% 0px" }}
                transition={{
                  duration: 0.6,
                  delay: 0.05 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/services/${s.slug}`}
                  className={cn(
                    "group flex min-h-[48px] flex-col gap-4 py-7 transition-[opacity,color] duration-[250ms] ease-out md:flex-row md:items-center md:justify-between md:gap-6 md:py-8",
                    isActive ? "opacity-100" : "opacity-45 hover:opacity-70"
                  )}
                  onMouseEnter={() => {
                    if (!mobile) setHovered(s.slug);
                  }}
                  onFocus={() => setHovered(s.slug)}
                  onClick={(e) => {
                    if (mobile && hovered !== s.slug) {
                      e.preventDefault();
                      setHovered(s.slug);
                    }
                  }}
                >
                  <div className="flex min-w-0 flex-1 items-baseline gap-6 md:gap-10">
                    <span
                      className={cn(
                        "w-7 shrink-0 font-display text-sm font-medium tabular-nums transition-colors duration-200",
                        isActive ? "text-accent" : "text-text-muted"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "font-display text-xl font-semibold transition-colors duration-200 md:text-2xl lg:text-3xl",
                          isActive ? "text-accent" : "text-text-primary"
                        )}
                      >
                        {s.title}
                      </span>
                      <p
                        className={cn(
                          "mt-2 max-w-xl text-base leading-relaxed transition-opacity duration-200 md:text-lg",
                          isActive ? "text-white/90 opacity-100" : "text-text-secondary opacity-80"
                        )}
                      >
                        {row.shortDescription}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center self-end transition-colors duration-200 md:h-auto md:w-auto md:self-center",
                      isActive ? "text-accent" : "text-text-muted"
                    )}
                    animate={{ x: isActive ? 4 : 0 }}
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
