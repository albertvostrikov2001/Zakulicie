/**
 * scripts/import-new-images.mjs
 *
 * 1) Конвертирует фото из папки "направления"  → public/services/*.webp
 *    (max 1600px, quality 82, с генерацией blurDataURL)
 * 2) Конвертирует фото из папки "Системно творчески про людей" → public/eventphrase/*.webp
 *    (max 1400px, quality 82)
 * 3) Выводит новые пути и blurDataURL для вставки в код
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");

// ─── helpers ─────────────────────────────────────────────────────────────────

async function toWebp(srcPath, destPath, maxWidth, quality) {
  const buf = await sharp(srcPath)
    .rotate()                                          // исправить EXIF-ориентацию
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toBuffer();
  fs.writeFileSync(destPath, buf);
  const kb = Math.round(buf.length / 1024);
  const srcKb = Math.round(fs.statSync(srcPath).size / 1024);
  console.log(`  ${path.basename(srcPath)} → ${path.basename(destPath)} (${srcKb} KB → ${kb} KB)`);
  return buf;
}

async function blurBase64(srcPath) {
  const buf = await sharp(srcPath)
    .rotate()
    .resize({ width: 12 })
    .webp({ quality: 30 })
    .toBuffer();
  return "data:image/webp;base64," + buf.toString("base64");
}

async function getSize(srcPath) {
  const meta = await sharp(srcPath).rotate().metadata();
  // after possible resize to 1600
  const w = Math.min(meta.width ?? 1600, 1600);
  const ratio = w / (meta.width ?? w);
  const h = Math.round((meta.height ?? 900) * ratio);
  return { width: w, height: h };
}

// ─── 1. SERVICE IMAGES ───────────────────────────────────────────────────────

const SERVICE_MAP = [
  { src: "направления/Корпоратив.jpg",                     slug: "korporativnye-meropriyatiya", alt: "Корпоративные мероприятия — event-агентство Закулисье Новосибирск" },
  { src: "направления/тимбилдинг.jpg",                     slug: "timbilding",                  alt: "Тимбилдинг — event-агентство Закулисье Новосибирск" },
  { src: "направления/Деловые мероприятия.jpg",            slug: "delovye-meropriyatiya",        alt: "Деловые мероприятия — event-агентство Закулисье Новосибирск" },
  { src: "направления/рекламная акция.jpg",                slug: "reklamnye-akcii",              alt: "Рекламные акции и активации — event-агентство Закулисье Новосибирск" },
  { src: "направления/аренда реквизита.jpg",               slug: "arenda-rekvizita",             alt: "Аренда реквизита — event-агентство Закулисье Новосибирск" },
  { src: "направления/режиссёрские мероприятия.jpg",       slug: "rezhissyorskie-meropriyatiya", alt: "Постановка и режиссура мероприятий — event-агентство Закулисье Новосибирск" },
];

const servicesOut = path.join(ROOT, "public", "services");
fs.mkdirSync(servicesOut, { recursive: true });

console.log("\n=== SERVICE IMAGES ===");
const serviceResults = [];
for (const item of SERVICE_MAP) {
  const srcAbs  = path.join(ROOT, item.src);
  const destRel = `/services/${item.slug}.webp`;
  const destAbs = path.join(ROOT, "public", destRel);

  await toWebp(srcAbs, destAbs, 1600, 82);
  const blur  = await blurBase64(srcAbs);
  const size  = await getSize(srcAbs);
  serviceResults.push({ slug: item.slug, src: destRel, alt: item.alt, blur, ...size });
}

// ─── 2. EVENTPHRASE IMAGES ───────────────────────────────────────────────────

const EP_SRCS = [
  "Системно творчески про людей/Корпоратив.jpg",
  "Системно творчески про людей/Тимбилдинг.jpg",
  "Системно творчески про людей/деловые.jpg",
  "Системно творчески про людей/открытие.jpg",
  "Системно творчески про людей/рекламные мероприятия.webp",
  "Системно творчески про людей/реквизит.jpg",
  "Системно творчески про людей/Реквизит 2.jpg",
  "Системно творчески про людей/Вармекс (213).jpg",
  "Системно творчески про людей/0FV3bwKGBPA.jpg",
  "Системно творчески про людей/p49T4_4rpkk.jpg",
  "Системно творчески про людей/yw7-UALOM6U.jpg",
];

const epOut = path.join(ROOT, "public", "eventphrase");
fs.mkdirSync(epOut, { recursive: true });

console.log("\n=== EVENTPHRASE IMAGES ===");
const epPaths = [];
for (let i = 0; i < EP_SRCS.length; i++) {
  const srcRel  = EP_SRCS[i];
  const srcAbs  = path.join(ROOT, srcRel);
  const fname   = String(i + 1).padStart(2, "0") + ".webp";
  const destRel = `/eventphrase/${fname}`;
  const destAbs = path.join(ROOT, "public", destRel);

  await toWebp(srcAbs, destAbs, 1400, 82);
  epPaths.push(destRel);
}

// ─── 3. PRINT RESULTS ────────────────────────────────────────────────────────

console.log("\n=== services.ts heroImage snippets ===");
for (const r of serviceResults) {
  console.log(`
  // ${r.slug}
  heroImage: {
    src: "${r.src}",
    alt: "${r.alt}",
    blurDataURL: "${r.blur.substring(0, 60)}...",
    width: ${r.width},
    height: ${r.height},
  },`);
}

console.log("\n=== EventPhrase IMAGE_SOURCES ===");
console.log("const IMAGE_SOURCES: string[] = [");
epPaths.forEach(p => console.log(`  "${p}",`));
console.log("];");

// ─── 4. WRITE JSON SIDECAR (for easy copy-paste) ─────────────────────────────

const sidecar = { services: serviceResults, eventphrase: epPaths };
fs.writeFileSync(
  path.join(ROOT, "scripts", "_new-images-data.json"),
  JSON.stringify(sidecar, null, 2)
);
console.log("\n✓ Данные сохранены в scripts/_new-images-data.json");
