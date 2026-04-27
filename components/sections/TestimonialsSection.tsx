"use client";

import { TestimonialCard } from "@/components/blocks/TestimonialCard";
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

export function TestimonialsSection({ items }: Props) {
  const id = useId();
  const prevClass = `swiper-prev-${id.replace(/:/g, "")}`;
  const nextClass = `swiper-next-${id.replace(/:/g, "")}`;
  const paginationClass = `swiper-pagination-${id.replace(/:/g, "")}`;

  if (items.length === 0) return null;

  const canLoop = items.length > 2;

  return (
    <section
      className={cn(
        "border-t border-border bg-[#0a0a0a] py-24 md:py-36",
        "[&_.swiper-pagination-bullet]:mx-1 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-white/25 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:bg-accent [&_.swiper-pagination-bullet-active]:opacity-100"
      )}
      aria-label="Отзывы клиентов"
    >
      <div className="mx-auto max-w-content px-4 md:px-8">
        <RevealOnScroll>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">Репутация</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-text-primary md:text-4xl">Отзывы</h2>
              <p className="mt-4 max-w-2xl text-sm text-text-secondary">
                Публикуем только согласованные с брендами формулировки. Подтверждения и письма — по запросу.
              </p>
            </div>

            <div className="flex shrink-0 gap-3 self-start md:self-auto">
              <button
                type="button"
                className={cn(
                  prevClass,
                  "flex h-11 w-11 items-center justify-center rounded-[2px] border border-white/15 text-text-primary transition-[border-color,color,transform] duration-200 ease-out hover:border-accent hover:text-accent"
                )}
                aria-label="Предыдущий отзыв"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
              </button>
              <button
                type="button"
                className={cn(
                  nextClass,
                  "flex h-11 w-11 items-center justify-center rounded-[2px] border border-white/15 text-text-primary transition-[border-color,color,transform] duration-200 ease-out hover:border-accent hover:text-accent"
                )}
                aria-label="Следующий отзыв"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.25} />
              </button>
            </div>
          </div>
        </RevealOnScroll>

        <div className="mt-12 md:mt-14">
          <Swiper
            modules={[Navigation, Pagination, Keyboard]}
            loop={canLoop}
            spaceBetween={24}
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
              768: { slidesPerView: 2 },
            }}
            className="!overflow-visible"
            watchOverflow
          >
            {items.map((t) => (
              <SwiperSlide key={t.id} className="!h-auto">
                <TestimonialCard item={t} className="h-full" />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={cn(paginationClass, "mt-10 flex flex-wrap justify-center gap-1")} />
        </div>
      </div>
    </section>
  );
}
