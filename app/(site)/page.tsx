import { CTASectionNew } from "@/components/sections/CTASectionNew";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { FlagshipCases } from "@/components/sections/FlagshipCases";
import { HeroSection } from "@/components/sections/HeroSection";
import { LightToDarkTransition } from "@/components/sections/LightToDarkTransition";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { VideoReveal } from "@/components/sections/VideoReveal";
import { getFeaturedCases, getTestimonials } from "@/lib/data";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SITE_NAME} — мероприятия для компаний, где важна репутация`,
  description:
    "Event-агентство в Новосибирске: корпоративные мероприятия, деловые форумы, тимбилдинг, активации, аренда реквизита. 20 лет опыта, 3000+ мероприятий, федеральные бренды.",
  alternates: { canonical: getSiteUrl() + "/" },
  openGraph: {
    title: `${SITE_NAME} — премиальные события в Сибири`,
    description:
      "Агентство полного цикла для компаний, которые не идут на компромисс по качеству исполнения. Новосибирск и вся Сибирь.",
    url: getSiteUrl(),
  },
};

export default async function HomePage() {
  const featured = await getFeaturedCases();
  const testimonials = await getTestimonials();

  return (
    <>
      <HeroSection />
      <LightToDarkTransition />
      <VideoReveal />
      <StatsSection />
      <FlagshipCases cases={featured} />
      <ServicesSection />
      <ClientsSection />
      <TestimonialsSection items={testimonials} />
      <CTASectionNew />
    </>
  );
}
