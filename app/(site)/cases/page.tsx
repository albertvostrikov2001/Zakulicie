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
    "Подборка реализованных мероприятий: деловые форумы, корпоративы, активации, постановка. Закулисье, Новосибирск.",
  alternates: { canonical: `${getSiteUrl()}/cases` },
  openGraph: {
    title: `Кейсы event-агентства «Закулисье» | ${SITE_NAME}`,
    description: "Проекты, за которые не стыдно показать руководству.",
    url: `${getSiteUrl()}/cases`,
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
            Кейсы ивент агентства «Закулисье»
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Проекты, за которые не стыдно отправить ссылку коллеге. Без лишних слов — фактура задач и
            результата.
          </p>
        </header>

        <section className="mt-12" aria-labelledby="cases-intro-heading">
          <h2 id="cases-intro-heading" className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
            Мероприятия для федеральных брендов и лидеров региона
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
            Расскажите о задаче — предложим формат и таймлайн без шаблонных коммерческих.
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
