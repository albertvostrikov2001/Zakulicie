"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { Testimonial } from "@/lib/types";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

type Props = { items: Testimonial[] };

export function TestimonialsSection({ items }: Props) {
  const mobile = useIsMobile();
  const rootRef = useRef<HTMLDivElement>(null);
  if (items.length === 0) return null;

  return (
    <section
      className="border-t border-border bg-[#141414] py-24 md:py-36"
      aria-label="Отзывы клиентов"
    >
      <div className="mx-auto max-w-content px-4 md:px-8">
        <RevealOnScroll>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">Репутация</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-text-primary md:text-4xl">Отзывы</h2>
          <p className="mt-4 max-w-2xl text-sm text-text-secondary">
            Публикуем только согласованные с брендами формулировки. Подтверждения и письма — по запросу.
          </p>
        </RevealOnScroll>

        {mobile ? (
          <div ref={rootRef} className="mt-12">
            <Swiper
              modules={[EffectFade]}
              effect="fade"
              loop
              spaceBetween={0}
              className="!overflow-visible"
            >
              {items.map((t) => (
                <SwiperSlide key={t.id}>
                  <figure className="pt-2">
                    <blockquote className="font-display text-2xl font-normal leading-snug text-text-primary md:text-3xl">
                      &laquo;{t.text}&raquo;
                    </blockquote>
                    <figcaption className="mt-8 text-sm text-text-secondary">
                      <span className="text-text-primary">{t.author}</span>
                      {t.position ? <span> · {t.position}</span> : null}
                      {t.company ? <span className="mt-1 block text-xs text-text-muted">{t.company}</span> : null}
                    </figcaption>
                  </figure>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="mt-16">
            {items.map((t, i) => (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: 0.08 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={i > 0 ? "mt-20 border-t border-border pt-16" : ""}
              >
                <blockquote className="max-w-4xl font-display text-2xl font-normal leading-snug text-text-primary md:text-3xl lg:text-4xl">
                  &laquo;{t.text}&raquo;
                </blockquote>
                <figcaption className="mt-8 text-sm text-text-secondary">
                  <span className="text-text-primary">{t.author}</span>
                  {t.position ? <span> · {t.position}</span> : null}
                  {t.company ? <span className="mt-1 block text-xs text-text-muted">{t.company}</span> : null}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
