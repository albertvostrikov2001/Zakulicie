/**
 * Applies new cover images from "кейсы новые" folder to public/cases directories.
 * Also fixes portrait/square cover issues using gallery images where needed.
 * Run: node scripts/apply-new-covers.mjs
 */
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const ROOT = path.resolve(".");
const CASES_DIR = path.join(ROOT, "public", "cases");
const BLUR_PATH = path.join(ROOT, "lib", "content", "blur-data.json");
const NEW_COVERS_DIR = path.join(ROOT, "кейсы новые");

// Maps filename keyword → slug
const NEW_COVER_MAP = [
  { match: "Арт-дом", slug: "artdom-dizajn-konferenciya", focal: "center center" },
  { match: "Благотворительный бал", slug: "blagotvoritelnyj-bal-detskaya-ploshchadka", focal: "center center" },
  { match: "Ветеринарный форум", slug: "veterinarnyj-forum", focal: "right center" },
  { match: "Уголь России", slug: "ugol-rossii-majning", focal: "center center" },
  { match: "Золотое Яблоко", slug: "dr-zolotoe-yabloko-master-klassy", focal: "center center" },
  { match: "Любимая кухня", slug: "korporativ-lyubimaya-kuhnya", focal: "center center" },
  { match: "Альфа-деньги", slug: "novogodnij-korporativ-alfa-dengi", focal: "center center" },
  { match: "Металл Профиль", slug: "korporativ-metall-profil-ng", focal: "center center" },
  { match: "Обучение детей", slug: "obuchenie-detej-pdd", focal: "center center" },
  { match: "Леруа Мерлен", slug: "otkrytie-lerua-merlen-kemerovo", focal: "center center" },
  { match: "Альфа-Банка", slug: "otkrytie-ofisov-alfa-bank", focal: "center center" },
  { match: "фонтана", slug: "otkrytie-fontana-centralnyj-park", focal: "center center" },
  // Skip "den-shahtera" (champagne glass doesn't fit miners' concert case)
  { match: "Varmix", slug: "semejnyj-korporativ-varmix-warmax", focal: "center center" },
  { match: "Спартакиада", slug: null }, // portrait — handled separately via gallery
  { match: "волонтер", slug: "ceremoniya-ya-volonter", focal: "center center" },
  { match: "Сибирском Молле", slug: "cherno-belyj-fest-sibirskij-moll", focal: "center center" },
  { match: "Болотнин", slug: "yubilej-bolotninskaya-gofrotara", focal: "center top" },
  { match: "СТС", slug: "yubilej-sts-25-let", focal: "center center" },
];

// Gallery-based cover fixes (portrait/square covers that need landscape gallery images)
const GALLERY_COVER_FIXES = [
  {
    slug: "spartakiada-metall-profil",
    gallerySrc: path.join(CASES_DIR, "spartakiada-metall-profil", "gallery", "07.webp"),
    focal: "center center",
  },
  {
    slug: "syezd-dilerov-metall-profil",
    gallerySrc: path.join(CASES_DIR, "syezd-dilerov-metall-profil", "gallery", "07.webp"),
    focal: "center center",
  },
  {
    slug: "opening-holiley-classic",
    gallerySrc: path.join(CASES_DIR, "opening-holiley-classic", "gallery", "01.webp"),
    focal: "center center",
  },
];

async function generateBlur(imagePath) {
  const blurBuffer = await sharp(imagePath)
    .resize(20, 12, { fit: "cover" })
    .webp({ quality: 20 })
    .toBuffer();
  const meta = await sharp(imagePath).metadata();
  return {
    blurDataURL: `data:image/webp;base64,${blurBuffer.toString("base64")}`,
    width: meta.width ?? 1920,
    height: meta.height ?? 1080,
  };
}

async function main() {
  const blurData = JSON.parse(await fs.readFile(BLUR_PATH, "utf8"));
  const newCoverFiles = await fs.readdir(NEW_COVERS_DIR);

  // === Phase 1: Convert "кейсы новые" JPGs → cover.webp ===
  console.log("\n=== Phase 1: New JPG covers ===");
  for (const entry of NEW_COVER_MAP) {
    if (!entry.slug) continue;

    const srcFile = newCoverFiles.find((f) => f.includes(entry.match));
    if (!srcFile) {
      console.warn(`  SKIP (not found): ${entry.match}`);
      continue;
    }

    const srcPath = path.join(NEW_COVERS_DIR, srcFile);
    const destDir = path.join(CASES_DIR, entry.slug);
    const destCover = path.join(destDir, "cover.webp");

    await fs.mkdir(destDir, { recursive: true });

    // Convert JPG → WebP, resize to max 2000px wide
    await sharp(srcPath)
      .rotate()
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 83 })
      .toFile(destCover);

    const { blurDataURL, width, height } = await generateBlur(destCover);
    blurData[entry.slug] = {
      cover: { src: `/cases/${entry.slug}/cover.webp`, blurDataURL, width, height },
      gallery: blurData[entry.slug]?.gallery ?? [],
    };

    console.log(`  ✓ ${entry.slug} ← ${srcFile.slice(0, 55)}`);
  }

  // === Phase 2: Gallery-based cover fixes ===
  console.log("\n=== Phase 2: Gallery cover fixes ===");
  for (const fix of GALLERY_COVER_FIXES) {
    if (!existsSync(fix.gallerySrc)) {
      console.warn(`  SKIP (gallery not found): ${fix.slug}`);
      continue;
    }

    const destDir = path.join(CASES_DIR, fix.slug);
    const destCover = path.join(destDir, "cover.webp");

    await fs.mkdir(destDir, { recursive: true });

    // Resize gallery image to cover size
    await sharp(fix.gallerySrc)
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 83 })
      .toFile(destCover);

    const { blurDataURL, width, height } = await generateBlur(destCover);
    blurData[fix.slug] = {
      cover: { src: `/cases/${fix.slug}/cover.webp`, blurDataURL, width, height },
      gallery: blurData[fix.slug]?.gallery ?? [],
    };

    console.log(`  ✓ ${fix.slug} ← gallery ${path.basename(fix.gallerySrc)}`);
  }

  // === Phase 3: Write updated blur-data.json ===
  await fs.writeFile(BLUR_PATH, JSON.stringify(blurData, null, 2));
  console.log("\n✓ Updated lib/content/blur-data.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
