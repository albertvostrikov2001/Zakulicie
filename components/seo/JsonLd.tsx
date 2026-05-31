import { getSiteUrl, SITE_NAME, SITE_REGION } from "@/lib/site";
import {
  CONTACT_PHONE_TEL,
  CONTACT_EMAIL,
  CONTACT_CITY,
  CONTACT_STREET,
  CONTACT_POSTAL_CODE,
} from "@/lib/constants";
import type { CaseStudy } from "@/lib/types";

const BASE = getSiteUrl();

/* ─── Organization ─────────────────────────────────────────── */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE,
    logo: {
      "@type": "ImageObject",
      url: `${BASE}/services/korporativnye-meropriyatiya.webp`,
    },
    foundingDate: "2004",
    areaServed: SITE_REGION,
    telephone: `+${CONTACT_PHONE_TEL}`,
    email: CONTACT_EMAIL,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${CONTACT_PHONE_TEL}`,
      contactType: "sales",
      availableLanguage: "Russian",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── LocalBusiness ────────────────────────────────────────── */
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: BASE,
    telephone: `+${CONTACT_PHONE_TEL}`,
    email: CONTACT_EMAIL,
    image: `${BASE}/services/korporativnye-meropriyatiya.webp`,
    priceRange: "₽₽₽",
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT_STREET,
      addressLocality: CONTACT_CITY,
      postalCode: CONTACT_POSTAL_CODE,
      addressRegion: "Новосибирская область",
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 54.9884,
      longitude: 82.9023,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "4",
      bestRating: "5",
      worstRating: "1",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── FAQPage ──────────────────────────────────────────────── */
export function FaqPageJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── Case study (Article) ─────────────────────────────────── */
export function EventCaseJsonLd({ c }: { c: CaseStudy }) {
  const url = `${BASE}/cases/${c.slug}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    description: c.excerpt,
    datePublished: `${c.year}-01-01`,
    image: c.heroImage.src.startsWith("http")
      ? c.heroImage.src
      : `${BASE}${c.heroImage.src}`,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: url,
    url,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── Breadcrumb ───────────────────────────────────────────── */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${BASE}${it.path}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── Article (blog) ───────────────────────────────────────── */
export function ArticleJsonLd({
  title,
  description,
  publishedAt,
  url,
  image,
}: {
  title: string;
  description: string;
  publishedAt: string;
  url: string;
  image: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    datePublished: publishedAt,
    description,
    mainEntityOfPage: url,
    image,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
