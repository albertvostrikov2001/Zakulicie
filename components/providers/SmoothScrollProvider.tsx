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

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.45,
    });

    lenisRef.current = lenis;

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onLenisScroll);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tickerFn);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenisRef.current}>{children}</LenisContext.Provider>;
}
