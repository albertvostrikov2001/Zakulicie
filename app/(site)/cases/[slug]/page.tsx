import { PageWrapper } from "@/components/layout/PageWrapper";
import { BreadcrumbJsonLd, EventCaseJsonLd } from "@/components/seo/JsonLd";
import { getAdjacentCases, getCaseBySlug } from "@/lib/data";
import { LEGACY_SLUG_REDIRECTS } from "@/lib/content/caseAssets";
import { caseImagePosition, CASE_HERO_OVERLAY } from "@/lib/caseImage";
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
  const legacy = Object.keys(LEGACY_SLUG_REDIRECTS);
  return [...cases.map((c) => ({ slug: c.slug })), ...legacy.map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseBySlug(slug);
  if (!c) return { title: "Кейс не найден" };
  const url = `${getSiteUrl()}/cases/${c.slug}`;
  const canonicalSlug = LEGACY_SLUG_REDIRECTS[slug];
  return {
    title: c.seoTitle,
    description: c.seoDescription,
    alternates: { canonical: canonicalSlug ? `${getSiteUrl()}/cases/${c.slug}` : url },
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
            alt={`${c.serviceTypeSlug ? tag : "Мероприятие"} ${c.title} — event-агентство Закулисье Новосибирск`}
            fill
            priority
            className="object-cover"
            style={caseImagePosition(c.heroImage)}
            sizes="100vw"
            placeholder={c.heroImage.blurDataURL ? "blur" : undefined}
            blurDataURL={c.heroImage.blurDataURL}
          />
          <div className="absolute inset-0 bg-black/15" style={{ mixBlendMode: "multiply" }} aria-hidden />
          <div
            className="absolute inset-0"
            style={{ background: CASE_HERO_OVERLAY }}
            aria-hidden
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
                {(c.participantsCount || c.scaleLabel) ? (
                  <div>
                    <dt className="text-text-muted">Масштаб</dt>
                    <dd className="mt-1 text-text-primary">
                      {c.participantsCount
                        ? `${c.participantsCount.toLocaleString("ru-RU")} участников${c.scaleLabel ? ` · ${c.scaleLabel}` : ""}`
                        : c.scaleLabel}
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
              Что было реализовано
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
            <section className="mt-20" aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className="font-display text-2xl text-text-primary">
                Фотографии с мероприятия
              </h2>
              {/* Первые 2 фото — широкий full-width блок */}
              {c.gallery.slice(0, 2).length > 0 && (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {c.gallery.slice(0, 2).map((img) => (
                    <div
                      key={img.src}
                      className="relative aspect-[16/10] overflow-hidden rounded-card"
                    >
                      <Image
                        src={img.src}
                        alt={`${c.title} — ${tag.toLowerCase()}, организация мероприятий Закулисье`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        placeholder={img.blurDataURL ? "blur" : undefined}
                        blurDataURL={img.blurDataURL}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Остальные фото — горизонтальный скролл-слайдер */}
              {c.gallery.length > 2 && (
                <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
                  {c.gallery.slice(2).map((img) => (
                    <div
                      key={img.src}
                      className="relative aspect-[4/3] w-[min(80vw,480px)] flex-shrink-0 snap-center overflow-hidden rounded-card md:w-auto"
                    >
                      <Image
                        src={img.src}
                        alt={`${c.title} — ${tag.toLowerCase()}, организация мероприятий Закулисье`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 80vw, 33vw"
                        placeholder={img.blurDataURL ? "blur" : undefined}
                        blurDataURL={img.blurDataURL}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

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

          <section className="mt-20 border-t border-border pt-10" aria-labelledby="other-cases-heading">
            <h2 id="other-cases-heading" className="font-display text-2xl text-text-primary">
              Другие кейсы агентства
            </h2>
            <nav className="mt-6 flex flex-wrap justify-between gap-6 text-sm">
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
          </section>

          <CaseEndCTA />
        </PageWrapper>
      </article>
    </>
  );
}
