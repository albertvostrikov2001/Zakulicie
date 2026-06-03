"use client";

import { CustomSelect } from "@/components/ui/CustomSelect";
import { trackContactFormSubmit } from "@/lib/analytics/client";
import { formatPhone } from "@/lib/formatPhone";
import { submitContactPayload } from "@/lib/submitContact";
import { contactFormSchema, type ContactFormValues } from "@/lib/validators/contact";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./ContactForm.module.css";

const FORMAT_OPTIONS = [
  { label: "Корпоративное мероприятие", value: "corporate" },
  { label: "Деловое событие", value: "business" },
  { label: "Тимбилдинг", value: "team" },
  { label: "Рекламная акция", value: "promo" },
  { label: "Открытие объекта", value: "opening" },
  { label: "Другое", value: "other" },
] as const;

type FocusField = "name" | "phone" | "format" | "dates" | null;

export function ContactForm() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState("");
  const [dates, setDates] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const closeSuccess = useCallback(() => setShowSuccess(false), []);
  const [selectOpen, setSelectOpen] = useState(false);
  const [focusField, setFocusField] = useState<FocusField>(null);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [consentInvalid, setConsentInvalid] = useState(false);
  const [formatInvalid, setFormatInvalid] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showSuccess) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeSuccess(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showSuccess, closeSuccess]);

  const onPhoneChange = (value: string) => {
    setPhone(formatPhone(value));
  };

  const submit = useCallback(async () => {
    let valid = true;

    if (!name.trim()) {
      setNameInvalid(true);
      nameRef.current?.focus();
      setTimeout(() => setNameInvalid(false), 900);
      valid = false;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setPhoneInvalid(true);
      if (valid) phoneRef.current?.focus();
      setTimeout(() => setPhoneInvalid(false), 900);
      valid = false;
    }

    if (!eventType) {
      setFormatInvalid(true);
      setTimeout(() => setFormatInvalid(false), 900);
      valid = false;
    }

    if (!consent) {
      setConsentInvalid(true);
      setTimeout(() => setConsentInvalid(false), 800);
      valid = false;
    }

    if (!valid) return;

    const payload: ContactFormValues = {
      name: name.trim(),
      phone,
      eventType: eventType as ContactFormValues["eventType"],
      dates: dates.trim(),
      consent: true,
    };

    const parsed = contactFormSchema.safeParse(payload);
    if (!parsed.success) return;

    setIsSubmitting(true);
    setSubmitError(false);
    const { ok } = await submitContactPayload(parsed.data);
    setIsSubmitting(false);
    if (!ok) {
      setSubmitError(true);
      return;
    }

    trackContactFormSubmit();
    setShowSuccess(true);
  }, [consent, dates, eventType, name, phone]);

  const fieldClass = (field: FocusField, invalid: boolean) =>
    [styles.field, focusField === field ? styles.fieldFocused : "", invalid ? styles.fieldInvalid : ""]
      .filter(Boolean)
      .join(" ");

  const labelClass = (field: FocusField) =>
    [styles.fieldLabel, focusField === field || (field === "format" && selectOpen) ? styles.fieldLabelFocused : ""]
      .filter(Boolean)
      .join(" ");

  return (
    <>
      <div className={styles.formCol}>
        <h3 className={styles.formTitle}>Оставить заявку</h3>
        <p className={styles.formSubtitle}>Заполните — остальное за нами</p>

        <div className={styles.fields}>
          <div className={fieldClass("name", nameInvalid)}>
            <label className={labelClass("name")} htmlFor="contact-name">
              Имя
            </label>
            <input
              ref={nameRef}
              id="contact-name"
              type="text"
              autoComplete="off"
              placeholder="Ваше имя"
              className={[styles.fieldInput, nameInvalid ? styles.fieldInputInvalid : ""].filter(Boolean).join(" ")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusField("name")}
              onBlur={() => setFocusField((f) => (f === "name" ? null : f))}
            />
          </div>

          <div className={fieldClass("phone", phoneInvalid)}>
            <label className={labelClass("phone")} htmlFor="contact-phone">
              Телефон
            </label>
            <input
              ref={phoneRef}
              id="contact-phone"
              type="tel"
              autoComplete="off"
              placeholder="+7 (___) ___-__-__"
              className={[styles.fieldInput, phoneInvalid ? styles.fieldInputInvalid : ""].filter(Boolean).join(" ")}
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              onFocus={() => setFocusField("phone")}
              onBlur={() => setFocusField((f) => (f === "phone" ? null : f))}
            />
          </div>

          <CustomSelect
            label="Формат"
            value={eventType}
            options={[...FORMAT_OPTIONS]}
            open={selectOpen}
            onOpenChange={setSelectOpen}
            onChange={setEventType}
            invalid={formatInvalid}
            focused={focusField === "format"}
            onFocus={() => setFocusField("format")}
            onBlur={() => setFocusField((f) => (f === "format" ? null : f))}
          />

          <div className={fieldClass("dates", false)}>
            <label className={labelClass("dates")} htmlFor="contact-dates">
              Сроки
            </label>
            <input
              id="contact-dates"
              type="text"
              autoComplete="off"
              placeholder="Примерно когда"
              className={styles.fieldInput}
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              onFocus={() => setFocusField("dates")}
              onBlur={() => setFocusField((f) => (f === "dates" ? null : f))}
            />
          </div>
        </div>

        <label
          className={[styles.consentRow, consentInvalid ? styles.consentRowInvalid : ""].filter(Boolean).join(" ")}
          htmlFor="contact-consent"
        >
          <input
            id="contact-consent"
            type="checkbox"
            className={styles.consentInput}
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              setConsentInvalid(false);
            }}
          />
          <span className={styles.consentBox} aria-hidden />
          <span className={styles.consentText}>
            Нажимая кнопку, я соглашаюсь с{" "}
            <Link href="/privacy-policy" onClick={(e) => e.stopPropagation()}>
              политикой конфиденциальности
            </Link>
          </span>
        </label>

        <button type="button" className={styles.submitBtn} disabled={isSubmitting} onClick={() => void submit()}>
          <span>Обсудить проект</span>
          <span className={styles.submitArrow} aria-hidden>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path
                d="M1 5h12M8 1.5 12.5 5 8 8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {submitError ? (
          <p className={styles.submitError} role="alert">
            Не удалось отправить заявку. Позвоните нам или попробуйте ещё раз.
          </p>
        ) : null}

        <p className={styles.formNote}>Ответим в рабочее время · Данные защищены</p>
      </div>

      {mounted && showSuccess
        ? createPortal(
            <div className={styles.successNotification} role="status" aria-live="polite">
              <button
                type="button"
                className={styles.successCloseBtn}
                onClick={closeSuccess}
                aria-label="Закрыть"
              >
                ×
              </button>
              <div className={styles.successCheck}>✓</div>
              <h4 className={styles.successTitle}>Заявка принята</h4>
              <p className={styles.successText}>
                Свяжемся в течение нескольких часов. Команда Закулисья уже готовится к диалогу.
              </p>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
