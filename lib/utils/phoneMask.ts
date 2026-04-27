/** Маска отображения +7 (___) ___-__-__ */
export function formatRuPhoneInput(raw: string): string {
  const d = raw.replace(/\D/g, "");
  let n = d;
  if (n.startsWith("8")) n = "7" + n.slice(1);
  if (n.length > 0 && !n.startsWith("7")) n = "7" + n.replace(/^7+/, "");
  n = n.slice(0, 11);
  const a = n.slice(1);
  if (a.length === 0) return n ? "+7" : "";
  let out = "+7 (";
  out += a.slice(0, 3);
  if (a.length >= 3) out += ") ";
  out += a.slice(3, 6);
  if (a.length > 6) out += "-" + a.slice(6, 8);
  if (a.length > 8) out += "-" + a.slice(8, 10);
  return out;
}
