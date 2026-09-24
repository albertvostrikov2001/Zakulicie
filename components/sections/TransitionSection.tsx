"use client";

import { CTALink } from "@/components/ui/CTALink";
import Image from "@/components/ui/SiteImage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { resolvePublicPath } from "@/lib/publicPath";
import type { CaseStudy } from "@/lib/types";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const DARK = "#0a0a0a";
const AUTOPLAY_DELAY = 6500;

const slides = [
  {
    desktop: "/hero-carousel/slide-01-desktop.webp",
    mobile: "/hero-carousel/slide-01-mobile.webp",
    thumb: "/hero-carousel/slide-01-thumb.webp",
    alt: "Юбилей компании с праздничным тортом",
  },
  {
    desktop: "/hero-carousel/slide-02-desktop.webp",
    mobile: "/hero-carousel/slide-02-mobile.webp",
    thumb: "/hero-carousel/slide-02-thumb.webp",
    alt: "Танцевальная программа на корпоративном мероприятии",
  },
  {
    desktop: "/hero-carousel/slide-03-desktop.webp",
    mobile: "/hero-carousel/slide-03-mobile.webp",
    thumb: "/hero-carousel/slide-03-thumb.webp",
    alt: "Артисты на сцене бизнес-мероприятия",
  },
  {
    desktop: "/hero-carousel/slide-04-desktop.webp",
    mobile: "/hero-carousel/slide-04-mobile.webp",
    thumb: "/hero-carousel/slide-04-thumb.webp",
    alt: "Новогодняя корпоративная программа",
  },
  {
    desktop: "/hero-carousel/slide-05-desktop.webp",
    mobile: "/hero-carousel/slide-05-mobile.webp",
    thumb: "/hero-carousel/slide-05-thumb.webp",
    alt: "Ведущие городского праздника",
  },
  {
    desktop: "/hero-carousel/slide-06-desktop.webp",
    mobile: "/hero-carousel/slide-06-mobile.webp",
    thumb: "/hero-carousel/slide-06-thumb.webp",
    alt: "Гости тематического корпоративного вечера",
  },
  {
    desktop: "/hero-carousel/slide-07-desktop.webp",
    mobile: "/hero-carousel/slide-07-mobile.webp",
    thumb: "/hero-carousel/slide-07-thumb.webp",
    alt: "Новогоднее шоу на корпоративном празднике",
  },
  {
    desktop: "/hero-carousel/slide-08-desktop.webp",
    mobile: "/hero-carousel/slide-08-mobile.webp",
    thumb: "/hero-carousel/slide-08-thumb.webp",
    alt: "Торжественная подача праздничного торта",
  },
  {
    desktop: "/hero-carousel/slide-09-desktop.webp",
    mobile: "/hero-carousel/slide-09-mobile.webp",
    thumb: "/hero-carousel/slide-09-thumb.webp",
    alt: "Деловая выставка с брендированными стендами",
  },
] as const;

interface TransitionSectionProps {
  cases?: CaseStudy[];
}

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

