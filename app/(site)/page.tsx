import { ClientsSection } from "@/components/sections/ClientsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TransitionSection } from "@/components/sections/TransitionSection";
import { VideoSplitSection } from "@/components/sections/VideoSplitSection";
import { CasesMarquee } from "@/components/ui/CasesMarquee";
import { CTAStrip } from "@/components/ui/CTAStrip";
import { getFeaturedCases, getTestimonials } from "@/lib/data";
import { unsplashPhoto } from "@/lib/content/unsplash";
import { getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";

const homeUrl = getSiteUrl() + "/";

export const metadata: Metadata = {
  title: "Закулисье — Event-агентство премиум класса в Новосибирске",
  description:
    "Организация корпоративных мероприятий, деловых событий, тимбилдинга и брендовых активностей в Новосибирске и Сибири. 20 лет опыта. 3000+ мероприятий.",
  keywords: [
    "event агентство Новосибирск",
    "организация мероприятий Новосибирск",
    "корпоративные мероприятия Сибирь",
  ],
  alternates: { canonical: homeUrl },
  openGraph: {
    title: "Закулисье — Event-агентство",
    description:
      "Премиальные события для компаний, которые не идут на компромисс. Новосибирск, Сибирь, федеральные брифы.",
    locale: "ru_RU",
    type: "website",
    url: homeUrl,
    images: [
      {
        url: unsplashPhoto("1511578314322-379afb476865", 1200, 630),
        width: 1200,
        height: 630,
        alt: "Атмосфера делового мероприятия",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default async function HomePage() {
  const featured     = await getFeaturedCases();
  const testimonials = await getTestimonials();

  return (
    <>
      {/* 1 – HERO: oversized wordmark, trust-строка, description, CTA, scroll indicator */}
      <TransitionSection />

      {/* 2 – SHOWREEL / after-hero storytelling */}
      <VideoSplitSection />

      {/* 3 – STATS: 4 крупных числа, counter-up */}
      <StatsSection />

      {/* 4 – КЕЙСЫ: две бегущие строки */}
      <CasesMarquee cases={featured} />

      {/* 5 – CTA-вставка */}
      <CTAStrip text="Готовы обсудить ваш проект?" />

      {/* 6 – НАПРАВЛЕНИЯ РАБОТЫ: hover reveal услуг */}
      <ServicesSection />

      {/* 7 – CTA-вставка */}
      <CTAStrip text="Есть задача? Расскажите — предложим решение." />

      {/* 8 – КЛИЕНТЫ: самоперелистывающийся блок */}
      <ClientsSection />

      {/* 9 – ОТЗЫВЫ: editorial Swiper */}
      <TestimonialsSection items={testimonials} />

      {/* 10 – ФОРМА: id=contact-form */}
      <ContactSection />
    </>
  );
}
