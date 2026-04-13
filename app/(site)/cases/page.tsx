import { CasesListing } from "@/app/(site)/cases/CasesListing";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getCasesResolved } from "@/lib/data";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Кейсы — проекты event-агентства",
  description:
    "Подборка реализованных мероприятий: деловые форумы, корпоративы, активации, постановка. Закулисье, Новосибирск.",
  alternates: { canonical: `${getSiteUrl()}/cases` },
  openGraph: {
    title: `Кейсы | ${SITE_NAME}`,
    description: "Проекты, за которые не стыдно показать руководству.",
    url: `${getSiteUrl()}/cases`,
  },
};

function CasesGridFallback() {
  return (
    <ul className="mt-12 grid gap-6 md:grid-cols-2">
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
          <h1 className="font-display text-4xl font-semibold text-text-primary md:text-5xl">Кейсы</h1>
          <p className="mt-4 text-lg text-text-secondary">
            Проекты, за которые не стыдно отправить ссылку коллеге. Без лишних слов — фактура задач и
            результата.
          </p>
        </header>

        <Suspense fallback={<CasesGridFallback />}>
          <CasesListing all={all} />
        </Suspense>
      </PageWrapper>
    </>
  );
}
