"use client";

import { useEffect, useRef, useState } from "react";

export function DevCard() {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    function onOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onOutside);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[12px] text-text-muted transition-colors hover:text-text-secondary"
      >
        Разработчик
      </button>

      {open && (
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-label="Карточка разработчика"
          className="absolute bottom-full right-0 mb-3 w-[260px] rounded-[3px] border border-[rgba(255,255,255,0.08)] bg-[#141414] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.55)] text-[13px]"
        >
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Закрыть"
            className="absolute right-3 top-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
          >
            ✕
          </button>

          <p className="leading-relaxed text-[var(--color-text-secondary)]">
            Добрый день, меня зовут Альберт — я разработчик этого сайта.
            По интересующим проектам контакты ниже:
          </p>

          <ul className="mt-4 space-y-2">
            <li>
              <a
                href="tel:+79183906087"
                className="flex items-center gap-2 text-[var(--color-text-primary)] transition-colors hover:text-accent"
              >
                <span className="text-[var(--color-text-muted)]">☎</span>
                +7 (918) 390-60-87
              </a>
            </li>
            <li>
              <a
                href="https://t.me/AlbertV01"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--color-text-primary)] transition-colors hover:text-accent"
              >
                <span className="text-[var(--color-text-muted)]">✈</span>
                @AlbertV01
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
