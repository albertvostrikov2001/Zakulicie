"use client";

import { motion } from "framer-motion";

type Props = {
  onReset: () => void;
};

export function SuccessState({ onReset }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-[420px] flex-col items-center justify-center text-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 18 }}
        className="mb-10 flex h-20 w-20 items-center justify-center rounded-full border border-accent/40 bg-accent/5"
        aria-hidden
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-accent" aria-hidden>
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      <h2 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">Заявка отправлена</h2>
      <p className="mt-4 max-w-md text-text-secondary">Мы свяжемся с вами в течение нескольких часов.</p>
      <p className="mt-3 text-sm text-text-muted">Ваша заявка получена командой Закулисья.</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-12 text-xs font-medium uppercase tracking-[0.2em] text-accent underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-accent"
      >
        Отправить ещё одну заявку
      </button>
    </motion.div>
  );
}
