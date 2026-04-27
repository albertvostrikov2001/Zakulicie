import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd, EventCaseJsonLd } from "@/components/seo/JsonLd";
import { getAdjacentCases, getCaseBySlug } from "@/lib/data";
import { serviceNav } from "@/lib/content/services";
import { getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";
import Image from "@/components/ui/SiteImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseEndCTA } from "./CaseEndCTA";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { getCasesResolved } = await import("@/lib/data");
  const cases = await getCasesResolved();
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseBySlug(slug);
  if (!c) return { title: "Кейс не найден" };
  const url = `${getSiteUrl()}/cases/${c.slug}`;
  return {
    title: c.seoTitle,
    description: c.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: c.title,
      description: c.excerpt,
      url,
      images: [{ url: c.heroImage.src, alt: c.heroImage.alt }],
    },
  };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const c = await getCaseBySlug(slug);
  if (!c) notFound();

  const tag = serviceNav.find((s) => s.slug === c.serviceTypeSlug)?.title ?? "";
  const { prev, next } = await getAdjacentCases(slug);

  return (
    <>
      <EventCaseJsonLd c={c} />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Кейсы", path: "/cases" },
          { name: c.title, path: `/cases/${c.slug}` },
        ]}
      />
      <article>
        <header className="relative min-h-[80vh]">
          <Image
            src={c.heroImage.src}
            alt={c.heroImage.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" aria-hidden />
          <div className="absolute inset-0 flex flex-col justify-end pb-16 pt-32">
            <PageWrapper className="!pb-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">{tag}</p>
              <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold text-text-primary md:text-5xl lg:text-6xl">
                {c.title}
              </h1>
              <dl className="mt-8 flex flex-wrap gap-6 text-sm text-text-secondary">
                <div>
                  <dt className="text-text-muted">Клиент</dt>
                  <dd className="mt-1 text-text-primary">{c.client}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Год</dt>
                  <dd className="mt-1 text-text-primary">{c.year}</dd>
                </div>
                {c.participantsCount ? (
                  <div>
                    <dt className="text-text-muted">Масштаб</dt>
                    <dd className="mt-1 text-text-primary">
                      {c.participantsCount.toLocaleString("ru-RU")} участников
                      {c.scaleLabel ? ` · ${c.scaleLabel}` : ""}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </PageWrapper>
          </div>
        </header>

        <PageWrapper className="!pt-16">
          <section aria-labelledby="task-heading">
            <h2 id="task-heading" className="font-display text-2xl text-text-primary">
              Задача
            </h2>
            <p className="mt-4 max-w-3xl text-text-secondary leading-relaxed">{c.task}</p>
          </section>

          <section className="mt-16" aria-labelledby="sol-heading">
            <h2 id="sol-heading" className="font-display text-2xl text-text-primary">
              Решение
            </h2>
            <ul className="mt-6 max-w-3xl space-y-4 text-text-secondary">
              {c.solution.map((para, idx) => (
                <li key={idx} className="border-l border-border pl-6 leading-relaxed">
                  {para}
                </li>
              ))}
            </ul>
          </section>

          {c.gallery.length > 0 ? (
            <section className="mt-20" aria-label="Галерея">
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:max-w-full md:grid-cols-2 md:overflow-visible">
                {c.gallery.map((img) => (
                  <div
                    key={img.src}
                    className="relative aspect-[16/10] w-[min(100%,85vw)] flex-shrink-0 snap-center overflow-hidden rounded-card md:w-auto"
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width:768px) 85vw, 50vw" />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section
            className="mt-20 rounded-card border border-accent/25 bg-surface/80 p-8 md:p-12"
            aria-labelledby="res-heading"
          >
            <h2 id="res-heading" className="font-display text-2xl text-text-primary">
              Результат
            </h2>
            <ul className="mt-6 max-w-3xl space-y-4 text-text-secondary">
              {c.result.map((para, idx) => (
                <li key={idx} className="leading-relaxed">
                  {para}
                </li>
              ))}
            </ul>
            {c.resultNumbers && c.resultNumbers.length > 0 ? (
              <dl className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3">
                {c.resultNumbers.map((r) => (
                  <div key={r.label}>
                    <dt className="text-xs uppercase tracking-wider text-text-muted">{r.label}</dt>
                    <dd className="mt-2 font-display text-3xl text-accent">{r.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </section>

          {c.clientQuote ? (
            <figure className="mt-20 border-l-2 border-accent pl-8">
              <blockquote className="font-display text-xl leading-snug text-text-primary md:text-2xl">
                «{c.clientQuote.text}»
              </blockquote>
              <figcaption className="mt-6 text-sm text-text-secondary">
                {c.clientQuote.author}
                {c.clientQuote.position ? `, ${c.clientQuote.position}` : ""}
                {c.clientQuote.company ? ` · ${c.clientQuote.company}` : ""}
              </figcaption>
            </figure>
          ) : null}

          <nav className="mt-20 flex flex-wrap justify-between gap-6 border-t border-border pt-10 text-sm">
            {prev ? (
              <Link href={`/cases/${prev.slug}`} className="text-text-secondary hover:text-accent">
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/cases/${next.slug}`} className="text-text-secondary hover:text-accent">
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </nav>

          <CaseEndCTA />
        </PageWrapper>
      </article>
    </>
  );
}
