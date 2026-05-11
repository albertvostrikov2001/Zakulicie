import NextImage, { type ImageProps } from "next/image";

function isRemoteString(src: ImageProps["src"]): boolean {
  return typeof src === "string" && (src.startsWith("https://") || src.startsWith("http://"));
}

/**
 * Возвращает src с учётом basePath для GitHub Pages static export.
 * При unoptimized:true Next.js Image не всегда добавляет basePath автоматически,
 * поэтому добавляем вручную через NEXT_PUBLIC_PAGES_BASE_PATH.
 */
function resolveSrc(src: ImageProps["src"]): ImageProps["src"] {
  const base = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";
  if (!base || typeof src !== "string") return src;
  if (isRemoteString(src)) return src;
  if (src.startsWith(base + "/") || src.startsWith(base + "?")) return src;
  return base + src;
}

/** next/image: для внешних URL задаётся referrerPolicy="no-referrer" (лучше с GitHub Pages / Sanity CDN). */
export default function SiteImage(props: ImageProps) {
  const { referrerPolicy, src, ...rest } = props;
  const resolvedSrc = resolveSrc(src);
  return (
    <NextImage
      {...rest}
      src={resolvedSrc}
      referrerPolicy={referrerPolicy ?? (isRemoteString(src) ? "no-referrer" : undefined)}
    />
  );
}
