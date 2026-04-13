import type { BlogPost, CaseStudy, ServiceSlug, Testimonial } from "@/lib/types";
import { blocksToParagraphs } from "@/lib/sanity/portableText";
import { urlForSanityImage } from "@/lib/sanity/image";

const SERVICE_SLUGS: ServiceSlug[] = [
  "korporativnye-meropriyatiya",
  "timbilding",
  "delovye-meropriyatiya",
  "reklamnye-akcii",
  "arenda-rekvizita",
  "rezhissyorskie-meropriyatiya",
];

function asServiceSlug(v: string | null | undefined): ServiceSlug {
  if (v && SERVICE_SLUGS.includes(v as ServiceSlug)) return v as ServiceSlug;
  return "delovye-meropriyatiya";
}

type SanityCaseDoc = {
  title?: string;
  slug?: string;
  client?: string;
  serviceTypeSlug?: string;
  year?: number;
  participantsCount?: number;
  scaleLabel?: string;
  excerpt?: string;
  task?: string;
  solution?: unknown;
  result?: unknown;
  resultNumbers?: { label?: string; value?: string }[];
  heroImage?: { asset?: unknown };
  heroVideo?: string;
  gallery?: { asset?: unknown; alt?: string }[];
  clientQuote?: {
    text?: string;
    author?: string;
    position?: string;
    company?: string;
  };
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export function mapSanityCase(doc: SanityCaseDoc): CaseStudy | null {
  if (!doc.slug || !doc.title) return null;
  const heroUrl = urlForSanityImage(doc.heroImage);
  if (!heroUrl) return null;

  let solution = blocksToParagraphs(doc.solution as Parameters<typeof blocksToParagraphs>[0]);
  let result = blocksToParagraphs(doc.result as Parameters<typeof blocksToParagraphs>[0]);
  if (solution.length === 0 && doc.task) solution = [doc.task];
  if (result.length === 0) result = ["Итог согласован с заказчиком и зафиксирован по завершении проекта."];
  if (solution.length === 0) return null;

  const gallery =
    doc.gallery
      ?.map((img) => {
        const src = urlForSanityImage(img);
        if (!src) return null;
        return { src, alt: img.alt || "" };
      })
      .filter((x): x is { src: string; alt: string } => x !== null) ?? [];

  return {
    title: doc.title,
    slug: doc.slug,
    client: doc.client ?? "",
    serviceTypeSlug: asServiceSlug(doc.serviceTypeSlug),
    year: doc.year ?? new Date().getFullYear(),
    participantsCount: doc.participantsCount,
    scaleLabel: doc.scaleLabel,
    excerpt: doc.excerpt ?? doc.title,
    task: doc.task ?? "",
    solution,
    result,
    resultNumbers: doc.resultNumbers
      ?.filter((r) => r.label && r.value)
      .map((r) => ({ label: r.label!, value: r.value! })),
    heroImage: { src: heroUrl, alt: doc.title },
    heroVideoUrl: doc.heroVideo,
    gallery,
    clientQuote:
      doc.clientQuote?.text && doc.clientQuote.author
        ? {
            text: doc.clientQuote.text,
            author: doc.clientQuote.author,
            position: doc.clientQuote.position ?? "",
            company: doc.clientQuote.company ?? "",
          }
        : undefined,
    isFeatured: Boolean(doc.isFeatured),
    seoTitle: doc.seoTitle ?? `${doc.title} | Закулисье`,
    seoDescription: doc.seoDescription ?? doc.excerpt ?? doc.title,
  };
}

type SanityBlogDoc = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: unknown;
  coverImage?: { asset?: unknown };
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export function mapSanityBlogPost(doc: SanityBlogDoc): BlogPost | null {
  if (!doc.slug || !doc.title) return null;
  const cover = urlForSanityImage(doc.coverImage);
  if (!cover) return null;
  let content = blocksToParagraphs(doc.content as Parameters<typeof blocksToParagraphs>[0]);
  if (content.length === 0) content = [doc.excerpt ?? doc.title];
  const publishedAt = doc.publishedAt
    ? new Date(doc.publishedAt).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return {
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt ?? doc.title,
    publishedAt,
    coverImage: { src: cover, alt: doc.title },
    content,
    seoTitle: doc.seoTitle ?? doc.title,
    seoDescription: doc.seoDescription ?? doc.excerpt ?? doc.title,
  };
}

type SanityTestimonialDoc = {
  _id?: string;
  text?: unknown;
  author?: string;
  position?: string;
  company?: string;
  relatedCaseSlug?: string;
};

export function mapSanityTestimonial(doc: SanityTestimonialDoc): Testimonial | null {
  const text = blocksToPlainTextFromBlocks(doc.text);
  if (!text || !doc.author) return null;
  return {
    id: doc._id ?? doc.author,
    text,
    author: doc.author,
    position: doc.position ?? "",
    company: doc.company ?? "",
    relatedCaseSlug: doc.relatedCaseSlug,
  };
}

function blocksToPlainTextFromBlocks(text: unknown): string {
  if (typeof text === "string") return text.trim();
  const paras = blocksToParagraphs(text as Parameters<typeof blocksToParagraphs>[0]);
  return paras.join(" ").trim();
}
