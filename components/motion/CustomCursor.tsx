"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type CursorState = "default" | "case" | "link";

export function CustomCursor() {
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 300, damping: 28 });
  const sy = useSpring(y, { stiffness: 300, damping: 28 });
  const [state, setState] = useState<CursorState>("default");

  useEffect(() => {
    if (mobile || reduced) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor='case']")) {
        setState("case");
      } else if (target.closest("a, button, [role='button']")) {
        setState("link");
      } else {
        setState("default");
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", handleOver);
    document.body.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", handleOver);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [mobile, reduced, x, y]);

  if (mobile || reduced) return null;

  const isCase = state === "case";
  const isLink = state === "link";

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[200] flex items-center justify-center"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      aria-hidden
    >
      <motion.div
        className="rounded-full border border-white/60 bg-white/10 backdrop-blur-sm flex items-center justify-center"
        animate={{
          width: isCase ? 72 : isLink ? 32 : 12,
          height: isCase ? 72 : isLink ? 32 : 12,
          backgroundColor: isCase ? "rgba(201,168,76,0.15)" : isLink ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.9)",
          borderColor: isCase ? "rgba(201,168,76,0.6)" : "rgba(255,255,255,0.5)",
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {isCase && (
          <motion.span
            className="select-none text-[10px] font-medium uppercase tracking-widest text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            Смотреть
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
