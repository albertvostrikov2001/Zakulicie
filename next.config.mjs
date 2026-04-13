/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === "true";
const repoBase = "/Zakulicie";

const nextConfig = {
  ...(isGhPages
    ? {
        output: "export",
        basePath: repoBase,
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
