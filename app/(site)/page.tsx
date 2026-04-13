import { CaseStorytelling } from "@/components/blocks/CaseStorytelling";
import { ClientMarquee } from "@/components/blocks/ClientMarquee";
import { CTASection } from "@/components/blocks/CTASection";
import { FeaturedCasesStrip } from "@/components/blocks/FeaturedCasesStrip";
import { HeroVideo } from "@/components/blocks/HeroVideo";
import { ServicesBlock } from "@/components/blocks/ServicesBlock";
import { StatBlock } from "@/components/blocks/StatBlock";
import { TestimonialSlider } from "@/components/blocks/TestimonialSlider";
import { WhyWeBlock } from "@/components/blocks/WhyWeBlock";
import { getFeaturedCases, getTestimonials } from "@/lib/data";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SITE_NAME} — мероприятия для компаний, где важна репутация`,
  description:
    "Event-агентство в Новосибирске: корпоративы, деловые форумы, тимбилдинг, активации, аренда реквизита. 20 лет опыта, 3000+ мероприятий, работа с федеральными брендами.",
  alternates: { canonical: getSiteUrl() + "/" },
  openGraph: {
    title: `${SITE_NAME} — премиальные события в Сибири`,
    description:
      "Агентство полного цикла для компаний, которые не идут на компромисс по качеству исполнения.",
    url: getSiteUrl(),
  },
};

export default async function HomePage() {
  const featured = await getFeaturedCases();
  const testimonials = await getTestimonials();
  const story = featured[0];

  return (
    <>
      <HeroVideo />
      <StatBlock />
      <FeaturedCasesStrip cases={featured} />
      <ServicesBlock />
      <WhyWeBlock />
      <ClientMarquee />
      {story ? <CaseStorytelling story={story} /> : null}
      <TestimonialSlider items={testimonials} />
      <CTASection />
    </>
  );
}
