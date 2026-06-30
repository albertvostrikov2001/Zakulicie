import { PageWrapper } from "@/components/layout/PageWrapper";
import { CTALink } from "@/components/ui/CTALink";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import {
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  CONTACT_CITY,
  CONTACT_STREET,
  CONTACT_TELEGRAM,
  SOCIAL_VK,
  SOCIAL_INSTAGRAM,
  SOCIAL_WHATSAPP,
  SOCIAL_2GIS,
  SOCIAL_YANDEX_MAPS,
  SOCIAL_MAX,
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
                    style={{ color: '#ffffff', textDecoration: 'none' }}
                    data-analytics="phone"
                  >
                    {CONTACT_PHONE}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                  Написать
                </dt>
                <dd className="mt-1 flex flex-col gap-1.5">
                  <a
                    href={SOCIAL_WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary transition-colors hover:text-accent"
                    data-analytics="whatsapp"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={CONTACT_TELEGRAM}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary transition-colors hover:text-accent"
                    data-analytics="telegram"
                  >
                    Telegram — @Katya_Elgina
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                  Адрес
                </dt>
                <dd className="mt-1 flex flex-col gap-1.5">
                  <span className="text-text-primary">{CONTACT_STREET}, {CONTACT_CITY}</span>
                  <a
                    href={SOCIAL_2GIS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary transition-colors hover:text-accent"
                  >
                    Открыть в 2ГИС
                  </a>
                  <a
                    href={SOCIAL_YANDEX_MAPS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary transition-colors hover:text-accent"
                  >
                    Открыть в Яндекс Картах
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                  Режим работы
                </dt>
                <dd className="mt-1 text-text-primary">Пн–Пт, 11:00–19:00</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                  Соцсети
                </dt>
                <dd className="mt-1 flex flex-col gap-1.5">
                  <a
                    href={SOCIAL_INSTAGRAM}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary transition-colors hover:text-accent"
                    data-analytics="instagram"
                  >
                    Instagram — @katya__elgina
                  </a>
                  <a
                    href={SOCIAL_VK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary transition-colors hover:text-accent"
                    data-analytics="vk"
                  >
                    ВКонтакте — vk.ru/zakulisie54
                  </a>
                  <a
                    href={SOCIAL_MAX}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary transition-colors hover:text-accent"
                    data-analytics="max"
                  >
                    Max
                  </a>
                </dd>
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
              Расскажите о задаче — предложим формат и концепцию для её решения.
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

        {/* Map */}
        <section aria-labelledby="contact-map" className="mt-16 border-t border-border pt-16">
          <h2
            id="contact-map"
            className="font-display text-2xl font-semibold text-text-primary"
          >
            Как нас найти
          </h2>
          <div className="mt-8 overflow-hidden border border-border" style={{ borderRadius: "var(--border-radius-card)" }}>
            <iframe
              src="https://yandex.ru/map-widget/v1/?org_id=42212525268&z=16"
              width="100%"
              height="420"
              loading="lazy"
              title={`Закулисье на карте — ${CONTACT_STREET}, ${CONTACT_CITY}`}
              style={{ border: 0, display: "block" }}
            />
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
