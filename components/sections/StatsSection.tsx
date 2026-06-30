"use client";

import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "framer-motion";
import { Heart, Megaphone, Target, Users, type LucideIcon } from "lucide-react";
import { useRef } from "react";

const DIFFERENTIATORS: { label: string; Icon: LucideIcon }[] = [
  { label: "Решаем бизнес-задачи", Icon: Users },
  { label: "Продвигаем ценности компании", Icon: Megaphone },
  { label: "Формируем лояльность к бренду", Icon: Heart },
  { label: "Вносим смысл в каждую деталь", Icon: Target },
];

// Borders per cell to create internal grid lines without overflow-hidden on the wrapper
const CELL_BORDERS = ["border-r border-b", "border-b", "border-r", ""] as const;

function DifferentiatorCard({ label, Icon, index }: { label: string; Icon: LucideIcon; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || reduced) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      initial={false}
      whileHover={reduced ? undefined : "hover"}
      className="group/card relative flex h-full flex-col gap-3 overflow-hidden bg-[var(--color-surface-elevated)] p-4 transition-colors duration-300 md:gap-5 md:p-6 xl:p-7"
    >
      {/* Spotlight, following cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(181,97,28,0.16), transparent 70%)",
        }}
        aria-hidden
      />
      {/* Breathing corner glow — desktop only */}
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute -right-10 -top-10 hidden h-32 w-32 rounded-full md:block"
          style={{ background: "radial-gradient(circle, rgba(181,97,28,0.14), transparent 70%)" }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.6 }}
          aria-hidden
        />
      )}
      {/* Bottom accent line on hover */}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover/card:scale-x-100"
        aria-hidden
      />

      <div className="relative z-[1] flex items-center justify-between">
        <motion.span
          className="font-display text-[11px] font-bold tabular-nums text-accent md:text-[14px]"
          variants={{ hover: { x: 2 } }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
        {/* Icon — hidden on mobile */}
        <motion.span
          className="hidden h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-accent md:flex"
          variants={{
            rest: { rotate: 0, scale: 1, borderColor: "var(--color-border)" },
            hover: { rotate: -8, scale: 1.08, borderColor: "rgba(181,97,28,0.5)" },
          }}
          initial="rest"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </motion.span>
      </div>

      <motion.p
        className="relative z-[1] text-[13px] font-semibold leading-snug tracking-tight text-text-primary md:text-[15px] xl:text-[16px]"
        variants={{ hover: { x: 3 } }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section
      className="relative overflow-x-hidden border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-14 md:py-20"
      aria-label="Чем мы отличаемся от других"
    >
      <div className="relative z-[1] mx-auto max-w-content px-4 md:px-8">
        <RevealOnScroll>
          <p className="caption-text">Отличия</p>
          <h2 className="mt-3 max-w-[52ch] font-display text-[clamp(28px,3.5vw,48px)] font-bold leading-snug tracking-tight text-text-primary">
            Чем мы отличаемся от других?
          </h2>
        </RevealOnScroll>

        <div className="mt-10 grid gap-10 border-t border-[var(--color-border)] pt-10 md:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16 md:pt-14">
          <RevealOnScroll delay={0.05}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Подход
            </p>
            <p className="mt-4 max-w-[42ch] text-[18px] leading-relaxed text-text-primary md:text-[22px]">
              Мы используем режиссуру коммерческих событий как основной инструмент для
              проектирования событий.
            </p>
            <p className="mt-5 max-w-[44ch] text-[14px] leading-relaxed text-text-secondary md:text-[15px]">
              Наши мероприятия помогают достигать ваши коммерческие цели: коммуникация в коллективе, продвижение ценностей компании, формирование лояльности к бренду, создание трудовых ориентиров и многое другое.
            </p>
          </RevealOnScroll>

          {/* No overflow-hidden on wrapper — prevents clipping RevealOnScroll animations */}
          <div className="grid grid-cols-2 border border-[var(--color-border)]">
            {DIFFERENTIATORS.map((item, i) => (
              <div
                key={item.label}
                className={`border-[var(--color-border)] ${CELL_BORDERS[i] ?? ""}`}
              >
                <RevealOnScroll delay={0.1 + i * 0.07} className="h-full">
                  <DifferentiatorCard label={item.label} Icon={item.Icon} index={i} />
                </RevealOnScroll>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
