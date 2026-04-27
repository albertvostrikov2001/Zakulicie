"use client";

import { CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  className?: string;
  /** Тёмная тема: светлый текст с opacity */
  variant?: "on-dark" | "on-light";
};

export function PhoneLink({ className, variant = "on-dark" }: Props) {
  const reduced = usePrefersReducedMotion();
  const base =
    variant === "on-light"
      ? "text-text-dark/85 hover:text-text-dark"
      : "text-text-primary/90 hover:text-accent";

  return (
    <motion.div
      whileHover={reduced ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="inline-flex"
    >
      <Link
        href={`tel:${CONTACT_PHONE_TEL}`}
        className={cn(
          "text-[13px] font-medium tracking-wide transition-colors duration-200 ease-out md:text-sm",
          base,
          className
        )}
      >
        {CONTACT_PHONE}
      </Link>
    </motion.div>
  );
}
