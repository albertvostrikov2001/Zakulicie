export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) return url.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE_NAME = "Закулисье";
export const SITE_REGION = "Новосибирск, Сибирь";
export const DEFAULT_OG_IMAGE = "/og-default.jpg";
