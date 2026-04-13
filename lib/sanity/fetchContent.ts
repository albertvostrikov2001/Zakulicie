import type { BlogPost, CaseStudy, Testimonial } from "@/lib/types";
import { getSanityClient } from "@/lib/sanity/client";
import {
  mapSanityBlogPost,
  mapSanityCase,
  mapSanityTestimonial,
} from "@/lib/sanity/mapDocuments";
import {
  blogBySlugQuery,
  blogPostsQuery,
  caseBySlugQuery,
  casesQuery,
  testimonialsQuery,
} from "@/lib/sanity/queries";

export async function fetchCasesFromSanity(): Promise<CaseStudy[] | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    const raw = await client.fetch<unknown[]>(casesQuery);
    if (!Array.isArray(raw) || raw.length === 0) return null;
    const mapped = raw
      .map((doc) => mapSanityCase(doc as Parameters<typeof mapSanityCase>[0]))
      .filter((c): c is CaseStudy => c !== null);
    return mapped.length > 0 ? mapped : null;
  } catch {
    return null;
  }
}

export async function fetchCaseBySlugFromSanity(slug: string): Promise<CaseStudy | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    const doc = await client.fetch<unknown | null>(caseBySlugQuery, { slug });
    if (!doc) return null;
    return mapSanityCase(doc as Parameters<typeof mapSanityCase>[0]);
  } catch {
    return null;
  }
}

export async function fetchBlogPostsFromSanity(): Promise<BlogPost[] | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    const raw = await client.fetch<unknown[]>(blogPostsQuery);
    if (!Array.isArray(raw) || raw.length === 0) return null;
    const mapped = raw
      .map((doc) => mapSanityBlogPost(doc as Parameters<typeof mapSanityBlogPost>[0]))
      .filter((p): p is BlogPost => p !== null);
    return mapped.length > 0 ? mapped : null;
  } catch {
    return null;
  }
}

export async function fetchBlogBySlugFromSanity(slug: string): Promise<BlogPost | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    const doc = await client.fetch<unknown | null>(blogBySlugQuery, { slug });
    if (!doc) return null;
    return mapSanityBlogPost(doc as Parameters<typeof mapSanityBlogPost>[0]);
  } catch {
    return null;
  }
}

export async function fetchTestimonialsFromSanity(): Promise<Testimonial[] | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    const raw = await client.fetch<unknown[]>(testimonialsQuery);
    if (!Array.isArray(raw) || raw.length === 0) return null;
    const mapped = raw
      .map((doc) => mapSanityTestimonial(doc as Parameters<typeof mapSanityTestimonial>[0]))
      .filter((t): t is Testimonial => t !== null);
    return mapped.length > 0 ? mapped : null;
  } catch {
    return null;
  }
}
