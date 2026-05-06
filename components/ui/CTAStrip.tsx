"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface CTAStripProps {
  text?: string;
}

export function CTAStrip({ text = "Готовы обсудить ваш проект?" }: CTAStripProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="border-y border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 px-4 py-7 sm:flex-row md:px-8">
        <p className="text-[15px] font-medium text-text-secondary sm:text-[16px]">
          {text}
        </p>
        <a
          href="#contact-form"
          className="inline-flex shrink-0 items-center border-[1.5px] border-accent bg-transparent px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-text-primary transition-[background-color,color] duration-[250ms] ease-out hover:bg-accent hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
        >
          Обсудить проект
        </a>
      </div>
    </motion.div>
  );
}
