import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { staticClientWordmarks } from "@/lib/content/clients";
import { unsplashPhoto } from "@/lib/content/unsplash";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import Image from "@/components/ui/SiteImage";

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
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              src: unsplashPhoto("1504384308090-c894fdcc538d", 1200),
              alt: "Деловая конференция и участники",
            },
            {
              src: unsplashPhoto("1441986300917-64674bd600d8", 1200),
              alt: "Публичное мероприятие и бренд в пространстве",
            },
            {
              src: unsplashPhoto("1522071820081-009f0129c71c", 1200),
              alt: "Командная работа и корпоративные форматы",
            },
          ].map((ph) => (
            <div key={ph.src} className="relative aspect-[4/3] overflow-hidden rounded-card border border-border">
              <Image src={ph.src} alt={ph.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
            </div>
          ))}
        </div>
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
