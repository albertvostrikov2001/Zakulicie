"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { trackContactFormSubmit } from "@/lib/analytics/client";
import { EVENT_TYPE_OPTIONS } from "@/lib/constants";
import {
  contactFormSchema,
  normalizeRuPhone,
  type ContactFormValues,
} from "@/lib/validators/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  idPrefix?: string;
  className?: string;
};

export function ContactForm({ idPrefix = "cf", className }: Props) {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      eventType: "corporate",
      consent: false,
      comment: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("idle");
    const payload = { ...data, phone: normalizeRuPhone(data.phone) };
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus("ok");
      trackContactFormSubmit();
      reset();
      return;
    }
    setStatus("err");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-name`} className="mb-1 block text-xs text-text-secondary">
            Имя
          </label>
          <Input id={`${idPrefix}-name`} autoComplete="name" {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-company`} className="mb-1 block text-xs text-text-secondary">
            Компания
          </label>
          <Input id={`${idPrefix}-company`} autoComplete="organization" {...register("company")} />
          {errors.company && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              {errors.company.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-phone`} className="mb-1 block text-xs text-text-secondary">
            Телефон
          </label>
          <Input
            id={`${idPrefix}-phone`}
            type="tel"
            placeholder="+7 (___) ___-__-__"
            autoComplete="tel"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-email`} className="mb-1 block text-xs text-text-secondary">
            Email
          </label>
          <Input id={`${idPrefix}-email`} type="email" autoComplete="email" {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${idPrefix}-type`} className="mb-1 block text-xs text-text-secondary">
            Тип мероприятия
          </label>
          <Select id={`${idPrefix}-type`} {...register("eventType")}>
            {EVENT_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${idPrefix}-time`} className="mb-1 block text-xs text-text-secondary">
            Ориентировочные сроки
          </label>
          <Input id={`${idPrefix}-time`} placeholder="Например: май 2026" {...register("timeline")} />
          {errors.timeline && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              {errors.timeline.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${idPrefix}-msg`} className="mb-1 block text-xs text-text-secondary">
            Комментарий{" "}
            <span className="text-text-muted">— по желанию</span>
          </label>
          <Textarea id={`${idPrefix}-msg`} {...register("comment")} />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <label className="flex max-w-md cursor-pointer gap-3 text-xs text-text-secondary">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-border" {...register("consent")} />
          <span>
            Согласен с{" "}
            <Link href="/privacy-policy" className="text-accent underline-offset-2 hover:underline">
              политикой конфиденциальности
            </Link>
          </span>
        </label>
        {errors.consent && (
          <p className="text-xs text-red-400" role="alert">
            {errors.consent.message}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-[200px]">
          {isSubmitting ? "Отправка…" : "Отправить"}
        </Button>
        {status === "ok" && (
          <p className="text-sm text-text-secondary" role="status">
            Заявка отправлена. Мы свяжемся с вами.
          </p>
        )}
        {status === "err" && (
          <p className="text-sm text-red-400" role="alert">
            Не удалось отправить. Попробуйте позже или напишите на почту.
          </p>
        )}
      </div>
    </form>
  );
}
