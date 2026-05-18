/** @type {import('next').NextConfig} */
const isGhPages =
  process.env.GITHUB_PAGES === "true" && process.env.VERCEL !== "1";

/**
 * Публичный префикс пути для static export (GitHub Pages).
 * В CI: /имя-репозитория для https://user.github.io/repo/
 * Пустая строка: ассеты с корня домена (кастомный домен у project Pages).
 * Не используйте "" и вместе с github.io/repo — будет конфликт.
 */
function resolvePagesBasePath() {
  const raw = process.env.NEXT_PUBLIC_PAGES_BASE_PATH;
  if (raw === "") return undefined;
  if (raw != null && String(raw).trim() !== "") {
    const t = String(raw).trim();
    if (t === "/") return undefined;
    return t.startsWith("/") ? t : `/${t}`;
  }
  if (isGhPages) return "/Zakulicie";
  return undefined;
}

const pagesBase = resolvePagesBasePath();

const nextConfig = {
  ...(isGhPages
    ? {
        output: "export",
        trailingSlash: true,
        ...(pagesBase ? { basePath: pagesBase, assetPrefix: pagesBase } : {}),
      }
    : {}),
  images: {
    unoptimized: isGhPages,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
      {
        protocol: "https",
        hostname: "albertvostrikov2001.github.io",
        pathname: "/Zakulicie/**",
      },
    ],
    formats: isGhPages ? undefined : ["image/avif", "image/webp"],
  },
};

export default nextConfig;
