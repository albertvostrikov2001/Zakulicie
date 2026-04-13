import { contactFormSchema, normalizeRuPhone } from "@/lib/validators/contact";
import { Resend } from "resend";
import { NextResponse } from "next/server";

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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (apiKey && to) {
    const resend = new Resend(apiKey);
    const text = [
      `Имя: ${data.name}`,
      `Компания: ${data.company}`,
      `Телефон: ${data.phone}`,
      `Email: ${data.email}`,
      `Тип: ${data.eventType}`,
      `Сроки: ${data.timeline}`,
      data.comment ? `Комментарий: ${data.comment}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `Заявка с сайта — ${data.company}`,
      text,
    });

    if (error) {
      return NextResponse.json({ error: "Email send failed" }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
