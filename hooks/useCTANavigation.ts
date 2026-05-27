"use client";

import {
  getContactFormHref,
  isHomePath,
  waitForContactFormAndScroll,
} from "@/lib/contactFormNavigation";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

export function useCTANavigation() {
  const pathname = usePathname();

  const navigateToForm = useCallback(() => {
    if (isHomePath(pathname)) {
      waitForContactFormAndScroll();
      return;
    }

    window.location.assign(getContactFormHref());
  }, [pathname]);

  return { navigateToForm };
}
