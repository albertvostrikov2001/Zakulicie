import { PageWrapper } from "@/components/layout/PageWrapper";
import { PrivacyPolicyContent } from "@/components/sections/legal/PrivacyPolicyContent";
import { getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика в отношении обработки персональных данных Event-агентства «Закулисье» (Елгина Екатерина Эдуардовна).",
  alternates: { canonical: `${getSiteUrl()}/privacy-policy` },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
        Политика конфиденциальности
      </h1>
      <PrivacyPolicyContent siteUrl={getSiteUrl()} />
    </PageWrapper>
  );
}
