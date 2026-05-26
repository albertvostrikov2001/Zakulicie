/** Prepends NEXT_PUBLIC_PAGES_BASE_PATH for static assets on GitHub Pages. */
export function resolvePublicPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";
  if (!base || path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith(`${base}/`) || path.startsWith(`${base}?`)) return path;
  return base + (path.startsWith("/") ? path : `/${path}`);
}
