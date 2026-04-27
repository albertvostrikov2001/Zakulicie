import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getBlogBySlug, getBlogPosts } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";
import Image from "@/components/ui/SiteImage";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getBlogBySlug(slug);
  if (!p) return { title: "Статья" };
  const url = `${getSiteUrl()}/blog/${p.slug}`;
  return {
    title: p.seoTitle,
    description: p.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: p.title,
      description: p.excerpt,
      url,
      images: [{ url: p.coverImage.src, alt: p.coverImage.alt }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const p = await getBlogBySlug(slug);
  if (!p) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Блог", path: "/blog" },
          { name: p.title, path: `/blog/${p.slug}` },
        ]}
      />
      <article>
        <header className="relative aspect-[21/9] min-h-[240px] w-full md:min-h-[360px]">
          <Image
            src={p.coverImage.src}
            alt={p.coverImage.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-bg/50" aria-hidden />
        </header>
        <PageWrapper>
          <time className="text-xs text-text-muted" dateTime={p.publishedAt}>
            {new Date(p.publishedAt).toLocaleDateString("ru-RU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="mt-4 max-w-4xl font-display text-3xl font-semibold text-text-primary md:text-4xl lg:text-5xl">
            {p.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-secondary">{p.excerpt}</p>
          <div className="mt-12 max-w-3xl space-y-6">
            {p.content.map((para, idx) => (
              <p key={idx} className="leading-relaxed text-text-secondary">
                {para}
              </p>
            ))}
          </div>
        </PageWrapper>
      </article>
    </>
  );
}
