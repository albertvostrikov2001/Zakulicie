"use client";

import { Badge } from "@/components/ui/Badge";
import type { CaseStudy } from "@/lib/types";
import { serviceNav } from "@/lib/content/services";
import { caseImagePosition, CASE_CARD_OVERLAY } from "@/lib/caseImage";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import Image from "@/components/ui/SiteImage";
import Link from "next/link";

type Props = { item: CaseStudy; className?: string; priority?: boolean; index?: number };

export function CaseCard({ item, className, priority, index = 0 }: Props) {
  const tag = serviceNav.find((s) => s.slug === item.serviceTypeSlug)?.title ?? "";

  // Always show 1–2 accent metrics: prefer explicit resultNumbers, fall back to
  // participantsCount + year so every card has a consistent yellow stats block.
  const displayStats: { value: string; label: string }[] =
    item.resultNumbers && item.resultNumbers.length > 0
      ? item.resultNumbers.slice(0, 2)
      : item.participantsCount
      ? [
          { value: item.participantsCount.toLocaleString("ru-RU"), label: "участников" },
          { value: String(item.year), label: "год" },
        ]
      : [{ value: String(item.year), label: "год" }];

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
        <article className="relative aspect-[4/5] overflow-hidden md:aspect-[3/2]">
          {/* Фото */}
          <Image
            src={item.heroImage.src}
            alt={`Кейс: ${item.title} | ${tag}`}
            fill
            className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.03]"
            style={caseImagePosition(item.heroImage)}
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 34vw"
            priority={priority}
            placeholder={item.heroImage.blurDataURL ? "blur" : undefined}
            blurDataURL={item.heroImage.blurDataURL}
          />

          {/* Тональный оверлей */}
          <div className="absolute inset-0 bg-black/15" style={{ mixBlendMode: "multiply" }} aria-hidden />

          {/* Тёмный градиентный оверлей */}
          <div
            className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
            style={{ background: CASE_CARD_OVERLAY }}
            aria-hidden
          />

          {/* Hover оверлей */}
          <div className="case-overlay absolute inset-0 bg-accent/10 backdrop-blur-[1px]" aria-hidden />

          {/* Номер кейса */}
          {typeof index === "number" && (
            <span className="absolute right-4 top-4 font-display text-5xl font-bold leading-none text-white/10 select-none">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}

          {/* Контент */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
            <Badge className="mb-2.5 w-fit border-white/15 text-[10px] text-text-secondary">
              {tag}
            </Badge>

            {/* Заголовок: 3 строки на мобильном (tall 4:5), 2 на десктопе (wide 3:2) */}
            <h3 className="line-clamp-3 font-display text-xl font-semibold leading-snug text-text-primary md:line-clamp-2 md:text-2xl xl:text-xl min-[1536px]:text-2xl">
              {item.title}
            </h3>

            {item.client && (
              <p className="mt-1.5 text-sm text-text-secondary">{item.client}</p>
            )}

            {/* Excerpt: только мобильный (4:5 tall) — на 3:2 не помещается */}
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary/80 md:hidden">
              {item.excerpt}
            </p>

            {/* Метрики — всегда одинаковый стиль для всех кейсов */}
            <div className="mt-4 flex gap-5 border-t border-border/40 pt-3">
              {displayStats.map((r) => (
                <div key={r.label}>
                  <p className="font-display text-lg font-bold text-accent">{r.value}</p>
                  <p className="text-[10px] text-text-muted">{r.label}</p>
                </div>
              ))}
            </div>

            {/* CTA — absolute, не влияет на высоту flow, появляется при hover */}
            <span className={cn(
              "absolute bottom-5 right-5 md:bottom-6 md:right-6",
              "inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-accent",
              "translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            )}>
              Смотреть кейс
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 7h10M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
