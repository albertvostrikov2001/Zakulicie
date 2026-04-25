"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { cn } from "@/lib/cn";
import { serviceNav, staticServices } from "@/lib/content/services";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export function ServicesSection() {
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const activeSlug = hovered ?? serviceNav[0]?.slug ?? "";
  const activeBg = staticServices[activeSlug as keyof typeof staticServices]?.heroImage;

  return (
    <section className="relative bg-bg py-24 md:py-36" aria-label="Услуги" id="services">
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

        <div ref={ref} className="relative">
          {/* Фоновое изображение по ховеру */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 overflow-hidden opacity-0 transition-opacity duration-500 md:opacity-100 lg:w-2/5" aria-hidden>
            {activeBg && (
              <div className="relative h-full w-full">
                <Image
                  key={activeSlug}
                  src={activeBg.src}
                  alt=""
                  fill
                  className="object-cover opacity-20"
                  sizes="40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-bg/30" />
              </div>
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
                  animate={inView ? { opacity: 1, x: 0 } : {}}
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
                    onMouseLeave={() => setHovered(null)}
                    onBlur={() => setHovered(null)}
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
