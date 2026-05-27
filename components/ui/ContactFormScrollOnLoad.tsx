"use client";

import {
  SCROLL_TO_CONTACT_KEY,
  scrollToContactForm,
} from "@/lib/contactFormNavigation";
import { useEffect } from "react";

export function ContactFormScrollOnLoad() {
  useEffect(() => {
    if (sessionStorage.getItem(SCROLL_TO_CONTACT_KEY) !== "1") return;
    sessionStorage.removeItem(SCROLL_TO_CONTACT_KEY);

    const timer = window.setTimeout(() => {
      scrollToContactForm();
    }, 300);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
