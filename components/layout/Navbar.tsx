"use client";

import { serviceNav } from "@/lib/content/services";
import { cn } from "@/lib/cn";
import { useContactModal } from "@/components/providers/ContactModalProvider";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItemClass = (light: boolean) =>
  cn(
    "relative inline-flex text-[13px] font-normal transition-colors duration-200 ease-out md:text-[14px]",
    "tracking-[0.05em]",
    "after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 after:ease-out",
    "hover:after:scale-x-100",
    light ? "text-[#1A1A1A]/90 hover:text-[#1A1A1A]" : "text-white/85 hover:text-accent"
  );

export function Navbar() {
  const pathname = usePathname();
  const { openContact } = useContactModal();
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
          delay: 0.15,
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
            ? "border-b border-white/[0.06] bg-[rgba(10,10,10,0.88)] shadow-lg shadow-black/10 backdrop-blur-[16px] backdrop-saturate-[180%] transition-[background-color,backdrop-filter,border-color] duration-[350ms] ease-out"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div
          ref={innerRef}
          className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-4 md:px-8"
        >
          <Link
            href="/"
            className={cn(
              "font-display text-base font-semibold tracking-tight md:text-lg",
              lightHero ? "text-text-dark" : "text-text-primary"
            )}
          >
            Закулисье
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Основная навигация">
            <Link href="/cases" className={cn(navItemClass(lightHero), isActive("/cases") && activeClass)}>
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
                  navItemClass(lightHero),
                  "items-center gap-1 border-0 bg-transparent",
                  servicesOpen && !lightHero && "text-accent",
                  servicesOpen && lightHero && "text-text-dark"
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

            <Link href="/about" className={cn(navItemClass(lightHero), isActive("/about") && activeClass)}>
              О нас
            </Link>

            <PhoneLink variant={lightHero ? "on-light" : "on-dark"} className="hidden md:inline-flex" />

            <button
              type="button"
              onClick={openContact}
              className={cn(
                navItemClass(lightHero),
                "border-0 bg-transparent"
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
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="mt-4 py-2 text-text-secondary"
              onClick={() => setMobileOpen(false)}
            >
              {CONTACT_PHONE}
            </a>
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
