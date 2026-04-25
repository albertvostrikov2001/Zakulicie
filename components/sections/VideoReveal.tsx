"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { unsplashPhoto } from "@/lib/content/unsplash";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const IMAGE_URL = unsplashPhoto("1514525253161-7a46d19cd819", 2400);
const IMAGE_URL_2 = unsplashPhoto("1492684223066-81342ee5ff30", 2400);

export function VideoReveal() {
  const ref = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });

  const clipInset = useTransform(
    scrollYProgress,
    [0, 0.5],
    mobile || reduced ? ["0% 0%", "0% 0%"] : ["0% 42%", "0% 0%"]
  );

  const textOpacity = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.3, 0.7], ["24px", "0px"]);

  return (
    <section
      ref={ref}
      className="relative bg-bg py-24 md:py-32"
      aria-label="Видео-ревил"
    >
      <div className="mx-auto max-w-content px-4 md:px-8">
        {/* Заголовок секции */}
        <motion.p
          className="mb-12 text-xs font-medium uppercase tracking-[0.2em] text-text-muted"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Наши мероприятия
        </motion.p>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-10">
          {/* Левое изображение — reveal через clip-path */}
          <motion.div
            ref={imageRef}
            className="relative aspect-[3/4] overflow-hidden"
            style={reduced || mobile ? {} : { clipPath: `inset(${clipInset} ${clipInset} ${clipInset} 0%)` }}
          >
            <Image
              src={IMAGE_URL}
              alt="Атмосфера делового мероприятия — агентство Закулисье Новосибирск"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" aria-hidden />
            {/* Цифра */}
            <div className="absolute bottom-6 left-6">
              <span className="font-display text-6xl font-bold leading-none text-white/10 md:text-8xl">
                01
              </span>
            </div>
          </motion.div>

          {/* Правое — текст + второе фото */}
          <div className="flex flex-col justify-between gap-8">
            <motion.div
              style={reduced ? {} : { opacity: textOpacity, y: textY }}
            >
              <h2 className="font-display text-3xl font-semibold leading-tight text-text-primary md:text-4xl lg:text-5xl">
                Режиссёрский
                <br />
                <span className="text-accent">подход</span>
                <br />
                к каждому проекту.
              </h2>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-text-secondary">
                Мы не собираем мероприятия из готовых блоков. Каждое событие разрабатывается с нуля — от сценария до последнего кабеля на сцене.
              </p>
            </motion.div>

            <motion.div
              className="relative aspect-video overflow-hidden"
              initial={reduced ? false : { opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={IMAGE_URL_2}
                alt="Корпоративное мероприятие — event-агентство Закулисье"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-bg/20" aria-hidden />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
