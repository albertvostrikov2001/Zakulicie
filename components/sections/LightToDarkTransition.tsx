"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function LightToDarkTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const bgOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const textOpacity1 = useTransform(scrollYProgress, [0, 0.3, 0.55], [0, 1, 0]);
  const textOpacity2 = useTransform(scrollYProgress, [0.35, 0.6, 0.85], [0, 1, 0]);
  const textOpacity3 = useTransform(scrollYProgress, [0.6, 0.85, 1], [0, 1, 0.8]);
  const textY1 = useTransform(scrollYProgress, [0, 0.3], ["30px", "0px"]);
  const textY2 = useTransform(scrollYProgress, [0.35, 0.6], ["30px", "0px"]);
  const textY3 = useTransform(scrollYProgress, [0.6, 0.85], ["30px", "0px"]);

  if (reduced) {
    return (
      <section className="bg-bg py-24">
        <div className="mx-auto max-w-content px-4 md:px-8">
          <p className="font-display text-3xl font-semibold text-text-primary md:text-5xl">
            Мы работаем там, где важен каждый элемент.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[300vh]" aria-label="Переход">
      {/* Sticky контейнер */}
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
        {/* Тёмный оверлей — нарастает при скролле */}
        <motion.div
          className="absolute inset-0 bg-bg"
          style={{ opacity: bgOpacity }}
          aria-hidden
        />

        {/* Фоновые строки */}
        <div className="absolute inset-0 flex items-end justify-end p-8 md:p-16 opacity-[0.04]" aria-hidden>
          <p className="font-display text-[20vw] font-bold leading-none tracking-tighter text-white select-none">
            20
          </p>
        </div>

        {/* Текст 1 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-4 text-center"
          style={{ opacity: textOpacity1, y: textY1 }}
        >
          <p className="font-display text-3xl font-semibold leading-tight text-bg-light/90 md:text-5xl lg:text-6xl">
            Мы не продаём шоу.
          </p>
        </motion.div>

        {/* Текст 2 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-4 text-center"
          style={{ opacity: textOpacity2, y: textY2 }}
        >
          <p className="font-display text-3xl font-semibold leading-tight text-text-primary md:text-5xl lg:text-6xl">
            Мы создаём события,
            <br />
            <span className="text-accent">которые работают.</span>
          </p>
        </motion.div>

        {/* Текст 3 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-4 text-center"
          style={{ opacity: textOpacity3, y: textY3 }}
        >
          <p className="font-display text-2xl font-medium leading-snug text-text-secondary md:text-4xl">
            20 лет. 3000+ мероприятий.
            <br />
            <span className="text-text-primary">Один стандарт.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
