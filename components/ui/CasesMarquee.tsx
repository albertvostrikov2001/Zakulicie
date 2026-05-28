"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Image from "@/components/ui/SiteImage";
import Link from "next/link";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { caseImagePosition, CASE_CARD_OVERLAY } from "@/lib/caseImage";
import { serviceNav } from "@/lib/content/services";
import type { CaseStudy } from "@/lib/types";

interface CasesMarqueeProps {
  cases: CaseStudy[];
}

function CaseCard({ item }: { item: CaseStudy }) {
  const tag = serviceNav.find((s) => s.slug === item.serviceTypeSlug)?.title ?? "";

  return (
    <Link
      href={`/cases/${item.slug}`}
      className={cn(
        "group relative block shrink-0 overflow-hidden",
        "w-[260px] h-[170px] sm:w-[340px] sm:h-[220px] md:w-[380px] md:h-[240px]"
      )}
      style={{ borderRadius: "var(--border-radius-card)" }}
    >
      {/* Photo */}
      <Image
        src={item.heroImage.src}
        alt={`Кейс: ${item.title} | ${tag}`}
        fill
        className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.03]"
        style={caseImagePosition(item.heroImage)}
        sizes="(max-width: 640px) 300px, (max-width: 768px) 340px, 380px"
        placeholder={item.heroImage.blurDataURL ? "blur" : undefined}
        blurDataURL={item.heroImage.blurDataURL}
      />

      <div className="absolute inset-0 bg-black/15" style={{ mixBlendMode: "multiply" }} aria-hidden />

      <div
        className="absolute inset-0 transition-opacity duration-400 group-hover:opacity-90"
        style={{ background: CASE_CARD_OVERLAY }}
        aria-hidden
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        {/* Top tag */}
        {tag && (
          <span className="self-start border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-white/80 backdrop-blur-sm">
            {tag}
          </span>
        )}

        {/* Bottom text */}
        <div>
          <h3 className="text-[15px] font-semibold leading-snug text-white line-clamp-2 md:text-[16px]">
            {item.title}
          </h3>
          <p className="mt-1.5 text-[12px] leading-snug text-white/55 line-clamp-1">
            {item.excerpt}
          </p>

          {/* Hover reveal arrow */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Смотреть
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CasesMarquee({ cases }: CasesMarqueeProps) {
  const reduced     = usePrefersReducedMotion();
  const rowLtrRef   = useRef<HTMLDivElement>(null);
  const rowRtlRef   = useRef<HTMLDivElement>(null);
  const wrapLtrRef  = useRef<HTMLDivElement>(null);
  const wrapRtlRef  = useRef<HTMLDivElement>(null);

  const featured = cases.filter((c) => c.isFeatured).slice(0, 8);
  const padded   = featured.length < 4 ? [...featured, ...featured, ...featured, ...featured] : featured;
  const row1     = [...padded.slice(0, 4), ...padded.slice(0, 4)];
  const row2     = [...padded.slice(4),    ...padded.slice(4)];

  if (row2.length === 0) {
    row2.push(...padded.slice(0, 4), ...padded.slice(0, 4));
  }

  /* GSAP marquee timelines */
  useGSAP(() => {
    if (reduced) return;

    const ltr = rowLtrRef.current;
    const rtl = rowRtlRef.current;
    if (!ltr || !rtl) return;

    const ltrWidth = ltr.scrollWidth / 2;
    const rtlWidth = rtl.scrollWidth / 2;

    const ctx = gsap.context(() => {
      const tlLtr = gsap.fromTo(
        ltr,
        { x: 0 },
        { x: -ltrWidth, duration: 42, ease: "none", repeat: -1 }
      );

      const tlRtl = gsap.fromTo(
        rtl,
        { x: -rtlWidth },
        { x: 0, duration: 38, ease: "none", repeat: -1 }
      );

      const wrapL = wrapLtrRef.current;
      const wrapR = wrapRtlRef.current;

      const pauseLtr = () => gsap.to(tlLtr, { timeScale: 0, duration: 0.4 });
      const resumeLtr = () => gsap.to(tlLtr, { timeScale: 1, duration: 0.5 });
      const pauseRtl = () => gsap.to(tlRtl, { timeScale: 0, duration: 0.4 });
      const resumeRtl = () => gsap.to(tlRtl, { timeScale: 1, duration: 0.5 });

      if (wrapL) {
        wrapL.addEventListener("mouseenter", pauseLtr);
        wrapL.addEventListener("mouseleave", resumeLtr);
        wrapL.addEventListener("touchstart", pauseLtr, { passive: true });
        wrapL.addEventListener("touchend",   resumeLtr);
      }
      if (wrapR) {
        wrapR.addEventListener("mouseenter", pauseRtl);
        wrapR.addEventListener("mouseleave", resumeRtl);
        wrapR.addEventListener("touchstart", pauseRtl, { passive: true });
        wrapR.addEventListener("touchend",   resumeRtl);
      }

      return () => {
        tlLtr.kill();
        tlRtl.kill();
      };
    });

    return () => ctx.revert();
  }, { dependencies: [reduced] });

  return (
    <section className="bg-[var(--color-bg)] py-section overflow-hidden" aria-label="Кейсы">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-content px-4 md:mb-12 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="caption-text">Проекты</p>
            <h2 className="mt-3 font-display text-[clamp(28px,3.5vw,48px)] font-bold leading-snug tracking-tight text-text-primary">
              Кейсы для федеральных брендов и лидеров региона
            </h2>
            <h3 className="mt-3 max-w-[52ch] font-body text-[15px] font-medium leading-snug text-text-secondary md:text-[16px]">
              От ритейла и банков до дилерских съездов и корпоративных событий
            </h3>
          </div>
          <Link
            href="/cases"
            className="flex items-center gap-2 rounded-sm border border-white/20 px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-text-secondary transition-colors hover:text-accent sm:rounded-none sm:border-0 sm:px-0 sm:py-0"
          >
            Все проекты
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Row 1 — left to right */}
      <div ref={wrapLtrRef} className="overflow-hidden">
        <div
          ref={rowLtrRef}
          className={cn(
            "flex gap-4 will-change-transform",
            reduced && "flex-wrap px-4 md:flex-nowrap md:overflow-x-auto md:px-8"
          )}
        >
          {row1.map((item, i) => (
            <CaseCard key={`ltr-${item.slug}-${i}`} item={item} />
          ))}
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div ref={wrapRtlRef} className="mt-4 overflow-hidden">
        <div
          ref={rowRtlRef}
          className={cn(
            "flex gap-4 will-change-transform",
            reduced && "flex-wrap px-4 md:flex-nowrap md:overflow-x-auto md:px-8"
          )}
        >
          {row2.map((item, i) => (
            <CaseCard key={`rtl-${item.slug}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
