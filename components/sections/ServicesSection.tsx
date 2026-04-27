"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { cn } from "@/lib/cn";
import { serviceNav, staticServices } from "@/lib/content/services";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function ServicesSection() {
  const [hovered, setHovered] = useState<string | null>(serviceNav[0]?.slug ?? null);

  const activeSlug = hovered ?? serviceNav[0]?.slug ?? "";
  const activeBg = staticServices[activeSlug as keyof typeof staticServices]?.heroImage;

  return (
    <section
      className="group/services relative bg-bg py-24 md:py-36"
      aria-label="Услуги"
      id="services"
    >
      <div className="mx-auto max-w-content px-4 md:px-8">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <RevealOnScroll>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                Услуги
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-text-primary md:text-4xl lg:text-5xl">
                Направления работы
              </h2>
            </div>
          </RevealOnScroll>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute right-0 top-0 hidden h-full w-[40%] overflow-hidden md:block"
            aria-hidden
          >
            {activeBg && (
              <motion.div
                key={activeSlug}
                className="relative h-full min-h-[320px] w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <Image
                  src={activeBg.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-bg via-bg/40 to-transparent" />
              </motion.div>
            )}
          </div>

          {/* Список услуг */}
          <ul className="relative z-10 divide-y divide-border border-y border-border">
            {serviceNav.map((s, i) => {
              const row = staticServices[s.slug];
              return (
                <motion.li
                  key={s.slug}
                  initial={{ opacity: 0, x: -24 }}
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
                    className="group flex items-center justify-between gap-4 py-7 md:py-8"
                    onMouseEnter={() => setHovered(s.slug)}
                    onFocus={() => setHovered(s.slug)}
                    onMouseLeave={() => setHovered(serviceNav[0]?.slug ?? null)}
                    onBlur={() => setHovered(serviceNav[0]?.slug ?? null)}
                  >
                    <div className="flex items-baseline gap-6 md:gap-10">
                      <span className="w-6 font-display text-sm font-medium text-text-muted tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display text-xl font-medium transition-colors duration-300 md:text-2xl lg:text-3xl",
                          hovered === s.slug ? "text-accent" : "text-text-primary"
                        )}
                      >
                        {s.title}
                      </span>
                    </div>

                    <div className="hidden max-w-xs text-right text-sm text-text-secondary opacity-0 transition-all duration-300 group-hover:opacity-100 md:block lg:max-w-sm">
                      {row.shortDescription}
                    </div>

                    {/* Стрелка */}
                    <motion.div
                      className="flex-shrink-0 text-text-muted transition-colors duration-300 group-hover:text-accent"
                      animate={{ x: hovered === s.slug ? 4 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                        <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
