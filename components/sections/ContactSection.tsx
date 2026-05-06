"use client";

import { CinematicContactForm } from "@/components/forms/CinematicContactForm";
import { motion } from "framer-motion";

const TRUST_ITEMS = [
  "20 лет опыта",
  "3 000+ реализованных мероприятий",
  "От 5 млн рублей — крупные корпоративные проекты",
] as const;

export function ContactSection() {
  return (
    <section
      id="contact-form"
      className="relative scroll-mt-20 bg-[var(--color-bg)]"
      style={{ minHeight: "90vh" }}
      aria-label="Заявка"
    >
      {/* Subtle noise overlay */}
      <div className="pointer-events-none absolute inset-0 grain opacity-50" aria-hidden />

      <div className="relative mx-auto grid min-h-[inherit] max-w-content items-center gap-14 px-4 py-[clamp(72px,10vw,120px)] md:grid-cols-[minmax(0,2fr),minmax(0,3fr)] md:gap-20 md:px-8 lg:grid-cols-[2fr_3fr]">

        {/* Left column: offer + trust */}
        <motion.div
          className="order-2 md:order-1"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="caption-text mb-5">Обсудить проект</p>
          <h2
            className="font-display font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)]"
            style={{ fontSize: "clamp(28px, 3vw, 42px)" }}
          >
            Расскажите о задаче —<br className="hidden lg:block" /> мы предложим решение
          </h2>
          <p
            className="mt-5 max-w-sm leading-relaxed text-[var(--color-text-secondary)]"
            style={{ fontSize: "15px", lineHeight: 1.6 }}
          >
            Свяжемся в течение нескольких часов. Без шаблонных коммерческих предложений — только конкретика.
          </p>

          {/* Trust list */}
          <ul className="mt-10 space-y-4" aria-label="Факты об агентстве">
            {TRUST_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[13px] text-[var(--color-text-secondary)]"
              >
                <span
                  className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right column: form */}
        <div className="order-1 md:order-2">
          <CinematicContactForm />
        </div>
      </div>
    </section>
  );
}
