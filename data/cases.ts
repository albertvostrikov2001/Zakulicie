import { staticCases } from "@/lib/content/cases";
import { serviceNav } from "@/lib/content/services";
import type { CaseStudy, ServiceSlug } from "@/lib/types";

function serviceTitle(slug: ServiceSlug): string {
  return serviceNav.find((s) => s.slug === slug)?.title ?? "";
}

function buildKeywords(c: CaseStudy): string[] {
  const k = new Set<string>([
    "event агентство Новосибирск",
    "организация мероприятий Новосибирск",
    "корпоративные мероприятия Сибирь",
    c.client,
    serviceTitle(c.serviceTypeSlug),
  ]);
  return Array.from(k).filter((s): s is string => Boolean(s));
}

/**
 * Сводка кейсов с SEO и строковыми URL изображений (замена — одна строка в staticCases / здесь).
 */
export interface Case {
  slug: string;
  title: string;
  type: string;
  shortDescription: string;
  heroImage: string;
  gallery: string[];
  isFeatured: boolean;
  year?: number;
  scale?: string;
  client?: string;
  clientLogoPublic?: boolean;
  result?: string;
  seo: { title: string; description: string; keywords: string[] };
}

export const cases: Case[] = staticCases.map((c) => ({
  slug: c.slug,
  title: c.title,
  type: serviceTitle(c.serviceTypeSlug),
  shortDescription: c.excerpt,
  heroImage: c.heroImage.src,
  gallery: c.gallery.map((g) => g.src),
  isFeatured: c.isFeatured,
  year: c.year,
  scale: c.scaleLabel,
  client: c.client,
  clientLogoPublic: true,
  result: c.result[0],
  seo: {
    title: c.seoTitle,
    description: c.seoDescription,
    keywords: buildKeywords(c),
  },
}));

export function getCaseDataBySlug(slug: string): Case | undefined {
  return cases.find((c) => c.slug === slug);
}
