"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useId } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = { items: Testimonial[] };

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article
      className={cn(
        "flex h-full min-h-[280px] w-full flex-col border border-[var(--color-border)] bg-[var(--color-surface)]",
        "p-8 md:p-10"
      )}
      style={{ borderRadius: "var(--border-radius-card)" }}
    >
      {/* Quote mark */}
      <div
        className="mb-5 font-display font-bold leading-none text-accent"
        style={{ fontSize: "48px", opacity: 0.5 }}
        aria-hidden
      >
        «
      </div>

      {/* Quote text */}
      <blockquote className="flex-1">
        <p
          className="font-medium leading-relaxed text-text-primary"
          style={{ fontSize: "clamp(16px, 1.6vw, 22px)", lineHeight: "1.6" }}
        >
          {item.text}
        </p>
      </blockquote>

      {/* Author */}
      <footer className="mt-8 border-t border-[var(--color-border)] pt-5">
        <p className="text-[15px] font-semibold text-text-primary">{item.author}</p>
        <p className="mt-1 text-[12px] text-text-muted">{item.position}</p>
        <p className="text-[12px] text-text-muted">{item.company}</p>
      </footer>
    </article>
  );
}

export function TestimonialsSection({ items }: Props) {
  const id             = useId();
  const safeId         = id.replace(/:/g, "");
  const prevClass      = `swiper-prev-${safeId}`;
  const nextClass      = `swiper-next-${safeId}`;
  const paginationClass = `swiper-pagination-${safeId}`;

  if (items.length === 0) return null;

  const canLoop = items.length > 2;

  return (
    <section
      className="bg-[var(--color-bg)] py-section"
      aria-label="Отзывы клиентов"
    >
      <div className="mx-auto max-w-content px-4 md:px-8">
        {/* Header + controls */}
        <RevealOnScroll>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="caption-text">Репутация</p>
              <h2 className="mt-3 font-display text-[clamp(28px,3.5vw,48px)] font-bold leading-snug tracking-tight text-text-primary">
                Отзывы
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-text-secondary">
                Публикуем только согласованные формулировки. Подтверждения — по запросу.
              </p>
            </div>

            {/* Custom arrows */}
            <div className="flex shrink-0 gap-3 self-start md:self-auto">
              <button
                type="button"
                className={cn(
                  prevClass,
                  "flex h-12 w-12 items-center justify-center border border-white/[0.12] text-text-primary transition-[border-color,color] duration-200 ease-out hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                )}
                style={{ borderRadius: "var(--border-radius-card)" }}
                aria-label="Предыдущий отзыв"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
              </button>
              <button
                type="button"
                className={cn(
                  nextClass,
                  "flex h-12 w-12 items-center justify-center border border-white/[0.12] text-text-primary transition-[border-color,color] duration-200 ease-out hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                )}
                style={{ borderRadius: "var(--border-radius-card)" }}
                aria-label="Следующий отзыв"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.25} />
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {/* Swiper — editorial: 1 large + preview */}
        <div className="mt-12 md:mt-14">
          <Swiper
            modules={[Navigation, Pagination, Keyboard]}
            loop={canLoop}
            grabCursor
            spaceBetween={20}
            slidesPerView={1}
            keyboard={{ enabled: true }}
            navigation={{
              prevEl: `.${prevClass}`,
              nextEl: `.${nextClass}`,
            }}
            pagination={{
              el: `.${paginationClass}`,
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1.35,
                spaceBetween: 24,
              },
              900: {
                slidesPerView: 1.55,
                spaceBetween: 28,
              },
              1200: {
                slidesPerView: 1.65,
                spaceBetween: 32,
              },
            }}
            className="!overflow-visible"
            watchOverflow
          >
            {items.map((t) => (
              <SwiperSlide key={t.id} className="!h-auto !flex">
                <TestimonialCard item={t} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination dots */}
          <div className={cn(paginationClass, "reviews-pagination mt-10 flex flex-wrap justify-center gap-1")} />
        </div>
      </div>
    </section>
  );
}
