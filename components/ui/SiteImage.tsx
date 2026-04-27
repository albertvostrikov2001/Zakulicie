import NextImage, { type ImageProps } from "next/image";

function isRemoteString(src: ImageProps["src"]): boolean {
  return typeof src === "string" && (src.startsWith("https://") || src.startsWith("http://"));
}

/** next/image: для внешних URL задаётся referrerPolicy="no-referrer" (лучше с GitHub Pages / Sanity CDN). */
export default function SiteImage(props: ImageProps) {
  const { referrerPolicy, src, ...rest } = props;
  return (
    <NextImage
      {...rest}
      src={src}
      referrerPolicy={referrerPolicy ?? (isRemoteString(src) ? "no-referrer" : undefined)}
    />
  );
}
