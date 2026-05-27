export const CONTACT_FORM_ID = "contact-form";
export const SCROLL_TO_CONTACT_KEY = "scrollToContact";
export const CONTACT_FORM_HEADER_OFFSET = 80;

export function getContactFormHref(): string {
  const base = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";
  return `${base}/#${CONTACT_FORM_ID}`;
}

export function scrollToContactForm(behavior: ScrollBehavior = "smooth"): void {
  const el = document.getElementById(CONTACT_FORM_ID);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - CONTACT_FORM_HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
}
