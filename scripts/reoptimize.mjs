/**
 * scripts/reoptimize.mjs
 * Переоптимизирует изображения превышающие лимиты размера
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

async function reoptimize(filePath, maxWidth, quality, maxSizeKB) {
  const stats = fs.statSync(filePath);
  if (stats.size / 1024 <= maxSizeKB) return false;

  const inputBuf = fs.readFileSync(filePath);
  const buf = await sharp(inputBuf)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();

  fs.writeFileSync(filePath, buf);
  const newSizeKB = Math.round(buf.length / 1024);
  const label = path.basename(path.dirname(filePath)) + "/" + path.basename(filePath);
  const oldKB = Math.round(stats.size / 1024);
  console.log("  " + label + ": " + oldKB + " KB -> " + newSizeKB + " KB");
  return true;
}

async function main() {
  const casesDir = "public/cases";
  const slugs = fs.readdirSync(casesDir);
  let count = 0;

  for (const slug of slugs) {
    const coverPath = path.join(casesDir, slug, "cover.webp");
    if (fs.existsSync(coverPath)) {
      if (await reoptimize(coverPath, 1600, 72, 350)) count++;
    }
    const galleryDir = path.join(casesDir, slug, "gallery");
    if (fs.existsSync(galleryDir)) {
      for (const f of fs.readdirSync(galleryDir)) {
        if (f.endsWith(".webp")) {
          if (await reoptimize(path.join(galleryDir, f), 1000, 52, 250)) count++;
        }
      }
    }
  }
  console.log("\nDone: " + count + " files reoptimized");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
