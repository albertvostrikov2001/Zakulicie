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
      {/* mobile: 1 col; tablet md–lg‒: 2 col; desktop xl+: 3 col */}
      <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-7">
        {filtered.map((c, i) => (
          <li key={c.slug}>
            <CaseCard item={c} priority={i < 3} index={i} />
          </li>
        ))}
      </ul>
    </>
  );
}
