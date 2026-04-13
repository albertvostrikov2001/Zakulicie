"use client";

import { Badge } from "@/components/ui/Badge";
import type { CaseStudy } from "@/lib/types";
import { serviceNav } from "@/lib/content/services";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Props = { item: CaseStudy; className?: string; priority?: boolean };

export function CaseCard({ item, className, priority }: Props) {
  const tag = serviceNav.find((s) => s.slug === item.serviceTypeSlug)?.title ?? "";

  return (
    <Link href={`/cases/${item.slug}`} className={cn("group block", className)}>
      <motion.article
        className="relative aspect-[4/5] overflow-hidden rounded-card md:aspect-[16/10]"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={item.heroImage.src}
          alt={item.heroImage.alt}
          fill
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 50vw"
          priority={priority}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-90 transition group-hover:opacity-95"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <Badge className="mb-3 w-fit border-white/20 text-[10px] text-text-secondary">{tag}</Badge>
          <h3 className="font-display text-xl font-semibold text-text-primary md:text-2xl">
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-text-secondary">{item.client}</p>
          <p className="mt-3 line-clamp-2 text-sm text-text-secondary/90">{item.excerpt}</p>
          <span className="mt-5 inline-flex items-center text-xs font-medium uppercase tracking-widest text-accent opacity-0 transition group-hover:opacity-100">
            Смотреть кейс
          </span>
        </div>
      </motion.article>
    </Link>
  );
}
