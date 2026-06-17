import { CasesListing } from "@/app/(site)/cases/CasesListing";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { CTALink } from "@/components/ui/CTALink";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getCasesResolved } from "@/lib/data";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Кейсы event-агентства «Закулисье»",
  description:
    "40+ реализованных проектов: деловые форумы, корпоративы, активации, постановки для федеральных брендов и региональных лидеров в Новосибирске и Сибири.",
  alternates: { canonical: `${getSiteUrl()}/cases` },
  openGraph: {
    title: `Кейсы | ${SITE_NAME}`,
    description: "40+ проектов для федеральных брендов и региональных лидеров — от 150 до 8 000 гостей.",
    url: `${getSiteUrl()}/cases`,
    images: [
      {
        url: "/cases/syezd-dilerov-metall-profil/cover.webp",
        alt: "Кейсы event-агентства Закулисье — реализованные мероприятия",
      },
    ],
  },
};

function CasesGridFallback() {
  return (
    <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-7">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="aspect-[16/10] animate-pulse rounded-card bg-surface" />
      ))}
    </ul>
  );
}

export default async function CasesPage() {
  const all = await getCasesResolved();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Кейсы", path: "/cases" },
        ]}
      />
      <PageWrapper>
        <header className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold text-text-primary md:text-5xl">
            Кейсы event&#8209;агентства «Закулисье»
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Реализованные проекты — без лишних слов: задача, что сделано и результат.
            Федеральные бренды, региональные лидеры, события от 150 до 8 000 человек.
          </p>
        </header>

        <section className="mt-12" aria-labelledby="cases-intro-heading">
          <h2 id="cases-intro-heading" className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
            Корпоративы, деловые форумы, церемонии, тимбилдинг и городские события
          </h2>
        </section>

        <Suspense fallback={<CasesGridFallback />}>
          <CasesListing all={all} />
        </Suspense>

        <section
          className="mt-16 border border-border bg-surface/50 p-8 md:mt-20 md:p-10"
          aria-labelledby="cases-page-cta"
          style={{ borderRadius: "var(--border-radius-card)" }}
        >
          <h2 id="cases-page-cta" className="font-display text-2xl font-semibold text-text-primary">
            Обсудить похожий проект
          </h2>
          <p className="mt-3 max-w-xl text-sm text-text-secondary">
            Расскажите о задаче — предложим формат и концепцию для её решения.
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
