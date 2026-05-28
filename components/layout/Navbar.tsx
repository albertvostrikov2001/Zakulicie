"use client";

import { serviceNav } from "@/lib/content/services";
import { cn } from "@/lib/cn";
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/constants";
import { CTALink } from "@/components/ui/CTALink";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Текст бренда в левой части хедера (ссылка на главную) */
const BRAND_LABEL = "Ивент-агентство полного цикла";

/** ~×1.5 к прежним 13px — навигация, телефон, выпадающий список */
const NAV_TEXT = "text-[19px] leading-snug tracking-[0.03em]";

/** Бренд в хедере: на 1 шаг крупнее навигации, без подчёркивания */
const BRAND_TEXT = "text-[20px] leading-snug tracking-[0.03em]";

const navLinkClass = (light: boolean) =>
  cn(
    "relative inline-flex items-center font-medium transition-colors duration-200 ease-out",
    NAV_TEXT,
    "after:pointer-events-none after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 after:ease-out",
    "hover:after:scale-x-100",
    light ? "text-[#1A1A1A]/90 hover:text-[#1A1A1A]" : "text-white/80 hover:text-white"
  );

const brandLinkClass = () =>
  cn(
    "inline-flex items-center font-display font-black transition-colors duration-200 ease-out",
    BRAND_TEXT,
    "text-white/90 hover:text-white"
  );

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const lightHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      const inner = innerRef.current;
      if (!inner || reducedMotion) return;
      const ctx = gsap.context(() => {
        gsap.from(inner, {
          opacity: 0,
          y: -8,
          duration: 0.6,
          delay: 0.1,
          ease: "power3.out",
        });
      }, headerRef);
      return () => ctx.revert();
    },
    { scope: headerRef, dependencies: [reducedMotion] }
  );

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

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const activeClass = cn(
    "after:!scale-x-100 after:!bg-current",
    lightHero ? "text-text-dark" : "text-accent"
  );

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed left-0 right-0 top-0 z-[100] transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
          scrolled
            ? "border-b border-white/[0.06] bg-[rgba(10,10,10,0.92)] shadow-lg shadow-black/10 backdrop-blur-[16px] backdrop-saturate-[180%]"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div
          ref={innerRef}
          className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-5 md:gap-5 md:px-8 md:py-5"
        >
          {/* Бренд / home — крупнее навигации, без подчёркивания */}
          <Link
            href="/"
            aria-label="На главную — Ивент-агентство полного цикла"
            className={cn(
              brandLinkClass(),
              "max-w-[min(11rem,42vw)] shrink-0 sm:max-w-[12.5rem] lg:max-w-[13.5rem] xl:max-w-[15rem] 2xl:max-w-none 2xl:whitespace-nowrap",
              pathname === "/" && (lightHero ? "text-text-dark" : "text-accent")
            )}
          >
            {BRAND_LABEL}
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden min-w-0 flex-1 items-center justify-end gap-5 lg:flex lg:gap-6 xl:gap-8 2xl:gap-9"
            aria-label="Основная навигация"
          >
            <Link href="/cases" className={cn(navLinkClass(lightHero), isActive("/cases") && activeClass)}>
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
                  navLinkClass(lightHero),
                  "items-center gap-1 border-0 bg-transparent",
                  servicesOpen && !lightHero && "text-accent",
                  servicesOpen && lightHero && "text-text-dark"
                )}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                onClick={() => setServicesOpen((v) => !v)}
              >
                Услуги
                <ChevronDown className="h-[1.05rem] w-[1.05rem] shrink-0 opacity-60" aria-hidden />
              </button>
              {servicesOpen && (
                <div
                  role="menu"
                  className="absolute left-1/2 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-2.5 shadow-2xl shadow-black/40"
                >
                  {serviceNav.map((s) => (
                    <Link
                      key={s.slug}
                      role="menuitem"
                      href={`/services/${s.slug}`}
                      className="block px-5 py-3 text-[19px] leading-snug text-text-secondary transition-colors duration-150 hover:bg-white/5 hover:text-text-primary"
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className={cn(navLinkClass(lightHero), isActive("/about") && activeClass)}>
              О нас
            </Link>

            <Link href="/blog" className={cn(navLinkClass(lightHero), isActive("/blog") && activeClass)}>
              Блог
            </Link>

            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className={cn(navLinkClass(lightHero), "hidden xl:inline-flex")}
              data-analytics="phone-nav"
            >
              {CONTACT_PHONE}
            </a>
          </nav>

          {/* CTA button — always visible */}
          <CTALink
            onNavigate={() => setMobileOpen(false)}
            className={cn(
              "hidden shrink-0 items-center border-[1.5px] px-6 py-3 text-[18px] font-semibold uppercase leading-snug tracking-[0.1em] transition-[background-color,color,border-color] duration-[250ms] ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent lg:inline-flex",
              lightHero
                ? "border-[#1A1A1A]/50 text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
                : "border-accent text-text-primary hover:bg-accent hover:text-[#0A0A0A]"
            )}
          >
            Обсудить проект
          </CTALink>

          {/* Mobile hamburger */}
          <button
            type="button"
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border transition-[border-color,background-color,color] duration-200 lg:hidden",
              mobileOpen
                ? "border-accent bg-accent/10 text-accent"
                : lightHero
                  ? "border-text-dark/25 text-text-dark hover:border-text-dark/60 hover:bg-black/5"
                  : "border-white/15 text-text-primary hover:border-accent/60 hover:bg-white/5"
            )}
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[110] flex flex-col bg-[var(--color-bg)] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-5">
            <span className="font-display text-2xl font-semibold leading-tight text-text-primary">Меню</span>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-accent bg-accent/10 text-accent transition-colors duration-200 hover:bg-accent/20"
              aria-label="Закрыть"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-4 py-7" aria-label="Мобильная навигация">
            <Link
              href="/cases"
              className="py-3.5 text-[27px] font-medium leading-snug text-text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Кейсы
            </Link>
            <p className="mt-5 text-base font-medium uppercase tracking-[0.16em] text-text-muted">Услуги</p>
            {serviceNav.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="py-3 text-[22px] leading-snug text-text-secondary"
                onClick={() => setMobileOpen(false)}
              >
                {s.title}
              </Link>
            ))}
            <Link
              href="/about"
              className="mt-5 py-3.5 text-[27px] font-medium leading-snug text-text-primary"
              onClick={() => setMobileOpen(false)}
            >
              О нас
            </Link>
            <Link
              href="/blog"
              className="py-3.5 text-[27px] font-medium leading-snug text-text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Блог
            </Link>
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="mt-5 py-2.5 text-[22px] leading-snug text-text-secondary"
              onClick={() => setMobileOpen(false)}
            >
              {CONTACT_PHONE}
            </a>
            <div className="mt-9">
              <CTALink
                onNavigate={() => setMobileOpen(false)}
                className="inline-flex items-center border-[1.5px] border-accent bg-transparent px-9 py-[1.125rem] text-[19px] font-semibold uppercase leading-snug tracking-[0.1em] text-text-primary transition-[background-color,color] duration-[250ms] hover:bg-accent hover:text-[#0A0A0A]"
              >
                Обсудить проект
              </CTALink>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
