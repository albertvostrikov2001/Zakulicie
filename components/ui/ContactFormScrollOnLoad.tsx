"use client";

import {
  clearContactFormScrollIntent,
  shouldScrollToContactForm,
  waitForContactFormAndScroll,
} from "@/lib/contactFormNavigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ContactFormScrollOnLoad() {
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldScrollToContactForm()) return;

    clearContactFormScrollIntent();

    const cancel = waitForContactFormAndScroll("smooth", 50, 100);

    return cancel;
  }, [pathname]);

  return null;
}
