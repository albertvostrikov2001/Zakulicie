import { AboutPageContent } from "@/components/sections/about/AboutPageContent";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О компании — 20 лет в event-индустрии | Закулисье",
  description:
    "«Закулисье» — 20 лет на рынке event в Новосибирске, 3000+ мероприятий, 50+ федеральных брендов. Собственный реквизит, команда полного цикла, работа по Сибири.",
  alternates: { canonical: `${getSiteUrl()}/about` },
  openGraph: {
    title: `О компании | ${SITE_NAME}`,
    description: "20 лет, 3000+ мероприятий, 50+ федеральных брендов. Новосибирск и Сибирь.",
    url: `${getSiteUrl()}/about`,
    images: [
      {
        url: "/cases/semejnyj-korporativ-varmix-warmax/cover.webp",
        alt: "О компании Закулисье — event-агентство полного цикла в Новосибирске",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "О нас", path: "/about" },
        ]}
      />
      <PageWrapper>
        <AboutPageContent />
      </PageWrapper>
    </>
  );
}
