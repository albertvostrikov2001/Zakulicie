/**
 * Batch image optimizer using sharp.
 * Resizes and re-encodes all WebP/JPG images in public/ to web-appropriate sizes.
 *
 * Targets:
 *   covers        — max 1400px wide, WebP quality 80
 *   gallery items — max 900px wide,  WebP quality 75
 *   services      — max 1400px wide, WebP quality 80
 *   blog          — max 1200px wide, WebP quality 80
 *   testimonials  — max 400px wide,  WebP quality 82
 *
 * Run: node scripts/optimize-images.mjs
 * Safe to re-run — skips files already within size budget.
 */

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

// ── Rules ────────────────────────────────────────────────────────────────────
const RULES = [
  {
    // Case gallery items (not covers)
    pattern: /\/cases\/[^/]+\/gallery\/[^/]+\.(webp|jpg|jpeg|png)$/i,
    maxWidth: 900,
    maxHeight: 1400,
    quality: 75,
    budgetKB: 130,
  },
  {
    // Case cover images
    pattern: /\/cases\/[^/]+\/cover\.(webp|jpg|jpeg|png)$/i,
    maxWidth: 1400,
    maxHeight: 1050,
    quality: 80,
    budgetKB: 300,
  },
  {
    // Service hero images
    pattern: /\/services\/[^/]+\.(webp|jpg|jpeg|png)$/i,
    maxWidth: 1400,
    maxHeight: 1050,
    quality: 80,
    budgetKB: 300,
  },
  {
    // Blog cover images
    pattern: /\/blog\/[^/]+\.(webp|jpg|jpeg|png)$/i,
    maxWidth: 1200,
    maxHeight: 900,
    quality: 80,
    budgetKB: 250,
  },
  {
    // Testimonial photos
    pattern: /\/testimonials\/[^/]+\.(webp|jpg|jpeg|png)$/i,
    maxWidth: 400,
    maxHeight: 400,
    quality: 82,
    budgetKB: 60,
  },
  {
    // Site-wide images (SiteView.jpg etc.)
    pattern: /\/public\/[^/]+\.(webp|jpg|jpeg|png)$/i,
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 80,
    budgetKB: 500,
  },
];

function findRule(absPath) {
  const rel = absPath.replace(/\\/g, "/");
  return RULES.find((r) => r.pattern.test(rel)) ?? null;
}

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs, results);
    } else if (/\.(webp|jpg|jpeg|png)$/i.test(entry.name)) {
      results.push(abs);
    }
  }
  return results;
}

async function processFile(abs, rule) {
  const sizeBefore = fs.statSync(abs).size;
  const budgetBytes = rule.budgetKB * 1024;

  if (sizeBefore <= budgetBytes) {
    return { skipped: true, sizeBefore };
  }

  const ext = path.extname(abs).toLowerCase();
  const isJpeg = ext === ".jpg" || ext === ".jpeg";

  // Read into buffer first so sharp releases the file handle before we write
  const inputBuf = fs.readFileSync(abs);
  const meta = await sharp(inputBuf).metadata();
  const needsResize = (meta.width ?? 0) > rule.maxWidth || (meta.height ?? 0) > rule.maxHeight;

  let pipeline = sharp(inputBuf);
  if (needsResize) {
    pipeline = pipeline.resize(rule.maxWidth, rule.maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const buf = await pipeline.webp({ quality: rule.quality, effort: 5 }).toBuffer();
  const sizeAfter = buf.length;

  if (sizeAfter < sizeBefore) {
    const destPath = isJpeg ? abs.replace(/\.(jpg|jpeg)$/i, ".webp") : abs;
    fs.writeFileSync(destPath, buf);
    if (isJpeg && destPath !== abs) {
      try { fs.unlinkSync(abs); } catch {}
      return { skipped: false, sizeBefore, sizeAfter, renamed: { from: abs, to: destPath } };
    }
    return { skipped: false, sizeBefore, sizeAfter };
  }

  return { skipped: true, sizeBefore, reason: "already optimal" };
}

// ── Main ─────────────────────────────────────────────────────────────────────
const files = walk(publicDir);
let processed = 0, skipped = 0, savedBytes = 0;
const renamed = [];

console.log(`Found ${files.length} images. Optimizing…\n`);

for (const abs of files) {
  const rule = findRule(abs);
  if (!rule) { skipped++; continue; }

  try {
    const result = await processFile(abs, rule);
    if (result.skipped) {
      skipped++;
      process.stdout.write("·");
    } else {
      processed++;
      savedBytes += result.sizeBefore - result.sizeAfter;
      if (result.renamed) renamed.push(result.renamed);
      const pct = Math.round((1 - result.sizeAfter / result.sizeBefore) * 100);
      process.stdout.write(`✓`);
    }
  } catch (err) {
    console.error(`\n✗ ${path.relative(root, abs)}: ${err.message}`);
  }
}

console.log(`\n\nDone.`);
console.log(`  Optimized : ${processed} files`);
console.log(`  Skipped   : ${skipped} files (already within budget)`);
console.log(`  Saved     : ${(savedBytes / 1024 / 1024).toFixed(1)} MB`);

if (renamed.length > 0) {
  console.log(`\n  Renamed JPG→WebP (update references if needed):`);
  for (const { from, to } of renamed) {
    console.log(`    ${path.basename(from)} → ${path.basename(to)}`);
  }
}
