"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Image from "@/components/ui/SiteImage";
import { motion, type MotionProps } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  const motionProps: MotionProps = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
    viewport: { once: true, margin: "-60px" },
  };

  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  );
}

export function AboutPageContent() {
  return (
    <>
      {/* Секция 1 — Hero-заголовок */}
      <Reveal>
        <header className="pb-10 md:pb-12">
          <h1
            className="font-display font-black tracking-[-0.025em] text-text-primary"
            style={{
              fontSize: "clamp(36px, 7vw, 96px)",
              lineHeight: 0.92,
            }}
          >
            О компании «Закулисье»
          </h1>
          <div className="mt-10 h-px w-full bg-white/[0.08]" aria-hidden />
        </header>
      </Reveal>

      {/* Секция 2 — Фото команды */}
      <Reveal delay={0.08}>
        <section className="mb-16 md:mb-20" aria-label="Фото команды">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[3px] md:aspect-[16/7] md:rounded-sm lg:aspect-[21/9]">
            <Image
              src="/about/team.png"
              alt="Команда event-агентства «Закулисье» — основатель Екатерина Ёлгина и коллеги"
              fill
              className="object-cover object-[center_top]"
              sizes="100vw"
              priority
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.4)] from-0% via-transparent via-40% to-transparent"
              aria-hidden
            />
          </div>
        </section>
      </Reveal>

      {/* Секция 3 — Основатель */}
      <section className="mb-16 md:mb-20" aria-labelledby="about-founder">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <Reveal delay={0.1}>
            <div>
              <p id="about-founder" className="max-w-[28ch]">
                <span className="block text-[13px] leading-[1.5] text-[rgba(242,239,233,0.5)]">
                  Основатель и директор агентства событий «Закулисье» —
                </span>
                <span
                  className="mt-2 block font-display font-bold tracking-[-0.015em] text-text-primary"
                  style={{
                    fontSize: "clamp(20px, 2vw, 28px)",
                    lineHeight: 1.1,
                  }}
                >
                  Екатерина Ёлгина.
                </span>
              </p>
              <div className="mt-6 h-0.5 w-10 bg-accent" aria-hidden />
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <blockquote className="m-0 border-l-2 border-accent/25 pl-7 md:pl-7">
              <span
                className="pointer-events-none mb-3 block select-none font-display text-[56px] leading-none text-accent opacity-[0.22]"
                aria-hidden
              >
                «
              </span>
              <div className="space-y-5 font-body text-base font-normal leading-[1.75] text-[rgba(242,239,233,0.82)] md:text-base">
                <p>
                  Я открыла праздничное агентство не случайно. Я получила высшее профессиональное
                  образование режиссёра праздников, работаю по профессии уже 20 лет.
                </p>
                <p>
                  Я всегда хотела, чтобы в моей жизни было много радости — так оно и случилось. В
                  команде «Закулисье» я не единственный режиссёр, мне важно окружать себя
                  профессионалами.
                </p>
                <p>
                  Сегодня на режиссуру в сфере коммерческих мероприятий наконец-то появился
                  достойный спрос, и наше агентство — это именно та самая команда, которая умеет, а
                  главное любит искать интересные и креативные решения.
                </p>
                <p>
                  За 20 лет работы мною получен колоссальный опыт, но я продолжаю учиться и обучать
                  своих сотрудников — именно поэтому мы всегда находимся в тренде.
                </p>
              </div>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Секция 4 — Миссия */}
      <Reveal delay={0.12}>
        <section className="border-t border-white/[0.08] py-16 md:py-20" aria-labelledby="about-mission">
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-20 md:py-0">
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-white/[0.08] md:block"
              aria-hidden
            />
            <div>
              <h2
                id="about-mission"
                className="font-display font-bold tracking-[-0.02em] text-text-primary"
                style={{
                  fontSize: "clamp(32px, 4vw, 56px)",
                  lineHeight: 0.95,
                }}
              >
                Миссия компании
              </h2>
            </div>
            <p
              className="font-body font-normal leading-[1.65] text-[rgba(242,239,233,0.75)] md:flex md:items-center"
              style={{ fontSize: "clamp(17px, 1.6vw, 20px)" }}
            >
              Мы развиваем уровень культуры праздничной индустрии в Сибири.
            </p>
          </div>
        </section>
      </Reveal>
    </>
  );
}
