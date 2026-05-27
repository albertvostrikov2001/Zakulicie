"use client";

import {
  getContactFormHref,
  isHomePath,
  SCROLL_TO_CONTACT_KEY,
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

    sessionStorage.setItem(SCROLL_TO_CONTACT_KEY, "1");
    window.location.assign(getContactFormHref());
  }, [pathname]);

  return { navigateToForm };
}
