import { ContactForm } from "@/components/blocks/ContactForm";
import { CaseCard } from "@/components/blocks/CaseCard";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { serviceSeoH1 } from "@/data/services";
import { getAllServiceSlugs, getCasesByServiceSlug, getService } from "@/lib/data";
import type { ServiceSlug } from "@/lib/types";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return { title: "Услуга" };
  const url = `${getSiteUrl()}/services/${s.slug}`;
  return {
    title: s.seoTitle,
    description: s.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: s.title,
      description: s.shortDescription,
      url,
      images: [{ url: s.heroImage.src, alt: s.heroImage.alt }],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) notFound();

  const related = await getCasesByServiceSlug(s.slug as ServiceSlug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: s.title, path: `/services/${s.slug}` },
        ]}
      />
      <header className="relative min-h-[70vh]">
        <Image
          src={s.heroImage.src}
          alt={s.heroImage.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/40" aria-hidden />
        <div className="absolute inset-0 flex items-end">
          <PageWrapper className="!pb-16 !pt-32">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
              {SITE_NAME}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold text-text-primary md:text-5xl">
              {serviceSeoH1[s.slug] ?? s.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-text-secondary">{s.shortDescription}</p>
          </PageWrapper>
        </div>
      </header>

      <PageWrapper>
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" aria-labelledby="includes">
          <h2 id="includes" className="sr-only">
            Что включает услуга
          </h2>
          {s.includes.map((block) => (
            <article key={block.title} className="border border-border bg-surface/50 p-6">
              <h3 className="font-display text-lg text-text-primary">{block.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{block.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-20" aria-labelledby="why">
          <h2 id="why" className="font-display text-2xl text-text-primary md:text-3xl">
            Почему «Закулисье»
          </h2>
          <ul className="mt-8 space-y-8">
            {s.whyUs.map((w) => (
              <li key={w.title} className="max-w-3xl border-l border-accent/40 pl-6">
                <h3 className="font-display text-lg text-text-primary">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{w.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 ? (
          <section className="mt-20" aria-labelledby="cases">
            <h2 id="cases" className="font-display text-2xl text-text-primary">
              Релевантные кейсы
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <li key={c.slug}>
                  <CaseCard item={c} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {s.quote ? (
          <figure className="mt-20 border border-border bg-elevated/40 p-8 md:p-10">
            <blockquote className="font-display text-lg leading-snug text-text-primary md:text-xl">
              «{s.quote.text}»
            </blockquote>
            <figcaption className="mt-6 text-sm text-text-secondary">
              {s.quote.author}
              {s.quote.position ? `, ${s.quote.position}` : ""}
              {s.quote.company ? ` · ${s.quote.company}` : ""}
            </figcaption>
          </figure>
        ) : null}

        <section className="mt-20" aria-labelledby="faq">
          <h2 id="faq" className="font-display text-2xl text-text-primary">
            Вопросы и ответы
          </h2>
          <div className="mt-8 divide-y divide-border border-t border-border">
            {s.faq.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="cursor-pointer list-none font-medium text-text-primary outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {item.question}
                    <span className="text-accent transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-secondary">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-20 border border-border bg-surface/60 p-8 md:p-10" aria-labelledby="lead">
          <h2 id="lead" className="font-display text-2xl text-text-primary">
            Обсудить проект
          </h2>
          <p className="mt-3 max-w-xl text-sm text-text-secondary">
            Оставьте заявку — мы свяжемся и предложим следующий шаг без навязанных брифов.
          </p>
          <div className="mt-8">
            <ContactForm idPrefix={`svc-${s.slug}`} />
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
