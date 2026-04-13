"use client";

import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/providers/ContactModalProvider";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Section } from "@/components/layout/Section";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/cn";
import type { CaseStudy } from "@/lib/types";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type Props = { story: CaseStudy };

export function CaseStorytelling({ story }: Props) {
  const ref = useRef(null);
  const mobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const { openContact } = useContactModal();

  return (
    <Section>
      <div ref={ref} className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
        <RevealOnScroll className="relative aspect-[4/5] overflow-hidden rounded-card lg:aspect-auto lg:min-h-[520px]">
          <motion.div
            style={{ y: mobile ? 0 : y }}
            className="relative h-full min-h-[400px] w-full lg:min-h-[520px]"
          >
            <Image
              src={story.heroImage.src}
              alt={story.heroImage.alt}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </motion.div>
        </RevealOnScroll>
        <div>
          <RevealOnScroll>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Разбор проекта
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-text-primary md:text-4xl">
              {story.title}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">{story.client}</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.08}>
            <p className="mt-6 text-sm leading-relaxed text-text-secondary md:text-base">
              {story.task}
            </p>
          </RevealOnScroll>
          {story.resultNumbers && story.resultNumbers.length > 0 && (
            <RevealOnScroll delay={0.12}>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-8">
                {story.resultNumbers.map((r) => (
                  <div key={r.label}>
                    <dt className="text-xs uppercase tracking-wider text-text-muted">{r.label}</dt>
                    <dd className="mt-1 font-display text-3xl text-text-primary">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </RevealOnScroll>
          )}
          <RevealOnScroll delay={0.16}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button type="button" onClick={openContact} className="uppercase tracking-widest">
                Обсудить похожий проект
              </Button>
              <Link
                href={`/cases/${story.slug}`}
                className={cn(
                  "inline-flex items-center justify-center rounded-card border border-border bg-transparent px-6 py-3 text-sm font-medium uppercase tracking-widest text-text-primary transition duration-base ease-base hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                )}
              >
                Открыть кейс
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </Section>
  );
}
