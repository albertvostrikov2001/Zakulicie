"use client";

import { CTALink } from "@/components/ui/CTALink";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface CTAStripProps {
  text?: string;
  /** "default" = bordered/minimal  |  "filled" = accent-background fill */
  variant?: "default" | "filled";
}

export function CTAStrip({
  text = "Готовы обсудить ваш проект?",
  variant = "default",
}: CTAStripProps) {
  const reduced = usePrefersReducedMotion();

  if (variant === "filled") {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-accent"
      >
        <div className="mx-auto flex max-w-content flex-col items-end gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p className="w-full text-right text-[15px] font-semibold text-[#0A0A0A] sm:text-left sm:text-[16px]">
            {text}
          </p>
          <CTALink
            className="inline-flex shrink-0 items-center justify-center border-[1.5px] border-[#0A0A0A] bg-transparent px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0A0A0A] transition-[background-color,color] duration-[250ms] ease-out hover:bg-[#0A0A0A] hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#0A0A0A]"
          >
            Обсудить проект
          </CTALink>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="border-y border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="mx-auto flex max-w-content flex-col items-end gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p className="w-full text-right text-[15px] font-medium text-text-secondary sm:text-left sm:text-[16px]">
          {text}
        </p>
        <CTALink
          className="inline-flex shrink-0 items-center justify-center border-[1.5px] border-accent bg-transparent px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-text-primary transition-[background-color,color] duration-[250ms] ease-out hover:bg-accent hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
        >
          Обсудить проект
        </CTALink>
      </div>
    </motion.div>
  );
}
