"use client";

import { MagneticButton } from "@/components/motion/MagneticButton";
import { SuccessState } from "@/components/sections/SuccessState";
import { EVENT_TYPE_OPTIONS } from "@/lib/constants";
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
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export function CinematicContactForm() {
  const [done, setDone] = useState(false);
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
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <label htmlFor="c-name" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-text-muted">
                Имя
              </label>
              <input
                id="c-name"
                autoComplete="name"
                className="w-full border-0 border-b border-border bg-transparent py-3 text-text-primary outline-none transition focus:border-accent focus:shadow-[0_1px_0_0_rgba(201,168,76,0.4)]"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "c-e-name" : undefined}
                {...register("name")}
              />
              {errors.name && (
                <p id="c-e-name" className="mt-2 text-xs text-red-400" role="alert">
                  {errors.name.message}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <label htmlFor="c-phone" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-text-muted">
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
                    className="w-full border-0 border-b border-border bg-transparent py-3 text-text-primary placeholder:text-text-secondary/40 outline-none transition focus:border-accent"
                    value={field.value}
                    onChange={(e) => field.onChange(formatRuPhoneInput(e.target.value))}
                    onBlur={field.onBlur}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? "c-e-phone" : undefined}
                  />
                )}
              />
              {errors.phone && (
                <p id="c-e-phone" className="mt-2 text-xs text-red-400" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <label htmlFor="c-email" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-text-muted">
                Email
              </label>
              <input
                id="c-email"
                type="email"
                autoComplete="email"
                className="w-full border-0 border-b border-border bg-transparent py-3 text-text-primary outline-none transition focus:border-accent"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "c-e-email" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id="c-e-email" className="mt-2 text-xs text-red-400" role="alert">
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <label htmlFor="c-type" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-text-muted">
                Тип мероприятия
              </label>
              <select
                id="c-type"
                className="w-full border-0 border-b border-border bg-transparent py-3 text-text-primary outline-none transition focus:border-accent"
                {...register("eventType")}
              >
                {EVENT_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-bg text-text-primary">
                    {o.label}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <label htmlFor="c-dates" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-text-muted">
                Ориентировочные сроки
              </label>
              <input
                id="c-dates"
                className="w-full border-0 border-b border-border bg-transparent py-3 text-text-primary placeholder:text-text-secondary/40 outline-none transition focus:border-accent"
                placeholder="Например: май 2026"
                aria-invalid={errors.dates ? true : undefined}
                aria-describedby={errors.dates ? "c-e-dates" : undefined}
                {...register("dates")}
              />
              {errors.dates && (
                <p id="c-e-dates" className="mt-2 text-xs text-red-400" role="alert">
                  {errors.dates.message}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: 0.22, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <label className="flex cursor-pointer gap-3 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-border bg-transparent text-accent focus:ring-accent"
                  {...register("consent")}
                />
                <span>
                  Согласен с{" "}
                  <Link href="/privacy-policy" className="text-accent underline-offset-2 hover:underline">
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>
              {errors.consent && (
                <p className="mt-2 text-xs text-red-400" role="alert">
                  {errors.consent.message}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="mt-12"
            >
              <MagneticButton>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="border border-accent bg-transparent px-10 py-5 text-xs font-medium uppercase tracking-[0.25em] text-text-primary transition hover:bg-accent/10 focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                >
                  {isSubmitting ? "Отправка…" : "Обсудить проект"}
                </button>
              </MagneticButton>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
