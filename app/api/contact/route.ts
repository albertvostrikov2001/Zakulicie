import { contactFormSchema, normalizeRuPhone } from "@/lib/validators/contact";
import { NextRequest, NextResponse } from "next/server";

const EVENT_TYPE_LABELS: Record<string, string> = {
  corporate: "Корпоративное мероприятие",
  business: "Деловое событие",
  team: "Тимбилдинг",
  promo: "Рекламная акция",
  opening: "Открытие объекта",
  other: "Другое",
};

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const { name, phone, email, eventType, dates } = parsed.data;
  const normalized = normalizeRuPhone(phone);
  const eventLabel = EVENT_TYPE_LABELS[eventType] ?? eventType;

  const plainLines = [
    "Новая заявка — Закулисье",
    "",
    `Имя: ${name}`,
    `Телефон: ${normalized}`,
    `Email: ${email}`,
    `Тип: ${eventLabel}`,
    `Сроки: ${dates}`,
  ];
  const plain = plainLines.join("\n");

  const text = `🎯 <b>Новая заявка — Закулисье</b>

<b>Имя:</b> ${escapeHtml(name)}
<b>Телефон:</b> ${escapeHtml(normalized)}
<b>Email:</b> ${escapeHtml(email)}
<b>Тип:</b> ${escapeHtml(eventLabel)}
<b>Сроки:</b> ${escapeHtml(dates)}`;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  let delivered = false;

  if (token && chatId) {
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
    delivered = res.ok;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!delivered && resendKey && toEmail) {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);
    const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
    const r = await resend.emails.send({
      from,
      to: [toEmail],
      subject: `Заявка с сайта — ${name}`,
      text: plain,
    });
    delivered = !r.error;
  }

  if (!delivered && !token && !resendKey) {
    return NextResponse.json({ error: "Server not configured" }, { status: 503 });
  }

  if (!delivered) {
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
