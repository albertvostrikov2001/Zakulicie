/** Цели аналитики после успешной отправки формы (без ошибок, если счётчики не загружены). */
export function trackContactFormSubmit(): void {
  if (typeof window === "undefined") return;

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", "form_submit", { form_id: "contact" });

  const ymId = process.env.NEXT_PUBLIC_YM_ID;
  const ym = (window as unknown as { ym?: (id: number, ev: string, goal: string) => void }).ym;
  if (ymId && ym) {
    const id = Number(ymId);
    if (!Number.isNaN(id)) ym(id, "reachGoal", "contact_form");
  }
}
