import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { staticClientWordmarks } from "@/lib/content/clients";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Клиенты и отрасли",
  description:
    "Компании и бренды, с которыми работает «Закулисье»: федеральные и сибирские организации, долгосрочные контракты и проекты повышенной ответственности.",
  alternates: { canonical: `${getSiteUrl()}/clients` },
  openGraph: {
    title: `Клиенты | ${SITE_NAME}`,
    url: `${getSiteUrl()}/clients`,
  },
};

export default function ClientsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Клиенты", path: "/clients" },
        ]}
      />
      <PageWrapper>
        <h1 className="font-display text-4xl font-semibold text-text-primary md:text-5xl">Клиенты</h1>
        <p className="mt-6 max-w-2xl text-lg text-text-secondary">
          Мы работаем там, где событие связано с репутацией: корпоративная культура, B2B-коммуникации,
          открытия, федеральные коммуникации дилерских сетей. Ниже — формат плейсхолдеров до согласования
          публичного использования логотипов.
        </p>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staticClientWordmarks.map((name) => (
            <li
              key={name}
              className="flex min-h-[100px] items-center justify-center border border-border bg-surface/40 px-6 text-center font-display text-sm text-text-secondary"
            >
              {name}
            </li>
          ))}
        </ul>
        <p className="mt-12 max-w-2xl text-sm text-text-muted">
          Полный список отраслей и рекомендации доступны по запросу — часть проектов закрыта NDA, и мы это
          соблюдаем.
        </p>
      </PageWrapper>
    </>
  );
}
