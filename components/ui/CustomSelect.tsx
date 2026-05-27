"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./CustomSelect.module.css";

export type SelectOption = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  label: string;
  value: string;
  placeholder?: string;
  options: SelectOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (value: string) => void;
  invalid?: boolean;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

export function CustomSelect({
  label,
  value,
  placeholder = "Выберите формат",
  options,
  open,
  onOpenChange,
  onChange,
  invalid,
  focused,
  onFocus,
  onBlur,
}: CustomSelectProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  const fieldClass = [
    styles.field,
    focused || open ? styles.fieldFocused : "",
    invalid ? styles.fieldInvalid : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={fieldClass}>
      <span className={[styles.fieldLabel, focused || open ? styles.fieldLabelFocused : ""].filter(Boolean).join(" ")}>
        {label}
      </span>
      <div className={styles.selectWrap} ref={wrapRef}>
        <select
          className={styles.nativeSelect}
          value={value}
          tabIndex={-1}
          aria-hidden
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={styles.selectTrigger}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => {
            onFocus?.();
            onOpenChange(!open);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onFocus?.();
              onOpenChange(!open);
            }
          }}
        >
          <span className={selected ? styles.selectValue : styles.selectPlaceholder}>
            {selected?.label ?? placeholder}
          </span>
          <svg
            className={[styles.selectChevron, open ? styles.selectChevronOpen : ""].filter(Boolean).join(" ")}
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            aria-hidden
          >
            <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {open ? (
          <ul className={styles.dropdown} id={listId} role="listbox">
            <li className={styles.dropdownLine} aria-hidden />
            {options.map((o) => {
              const isSelected = o.value === value;
              return (
                <li key={o.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    className={[styles.option, isSelected ? styles.optionSelected : ""].filter(Boolean).join(" ")}
                    onClick={() => {
                      onChange(o.value);
                      onOpenChange(false);
                      onBlur?.();
                    }}
                  >
                    <span className={styles.optionDot} aria-hidden />
                    <span>{o.label}</span>
                    {isSelected ? <span className={styles.optionCheck} aria-hidden>✓</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
