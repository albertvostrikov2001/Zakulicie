"use client";

import { trackContactFormSubmit } from "@/lib/analytics/client";
import { submitContactPayload } from "@/lib/submitContact";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validators/contact";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import styles from "./ContactStepForm.module.css";

const TOTAL_STEPS = 4;

const EVENT_LABEL_TO_ENUM: Record<string, ContactFormValues["eventType"]> = {
  "Корпоративное мероприятие": "corporate",
  "Деловое событие / форум": "business",
  Тимбилдинг: "team",
  "Рекламная акция": "promo",
  "Открытие объекта": "opening",
  Другое: "other",
};

const ArrowSvg = () => (
  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden>
    <path
      d="M1 4h12M9 1l3 3-3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export function ContactStepForm() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showFinal, setShowFinal] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const progressRef = useRef<HTMLDivElement | null>(null);
  const input1 = useRef<HTMLInputElement | null>(null);
  const input2 = useRef<HTMLSelectElement | null>(null);
  const input3 = useRef<HTMLInputElement | null>(null);
  const input4 = useRef<HTMLInputElement | null>(null);
  const consentBox = useRef<HTMLInputElement | null>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const getInput = (stepNum: number): HTMLInputElement | HTMLSelectElement | null => {
    if (stepNum === 1) return input1.current;
    if (stepNum === 2) return input2.current;
    if (stepNum === 3) return input3.current;
    if (stepNum === 4) return input4.current;
    return null;
  };

  const pushTimeout = (id: ReturnType<typeof setTimeout>) => {
    timeoutRefs.current.push(id);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      const pending = timeoutRefs.current;
      pending.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  const setProgressPct = (pct: number) => {
    if (progressRef.current) progressRef.current.style.width = `${pct}%`;
  };

  const nextStep = useCallback((stepNum: number) => {
    const input = getInput(stepNum);
    if (!input) return;
    const value = input.value.trim();
    if (!value) {
      input.style.borderColor = "#e05a5a";
      input.focus();
      pushTimeout(
        setTimeout(() => {
          input.style.borderColor = "";
        }, 600)
      );
      return;
    }

    setDone((d) => ({ ...d, [stepNum]: true }));
    setAnswers((a) => ({ ...a, [stepNum]: value }));

    const nextCurrent = stepNum + 1;
    setCurrentStep(nextCurrent);

    if (stepNum < TOTAL_STEPS) {
      pushTimeout(
        setTimeout(() => {
          const nextInput = getInput(nextCurrent);
          nextInput?.focus();
        }, 100)
      );
    } else {
      setShowFinal(true);
    }

    const pct = (stepNum / TOTAL_STEPS) * 100;
    setProgressPct(pct);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || successVisible) return;
      if (currentStep > TOTAL_STEPS) return;
      if (done[currentStep]) return;
      e.preventDefault();
      nextStep(currentStep);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [currentStep, done, nextStep, successVisible]);

  const submitForm = useCallback(async () => {
    if (!consentBox.current?.checked) {
      const parent = consentBox.current?.parentElement;
      if (parent) parent.style.outline = "1px solid #e05";
      return;
    }

    const a1 = answers[1] ?? input1.current?.value.trim() ?? "";
    const raw2 = answers[2] ?? input2.current?.value.trim() ?? "";
    const a3 = answers[3] ?? input3.current?.value.trim() ?? "";
    const a4 = answers[4] ?? input4.current?.value.trim() ?? "";

    const eventEnum = EVENT_LABEL_TO_ENUM[raw2];
    if (!eventEnum) return;

    const parsed = contactFormSchema.safeParse({
      name: a1,
      eventType: eventEnum,
      dates: a3,
      phone: a4,
      consent: true,
    });

    if (!parsed.success) return;

    setSubmitting(true);
    const { ok } = await submitContactPayload(parsed.data);
    setSubmitting(false);
    if (!ok) return;

    trackContactFormSubmit();
    setProgressPct(100);
    pushTimeout(
      setTimeout(() => {
        setSuccessVisible(true);
      }, 400)
    );
  }, [answers]);

  const stepClass = (i: number) => {
    const isDone = Boolean(done[i]);
    const isActive = i === currentStep && !isDone;
    return [styles.step, isActive ? styles.stepActive : "", isDone ? styles.stepDone : ""]
      .filter(Boolean)
      .join(" ");
  };

  const progressBar = (
    <div
      ref={progressRef}
      className={styles.progressBar}
      aria-hidden
    />
  );

  return (
    <div className={styles.formRoot}>
      {mounted ? createPortal(progressBar, document.body) : null}

      <div className={styles.formWrapper}>
        <div className={styles.formHeader}>
          <div className={styles.eyebrow}>Закулисье · Новосибирск</div>
          <h2 className={styles.formHeadline}>
            Давайте
            <br />
            <span>поговорим</span>
          </h2>
        </div>

        <div className={styles.steps} id="stepsContainer">
          <div className={stepClass(1)} data-step="1">
            <div className={styles.stepDot}>01</div>
            <div className={styles.stepContent}>
              <div className={styles.stepQuestion}>Как вас зовут?</div>
              <div className={styles.stepAnswer}>{answers[1] ?? ""}</div>
              <div className={styles.stepInputArea}>
                <input
                  ref={input1}
                  id="s1"
                  type="text"
                  placeholder="Ваше имя"
                  autoComplete="off"
                />
                <div className={styles.stepHint}>Имя или имя + отчество</div>
                <button type="button" className={styles.nextBtn} onClick={() => nextStep(1)}>
                  Далее
                  <ArrowSvg />
                </button>
              </div>
            </div>
          </div>

          <div className={stepClass(2)} data-step="2">
            <div className={styles.stepDot}>02</div>
            <div className={styles.stepContent}>
              <div className={styles.stepQuestion}>Какое мероприятие планируете?</div>
              <div className={styles.stepAnswer}>{answers[2] ?? ""}</div>
              <div className={styles.stepInputArea}>
                <select ref={input2} id="s2" defaultValue="">
                  <option value="" disabled>
                    Выберите формат
                  </option>
                  <option value="Корпоративное мероприятие">Корпоративное мероприятие</option>
                  <option value="Деловое событие / форум">Деловое событие / форум</option>
                  <option value="Тимбилдинг">Тимбилдинг</option>
                  <option value="Рекламная акция">Рекламная акция</option>
                  <option value="Открытие объекта">Открытие объекта</option>
                  <option value="Другое">Другое</option>
                </select>
                <button type="button" className={styles.nextBtn} onClick={() => nextStep(2)}>
                  Далее
                  <ArrowSvg />
                </button>
              </div>
            </div>
          </div>

          <div className={stepClass(3)} data-step="3">
            <div className={styles.stepDot}>03</div>
            <div className={styles.stepContent}>
              <div className={styles.stepQuestion}>Примерные сроки?</div>
              <div className={styles.stepAnswer}>{answers[3] ?? ""}</div>
              <div className={styles.stepInputArea}>
                <input
                  ref={input3}
                  id="s3"
                  type="text"
                  placeholder="Например: декабрь 2025"
                  autoComplete="off"
                />
                <div className={styles.stepHint}>Точная дата или месяц — достаточно</div>
                <button type="button" className={styles.nextBtn} onClick={() => nextStep(3)}>
                  Далее
                  <ArrowSvg />
                </button>
              </div>
            </div>
          </div>

          <div className={stepClass(4)} data-step="4">
            <div className={styles.stepDot}>04</div>
            <div className={styles.stepContent}>
              <div className={styles.stepQuestion}>Как с вами связаться?</div>
              <div className={styles.stepAnswer}>{answers[4] ?? ""}</div>
              <div className={styles.stepInputArea}>
                <input
                  ref={input4}
                  id="s4"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  autoComplete="off"
                />
                <div className={styles.stepHint}>
                  Телефон — позвоним или напишем в удобный мессенджер
                </div>
                <button type="button" className={styles.nextBtn} onClick={() => nextStep(4)}>
                  Готово
                  <ArrowSvg />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${styles.finalStep} ${showFinal ? styles.finalStepVisible : ""}`}
          id="finalStep"
        >
          <div className={`${styles.stepDot} ${styles.finalStepDot}`}>✓</div>
          <div className={styles.finalContent}>
            <div className={styles.consentRow}>
              <input
                ref={consentBox}
                type="checkbox"
                className={styles.customCheck}
                id="consent"
                onChange={(e) => {
                  e.target.parentElement?.style.removeProperty("outline");
                }}
              />
              <label className={styles.consentText} htmlFor="consent">
                Согласен с <a href="#">политикой конфиденциальности</a> и обработкой
                персональных данных
              </label>
            </div>
            <button
              type="button"
              className={styles.submitBtn}
              id="submitBtn"
              disabled={submitting}
              onClick={() => void submitForm()}
            >
              Отправить заявку
            </button>
          </div>
        </div>
      </div>

      {mounted
        ? createPortal(
            <div
              className={`${styles.successOverlay} ${successVisible ? styles.successOverlayVisible : ""}`}
              id="successOverlay"
              aria-live="polite"
            >
              <div className={styles.successNum}>03</div>
              <div className={styles.successTitle}>Заявка принята</div>
              <p className={styles.successText}>
                Свяжемся с вами в ближайшее рабочее время.
                <br />
                Спасибо, что выбираете Закулисье.
              </p>
              <div className={styles.accentLine} />
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
