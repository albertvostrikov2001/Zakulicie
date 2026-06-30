import type { BlogBlock } from "@/lib/types";
import Image from "@/components/ui/SiteImage";

export function BlogArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="mt-12 max-w-3xl space-y-6">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={idx}
                className="pt-4 font-display text-2xl font-semibold text-text-primary md:text-3xl"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={idx} className="pt-2 font-display text-xl font-medium text-text-primary">
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={idx} className="space-y-2 pl-5 font-body text-[15px] leading-[1.65] text-text-secondary">
                {block.items.map((item, i) => (
                  <li key={i} className="relative before:absolute before:-left-4 before:content-['—']">{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={idx} className="list-decimal space-y-2 pl-5 font-body text-[15px] leading-[1.65] text-text-secondary">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            );
          case "img":
            return (
              <figure key={idx} className="relative my-8 aspect-[16/9] overflow-hidden rounded-card">
                <Image
                  src={block.src}
                  alt={block.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </figure>
            );
          default:
            return (
              <p key={idx} className="font-body text-[15px] leading-[1.65] text-text-secondary">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
