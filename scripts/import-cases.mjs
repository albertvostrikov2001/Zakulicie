/**
 * scripts/import-cases.mjs
 * Копирует и конвертирует фото кейсов из папки "Кейсы" в public/cases/[slug]/
 * Генерирует blurDataURL (base64) для каждого изображения
 * Запуск: node scripts/import-cases.mjs
 */

import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

const CASES_SOURCE = "D:\\Work Unity\\Zakulicie\\Кейсы";
const CASES_DEST = path.resolve("public", "cases");
const BLUR_OUTPUT = path.resolve("scripts", "blur-data.json");

/** Mapping: имя папки → slug */
const FOLDER_TO_SLUG = {
  "25летие стс": "25-let-sts",
  "Альфа-деньги казино": "alfa-dengi-kazino",
  "Аренда игрового реквизита": "arenda-rekvizita-syomka",
  "АртДом - дизайнеры со всей Сибири, образовательное мероприятие": "artdom",
  "Благотворительный бал": "blagotvoritelnyy-bal",
  "Болотнинская гофротара 2024 год": "bolotninskaya-gofrotara",
  "Ветеринарный фестиваль": "veterinarnyy-festival",
  "День шахтера - концерт": "den-shahtera",
  "Др Золотого яблока": "dr-zolotogo-yabloka",
  "Корпорат Леруа": "korporat-lerua",
  "Любимая кухня новогодний корпоратив Натальная карта": "lyubimaya-kuhnya-natalnaaya-karta",
  "Новогодний корпорат в русском стиле времена года": "novogodniy-russkiy-stil",
  "Открытие Леруа Мерлен 2015 Кемерово": "opening-lerua-kemerovo",
  "Открытие офисов альфа-банка": "opening-alfa-bank",
  "Открытие фонтана в центральном парке - Иванушки": "otkrytie-fontana-ivanushki",
  "Открытие Холилей классик Звездная ведущая - Ангарская": "opening-holiley-classic",
  "Праздники в жк чистая слобода": "prazdniki-chistaya-sloboda",
  "Премия я Волонтер": "premiya-ya-volonter",
  "Сображ, тц СибМолл": "sibmoll",
  "Спартакиада 6 лет, 7 раз": "spartakiada",
  "Съезд диллеров Металл профиль Регата": "syezd-dilerov-metall-profil",
  "Тимбилдинг Промэко": "timbilding-promeko",
  "Уголь России и майнинг - выставка": "ugol-rossii-mining",
  "Фэмэли Дэй Вармикс 25 лет компании": "family-day-warmex",
};

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".JPG", ".JPEG", ".PNG"]);

async function generateBlurDataURL(imagePath) {
  const blurBuffer = await sharp(imagePath)
    .resize(20, 12, { fit: "cover" })
    .webp({ quality: 20 })
    .toBuffer();
  return `data:image/webp;base64,${blurBuffer.toString("base64")}`;
}

async function getImageDimensions(imagePath) {
  const meta = await sharp(imagePath).metadata();
  return { width: meta.width ?? 1920, height: meta.height ?? 1080 };
}

async function convertToWebP(srcPath, destPath, options = {}) {
  const { maxWidth = 2400, quality = 82 } = options;
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await sharp(srcPath)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(destPath);
}

async function processCase(folderName, slug) {
  const srcDir = path.join(CASES_SOURCE, folderName);
  const destDir = path.join(CASES_DEST, slug);
  const galleryDir = path.join(destDir, "gallery");

  const allFiles = await fs.readdir(srcDir);
  const imageFiles = allFiles.filter((f) => IMAGE_EXTS.has(path.extname(f)));

  const coverFile = imageFiles.find((f) => f.toLowerCase().includes("обложка"));
  const galleryFiles = imageFiles
    .filter((f) => !f.toLowerCase().includes("обложка"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const result = { slug, cover: null, gallery: [] };

  if (!coverFile) {
    console.error(`  ❌ Cover not found in: ${folderName}`);
    return result;
  }

  const coverSrc = path.join(srcDir, coverFile);
  const coverDest = path.join(destDir, "cover.webp");

  await fs.mkdir(destDir, { recursive: true });

  try {
    await convertToWebP(coverSrc, coverDest, { maxWidth: 1920, quality: 85 });
    const blurDataURL = await generateBlurDataURL(coverSrc);
    const dims = await getImageDimensions(coverSrc);
    result.cover = { src: `/cases/${slug}/cover.webp`, blurDataURL, ...dims };
    console.log(`  ✓ cover: ${coverFile}`);
  } catch (err) {
    console.error(`  ❌ Cover error: ${err.message}`);
  }

  await fs.mkdir(galleryDir, { recursive: true });

  for (let i = 0; i < galleryFiles.length; i++) {
    const num = String(i + 1).padStart(2, "0");
    const srcFile = path.join(srcDir, galleryFiles[i]);
    const destFile = path.join(galleryDir, `${num}.webp`);

    try {
      await convertToWebP(srcFile, destFile, { maxWidth: 2400, quality: 82 });
      const blurDataURL = await generateBlurDataURL(srcFile);
      const dims = await getImageDimensions(srcFile);
      result.gallery.push({
        src: `/cases/${slug}/gallery/${num}.webp`,
        blurDataURL,
        ...dims,
      });
    } catch (err) {
      console.error(`  ❌ Gallery ${galleryFiles[i]}: ${err.message}`);
    }
  }

  console.log(`  ✓ gallery: ${galleryFiles.length} photos`);
  return result;
}

async function main() {
  console.log("🚀 Starting cases import...\n");

  const blurData = {};
  let totalCover = 0;
  let totalGallery = 0;

  for (const [folderName, slug] of Object.entries(FOLDER_TO_SLUG)) {
    const folderPath = path.join(CASES_SOURCE, folderName);
    if (!existsSync(folderPath)) {
      console.warn(`⚠️  Folder not found: ${folderName}`);
      continue;
    }

    console.log(`📁 Processing: ${folderName} → ${slug}`);
    const result = await processCase(folderName, slug);

    blurData[slug] = {
      cover: result.cover,
      gallery: result.gallery,
    };

    if (result.cover) totalCover++;
    totalGallery += result.gallery.length;
  }

  await fs.writeFile(BLUR_OUTPUT, JSON.stringify(blurData, null, 2), "utf-8");

  console.log(`\n✅ Done!`);
  console.log(`   Covers processed: ${totalCover}`);
  console.log(`   Gallery photos:   ${totalGallery}`);
  console.log(`   Blur data saved:  ${BLUR_OUTPUT}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
