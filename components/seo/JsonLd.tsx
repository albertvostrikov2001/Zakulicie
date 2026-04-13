import { getSiteUrl, SITE_NAME, SITE_REGION } from "@/lib/site";
import type { CaseStudy } from "@/lib/types";

export function OrganizationJsonLd() {
  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url,
    areaServed: SITE_REGION,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Новосибирск",
      addressCountry: "RU",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function EventCaseJsonLd({ c }: { c: CaseStudy }) {
  const url = `${getSiteUrl()}/cases/${c.slug}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: c.title,
    description: c.excerpt,
    startDate: `${c.year}-01-01`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: c.client },
    organizer: { "@type": "Organization", name: SITE_NAME },
    url,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  const base = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${base}${it.path}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
