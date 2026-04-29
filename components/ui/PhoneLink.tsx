"use client";

import { CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "framer-motion";

type Props = {
  className?: string;
  /** Светлый hero: тёмный текст */
  variant?: "on-dark" | "on-light";
};

const charContainer = {
  rest: {},
  hover: {
    transition: { staggerChildren: 0.03, delayChildren: 0 },
  },
};

const charItem = (accent: string, muted: string, reduced: boolean) => ({
  rest: { color: muted, scale: 1 },
  hover: reduced
    ? { color: accent, scale: 1 }
    : { color: accent, scale: 1.01 },
});

export function PhoneLink({ className, variant = "on-dark" }: Props) {
  const reduced = usePrefersReducedMotion();
  const chars = CONTACT_PHONE.split("");
  const muted = variant === "on-light" ? "rgba(26,26,26,0.7)" : "rgba(255,255,255,0.7)";
  const accent = "var(--color-accent)";

  return (
    <motion.a
      href={`tel:${CONTACT_PHONE_TEL}`}
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={charContainer}
      className={cn(
        "inline-flex items-center text-[13px] font-normal tracking-[0.04em] transition-[transform] duration-200 ease-out",
        className
      )}
    >
      {chars.map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          variants={charItem(accent, muted, reduced)}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="inline-block"
        >
          {ch === " " ? "\u00a0" : ch}
        </motion.span>
      ))}
    </motion.a>
  );
}
