import type { ContactFormValues } from "@/lib/validators/contact";

export async function submitContactPayload(
  data: ContactFormValues & { phone: string }
): Promise<{ ok: boolean }> {
  const web3 = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (web3) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: web3,
        subject: `Заявка Закулисье: ${data.name}`,
        from_name: data.name,
        email: data.email,
        phone: data.phone,
        event_type: data.eventType,
        timeline: data.dates,
      }),
    });
    const json = (await res.json()) as { success?: boolean };
    return { ok: res.ok && Boolean(json.success) };
  }

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    return { ok: false };
  }
  const json = (await res.json()) as { success?: boolean };
  return { ok: Boolean(json.success) };
}
