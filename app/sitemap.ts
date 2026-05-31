import { getAllServiceSlugs, getBlogPosts, getCasesResolved } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

/** Дата последнего существенного обновления контента сайта */
const SITE_UPDATED = new Date("2025-06-01");
/** Дата последнего обновления страниц услуг */
const SERVICES_UPDATED = new Date("2025-06-01");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [casesList, blogList] = await Promise.all([getCasesResolved(), getBlogPosts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`,             lastModified: SITE_UPDATED,     changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/services`,     lastModified: SERVICES_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/cases`,        lastModified: SITE_UPDATED,     changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/about`,        lastModified: SITE_UPDATED,     changeFrequency: "yearly",  priority: 0.7 },
    { url: `${base}/clients`,      lastModified: SITE_UPDATED,     changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`,         lastModified: SITE_UPDATED,     changeFrequency: "weekly",  priority: 0.75 },
    { url: `${base}/contacts`,     lastModified: SITE_UPDATED,     changeFrequency: "yearly",  priority: 0.65 },
    { url: `${base}/privacy-policy`, lastModified: SITE_UPDATED,   changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/requisites`,   lastModified: SITE_UPDATED,     changeFrequency: "yearly",  priority: 0.3 },
  ];

  const cases: MetadataRoute.Sitemap = casesList.map((c) => ({
    url: `${base}/cases/${c.slug}`,
    lastModified: new Date(`${c.year}-06-01`),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  const services: MetadataRoute.Sitemap = getAllServiceSlugs().map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: SERVICES_UPDATED,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const blog: MetadataRoute.Sitemap = blogList.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticRoutes, ...services, ...cases, ...blog];
}
