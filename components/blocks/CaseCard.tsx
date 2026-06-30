"use client";

import type { CaseStudy } from "@/lib/types";
import { serviceNav } from "@/lib/content/services";
import { caseImagePosition, CASE_CARD_OVERLAY } from "@/lib/caseImage";
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

          {/* Контент — короткое название + hover CTA */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
            <h3 className="font-display text-lg font-semibold leading-snug text-text-primary md:text-base xl:text-sm min-[1536px]:text-base">
              {item.title}
            </h3>

            {/* Год + масштаб */}
            <p className="mt-1.5 text-[13px] font-medium tracking-wide text-white/55">
              {item.year}
              {item.scaleLabel ? ` · ${item.scaleLabel}` : item.participantsCount ? ` · ${item.participantsCount}+ участников` : ""}
            </p>

            {/* CTA — absolute, не влияет на высоту flow, появляется при hover */}
            <span className="absolute bottom-5 right-5 inline-flex translate-y-2 items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-accent opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:bottom-6 md:right-6">
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
