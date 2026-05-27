"use client";

import {
  SCROLL_TO_CONTACT_KEY,
  scrollToContactForm,
} from "@/lib/contactFormNavigation";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

function isHomePath(pathname: string): boolean {
  return pathname === "/" || pathname === "";
}

export function useCTANavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navigateToForm = useCallback(() => {
    if (isHomePath(pathname)) {
      scrollToContactForm();
      return;
    }
    sessionStorage.setItem(SCROLL_TO_CONTACT_KEY, "1");
    router.push("/");
  }, [pathname, router]);

  return { navigateToForm };
}
