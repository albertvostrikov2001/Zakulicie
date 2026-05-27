import { AboutPageContent } from "@/components/sections/about/AboutPageContent";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О компании — стандарт, опыт и география",
  description:
    "«Закулисье»: 20 лет на рынке event в Новосибирске, 3000+ мероприятий, работа с крупными брендами, собственный реквизит и команда полного цикла.",
  alternates: { canonical: `${getSiteUrl()}/about` },
  openGraph: {
    title: `О компании | ${SITE_NAME}`,
    url: `${getSiteUrl()}/about`,
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
