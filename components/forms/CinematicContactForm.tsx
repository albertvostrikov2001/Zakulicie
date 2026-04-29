"use client";

import { SuccessState } from "@/components/sections/SuccessState";
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
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const inputClass =
  "w-full border-0 border-b border-white/[0.15] bg-transparent py-4 pb-3 text-[15px] text-[#F5F5F5] outline-none transition-[border-color,box-shadow] duration-[250ms] ease-out placeholder:text-white/25 focus:border-accent focus:shadow-[0_1px_0_0_var(--color-accent)]";
const labelClass =
  "mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-white/40";

export function CinematicContactForm() {
  const [done, setDone] = useState(false);
  const reduced = usePrefersReducedMotion();
  const stagger = reduced ? 0 : 0.08;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      eventType: "corporate",
      consent: false,
      dates: "",
      name: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    const payload = { ...data, phone: normalizeRuPhone(data.phone) };
    const { ok } = await submitContactPayload(payload);
    if (ok) {
      setDone(true);
      trackContactFormSubmit();
    }
  };

  const reveal = (i: number) => ({
    initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-8%" },
    transition: { delay: i * stagger, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div className="relative min-h-[480px]">
      <AnimatePresence mode="wait">
        {done ? (
          <SuccessState key="ok" onReset={() => setDone(false)} />
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-0"
          >
            <motion.div {...reveal(0)}>
              <label htmlFor="c-name" className={labelClass}>
                Имя
              </label>
              <input
                id="c-name"
                autoComplete="name"
                className={cnInput(errors.name)}
                placeholder="Как к вам обращаться"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "c-e-name" : undefined}
                {...register("name")}
              />
              {errors.name && (
                <p id="c-e-name" className="mt-2 text-[11px] text-[#E53E3E]" role="alert">
                  {errors.name.message}
                </p>
              )}
            </motion.div>

            <motion.div {...reveal(1)} className="mt-10">
              <label htmlFor="c-phone" className={labelClass}>
                Телефон
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    id="c-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+7 (___) ___-__-__"
                    className={cnInput(errors.phone)}
                    value={field.value}
                    onChange={(e) => field.onChange(formatRuPhoneInput(e.target.value))}
                    onBlur={field.onBlur}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? "c-e-phone" : undefined}
                  />
                )}
              />
              {errors.phone && (
                <p id="c-e-phone" className="mt-2 text-[11px] text-[#E53E3E]" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </motion.div>

            <motion.div {...reveal(2)} className="mt-10">
              <label htmlFor="c-email" className={labelClass}>
                Email
              </label>
              <input
                id="c-email"
                type="email"
                autoComplete="email"
                className={cnInput(errors.email)}
                placeholder="Рабочая почта"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "c-e-email" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id="c-e-email" className="mt-2 text-[11px] text-[#E53E3E]" role="alert">
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            <motion.div {...reveal(3)} className="mt-10">
              <label htmlFor="c-type" className={labelClass}>
                Тип мероприятия
              </label>
              <div className="relative">
                <select
                  id="c-type"
                  className={`${inputClass} appearance-none pr-10`}
                  {...register("eventType")}
                >
                  {EVENT_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-[#141414] text-text-primary">
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-accent"
                  aria-hidden
                />
              </div>
            </motion.div>

            <motion.div {...reveal(4)} className="mt-10">
              <label htmlFor="c-dates" className={labelClass}>
                Ориентировочные сроки
              </label>
              <input
                id="c-dates"
                className={cnInput(errors.dates)}
                placeholder="Например: май 2026"
                aria-invalid={errors.dates ? true : undefined}
                aria-describedby={errors.dates ? "c-e-dates" : undefined}
                {...register("dates")}
              />
              {errors.dates && (
                <p id="c-e-dates" className="mt-2 text-[11px] text-[#E53E3E]" role="alert">
                  {errors.dates.message}
                </p>
              )}
            </motion.div>

            <motion.div {...reveal(5)} className="mt-10">
              <label className="flex cursor-pointer gap-3 text-xs text-white/50">
                <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border border-white/20 bg-transparent transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    {...register("consent")}
                  />
                  <Check
                    className="h-3.5 w-3.5 text-accent opacity-0 transition-opacity peer-checked:opacity-100"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </span>
                <span>
                  Согласен с{" "}
                  <Link href="/privacy-policy" className="text-accent underline-offset-2 hover:underline">
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>
              {errors.consent && (
                <p className="mt-2 text-[11px] text-[#E53E3E]" role="alert">
                  {errors.consent.message}
                </p>
              )}
            </motion.div>

            <motion.div {...reveal(6)} className="mt-12">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center border-[1.5px] border-accent bg-transparent px-10 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#F5F5F5] transition-[background-color,color,opacity] duration-[250ms] ease-out hover:bg-accent hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent disabled:opacity-40"
              >
                {isSubmitting ? "Отправка…" : "Обсудить проект"}
              </button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function cnInput(err: unknown) {
  return err
    ? `${inputClass} border-[#E53E3E] focus:border-[#E53E3E] focus:shadow-[0_1px_0_0_#E53E3E]`
    : inputClass;
}
