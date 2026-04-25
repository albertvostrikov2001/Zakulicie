import { contactFormSchema, normalizeRuPhone } from "@/lib/validators/contact";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const EVENT_TYPE_LABELS: Record<string, string> = {
  corporate: "Корпоративное мероприятие",
  business: "Деловое событие",
  team: "Тимбилдинг",
  promo: "Рекламная акция",
  opening: "Открытие объекта",
  other: "Другое",
};

async function sendToTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });

  if (!res.ok) {
    console.error("Telegram send failed:", await res.text());
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = { ...parsed.data, phone: normalizeRuPhone(parsed.data.phone) };
  const eventLabel = EVENT_TYPE_LABELS[data.eventType] ?? data.eventType;

  const telegramText = [
    `🎯 <b>Новая заявка с сайта Закулисье</b>`,
    ``,
    `<b>Имя:</b> ${data.name}`,
    `<b>Компания:</b> ${data.company}`,
    `<b>Телефон:</b> ${data.phone}`,
    `<b>Email:</b> ${data.email}`,
    `<b>Тип мероприятия:</b> ${eventLabel}`,
    `<b>Сроки:</b> ${data.timeline}`,
    data.comment ? `<b>Комментарий:</b> ${data.comment}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const emailText = [
    `Имя: ${data.name}`,
    `Компания: ${data.company}`,
    `Телефон: ${data.phone}`,
    `Email: ${data.email}`,
    `Тип: ${eventLabel}`,
    `Сроки: ${data.timeline}`,
    data.comment ? `Комментарий: ${data.comment}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Отправка в Telegram (приоритет)
  await sendToTelegram(telegramText);

  // Отправка Email через Resend (опционально)
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (resendKey && toEmail) {
    const resend = new Resend(resendKey);
    const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
    await resend.emails.send({
      from,
      to: [toEmail],
      subject: `Заявка с сайта — ${data.company}`,
      text: emailText,
    });
  }

  return NextResponse.json({ ok: true });
}
