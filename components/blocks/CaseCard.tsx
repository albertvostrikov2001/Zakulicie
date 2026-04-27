"use client";

import { Badge } from "@/components/ui/Badge";
import type { CaseStudy } from "@/lib/types";
import { serviceNav } from "@/lib/content/services";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import Image from "@/components/ui/SiteImage";
import Link from "next/link";

type Props = { item: CaseStudy; className?: string; priority?: boolean; index?: number };

export function CaseCard({ item, className, priority, index = 0 }: Props) {
  const tag = serviceNav.find((s) => s.slug === item.serviceTypeSlug)?.title ?? "";

  return (
    <motion.div
      initial={{ opacity: 1, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px 5% 0px" }}
      transition={{ duration: 0.7, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <Link
        href={`/cases/${item.slug}`}
        data-cursor="case"
        className="group block"
        aria-label={`Кейс: ${item.title}`}
      >
        <article className="relative aspect-[4/5] overflow-hidden md:aspect-[16/10]">
          {/* Фото */}
          <Image
            src={item.heroImage.src}
            alt={item.heroImage.alt}
            fill
            className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
          />

          {/* Тёмный оверлей */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-transparent transition-opacity duration-500 group-hover:opacity-90"
            aria-hidden
          />

          {/* Hover оверлей - clip-path reveal */}
          <div className="case-overlay absolute inset-0 bg-accent/10 backdrop-blur-[1px]" aria-hidden />

          {/* Номер кейса */}
          {typeof index === "number" && (
            <span className="absolute right-4 top-4 font-display text-5xl font-bold leading-none text-white/10 select-none">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}

          {/* Контент */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
            <Badge className="mb-3 w-fit border-white/15 text-[10px] text-text-secondary">
              {tag}
            </Badge>
            <h3 className="font-display text-xl font-semibold text-text-primary md:text-2xl">
              {item.title}
            </h3>
            {item.client && (
              <p className="mt-1.5 text-sm text-text-secondary">{item.client}</p>
            )}
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-secondary/80">
              {item.excerpt}
            </p>

            {/* Результаты */}
            {item.resultNumbers && item.resultNumbers.length > 0 && (
              <div className="mt-4 flex gap-6 border-t border-border/40 pt-4">
                {item.resultNumbers.slice(0, 2).map((r) => (
                  <div key={r.label}>
                    <p className="font-display text-lg font-bold text-accent">{r.value}</p>
                    <p className="text-[10px] text-text-muted">{r.label}</p>
                  </div>
                ))}
              </div>
            )}

            <span className={cn(
              "mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-accent",
              "translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            )}>
              Смотреть кейс
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 7h10M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
