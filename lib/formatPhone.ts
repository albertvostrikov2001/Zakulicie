/** Маска: +7 (XXX) XXX-XX-XX */
export function formatPhone(value: string): string {
  let v = value.replace(/\D/g, "");
  if (v.startsWith("7") || v.startsWith("8")) v = v.slice(1);
  let out = "+7";
  if (v.length > 0) out += " (" + v.slice(0, 3);
  if (v.length >= 3) out += ") " + v.slice(3, 6);
  if (v.length >= 6) out += "-" + v.slice(6, 8);
  if (v.length >= 8) out += "-" + v.slice(8, 10);
  return out;
}
