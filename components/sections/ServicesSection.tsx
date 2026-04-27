"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { serviceNav, staticServices } from "@/lib/content/services";
import { motion } from "framer-motion";
import Image from "@/components/ui/SiteImage";
import Link from "next/link";
import { useState } from "react";

export function ServicesSection() {
  const defaultSlug = serviceNav[0]?.slug ?? "";
  const [hovered, setHovered] = useState<string | null>(defaultSlug);
  const reducedMotion = usePrefersReducedMotion();

  const activeSlug = hovered ?? defaultSlug;

  return (
    <section
      className="group/services relative min-h-0 overflow-hidden bg-bg py-24 md:min-h-[640px] md:py-36"
      aria-label="Услуги"
      id="services"
      onMouseLeave={() => setHovered(defaultSlug)}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {serviceNav.map((s) => {
          const img = staticServices[s.slug]?.heroImage;
          if (!img) return null;
          const isOn = activeSlug === s.slug;
          return (
            <motion.div
              key={s.slug}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: isOn ? 1 : 0,
                scale: isOn ? 1 : 1.05,
                filter: isOn || reducedMotion ? "blur(0px)" : "blur(2px)",
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <Image src={img.src} alt="" fill className="object-cover" sizes="100vw" priority={s.slug === defaultSlug} />
            </motion.div>
          );
        })}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/75 via-black/55 to-black/35"
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
                    "group flex flex-col gap-4 py-7 transition-[opacity,color] duration-300 ease-out md:flex-row md:items-center md:justify-between md:gap-6 md:py-8",
                    isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                  )}
                  onMouseEnter={() => setHovered(s.slug)}
                  onFocus={() => setHovered(s.slug)}
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
                          "font-display text-xl font-medium transition-colors duration-200 md:text-2xl lg:text-3xl",
                          isActive ? "text-accent" : "text-text-primary"
                        )}
                      >
                        {s.title}
                      </span>
                      <p
                        className={cn(
                          "mt-2 max-w-xl text-base leading-relaxed transition-colors duration-200 md:text-lg",
                          isActive ? "text-white/90" : "text-text-secondary"
                        )}
                      >
                        {row.shortDescription}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    className={cn(
                      "flex shrink-0 self-end transition-colors duration-200 md:self-center",
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
