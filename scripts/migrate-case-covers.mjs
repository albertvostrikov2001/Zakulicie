/**
 * Migrates case folders to new slugs and applies cover images from assets/.
 * Run: node scripts/migrate-case-covers.mjs
 */
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const ROOT = path.resolve(".");
const ASSETS_CANDIDATES = [
  path.join(ROOT, "assets"),
  path.join(process.env.USERPROFILE || "", ".cursor", "projects", "d-Work-Unity-Zakulicie", "assets"),
];

async function resolveAssetsDir() {
  for (const dir of ASSETS_CANDIDATES) {
    if (existsSync(dir)) return dir;
  }
  throw new Error(`Assets not found. Tried: ${ASSETS_CANDIDATES.join(", ")}`);
}
const CASES_DIR = path.join(ROOT, "public", "cases");
const BLUR_PATH = path.join(ROOT, "lib", "content", "blur-data.json");

const CASES = [
  { slug: "spartakiada-metall-profil", legacySlug: "spartakiada", assetMatch: "65f07c17" },
  { slug: "yubilej-bolotninskaya-gofrotara", legacySlug: "bolotninskaya-gofrotara", assetMatch: "4c33cdf3" },
  { slug: "artdom-dizajn-konferenciya", legacySlug: "artdom", assetMatch: "a24b08ca" },
  { slug: "veterinarnyj-forum", legacySlug: "veterinarnyy-festival", assetMatch: "f962de77" },
  { slug: "novogodnij-korporativ-alfa-dengi", legacySlug: "alfa-dengi-kazino", assetMatch: "7685e9f3" },
  { slug: "otkrytie-fontana-centralnyj-park", legacySlug: "otkrytie-fontana-ivanushki", assetMatch: "22253c5e" },
  { slug: "yubilej-sts-25-let", legacySlug: "25-let-sts", assetMatch: "3aa05735" },
  { slug: "korporativ-lyubimaya-kuhnya", legacySlug: "lyubimaya-kuhnya-natalnaaya-karta", assetMatch: "d53b5d2a" },
  { slug: "otkrytie-lerua-merlen-kemerovo", legacySlug: "opening-lerua-kemerovo", assetMatch: "c53fce61" },
  { slug: "dr-zolotoe-yabloko-master-klassy", legacySlug: "dr-zolotogo-yabloka", assetMatch: "e33d82c5" },
  { slug: "cherno-belyj-fest-sibirskij-moll", legacySlug: "sibmoll", assetMatch: "3f0b6127" },
  { slug: "korporativ-metall-profil-ng", legacySlug: "novogodniy-russkiy-stil", assetMatch: "8d9b5290" },
  { slug: "semejnyj-korporativ-varmix-warmax", legacySlug: "family-day-warmex", assetMatch: "ba1af89f" },
  { slug: "obuchenie-detej-pdd", legacySlug: null, assetMatch: "2f8bba93" },
  { slug: "blagotvoritelnyj-bal-detskaya-ploshchadka", legacySlug: "blagotvoritelnyy-bal", assetMatch: "61c78b61" },
  { slug: "otkrytie-ofisov-alfa-bank", legacySlug: "opening-alfa-bank", assetMatch: "14b3bb66" },
  { slug: "den-shahtera-prokopevsk", legacySlug: "den-shahtera", assetMatch: null },
  { slug: "ceremoniya-ya-volonter", legacySlug: "premiya-ya-volonter", assetMatch: "546b9b31" },
  { slug: "ugol-rossii-majning", legacySlug: "ugol-rossii-mining", assetMatch: null },
];

async function findAsset(match) {
  if (!match) return null;
  const assetsDir = await resolveAssetsDir();
  const files = await fs.readdir(assetsDir);
  const hit = files.find((f) => f.includes(match));
  return hit ? path.join(assetsDir, hit) : null;
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else await fs.copyFile(s, d);
  }
}

async function generateBlur(imagePath) {
  const blurBuffer = await sharp(imagePath).resize(20, 12, { fit: "cover" }).webp({ quality: 20 }).toBuffer();
  const meta = await sharp(imagePath).metadata();
  return {
    blurDataURL: `data:image/webp;base64,${blurBuffer.toString("base64")}`,
    width: meta.width ?? 1920,
    height: meta.height ?? 1080,
  };
}

async function main() {
  const blurData = JSON.parse(await fs.readFile(BLUR_PATH, "utf8"));

  for (const c of CASES) {
    const destDir = path.join(CASES_DIR, c.slug);
    const legacyDir = c.legacySlug ? path.join(CASES_DIR, c.legacySlug) : null;

    if (!existsSync(destDir)) {
      if (legacyDir && existsSync(legacyDir)) {
        await copyDir(legacyDir, destDir);
        console.log(`Copied ${c.legacySlug} → ${c.slug}`);
      } else {
        await fs.mkdir(destDir, { recursive: true });
        console.log(`Created ${c.slug}`);
      }
    }

    const assetPath = await findAsset(c.assetMatch);
    const coverPath = path.join(destDir, "cover.webp");

    let blurSource = coverPath;
    if (assetPath) {
      const tmp = path.join(destDir, "_cover_src.png");
      await fs.copyFile(assetPath, tmp);
      await sharp(tmp).rotate().resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 85 }).toFile(coverPath);
      await fs.unlink(tmp).catch(() => {});
      console.log(`Cover: ${c.slug} ← ${path.basename(assetPath).slice(0, 60)}…`);
    } else if (legacyDir && existsSync(path.join(legacyDir, "cover.webp"))) {
      await fs.copyFile(path.join(legacyDir, "cover.webp"), coverPath);
      console.log(`Cover fallback: ${c.slug} from legacy`);
    }

    const legacyBlur = c.legacySlug ? blurData[c.legacySlug] : null;
    const { blurDataURL, width, height } = existsSync(coverPath)
      ? await generateBlur(coverPath)
      : legacyBlur?.cover
        ? {
            blurDataURL: legacyBlur.cover.blurDataURL,
            width: legacyBlur.cover.width,
            height: legacyBlur.cover.height,
          }
        : { blurDataURL: "", width: 1920, height: 1080 };

    blurData[c.slug] = {
      cover: {
        src: `/cases/${c.slug}/cover.webp`,
        blurDataURL,
        width,
        height,
      },
      gallery: legacyBlur?.gallery?.map((g) => ({
        ...g,
        src: g.src.replace(`/cases/${c.legacySlug}/`, `/cases/${c.slug}/`),
      })) ?? [],
    };
  }

  await fs.writeFile(BLUR_PATH, JSON.stringify(blurData, null, 2));
  console.log("Updated blur-data.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
