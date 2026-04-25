"use client";

import { CaseCard } from "@/components/blocks/CaseCard";
import { CasesFilter } from "./CasesFilter";
import { serviceNav } from "@/lib/content/services";
import type { CaseStudy } from "@/lib/types";
import type { ServiceSlug } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

function isServiceSlug(v: string | null): v is ServiceSlug {
  return Boolean(v && serviceNav.some((s) => s.slug === v));
}

const filterOptions = [
  { slug: "all", title: "Все" },
  ...serviceNav.map((s) => ({ slug: s.slug, title: s.title })),
];

export function CasesListing({ all }: { all: CaseStudy[] }) {
  const searchParams = useSearchParams();
  const service = searchParams.get("service");
  const filter: ServiceSlug | "all" = isServiceSlug(service) ? service : "all";

  const filtered = useMemo(
    () => (filter === "all" ? all : all.filter((c) => c.serviceTypeSlug === filter)),
    [all, filter]
  );

  return (
    <>
      <CasesFilter options={filterOptions} active={filter} />
      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {filtered.map((c, i) => (
          <li key={c.slug}>
            <CaseCard item={c} priority={i < 2} index={i} />
          </li>
        ))}
      </ul>
    </>
  );
}
