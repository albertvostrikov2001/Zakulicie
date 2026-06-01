import { ClientsShowcase } from "@/components/sections/ClientsShowcase";
import { ContactStepSection } from "@/components/sections/ContactStepSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TestimonialsSpotlight } from "@/components/sections/TestimonialsSpotlight";
import { TransitionSection } from "@/components/sections/TransitionSection";
import { VideoSplitSection } from "@/components/sections/VideoSplitSection";
import { CasesMarquee } from "@/components/ui/CasesMarquee";
import { CTAStrip } from "@/components/ui/CTAStrip";
import { EventPhrase } from "@/components/ui/EventPhrase";
import { getFeaturedCases } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";

const homeUrl = getSiteUrl() + "/";

export const metadata: Metadata = {
  title: "Организация мероприятий в Новосибирске | Закулисье",
  description:
    "Ивент-агентство «Закулисье»: корпоративные и деловые мероприятия, тимбилдинг, рекламные акции в Новосибирске и Сибири. 20 лет опыта, 3000+ событий.",
  keywords: [
    "event агентство Новосибирск",
    "организация мероприятий Новосибирск",
    "корпоративные мероприятия Сибирь",
  ],
  alternates: { canonical: homeUrl },
  openGraph: {
    title: "Закулисье — ивент-агентство полного цикла для корпоративных и деловых событий",
    description:
      "Премиальные события для компаний, которые не идут на компромисс. Новосибирск, Сибирь, федеральные брифы.",
    locale: "ru_RU",
    type: "website",
    url: homeUrl,
    images: [
      {
        url: "/cases/semejnyj-korporativ-varmix-warmax/cover.webp",
        width: 1920,
        height: 1080,
        alt: "Event-агентство Закулисье — организация мероприятий в Новосибирске",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default async function HomePage() {
  const featured = await getFeaturedCases();

  return (
    <>
      {/* 1 – HERO: oversized wordmark, description, CTA, image-motion */}
      <TransitionSection cases={featured} />

      {/* 2 – SHOWREEL / after-hero storytelling */}
      <VideoSplitSection />

      {/* 1.5 – «Творчески. Системно. Про людей» — эмоциональный переход */}
      <EventPhrase />

      {/* 3 – STATS: 4 крупных числа, counter-up */}
      <StatsSection />

      {/* 4 – КЕЙСЫ: две бегущие строки */}
      <CasesMarquee cases={featured} />

      {/* 5 – CTA-вставка */}
      <CTAStrip text="Готовы обсудить ваш проект?" />

      {/* 6 – НАПРАВЛЕНИЯ РАБОТЫ: hover reveal услуг */}
      <ServicesSection />

      {/* 7 – CTA-вставка (filled variant для визуального контраста) */}
      <CTAStrip text="Есть задача? Расскажите — предложим решение." variant="filled" />

      {/* 8 – КЛИЕНТЫ: premium flip-card showcase */}
      <ClientsShowcase />

      {/* 9 – ОТЗЫВЫ: spotlight (reviews-v2-spotlight) */}
      <TestimonialsSpotlight />

      {/* 10 – ФОРМА: id=contact-form */}
      <ContactStepSection />
    </>
  );
}
