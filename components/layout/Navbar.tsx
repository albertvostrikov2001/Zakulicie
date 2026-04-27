"use client";

import { serviceNav } from "@/lib/content/services";
import { cn } from "@/lib/cn";
import { useContactModal } from "@/components/providers/ContactModalProvider";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { openContact } = useContactModal();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lightHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const onServicesEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const onServicesLeave = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 160);
  };

  const linkClass = cn(
    "text-sm transition",
    lightHero ? "text-text-dark/80 hover:text-text-dark" : "text-text-secondary hover:text-text-primary",
    !lightHero && "text-text-secondary"
  );

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const activeClass = lightHero ? "text-text-dark" : "text-text-primary";

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-[100] transition-all duration-500",
          scrolled
            ? "border-b border-border bg-bg/85 shadow-lg shadow-black/10 backdrop-blur-[12px]"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link
            href="/"
            className={cn(
              "font-display text-base font-semibold tracking-tight md:text-lg",
              lightHero ? "text-text-dark" : "text-text-primary"
            )}
          >
            Закулисье
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Основная навигация">
            <Link href="/cases" className={cn(linkClass, isActive("/cases") && activeClass)}>
              Кейсы
            </Link>

            <div
              className="relative"
              onMouseEnter={onServicesEnter}
              onMouseLeave={onServicesLeave}
            >
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 text-sm transition",
                  lightHero ? "text-text-dark/80 hover:text-text-dark" : "text-text-secondary hover:text-text-primary"
                )}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                onClick={() => setServicesOpen((v) => !v)}
              >
                Услуги
                <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
              </button>
              {servicesOpen && (
                <div
                  role="menu"
                  className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 border border-border bg-elevated py-2 shadow-xl"
                >
                  {serviceNav.map((s) => (
                    <Link
                      key={s.slug}
                      role="menuitem"
                      href={`/services/${s.slug}`}
                      className="block px-4 py-2.5 text-sm text-text-secondary transition hover:bg-white/5 hover:text-text-primary"
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className={cn(linkClass, isActive("/about") && activeClass)}>
              О нас
            </Link>
            <button
              type="button"
              onClick={openContact}
              className={cn(
                "border-0 bg-transparent text-sm uppercase tracking-[0.15em] transition",
                lightHero ? "text-text-dark/90 hover:text-text-dark" : "text-text-secondary hover:text-text-primary"
              )}
            >
              Контакт
            </button>
          </nav>

          <button
            type="button"
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded border lg:hidden",
              lightHero ? "border-text-dark/25 text-text-dark" : "border-border text-text-primary"
            )}
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[90] flex flex-col bg-bg lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <span className="font-display text-lg font-semibold text-text-primary">Меню</span>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded border border-border"
              aria-label="Закрыть"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6" aria-label="Мобильная навигация">
            <Link href="/cases" className="py-3 text-lg text-text-primary" onClick={() => setMobileOpen(false)}>
              Кейсы
            </Link>
            <p className="mt-4 text-xs uppercase tracking-widest text-text-muted">Услуги</p>
            {serviceNav.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="py-2.5 text-text-secondary"
                onClick={() => setMobileOpen(false)}
              >
                {s.title}
              </Link>
            ))}
            <Link href="/about" className="mt-4 py-3 text-lg text-text-primary" onClick={() => setMobileOpen(false)}>
              О нас
            </Link>
            <Link href="/blog" className="py-3 text-lg text-text-secondary" onClick={() => setMobileOpen(false)}>
              Блог
            </Link>
            <button
              type="button"
              className="mt-6 border-0 bg-transparent py-3 text-left text-lg text-text-primary"
              onClick={() => {
                setMobileOpen(false);
                openContact();
              }}
            >
              Контакт
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
