import { BlogArticleBody } from "@/components/blog/BlogArticleBody";
import { BlogArticleCTA } from "@/components/blog/BlogArticleCTA";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getBlogBySlug, getBlogPosts } from "@/lib/data";
import { resolvePublicPath } from "@/lib/publicPath";
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
  const ogImage = resolvePublicPath(p.coverImage.src);
  return {
    title: p.seoTitle,
    description: p.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: p.title,
      description: p.seoDescription,
      url,
      type: "article",
      images: [{ url: ogImage, alt: p.coverImage.alt }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const p = await getBlogBySlug(slug);
  if (!p) notFound();

  const url = `${getSiteUrl()}/blog/${p.slug}`;
  const ogImage = resolvePublicPath(p.coverImage.src);

  return (
    <>
      <ArticleJsonLd
        title={p.title}
        description={p.seoDescription}
        publishedAt={p.publishedAt}
        url={url}
        image={`${getSiteUrl()}${ogImage}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Блог", path: "/blog" },
          { name: p.title, path: `/blog/${p.slug}` },
        ]}
      />
      <article>
        <header className="relative aspect-[16/9] min-h-[280px] w-full md:min-h-[420px]">
          <Image
            src={p.coverImage.src}
            alt={p.coverImage.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.82)] via-[rgba(10,10,10,0.35)] to-transparent"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-content px-4 pb-10 md:px-8 md:pb-14">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">{p.category}</p>
            <h1 className="mt-3 max-w-4xl font-display text-3xl font-semibold text-text-primary md:text-4xl lg:text-5xl">
              {p.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <time dateTime={p.publishedAt}>
                {new Date(p.publishedAt).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden>·</span>
              <span>{p.readTime} чтения</span>
            </div>
          </div>
        </header>
        <PageWrapper>
          <p className="max-w-3xl text-lg leading-relaxed text-text-secondary">{p.excerpt}</p>
          <BlogArticleBody blocks={p.blocks} />
          <BlogArticleCTA />
        </PageWrapper>
      </article>
    </>
  );
}
