/**
 * scripts/import-gallery.mjs
 * Импортирует фото из "сайт фото/{папка}" в public/cases/{slug}/gallery/
 * Конвертирует JPG→WebP, обновляет lib/content/blur-data.json
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Маппинг: ключевое слово (trim+lower) → слаг
const KEYWORD_MAP = [
  { key: "металлпрофиль2",                      slug: "spartakiada-metall-profil" },
  { key: "30 лет металлпрофиль",                slug: "yubilej-30-let-metall-profil" },
  { key: "альфа нг",                            slug: "novogodnij-korporativ-alfa-dengi" },
  { key: "аренда",                              slug: "arenda-rekvizita-syomka" },
  { key: "арт дом",                             slug: "artdom-dizajn-konferenciya" },
  { key: "бал",                                 slug: "blagotvoritelnyj-bal-detskaya-ploshchadka" },
  { key: "вармекс",                             slug: "semejnyj-korporativ-varmix-warmax" },
  { key: "ветеринарный форум",                  slug: "veterinarnyj-forum" },
  { key: "гофротара",                           slug: "yubilej-bolotninskaya-gofrotara" },
  { key: "день шахтера",                        slug: "den-shahtera-prokopevsk" },
  { key: "золотое яблоко",                      slug: "dr-zolotoe-yabloko-master-klassy" },
  { key: "леруа корпорат",                      slug: "korporat-lerua" },
  { key: "леруа сезон",                         slug: "otkrytie-stroitelnogo-sezona-lerua" },
  { key: "любимая кухня нг",                    slug: "korporativ-lyubimaya-kuhnya" },
  { key: "нг металлпрофиль",                    slug: "korporativ-metall-profil-ng" },
  { key: "стс",                                 slug: "yubilej-sts-25-let" },
  { key: "уголь",                               slug: "ugol-rossii-majning" },
  { key: "холидей",                             slug: "opening-holiley-classic" },
  { key: "центральный парк",                    slug: "otkrytie-fontana-centralnyj-park" },
  { key: "чб фест",                             slug: "cherno-belyj-fest-sibirskij-moll" },
  { key: "я волонтер",                          slug: "ceremoniya-ya-volonter" },
];

// Найдём папку "сайт фото" через перебор (кириллица может не работать как литерал)
const allRootDirs = fs.readdirSync(ROOT);
const siteFotoDir = allRootDirs.find(d => d.includes("фото") && !d.includes("облож"));
if (!siteFotoDir) throw new Error("Папка 'сайт фото' не найдена в корне проекта");
const SRC_ROOT = path.join(ROOT, siteFotoDir);
const CASES_ROOT = path.join(ROOT, "public", "cases");
const BLUR_DATA_PATH = path.join(ROOT, "lib", "content", "blur-data.json");

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function toWebp(srcPath, destPath) {
  const buf = await sharp(srcPath)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 72, effort: 4 })
    .toBuffer();
  fs.writeFileSync(destPath, buf);
  const kb = Math.round(buf.length / 1024);
  console.log(`    ${path.basename(srcPath)} → ${path.basename(destPath)} (${kb} KB)`);
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

async function getDims(srcPath, maxWidth = 1200) {
  const meta = await sharp(srcPath).rotate().metadata();
  const w = Math.min(meta.width ?? maxWidth, maxWidth);
  const ratio = w / (meta.width ?? w);
  const h = Math.round((meta.height ?? 900) * ratio);
  return { width: w, height: h };
}

async function main() {
  const blurData = JSON.parse(fs.readFileSync(BLUR_DATA_PATH, "utf-8"));

  // Реальные папки на диске
  const actualFolders = fs.readdirSync(SRC_ROOT).filter(f =>
    fs.statSync(path.join(SRC_ROOT, f)).isDirectory()
  );

  // Строим MAP: реальное имя → slug (нормализуем Unicode NFD→NFC)
  const MAP = [];
  for (const actual of actualFolders) {
    const norm = actual.normalize("NFC").trim().toLowerCase();
    const match = KEYWORD_MAP.find(({ key }) => norm.includes(key.normalize("NFC")));
    if (match) {
      MAP.push({ folder: actual, slug: match.slug });
    } else {
      console.log(`⚠  Нет маппинга для папки: "${actual}"`);
    }
  }

  for (const { folder, slug } of MAP) {
    const srcDir = path.join(SRC_ROOT, folder);
    if (!fs.existsSync(srcDir)) {
      console.log(`⚠  Папка не найдена: "${folder}" — пропускаю`);
      continue;
    }

    const files = fs
      .readdirSync(srcDir)
      .filter((f) => IMG_EXT.has(path.extname(f).toLowerCase()))
      .sort();

    if (files.length === 0) {
      console.log(`⚠  Нет фото в "${folder}" — пропускаю`);
      continue;
    }

    const galleryDir = path.join(CASES_ROOT, slug, "gallery");
    fs.mkdirSync(galleryDir, { recursive: true });

    // Удаляем старые webp из галереи
    if (fs.existsSync(galleryDir)) {
      for (const old of fs.readdirSync(galleryDir)) {
        if (old.endsWith(".webp")) fs.unlinkSync(path.join(galleryDir, old));
      }
    }

    console.log(`\n📁 ${folder} → ${slug} (${files.length} фото)`);

    const galleryEntries = [];

    for (let i = 0; i < files.length; i++) {
      const srcFile = path.join(srcDir, files[i]);
      const num = String(i + 1).padStart(2, "0");
      const destFile = path.join(galleryDir, `${num}.webp`);

      await toWebp(srcFile, destFile);
      const blur = await blurBase64(srcFile);
      const dims = await getDims(srcFile);

      galleryEntries.push({
        src: `/cases/${slug}/gallery/${num}.webp`,
        blurDataURL: blur,
        width: dims.width,
        height: dims.height,
      });
    }

    // Обновляем blur-data.json: сохраняем cover если есть, меняем gallery
    if (!blurData[slug]) blurData[slug] = {};
    blurData[slug].gallery = galleryEntries;

    console.log(`  ✓ ${files.length} фото, blur-data обновлён`);
  }

  fs.writeFileSync(BLUR_DATA_PATH, JSON.stringify(blurData, null, 2));
  console.log("\n✅ Готово! blur-data.json сохранён.");
}

main().catch((e) => { console.error(e); process.exit(1); });
