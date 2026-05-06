import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/constants";
import { serviceNav } from "@/lib/content/services";
import Link from "next/link";

const legal = [
  { href: "/privacy-policy", label: "Политика конфиденциальности" },
  { href: "/data-consent",   label: "Согласие на обработку данных" },
  { href: "/requisites",     label: "Реквизиты" },
  { href: "/oferta",         label: "Оферта" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      {/* CTA strip */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row md:px-8">
          <div>
            <p className="text-[16px] font-semibold text-text-primary">
              Готовы обсудить ваш проект?
            </p>
            <p className="mt-1 text-[13px] text-text-secondary">
              Свяжемся в течение нескольких часов.
            </p>
          </div>
          <a
            href="#contact-form"
            className="inline-flex shrink-0 items-center border-[1.5px] border-accent bg-transparent px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-text-primary transition-[background-color,color] duration-[250ms] ease-out hover:bg-accent hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
          >
            Обсудить проект
          </a>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="mx-auto max-w-content px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="font-display text-lg font-semibold text-text-primary">Закулисье</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
              Event-агентство
            </p>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-text-secondary">
              Агентство событий для компаний, где важны масштаб, дисциплина и репутация.
              Новосибирск — работа по Сибири и федеральным брифам.
            </p>
          </div>

          {/* Sections */}
          <div>
            <p className="caption-text">Разделы</p>
            <ul className="mt-4 space-y-2.5 text-[14px] text-text-secondary">
              {[
                { href: "/cases",   label: "Кейсы" },
                { href: "/about",   label: "О нас" },
                { href: "/clients", label: "Клиенты" },
                { href: "/blog",    label: "Блог" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="caption-text">Услуги</p>
            <ul className="mt-4 space-y-2.5 text-[14px] text-text-secondary">
              {serviceNav.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="transition-colors hover:text-text-primary">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <p className="caption-text">Связь</p>
            <ul className="mt-4 space-y-3 text-[14px]">
              <li>
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="text-text-secondary transition-colors hover:text-text-primary"
                  data-analytics="phone"
                >
                  {CONTACT_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-text-secondary transition-colors hover:text-text-primary"
                  data-analytics="email"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--color-border)] pt-8 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-text-muted">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-text-secondary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-[12px] text-text-muted">© {new Date().getFullYear()} Закулисье</p>
        </div>
      </div>
    </footer>
  );
}
