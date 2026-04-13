/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === "true";
/** Имя репозитория GitHub Pages: задайте NEXT_PUBLIC_PAGES_BASE_PATH=/MyRepo или в CI через workflow. */
const pagesBase = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || "/Zakulicie";

const nextConfig = {
  ...(isGhPages
    ? {
        output: "export",
        basePath: pagesBase,
        assetPrefix: pagesBase,
        trailingSlash: true,
      }
    : {}),
  images: {
    unoptimized: isGhPages,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    formats: isGhPages ? undefined : ["image/avif", "image/webp"],
  },
};

export default nextConfig;
