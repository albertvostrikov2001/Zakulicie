"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis + ScrollTrigger: обновление ST на событии scroll Lenis.
 * rAF вызывает lenis.raf(time) с timestamp в мс (как requestAnimationFrame) — без привязки к gsap.ticker,
 * чтобы не конфликтовать с GSAP-анимациями и Framer Motion.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onLenisScroll);

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      lenisRef.current = null;
      /* Не вызываем ScrollTrigger.getAll().kill() — это ломает все useGSAP в дочерних
       * компонентах (и при React Strict Mode двойной mount). Очистка — через ctx.revert() в компонентах. */
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenisRef.current}>{children}</LenisContext.Provider>;
}
