"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

export function CounterUp({ value, suffix = "", duration = 1.6, className }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px 20% 0px" });
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) return;
    if (!inView) return;
    const c = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => c.stop();
  }, [duration, inView, reduced, value]);

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}
