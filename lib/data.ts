import { staticBlogPosts } from "@/lib/content/blog";
import { staticCases } from "@/lib/content/cases";
import { staticServices } from "@/lib/content/services";
import { staticTestimonials } from "@/lib/content/testimonials";
import {
  fetchBlogBySlugFromSanity,
  fetchBlogPostsFromSanity,
  fetchCaseBySlugFromSanity,
  fetchCasesFromSanity,
  fetchTestimonialsFromSanity,
} from "@/lib/sanity/fetchContent";
import type { BlogPost, CaseStudy, ServiceLanding, ServiceSlug, Testimonial } from "@/lib/types";

/** Кейсы: Sanity при наличии проекта и документов, иначе статика. */
export async function getCasesResolved(): Promise<CaseStudy[]> {
  const fromCms = await fetchCasesFromSanity();
  return fromCms ?? staticCases;
}

export async function getCaseBySlug(slug: string): Promise<CaseStudy | undefined> {
  const fromCms = await fetchCaseBySlugFromSanity(slug);
  if (fromCms) return fromCms;
  return staticCases.find((c) => c.slug === slug);
}

export async function getFeaturedCases(): Promise<CaseStudy[]> {
  const all = await getCasesResolved();
  const featured = all.filter((c) => c.isFeatured);
  const list = featured.length > 0 ? featured : all.slice(0, 4);
  return [...list].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

export async function getService(slug: string): Promise<ServiceLanding | undefined> {
  if (slug in staticServices) return staticServices[slug as ServiceSlug];
  return undefined;
}

export function getAllServiceSlugs(): ServiceSlug[] {
  return Object.keys(staticServices) as ServiceSlug[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const fromCms = await fetchTestimonialsFromSanity();
  return fromCms ?? staticTestimonials;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const fromCms = await fetchBlogPostsFromSanity();
  return fromCms ?? staticBlogPosts;
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  const fromCms = await fetchBlogBySlugFromSanity(slug);
  if (fromCms) return fromCms;
  return staticBlogPosts.find((p) => p.slug === slug);
}

export async function getCasesByServiceSlug(serviceSlug: ServiceSlug): Promise<CaseStudy[]> {
  const all = await getCasesResolved();
  return all.filter((c) => c.serviceTypeSlug === serviceSlug).slice(0, 3);
}

export async function getAdjacentCases(slug: string): Promise<{ prev?: CaseStudy; next?: CaseStudy }> {
  const list = await getCasesResolved();
  const i = list.findIndex((c) => c.slug === slug);
  if (i === -1) return {};
  return {
    prev: list[i - 1],
    next: list[i + 1],
  };
}
