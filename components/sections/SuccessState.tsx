"use client";

import { motion } from "framer-motion";

type Props = {
  onReset: () => void;
};

/* ─── Custom premium SVG icon ─────────────────────────────── */
function SuccessIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className="text-[var(--color-accent)]"
    >
      {/* Outer ring */}
      <motion.circle
        cx="32"
        cy="32"
        r="30"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
        initial={{ pathLength: 0, rotate: -90 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "50% 50%" }}
      />
      {/* Inner accent ring */}
      <motion.circle
        cx="32"
        cy="32"
        r="22"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "50% 50%" }}
      />
      {/* Checkmark */}
      <motion.path
        d="M20 33l8 8 16-18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.55, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

export function SuccessState({ onReset }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-[520px] flex-col items-center justify-center py-16 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="mb-10 flex h-24 w-24 items-center justify-center"
        aria-hidden
      >
        <SuccessIcon />
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="font-display font-bold text-[var(--color-text-primary)]"
        style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
      >
        Заявка отправлена
      </motion.h2>

      {/* Sub */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 max-w-sm leading-relaxed text-[var(--color-text-secondary)]"
        style={{ fontSize: "16px", lineHeight: 1.6 }}
      >
        Мы свяжемся с вами в течение нескольких часов.
        <br />
        Команда Закулисья готова к работе.
      </motion.p>

      {/* Accent horizontal rule */}
      <motion.div
        className="mt-10 h-px w-24 origin-left bg-[var(--color-accent)]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />

      {/* Reset link */}
      <motion.button
        type="button"
        onClick={onReset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-12 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)] underline-offset-4 transition-colors hover:text-[var(--color-accent)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        Отправить ещё одну заявку
      </motion.button>
    </motion.div>
  );
}
