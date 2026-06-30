import type { ContactFormValues } from "@/lib/validators/contact";

const EVENT_TYPE_LABELS: Record<string, string> = {
  corporate: "Корпоративное мероприятие",
  business: "Деловое событие",
  team: "Тимбилдинг",
  promo: "Рекламная акция",
  opening: "Открытие объекта",
  other: "Другое",
};

async function submitViaWeb3Forms(
  data: ContactFormValues & { phone: string },
  accessKey: string,
): Promise<boolean> {
  const eventLabel = EVENT_TYPE_LABELS[data.eventType] ?? data.eventType;
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Новая заявка: ${data.name} — ${data.phone}`,
      from_name: "Сайт Закулисье",
      "Имя":        data.name,
      "Телефон":    data.phone,
      "Мероприятие": eventLabel,
      "Дата":       data.dates?.trim() || "не указаны",
    }),
  });
  const json = (await res.json()) as { success?: boolean };
  return res.ok && Boolean(json.success);
}

export async function submitContactPayload(
  data: ContactFormValues & { phone: string },
): Promise<{ ok: boolean }> {
  const web3 = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (web3) {
    return { ok: await submitViaWeb3Forms(data, web3) };
  }

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.status === 404 || res.status === 405) {
      return { ok: false };
    }

    if (!res.ok) {
      return { ok: false };
    }

    const json = (await res.json()) as { success?: boolean };
    return { ok: Boolean(json.success) };
  } catch {
    return { ok: false };
  }
}
