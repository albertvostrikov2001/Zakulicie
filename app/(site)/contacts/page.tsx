import { PageWrapper } from "@/components/layout/PageWrapper";
import { CTALink } from "@/components/ui/CTALink";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import {
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  CONTACT_EMAIL,
  CONTACT_CITY,
  CONTACT_STREET,
} from "@/lib/constants";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Контакты event-агентства «Закулисье»",
  description:
    "Контакты ивент-агентства «Закулисье» в Новосибирске: телефон, email, адрес. Организация корпоративных и деловых мероприятий по всей Сибири.",
  alternates: { canonical: `${getSiteUrl()}/contacts` },
  openGraph: {
    title: `Контакты | ${SITE_NAME}`,
    description: "Свяжитесь с нами — ответим в течение нескольких часов.",
    url: `${getSiteUrl()}/contacts`,
    images: [
      {
        url: "/services/korporativnye-meropriyatiya.webp",
        alt: "Контакты event-агентства Закулисье — Новосибирск",
      },
    ],
  },
};

export default function ContactsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Контакты", path: "/contacts" },
        ]}
      />
      <PageWrapper>
        <header className="max-w-3xl">
          <p className="caption-text">{SITE_NAME}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-text-primary md:text-5xl">
            Контакты
          </h1>
          <p className="mt-5 text-lg text-text-secondary">
            Свяжитесь с нами любым удобным способом — ответим в течение нескольких часов и предложим
            понятный следующий шаг.
          </p>
        </header>

        <div className="mt-16 grid gap-12 border-t border-border pt-16 md:grid-cols-2">
          {/* Contact details */}
          <section aria-labelledby="contact-details">
            <h2
              id="contact-details"
              className="font-display text-2xl font-semibold text-text-primary"
            >
              Как связаться
            </h2>
            <dl className="mt-8 space-y-6 text-[15px]">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                  Телефон
                </dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${CONTACT_PHONE_TEL}`}
                    className="text-text-primary transition-colors hover:text-accent"
                    data-analytics="phone"
                  >
                    {CONTACT_PHONE}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-text-primary transition-colors hover:text-accent"
                    data-analytics="email"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                  Город
                </dt>
                <dd className="mt-1 text-text-primary">{CONTACT_CITY}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                  Адрес
                </dt>
                <dd className="mt-1 text-text-primary">{CONTACT_STREET}, {CONTACT_CITY}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                  Режим работы
                </dt>
                <dd className="mt-1 text-text-primary">Пн–Пт, 09:00–18:00</dd>
              </div>
            </dl>
          </section>

          {/* CTA */}
          <section
            aria-labelledby="contact-cta"
            className="flex flex-col justify-start border border-border bg-surface/50 p-8"
          >
            <h2
              id="contact-cta"
              className="font-display text-xl font-semibold text-text-primary"
            >
              Обсудить проект
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Расскажите о задаче — предложим формат и таймлайн без шаблонных коммерческих
              предложений.
            </p>
            <CTALink className="mt-6 inline-flex self-start border border-accent px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-text-primary transition-colors hover:bg-accent hover:text-[#0A0A0A]">
              Написать нам
            </CTALink>
            <p className="mt-4 text-xs text-text-muted">
              Или перейдите к{" "}
              <Link href="/#contact-form" className="text-accent underline-offset-4 hover:underline">
                форме заявки
              </Link>{" "}
              на главной странице
            </p>
          </section>
        </div>
      </PageWrapper>
    </>
  );
}
