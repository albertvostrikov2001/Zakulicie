import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/constants";
import { serviceNav } from "@/lib/content/services";
import Link from "next/link";

const legal = [
  { href: "/privacy-policy", label: "Политика конфиденциальности" },
  { href: "/data-consent", label: "Согласие на обработку данных" },
  { href: "/requisites", label: "Реквизиты" },
  { href: "/oferta", label: "Оферта" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-content px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-semibold text-text-primary">Закулисье</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-accent">
              Event-агентство
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              Агентство событий для компаний, где важны масштаб, дисциплина и репутация. Новосибирск,
              работа по Сибири и федеральным брифам.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-text-muted">Разделы</p>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary">
              <li>
                <Link href="/cases" className="transition hover:text-text-primary">
                  Кейсы
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-text-primary">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/clients" className="transition hover:text-text-primary">
                  Клиенты
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition hover:text-text-primary">
                  Блог
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-text-muted">Услуги</p>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary">
              {serviceNav.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="transition hover:text-text-primary">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-text-muted">Связь</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="text-text-secondary transition hover:text-text-primary"
                  data-analytics="phone"
                >
                  {CONTACT_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-text-secondary transition hover:text-text-primary"
                  data-analytics="email"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-muted">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-text-secondary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-text-muted">© {new Date().getFullYear()} Закулисье</p>
        </div>
      </div>
    </footer>
  );
}
