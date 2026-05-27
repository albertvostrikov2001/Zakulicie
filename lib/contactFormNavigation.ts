export const CONTACT_FORM_ID = "contact-form";
export const SCROLL_TO_CONTACT_KEY = "scrollToContact";
export const CONTACT_FORM_HEADER_OFFSET = 80;

type LenisLike = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; duration?: number; immediate?: boolean },
  ) => void;
};

declare global {
  interface Window {
    __zakulicieLenis?: LenisLike | null;
  }
}

export function getContactFormHref(): string {
  const base = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";
  return `${base}/#${CONTACT_FORM_ID}`;
}

export function isHomePath(pathname: string): boolean {
  if (pathname === "/" || pathname === "") return true;
  const base = (process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "").replace(/\/$/, "");
  if (!base) return false;
  return pathname === base || pathname === `${base}/`;
}

function getLenis(): LenisLike | null {
  if (typeof window === "undefined") return null;
  return window.__zakulicieLenis ?? null;
}

export function scrollToContactForm(behavior: ScrollBehavior = "smooth"): void {
  const el = document.getElementById(CONTACT_FORM_ID);
  if (!el) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, {
      offset: -CONTACT_FORM_HEADER_OFFSET,
      duration: behavior === "smooth" ? 1.15 : 0,
    });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - CONTACT_FORM_HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

export function waitForContactFormAndScroll(
  behavior: ScrollBehavior = "smooth",
  maxAttempts = 40,
  intervalMs = 100,
): () => void {
  let attempts = 0;
  let timer = 0;

  const tryScroll = () => {
    const el = document.getElementById(CONTACT_FORM_ID);
    if (el) {
      scrollToContactForm(behavior);
      return;
    }
    attempts += 1;
    if (attempts < maxAttempts) {
      timer = window.setTimeout(tryScroll, intervalMs);
    }
  };

  timer = window.setTimeout(tryScroll, 150);

  return () => window.clearTimeout(timer);
}

export function shouldScrollToContactForm(): boolean {
  if (typeof window === "undefined") return false;
  if (!isHomePath(window.location.pathname)) return false;
  if (window.location.hash === `#${CONTACT_FORM_ID}`) return true;
  return sessionStorage.getItem(SCROLL_TO_CONTACT_KEY) === "1";
}

export function clearContactFormScrollIntent(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SCROLL_TO_CONTACT_KEY);
  if (window.location.hash === `#${CONTACT_FORM_ID}`) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
}
