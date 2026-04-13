import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getBlogPosts } from "@/lib/data";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Блог — заметки о событиях и организации",
  description:
    "Материалы «Закулисье» о B2B-событиях, логистике крупных форматов, работе с площадками и собственным реквизитом.",
  alternates: { canonical: `${getSiteUrl()}/blog` },
  openGraph: {
    title: `Блог | ${SITE_NAME}`,
    url: `${getSiteUrl()}/blog`,
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Блог", path: "/blog" },
        ]}
      />
      <PageWrapper>
        <h1 className="font-display text-4xl font-semibold text-text-primary md:text-5xl">Блог</h1>
        <p className="mt-4 max-w-2xl text-text-secondary">
          Короткие текстовые разборы без «праздничного» тона — про процесс, ответственность и то, что
          видит руководство, когда открывает сайт агентства.
        </p>
        <ul className="mt-12 space-y-12">
          {posts.map((p) => (
            <li key={p.slug}>
              <article className="grid gap-6 border-t border-border pt-10 md:grid-cols-5 md:gap-10">
                <Link href={`/blog/${p.slug}`} className="relative aspect-[16/10] md:col-span-2">
                  <Image
                    src={p.coverImage.src}
                    alt={p.coverImage.alt}
                    fill
                    className="rounded-card object-cover"
                    sizes="(max-width:768px) 100vw, 40vw"
                  />
                </Link>
                <div className="md:col-span-3">
                  <time className="text-xs text-text-muted" dateTime={p.publishedAt}>
                    {new Date(p.publishedAt).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h2 className="mt-3 font-display text-2xl text-text-primary">
                    <Link href={`/blog/${p.slug}`} className="transition hover:text-accent">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-text-secondary">{p.excerpt}</p>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="mt-4 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
                  >
                    Читать
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </PageWrapper>
    </>
  );
}
