"use client";

import { CinematicContactForm } from "@/components/forms/CinematicContactForm";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/constants";
import Link from "next/link";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="min-h-screen scroll-mt-20 bg-gradient-to-b from-bg via-bg to-surface py-section-mobile md:py-28"
      aria-label="Заявка"
    >
      <div className="mx-auto grid max-w-content gap-16 px-4 md:grid-cols-[minmax(0,2fr),minmax(0,3fr)] md:items-start md:gap-20 md:px-8">
        <div className="order-2 md:order-1">
          <RevealOnScroll>
            <h2 className="font-display text-3xl font-semibold leading-tight text-text-primary md:text-4xl lg:text-5xl">
              Расскажите о задаче — мы предложим решение
            </h2>
            <p className="mt-6 max-w-md text-text-secondary">
              Свяжемся в течение нескольких часов. Без шаблонных предложений — только конкретика.
            </p>
            <div className="mt-10 space-y-2 text-sm text-text-secondary">
              <p>
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="text-text-primary transition hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {CONTACT_PHONE}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-text-primary transition hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
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
