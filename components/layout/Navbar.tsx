"use client";

import { serviceNav } from "@/lib/content/services";
import { cn } from "@/lib/cn";
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinkClass = (light: boolean) =>
  cn(
    "relative inline-flex text-[13px] font-medium transition-colors duration-200 ease-out tracking-[0.04em]",
    "after:pointer-events-none after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 after:ease-out",
    "hover:after:scale-x-100",
    light ? "text-[#1A1A1A]/90 hover:text-[#1A1A1A]" : "text-white/80 hover:text-white"
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
          className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-4 md:px-8"
        >
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "font-display text-base font-semibold tracking-tight md:text-lg",
              lightHero ? "text-text-dark" : "text-text-primary"
            )}
          >
            Закулисье
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Основная навигация">
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
                <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden />
              </button>
              {servicesOpen && (
                <div
                  role="menu"
                  className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-2 shadow-2xl shadow-black/40"
                >
                  {serviceNav.map((s) => (
                    <Link
                      key={s.slug}
                      role="menuitem"
                      href={`/services/${s.slug}`}
                      className="block px-4 py-2.5 text-[13px] text-text-secondary transition-colors duration-150 hover:bg-white/5 hover:text-text-primary"
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

            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className={cn(navLinkClass(lightHero), "hidden xl:inline-flex")}
              data-analytics="phone-nav"
            >
              {CONTACT_PHONE}
            </a>
          </nav>

          {/* CTA button — always visible */}
          <a
            href="#contact-form"
            className={cn(
              "hidden items-center border-[1.5px] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-[background-color,color,border-color] duration-[250ms] ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent lg:inline-flex",
              lightHero
                ? "border-[#1A1A1A]/50 text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
                : "border-accent text-text-primary hover:bg-accent hover:text-[#0A0A0A]"
            )}
          >
            Обсудить проект
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className={cn(
              "flex h-11 w-11 items-center justify-center border lg:hidden",
              lightHero ? "border-text-dark/25 text-text-dark" : "border-[var(--color-border)] text-text-primary"
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
          className="fixed inset-0 z-[90] flex flex-col bg-[var(--color-bg)] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4">
            <span className="font-display text-lg font-semibold text-text-primary">Меню</span>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center border border-[var(--color-border)]"
              aria-label="Закрыть"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6" aria-label="Мобильная навигация">
            <Link href="/cases" className="py-3 text-lg font-medium text-text-primary" onClick={() => setMobileOpen(false)}>
              Кейсы
            </Link>
            <p className="mt-4 text-[11px] uppercase tracking-widest text-text-muted">Услуги</p>
            {serviceNav.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="py-2.5 text-[15px] text-text-secondary"
                onClick={() => setMobileOpen(false)}
              >
                {s.title}
              </Link>
            ))}
            <Link href="/about" className="mt-4 py-3 text-lg font-medium text-text-primary" onClick={() => setMobileOpen(false)}>
              О нас
            </Link>
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="mt-4 py-2 text-[15px] text-text-secondary"
              onClick={() => setMobileOpen(false)}
            >
              {CONTACT_PHONE}
            </a>
            <div className="mt-8">
              <a
                href="#contact-form"
                className="inline-flex items-center border-[1.5px] border-accent bg-transparent px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-text-primary transition-[background-color,color] duration-[250ms] hover:bg-accent hover:text-[#0A0A0A]"
                onClick={() => setMobileOpen(false)}
              >
                Обсудить проект
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
