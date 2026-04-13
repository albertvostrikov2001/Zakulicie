import createImageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const builder =
  projectId && projectId !== "placeholder"
    ? createImageUrlBuilder({ projectId, dataset })
    : null;

/** Изображение из Sanity (image field с asset). */
export function urlForSanityImage(
  source: { asset?: unknown } | null | undefined,
  width = 2000
): string | null {
  if (!source?.asset || !builder) return null;
  return builder.image(source as Parameters<typeof builder.image>[0]).width(width).auto("format").quality(85).url();
}
