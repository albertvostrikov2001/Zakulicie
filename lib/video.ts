/** Showreel assets in public/video/ (see scripts/encode-showreel.mjs) */
export const SHOWREEL_VIDEO = "/video/showreel.mp4";
export const SHOWREEL_VIDEO_MOBILE = "/video/showreel-mobile.mp4";
export const SHOWREEL_POSTER = "/video/showreel-poster.webp";

/** Env override for CDN/external hosting; otherwise bundled static files. */
export function getShowreelVideoUrl(isMobile = false): string | undefined {
  const override = process.env.NEXT_PUBLIC_SHOWREEL_VIDEO_URL?.trim();
  if (override) return override;
  return isMobile ? SHOWREEL_VIDEO_MOBILE : SHOWREEL_VIDEO;
}

export function getHeroVideoUrl(): string | undefined {
  const override = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim();
  if (override) return override;
  return SHOWREEL_VIDEO;
}
