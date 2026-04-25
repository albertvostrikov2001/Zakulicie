"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
  splitBy?: "word" | "char";
};

export function StaggerText({
  text,
  as: Tag = "h1",
  className,
  delay = 0,
  staggerDelay = 0.06,
  once = true,
  splitBy = "word",
}: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-8% 0px" });
  const reduced = usePrefersReducedMotion();

  const items = splitBy === "word"
    ? text.split(" ").map((w, i, arr) => (i < arr.length - 1 ? w + "\u00A0" : w))
    : text.split("");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag ref={ref} className={cn("overflow-hidden", className)}>
      {items.map((item, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "110%", opacity: 0 }}
          animate={inView ? { y: "0%", opacity: 1 } : {}}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
            delay: delay + i * staggerDelay,
          }}
        >
          {item}
        </motion.span>
      ))}
    </Tag>
  );
}
