import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const ROOT = path.resolve(".");
const BLUR_PATH = path.join(ROOT, "lib", "content", "blur-data.json");
const DESKTOP = path.join(process.env.USERPROFILE || "", "Desktop", "кейсы новые");

const UPDATES = [
  {
    slug: "opening-holiley-classic",
    source: "Открытие гипермаркета Холидей — премиум-сегмент.jpg",
  },
  {
    slug: "syezd-dilerov-metall-profil",
    source: "Стратегическая встреча и тимбилдинг для дилеров Металл Профиль в парусном клубе .jpg",
  },
];

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

  for (const item of UPDATES) {
    const srcPath = path.join(DESKTOP, item.source);
    if (!existsSync(srcPath)) {
      const files = await fs.readdir(DESKTOP);
      const hit = files.find((f) => f.replace(/\s+/g, " ").trim().includes(item.source.replace(/\s+/g, " ").trim().slice(0, 40)));
      if (!hit) throw new Error(`Source not found: ${item.source}`);
      item.resolved = path.join(DESKTOP, hit);
    } else {
      item.resolved = srcPath;
    }

    const destDir = path.join(ROOT, "public", "cases", item.slug);
    const coverPath = path.join(destDir, "cover.webp");
    await fs.mkdir(destDir, { recursive: true });

    const tmp = path.join(destDir, "_cover_src.jpg");
    await fs.copyFile(item.resolved, tmp);
    await sharp(tmp).rotate().resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 85 }).toFile(coverPath);
    await fs.unlink(tmp).catch(() => {});

    const { blurDataURL, width, height } = await generateBlur(coverPath);
    const existing = blurData[item.slug] ?? { gallery: [] };
    blurData[item.slug] = {
      ...existing,
      cover: {
        src: `/cases/${item.slug}/cover.webp`,
        blurDataURL,
        width,
        height,
      },
    };
    console.log(`Updated cover: ${item.slug}`);
  }

  await fs.writeFile(BLUR_PATH, JSON.stringify(blurData, null, 2));
  console.log("Updated blur-data.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
