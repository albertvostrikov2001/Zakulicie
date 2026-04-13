import { getAllServiceSlugs, getBlogPosts, getCasesResolved } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [casesList, blogList] = await Promise.all([getCasesResolved(), getBlogPosts()]);
  const staticRoutes = [
    "",
    "/cases",
    "/about",
    "/clients",
    "/blog",
    "/privacy-policy",
    "/data-consent",
    "/requisites",
    "/oferta",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const cases = casesList.map((c) => ({
    url: `${base}/cases/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const services = getAllServiceSlugs().map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const blog = blogList.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...cases, ...services, ...blog];
}
