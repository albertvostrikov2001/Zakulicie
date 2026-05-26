import type { SiteImage } from "@/lib/types";
import type { CSSProperties } from "react";

/** Premium card overlay — bottom gradient for case covers */
export const CASE_CARD_OVERLAY =
  "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)";

/** Hero overlay on case detail pages */
export const CASE_HERO_OVERLAY =
  "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%)";

export function caseImagePosition(img: SiteImage): CSSProperties | undefined {
  return img.objectPosition ? { objectPosition: img.objectPosition } : undefined;
}
