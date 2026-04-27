export type ServiceSlug =
  | "korporativnye-meropriyatiya"
  | "timbilding"
  | "delovye-meropriyatiya"
  | "reklamnye-akcii"
  | "arenda-rekvizita"
  | "rezhissyorskie-meropriyatiya";

export type CaseStudy = {
  title: string;
  slug: string;
  client: string;
  serviceTypeSlug: ServiceSlug;
  year: number;
  participantsCount?: number;
  scaleLabel?: string;
  excerpt: string;
  task: string;
  solution: string[];
  result: string[];
  resultNumbers?: { label: string; value: string }[];
  heroImage: { src: string; alt: string };
  heroVideoUrl?: string;
  gallery: { src: string; alt: string }[];
  clientQuote?: {
    text: string;
    author: string;
    position: string;
    company: string;
  };
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
};

export type ServiceLanding = {
  slug: ServiceSlug;
  title: string;
  shortDescription: string;
  heroImage: { src: string; alt: string };
  includes: { title: string; description: string }[];
  whyUs: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
  quote?: {
    text: string;
    author: string;
    position: string;
    company: string;
  };
};

export type Testimonial = {
  id: string;
  text: string;
  author: string;
  position: string;
  company: string;
  relatedCaseSlug?: string;
  /** Опциональный логотип бренда */
  logoUrl?: string;
};

export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  coverImage: { src: string; alt: string };
  content: string[];
  seoTitle: string;
  seoDescription: string;
};

export type NavService = {
  title: string;
  href: string;
};
