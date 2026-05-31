import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { CTALink } from "@/components/ui/CTALink";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { serviceNav, staticServices } from "@/lib/content/services";
import type { ServiceSlug } from "@/lib/types";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

const LIST_H2: Record<ServiceSlug, string> = {
  "korporativnye-meropriyatiya": "Организация корпоративных мероприятий",
  timbilding: "Тимбилдинг и командные события",
  "delovye-meropriyatiya": "Организация деловых мероприятий",
  "reklamnye-akcii": "Рекламные и имиджевые мероприятия",
  "rezhissyorskie-meropriyatiya": "Режиссёрские event-форматы",
  "arenda-rekvizita": "Аренда реквизита и event-оборудования",
};

export const metadata: Metadata = {
  title: "Услуги event-агентства «Закулисье»",
  description:
    "Корпоративные и деловые мероприятия, тимбилдинг, промо-акции и режиссёрские форматы. Агентство полного цикла в Новосибирске — 20 лет опыта, 3000+ событий.",
  alternates: { canonical: `${getSiteUrl()}/services` },
  openGraph: {
    title: `Услуги | ${SITE_NAME}`,
    description:
      "Шесть направлений — от корпоративной повестки до режиссёрских форматов. Агентство полного цикла, Новосибирск.",
    url: `${getSiteUrl()}/services`,
    images: [
      {
        url: "/services/korporativnye-meropriyatiya.webp",
        alt: "Услуги event-агентства Закулисье — организация мероприятий в Новосибирске",
      },
    ],
  },
};

export default function ServicesIndexPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Услуги", path: "/services" },
        ]}
      />
      <PageWrapper>
        <header className="max-w-3xl">
          <p className="caption-text">{SITE_NAME}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-text-primary md:text-5xl">
            Услуги event-агентства «Закулисье»
          </h1>
          <p className="mt-5 text-lg text-text-secondary">
            Направления работы — от корпоративной повестки до федеральных сборов и режиссёрских форматов.
          </p>
        </header>

        <div className="mt-16 space-y-16 border-t border-border pt-16">
          {serviceNav.map((s) => {
            const row = staticServices[s.slug];
            const title = LIST_H2[s.slug];
            return (
              <section key={s.slug} aria-labelledby={`svc-${s.slug}`}>
                <h2 id={`svc-${s.slug}`} className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
                  <Link href={`/services/${s.slug}`} className="transition-colors hover:text-accent">
                    {title}
                  </Link>
                </h2>
                {row?.shortDescription ? (
                  <p className="mt-4 max-w-2xl text-text-secondary leading-relaxed">{row.shortDescription}</p>
                ) : null}
              </section>
            );
          })}
        </div>

        <section className="mt-20 border-t border-border pt-16" aria-labelledby="why-full-cycle">
          <h2 id="why-full-cycle" className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
            Почему бизнес выбирает агентство полного цикла
          </h2>
          <p className="mt-4 max-w-2xl text-text-secondary leading-relaxed">
            Одна команда закрывает концепцию, продакшн и площадку — без размывания ответственности между подрядчиками.
          </p>
        </section>

        <section className="mt-16" aria-labelledby="cases-by-area">
          <h2 id="cases-by-area" className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
            Кейсы по направлениям
          </h2>
          <p className="mt-4 max-w-xl text-text-secondary">
            <Link href="/cases" className="font-medium text-accent underline-offset-4 hover:underline">
              Перейти к подборке кейсов
            </Link>
          </p>
        </section>

        <section
          className="mt-16 border border-border bg-surface/50 p-8 md:p-10"
          aria-labelledby="discuss-format"
          style={{ borderRadius: "var(--border-radius-card)" }}
        >
          <h2 id="discuss-format" className="font-display text-2xl font-semibold text-text-primary">
            Обсудить формат мероприятия
          </h2>
          <p className="mt-3 max-w-xl text-sm text-text-secondary">
            Короткий созвон и понятный следующий шаг — без обязательств и шаблонных коммерческих.
          </p>
          <CTALink
            className="mt-6 inline-flex border border-accent px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-text-primary transition-colors hover:bg-accent hover:text-[#0A0A0A]"
          >
            Связаться
          </CTALink>
        </section>
      </PageWrapper>
    </>
  );
}
