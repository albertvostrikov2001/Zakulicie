import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { staticClientWordmarks } from "@/lib/content/clients";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import Image from "@/components/ui/SiteImage";

export const metadata: Metadata = {
  title: "Клиенты event-агентства «Закулисье»",
  description:
    "50+ федеральных и региональных брендов доверяют «Закулисье» корпоративные мероприятия, деловые форумы и имиджевые события: от ритейла и банков до промышленных холдингов.",
  alternates: { canonical: `${getSiteUrl()}/clients` },
  openGraph: {
    title: `Клиенты | ${SITE_NAME}`,
    description: "50+ брендов — федеральные компании и региональные лидеры Сибири.",
    url: `${getSiteUrl()}/clients`,
    images: [
      {
        url: "/cases/syezd-dilerov-metall-profil/gallery/01.webp",
        alt: "Клиенты event-агентства Закулисье — деловые и корпоративные события",
      },
    ],
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
        <h1 className="font-display text-4xl font-semibold text-text-primary md:text-5xl">
          Клиенты event&#8209;агентства «Закулисье»
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-text-secondary">
          Работаем там, где событие связано с репутацией: корпоративная культура, B2B&#8209;коммуникации,
          церемонии открытий, федеральные съезды дилерских сетей.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              src: "/cases/syezd-dilerov-metall-profil/gallery/01.webp",
              alt: "Деловая конференция — event-агентство Закулисье Новосибирск",
            },
            {
              src: "/cases/otkrytie-lerua-merlen-kemerovo/gallery/03.webp",
              alt: "Открытие — event-агентство Закулисье Новосибирск",
            },
            {
              src: "/cases/spartakiada-metall-profil/gallery/08.webp",
              alt: "Корпоративные форматы — event-агентство Закулисье Новосибирск",
            },
          ].map((ph) => (
            <div
              key={ph.src}
              className="relative aspect-[4/3] overflow-hidden rounded-card border border-border"
            >
              <Image
                src={ph.src}
                alt={ph.alt}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 33vw"
              />
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
