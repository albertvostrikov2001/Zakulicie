export type ServiceSlug =
  | "korporativnye-meropriyatiya"
  | "timbilding"
  | "delovye-meropriyatiya"
  | "reklamnye-akcii"
  | "arenda-rekvizita";

export type SiteImage = {
  src: string;
  alt: string;
  blurDataURL?: string;
  width?: number;
  height?: number;
  /** CSS object-position for cover cropping */
  objectPosition?: string;
};

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
  heroImage: SiteImage;
  heroVideoUrl?: string;
  gallery: SiteImage[];
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
  heroImage: SiteImage;
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
  logoUrl?: string;
  caseCover?: string;
  source?: "2gis" | "site";
  avatar?: string;
};

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "img"; src: string; alt: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  readTime: string;
  coverImage: SiteImage;
  blocks: BlogBlock[];
  seoTitle: string;
  seoDescription: string;
};

export type NavService = {
  title: string;
  href: string;
};
