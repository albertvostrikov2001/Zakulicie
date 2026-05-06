"use client";

import { SuccessState } from "@/components/sections/SuccessState";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { EVENT_TYPE_OPTIONS } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { trackContactFormSubmit } from "@/lib/analytics/client";
import { submitContactPayload } from "@/lib/submitContact";
import { formatRuPhoneInput } from "@/lib/utils/phoneMask";
import {
  contactFormSchema,
  normalizeRuPhone,
  type ContactFormValues,
} from "@/lib/validators/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";

/* ─── Field styles ─────────────────────────────────────────── */
const baseInput =
  "w-full border-0 border-b border-white/[0.15] bg-transparent pb-3 pt-6 text-[15px] font-medium text-[#F5F5F5] outline-none transition-[border-color,box-shadow] duration-[250ms] ease-out placeholder:text-white/25 focus:border-[var(--color-accent)] focus:shadow-[0_1px_0_0_var(--color-accent)]";

const baseLabel =
  "pointer-events-none absolute left-0 top-6 origin-left text-[15px] font-medium text-white/35 transition-[transform,font-size,color,top] duration-[220ms] ease-out";

const errorClass = "mt-2 text-[11px] text-[#E53E3E]";

function cnInput(err: unknown) {
  return err
    ? `${baseInput} border-[#E53E3E] focus:border-[#E53E3E] focus:shadow-[0_1px_0_0_#E53E3E]`
    : baseInput;
}

/* ─── Floating label wrapper ──────────────────────────────── */
function FloatingField({
  id,
  label,
  error,
  children,
  index,
  reduced,
}: {
  id: string;
  label: string;
  error?: { message?: string };
  children: ReactNode;
  index: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="relative"
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{
        delay: index * 0.08,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <label
        htmlFor={id}
        className={baseLabel}
        style={
          {
            "--float-y": "-18px",
            "--float-scale": "0.72",
          } as React.CSSProperties
        }
      >
        {label}
      </label>
      {children}
      {error?.message && (
        <p className={errorClass} role="alert">{error.message}</p>
      )}
    </motion.div>
  );
}

export function CinematicContactForm() {
  const [isDone, setIsDone]   = useState(false);
  const reduced               = usePrefersReducedMotion();
  const uid                   = useId();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      eventType: "corporate",
      consent:   false,
      dates:     "",
      name:      "",
      phone:     "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    const payload = { ...data, phone: normalizeRuPhone(data.phone) };
    const { ok }  = await submitContactPayload(payload);
    if (ok) {
      setIsDone(true);
      trackContactFormSubmit();
    }
  };

  return (
    <div className="relative min-h-[520px]">
      <AnimatePresence mode="wait">
        {isDone ? (
          <SuccessState key="ok" onReset={() => { setIsDone(false); reset(); }} />
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            noValidate
            className="space-y-8"
          >
            {/* 1: Name */}
            <FloatingField id={`${uid}-name`} label="Имя" error={errors.name} index={0} reduced={reduced}>
              <input
                id={`${uid}-name`}
                autoComplete="name"
                className={cnInput(errors.name)}
                placeholder=" "
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? `${uid}-e-name` : undefined}
                {...register("name")}
                onFocus={(e) => floatLabel(e.currentTarget)}
                onBlur={(e) => unFloatLabel(e.currentTarget)}
              />
            </FloatingField>

            {/* 2: Phone */}
            <FloatingField id={`${uid}-phone`} label="Телефон" error={errors.phone} index={1} reduced={reduced}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    id={`${uid}-phone`}
                    type="tel"
                    autoComplete="tel"
                    placeholder=" "
                    className={cnInput(errors.phone)}
                    value={field.value}
                    onChange={(e) => field.onChange(formatRuPhoneInput(e.target.value))}
                    onBlur={(e) => { field.onBlur(); unFloatLabel(e.currentTarget); }}
                    onFocus={(e) => floatLabel(e.currentTarget)}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? `${uid}-e-phone` : undefined}
                  />
                )}
              />
            </FloatingField>

            {/* 3: Event type */}
            <motion.div
              className="relative"
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: 2 * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <label
                htmlFor={`${uid}-type`}
                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40"
              >
                Тип мероприятия
              </label>
              <div className="relative">
                <select
                  id={`${uid}-type`}
                  className={`${baseInput} appearance-none pr-10 pt-3`}
                  {...register("eventType")}
                >
                  {EVENT_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-[#111111] text-[#F5F5F5]">
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-accent)]"
                  aria-hidden
                />
              </div>
            </motion.div>

            {/* 4: Dates */}
            <FloatingField id={`${uid}-dates`} label="Ориентировочные сроки" error={errors.dates} index={3} reduced={reduced}>
              <input
                id={`${uid}-dates`}
                className={cnInput(errors.dates)}
                placeholder=" "
                aria-invalid={errors.dates ? true : undefined}
                aria-describedby={errors.dates ? `${uid}-e-dates` : undefined}
                {...register("dates")}
                onFocus={(e) => floatLabel(e.currentTarget)}
                onBlur={(e) => unFloatLabel(e.currentTarget)}
              />
            </FloatingField>

            {/* Consent */}
            <motion.div
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: 4 * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <label className="flex cursor-pointer gap-3 text-[13px] text-white/50">
                <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-white/20 bg-transparent transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-accent)]">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    {...register("consent")}
                  />
                  <Check
                    className="h-3.5 w-3.5 text-[var(--color-accent)] opacity-0 transition-opacity peer-checked:opacity-100"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </span>
                <span>
                  Согласен с{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[var(--color-accent)] underline-offset-2 hover:underline"
                  >
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>
              {errors.consent && (
                <p className={errorClass} role="alert">{errors.consent.message}</p>
              )}
            </motion.div>

            {/* Submit CTA */}
            <motion.div
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: 5 * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <MagneticButton strength={0.25}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 border-[1.5px] border-[var(--color-accent)] bg-transparent px-6 py-[18px] text-[14px] font-medium uppercase tracking-[0.12em] text-[#F5F5F5] transition-[background-color,color,opacity] duration-[250ms] ease-out hover:bg-[var(--color-accent)] hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-accent)] disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                      Отправка…
                    </>
                  ) : (
                    "Обсудить проект"
                  )}
                </button>
              </MagneticButton>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Floating label helpers ──────────────────────────────── */
function floatLabel(input: HTMLInputElement) {
  const label = input.previousElementSibling as HTMLElement | null;
  if (!label) return;
  label.style.transform = "translateY(-18px) scale(0.72)";
  label.style.color     = "var(--color-accent)";
  label.style.top       = "6px";
}

function unFloatLabel(input: HTMLInputElement) {
  const label = input.previousElementSibling as HTMLElement | null;
  if (!label) return;
  const hasValue = input.value.trim().length > 0;
  if (!hasValue) {
    label.style.transform = "";
    label.style.color     = "rgba(255,255,255,0.35)";
    label.style.top       = "24px";
  } else {
    label.style.color = "rgba(255,255,255,0.35)";
  }
}
