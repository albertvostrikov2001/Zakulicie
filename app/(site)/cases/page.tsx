import { CaseCard } from "@/components/blocks/CaseCard";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getCasesResolved } from "@/lib/data";
import { serviceNav } from "@/lib/content/services";
import type { ServiceSlug } from "@/lib/types";

function isServiceSlug(v: string | undefined): v is ServiceSlug {
  return Boolean(v && serviceNav.some((s) => s.slug === v));
}
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import { CasesFilter } from "./CasesFilter";

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

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const sp = await searchParams;
  const all = await getCasesResolved();
  const filter: ServiceSlug | "all" = isServiceSlug(sp.service) ? sp.service : "all";
  const filtered = filter === "all" ? all : all.filter((c) => c.serviceTypeSlug === filter);

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

        <CasesFilter
          options={[{ slug: "all", title: "Все" }, ...serviceNav.map((s) => ({ slug: s.slug, title: s.title }))]}
          active={filter}
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {filtered.map((c, i) => (
            <li key={c.slug}>
              <CaseCard item={c} priority={i < 2} />
            </li>
          ))}
        </ul>
      </PageWrapper>
    </>
  );
}
