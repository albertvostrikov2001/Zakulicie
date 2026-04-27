import { interpolateColor } from "@/lib/utils/interpolateColor";

/** Интерполяция hex → CSS `rgb()` для custom properties и style. */
export function interpolateHex(from: string, to: string, progress: number): string {
  return interpolateColor(from, to, progress);
}
