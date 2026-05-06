"use client";

import { CinematicContactForm } from "@/components/forms/CinematicContactForm";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/constants";
import Link from "next/link";

export function ContactSection() {
  return (
    <section
      id="contact-form"
      className="scroll-mt-24 bg-[var(--color-bg)] py-section"
      aria-label="Заявка"
    >
      <div className="mx-auto grid max-w-content gap-16 px-4 md:grid-cols-[minmax(0,2fr),minmax(0,3fr)] md:items-start md:gap-20 md:px-8 lg:grid-cols-[2fr_3fr]">
        <div className="order-2 md:order-1">
          <RevealOnScroll>
            <p className="caption-text">Обсудить проект</p>
            <h2 className="mt-3 font-display text-[clamp(26px,3vw,44px)] font-bold leading-snug tracking-tight text-text-primary">
              Расскажите о задаче — мы предложим решение
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-text-secondary">
              Свяжемся в течение нескольких часов. Без шаблонных предложений — только конкретика.
            </p>
            <div className="mt-10 space-y-2 text-sm text-text-secondary/90">
              <p>
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="text-text-primary transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {CONTACT_PHONE}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-text-primary transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
            <p className="mt-8 text-xs text-text-muted">
              <Link href="/requisites" className="hover:text-text-secondary">
                Реквизиты
              </Link>
            </p>
          </RevealOnScroll>
        </div>

        <div className="order-1 md:order-2">
          <CinematicContactForm />
        </div>
      </div>
    </section>
  );
}
