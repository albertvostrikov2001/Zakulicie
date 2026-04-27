import { z } from "zod";

const eventTypes = ["corporate", "business", "team", "promo", "opening", "other"] as const;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя"),
  phone: z
    .string()
    .trim()
    .min(5)
    .refine(
      (v) => {
        const d = v.replace(/\D/g, "");
        if (d.length === 11 && (d.startsWith("7") || d.startsWith("8"))) return true;
        if (d.length === 10) return true;
        return false;
      },
      { message: "Телефон в формате +7" }
    ),
  email: z.string().trim().email("Некорректный email"),
  eventType: z.enum(eventTypes),
  dates: z.string().trim().min(1, "Укажите ориентировочные сроки"),
  consent: z.boolean().refine((v) => v === true, { message: "Нужно согласие с политикой" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export function normalizeRuPhone(input: string): string {
  const d = input.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("8")) return `+7${d.slice(1)}`;
  if (d.length === 11 && d.startsWith("7")) return `+${d}`;
  if (d.length === 10) return `+7${d}`;
  return input.trim();
}
