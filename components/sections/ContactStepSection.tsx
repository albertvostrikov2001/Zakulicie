"use client";

import { useEffect, useState } from "react";
import { ContactSection } from "@/components/sections/ContactSection";
import { ContactStepForm } from "@/components/forms/ContactStepForm";

/**
 * Desktop → ContactSection (two-column form + trust block)
 * Mobile  → ContactStepForm (conversational step-by-step)
 */
export function ContactStepSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setMounted(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* SSR / pre-hydration: always render the desktop version to avoid mismatch */
  if (!mounted) return <ContactSection />;

  return isMobile ? <ContactStepForm /> : <ContactSection />;
}