export function TransitionSection({}: TransitionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const selectSlide = useCallback(
    (index: number, nextDirection?: number) => {
      const normalized = (index + slides.length) % slides.length;
      setDirection(nextDirection ?? (normalized >= activeIndex ? 1 : -1));
      setActiveIndex(normalized);
    },
    [activeIndex]
  );

  const showPrevious = useCallback(() => {
    selectSlide(activeIndex - 1, -1);
  }, [activeIndex, selectSlide]);

  const showNext = useCallback(() => {
    selectSlide(activeIndex + 1, 1);
  }, [activeIndex, selectSlide]);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setTimeout(showNext, AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [activeIndex, paused, reducedMotion, showNext]);

  useEffect(() => {
    const nextSlide = slides[(activeIndex + 1) % slides.length];
    const preload = new window.Image();
    preload.src = resolvePublicPath(
      window.matchMedia("(max-width: 767px)").matches ? nextSlide.mobile : nextSlide.desktop
    );

    const container = thumbnailContainerRef.current;
    const thumbnail = thumbnailRefs.current[activeIndex];
    if (!container || !thumbnail) return;
    container.scrollTo({
      left: thumbnail.offsetLeft - (container.clientWidth - thumbnail.clientWidth) / 2,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [activeIndex, reducedMotion]);

  useGSAP(
    () => {
      const content = contentRef.current;
      if (!content) return;
      const ctx = gsap.context(() => {
        const elements = content.querySelectorAll<HTMLElement>("[data-hero-el]");
        gsap.from(elements, {
          opacity: 0,
          y: reducedMotion ? 0 : 28,
          duration: reducedMotion ? 0.3 : 0.85,
          stagger: reducedMotion ? 0.04 : 0.14,
          ease: "power3.out",
          delay: 0.2,
        });
      });
      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      const overlay = fadeOverlayRef.current;
      if (!section || !overlay) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: reducedMotion ? 0 : 0.8,
          onUpdate: (self) => {
            overlay.style.opacity = String(self.progress);
            document.documentElement.style.setProperty("--scene-bg", DARK);
            document.documentElement.style.setProperty("--page-bg", DARK);
          },
        });
      }, section);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  const previousIndex = (activeIndex - 1 + slides.length) % slides.length;
  const nextIndex = (activeIndex + 1) % slides.length;
  const activeSlide = slides[activeIndex];

  return (
    <section
      ref={sectionRef}
      data-transition
      data-transition-section
      aria-label="Карусель мероприятий агентства Закулисье"
      aria-roledescription="карусель"
      className="relative z-10 min-h-[140vh]"
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="sticky top-0 h-[100dvh] min-h-[620px] w-full overflow-hidden bg-[#06101a]">
        <div className="absolute inset-y-0 left-0 w-[8vw] overflow-hidden md:w-[7vw]" aria-hidden>
          <Image
            src={slides[previousIndex].thumb}
            alt=""
            fill
            className="scale-110 object-cover opacity-55 blur-[1px]"
            sizes="8vw"
          />
        </div>
        <div className="absolute inset-y-0 right-0 w-[8vw] overflow-hidden md:w-[7vw]" aria-hidden>
          <Image
            src={slides[nextIndex].thumb}
            alt=""
            fill
            className="scale-110 object-cover opacity-55 blur-[1px]"
            sizes="8vw"
          />
        </div>

        <div className="absolute inset-y-0 left-[4vw] right-[4vw] overflow-hidden border-x border-white/20 bg-black md:left-[4.5vw] md:right-[4.5vw]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={
                reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * 70, scale: 1.025 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={
                reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -70, scale: 1.015 }
              }
              transition={{ duration: reducedMotion ? 0.2 : 0.75, ease: [0.22, 1, 0.36, 1] }}
              drag={reducedMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -55 || info.velocity.x < -450) showNext();
                if (info.offset.x > 55 || info.velocity.x > 450) showPrevious();
              }}
              className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
              aria-label={`${activeIndex + 1} из ${slides.length}: ${activeSlide.alt}`}
            >
              <picture className="block h-full w-full">
                <source media="(max-width: 767px)" srcSet={resolvePublicPath(activeSlide.mobile)} />
                {/* Assets are pre-cropped and compressed for art direction; picture prevents loading both variants. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolvePublicPath(activeSlide.desktop)}
                  alt={activeSlide.alt}
                  className="h-full w-full select-none object-cover"
                  draggable={false}
                  loading={activeIndex === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </picture>
            </motion.div>
          </AnimatePresence>

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(2,8,14,.52) 0%, rgba(2,8,14,.18) 29%, rgba(2,8,14,.34) 56%, rgba(2,8,14,.94) 100%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,.26)_100%)]"
            aria-hidden
          />
        </div>

        <button
          type="button"
          onClick={showPrevious}
          className="absolute left-[3vw] top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-black/20 text-white backdrop-blur-sm transition hover:border-accent hover:bg-accent hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:flex"
          aria-label="Предыдущее фото"
        >
          <ArrowLeft className="h-6 w-6" aria-hidden />
        </button>
        <button
          type="button"
          onClick={showNext}
          className="absolute right-[3vw] top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-black/20 text-white backdrop-blur-sm transition hover:border-accent hover:bg-accent hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:flex"
          aria-label="Следующее фото"
        >
          <ArrowRight className="h-6 w-6" aria-hidden />
        </button>

        <div
          ref={contentRef}
          className="pointer-events-none absolute inset-x-[4.5vw] top-[22%] z-10 flex flex-col items-center px-3 text-center sm:top-[25%] md:inset-x-[10vw] md:top-1/2 md:-translate-y-[54%]"
        >
          <h1
            data-hero-el
            className="m-0 max-w-[1450px] font-display text-[clamp(26px,7.2vw,46px)] font-black uppercase leading-[0.96] tracking-[-0.035em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,.65)] md:text-[clamp(38px,4.2vw,72px)] md:leading-[0.95]"
          >
            <span className="md:hidden">
              Организация
              <br />
              корпоративных и
              <br />
              бизнес-мероприятий
              <br />в Новосибирске
            </span>
            <span className="hidden md:inline">
              Организация корпоративных и
              <br />
              бизнес-мероприятий в Новосибирске
            </span>
          </h1>

          <p
            data-hero-el
            className="mt-5 max-w-[920px] text-[clamp(16px,4.4vw,22px)] font-medium leading-[1.35] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.75)] md:mt-7 md:text-[clamp(18px,1.45vw,25px)]"
          >
            Углублённая консультация по мероприятию без оплаты
            <br />
            Смета в день обращения
          </p>

          <div data-hero-el className="pointer-events-auto mt-6 md:mt-8">
            <CTALink className="inline-flex min-w-[min(310px,76vw)] items-center justify-center gap-4 border border-[#ff922f] bg-[#dd720d] px-7 py-4 text-[14px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_8px_30px_rgba(0,0,0,.3)] transition-[background-color,transform] duration-200 hover:bg-[#f08016] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:min-w-[340px] md:px-9 md:py-[18px] md:text-[16px]">
              Обсудить проект
              <ArrowRight className="h-5 w-5" aria-hidden />
            </CTALink>
          </div>
        </div>

        <div className="absolute inset-x-[8vw] bottom-4 z-20 md:inset-x-[7vw] md:bottom-7">
          <div className="mb-4 flex items-center gap-4 md:mb-0 md:absolute md:bottom-2 md:left-0 md:w-[30%]">
            <p
              className="shrink-0 font-display text-[24px] font-bold text-white md:text-[28px]"
              aria-live="polite"
            >
              {twoDigits(activeIndex + 1)}{" "}
              <span className="text-[16px] font-normal text-white/70">
                / {twoDigits(slides.length)}
              </span>
            </p>
            <div className="grid flex-1 grid-cols-9 gap-1.5" aria-hidden>
              {slides.map((_, index) => (
                <span
                  key={index}
                  className={`h-0.5 transition-colors duration-300 ${index === activeIndex ? "bg-accent" : "bg-white/70"}`}
                />
              ))}
            </div>
          </div>

          <div
            ref={thumbnailContainerRef}
            className="ml-auto flex w-full snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:w-[min(55vw,760px)] md:gap-3"
          >
            {slides.map((slide, index) => (
              <button
                key={slide.thumb}
                ref={(element) => {
                  thumbnailRefs.current[index] = element;
                }}
                type="button"
                onClick={() => selectSlide(index)}
                className={`relative aspect-[3/2] w-[29vw] max-w-[146px] shrink-0 snap-center overflow-hidden border transition-[border-color,opacity,transform] duration-300 md:w-[clamp(104px,9vw,150px)] ${index === activeIndex ? "border-accent opacity-100" : "border-white/45 opacity-70 hover:scale-[1.02] hover:opacity-100"}`}
                aria-label={`Показать фото ${index + 1}: ${slide.alt}`}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <Image
                  src={slide.thumb}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 29vw, 150px"
                />
              </button>
            ))}
          </div>
        </div>

        <div
          ref={fadeOverlayRef}
          className="pointer-events-none absolute inset-0 z-30 bg-[#0a0a0a] opacity-0"
          aria-hidden
        />
      </div>
    </section>
  );
}
