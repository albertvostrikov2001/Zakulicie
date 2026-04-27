"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { cn } from "@/lib/cn";
import { serviceNav } from "@/lib/content/services";
import type { CaseStudy } from "@/lib/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Props = { cases: CaseStudy[] };

function FlagshipCaseCard({ item, index }: { item: CaseStudy; index: number }) {
  const tag = serviceNav.find((s) => s.slug === item.serviceTypeSlug)?.title ?? "";
  const isOdd = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: "0px 0px 8% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 * index }}
      className={cn(
        "group relative grid grid-cols-1 gap-0 overflow-hidden border border-border",
        "md:grid-cols-2",
        isOdd && "md:[&>*:first-child]:order-last"
      )}
    >
      {/* Фото */}
      <Link
        href={`/cases/${item.slug}`}
        data-cursor="case"
        className="relative aspect-[4/3] block overflow-hidden md:aspect-auto md:min-h-[400px]"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={item.heroImage.src}
          alt={item.heroImage.alt}
          fill
          className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-bg/30 transition-opacity duration-500 group-hover:bg-bg/10" aria-hidden />

        {/* Номер */}
        <span className="absolute bottom-4 right-4 font-display text-7xl font-bold leading-none text-white/10 select-none md:text-9xl">
          {String(index + 1).padStart(2, "0")}
        </span>
      </Link>

      {/* Текст */}
      <div className="flex flex-col justify-between bg-surface p-8 md:p-10 lg:p-14">
        <div>
          <span className="inline-block border border-border px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-text-muted">
            {tag}
          </span>
          {item.year && (
            <span className="ml-3 text-[10px] text-text-muted">{item.year}</span>
          )}

          <h3 className="mt-5 font-display text-2xl font-semibold leading-tight text-text-primary md:text-3xl">
            {item.title}
          </h3>

          <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">
            {item.excerpt}
          </p>

          {/* Цифры результата */}
          {item.resultNumbers && item.resultNumbers.length > 0 && (
            <div className="mt-8 flex gap-8 border-t border-border pt-6">
              {item.resultNumbers.slice(0, 2).map((r) => (
                <div key={r.label}>
                  <p className="font-display text-2xl font-bold text-accent">{r.value}</p>
                  <p className="mt-1 text-xs text-text-muted">{r.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href={`/cases/${item.slug}`}
          className={cn(
            "mt-8 inline-flex w-fit items-center gap-3 text-sm font-medium uppercase tracking-widest text-text-secondary",
            "transition-all duration-300 hover:text-accent",
            "border-b border-border pb-1 hover:border-accent"
          )}
        >
          Смотреть кейс
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}

export function FlagshipCases({ cases }: Props) {
  const list = cases.slice(0, 8);
  return (
    <section className="bg-bg py-24 md:py-36" aria-label="Флагманские кейсы" id="cases-preview">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <RevealOnScroll>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                Флагманские проекты
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-text-primary md:text-4xl lg:text-5xl">
                Кейсы, которые
                <br />
                задают планку
              </h2>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <Link
              href="/cases"
              className="flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent"
            >
              Все {24} кейса
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </RevealOnScroll>
        </div>

        <div className="flex flex-col gap-6">
          {list.map((c, i) => (
            <FlagshipCaseCard key={c.slug} item={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
