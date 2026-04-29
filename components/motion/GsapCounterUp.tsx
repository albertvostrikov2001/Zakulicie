"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

type Props = {
  value: number;
  suffix?: string;
  className?: string;
};

export function GsapCounterUp({ value, suffix = "", className }: Props) {
  const elRef = useRef<HTMLSpanElement>(null);
  const valRef = useRef({ n: 0 });
  const reduced = usePrefersReducedMotion();
  const [text, setText] = useState(() => (reduced ? value : 0));

  useGSAP(
    () => {
      if (reduced) return;
      const el = elRef.current;
      if (!el) return;
      valRef.current.n = 0;
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          once: true,
          onEnter: () => {
            const v = valRef.current;
            v.n = 0;
            gsap.to(v, {
              n: value,
              duration: 1.8,
              ease: "power2.out",
              snap: { n: 1 },
              onUpdate: () => setText(Math.round(v.n)),
            });
          },
        });
      });
      return () => ctx.revert();
    },
    { dependencies: [value, reduced] }
  );

  return (
    <span ref={elRef} className={className}>
      {text.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}
