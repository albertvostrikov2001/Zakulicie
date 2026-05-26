import NextImage, { type ImageProps } from "next/image";
import { resolvePublicPath } from "@/lib/publicPath";

function isRemoteString(src: ImageProps["src"]): boolean {
  return typeof src === "string" && (src.startsWith("https://") || src.startsWith("http://"));
}

/** next/image: для внешних URL задаётся referrerPolicy="no-referrer" (лучше с GitHub Pages / Sanity CDN). */
export default function SiteImage(props: ImageProps) {
  const { referrerPolicy, src, ...rest } = props;
  const resolvedSrc =
    typeof src === "string" && !isRemoteString(src) ? resolvePublicPath(src) : src;
  return (
    <NextImage
      {...rest}
      src={resolvedSrc}
      referrerPolicy={referrerPolicy ?? (isRemoteString(src) ? "no-referrer" : undefined)}
    />
  );
}
