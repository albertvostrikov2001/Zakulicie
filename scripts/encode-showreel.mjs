/**
 * Encode showreel from source MP4 → public/video/
 * Run: node scripts/encode-showreel.mjs [sourcePath]
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const ROOT = path.resolve(".");
const OUT_DIR = path.join(ROOT, "public", "video");
const DEFAULT_SRC = path.join("D:", "загрузки", "Горизонт.mp4");

const src = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_SRC;

if (!ffmpegPath) throw new Error("ffmpeg-static binary missing");
if (!fs.existsSync(src)) throw new Error(`Source not found: ${src}`);

fs.mkdirSync(OUT_DIR, { recursive: true });

const desktopOut = path.join(OUT_DIR, "showreel.mp4");
const mobileOut = path.join(OUT_DIR, "showreel-mobile.mp4");
const posterJpg = path.join(OUT_DIR, "_poster.jpg");
const posterWebp = path.join(OUT_DIR, "showreel-poster.webp");

function run(args) {
  const r = spawnSync(ffmpegPath, args, { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${args.join(" ")}`);
}

console.log("Source:", src);
console.log("Size MB:", (fs.statSync(src).size / 1024 / 1024).toFixed(1));

/** Desktop MP4: up to 1280w, H.264 CRF 28, no audio (plays muted) */
run([
  "-y", "-i", src,
  "-c:v", "libx264",
  "-preset", "slow",
  "-crf", "28",
  "-profile:v", "high",
  "-level", "4.1",
  "-pix_fmt", "yuv420p",
  "-vf", "scale='min(1280,iw)':-2",
  "-movflags", "+faststart",
  "-an",
  desktopOut,
]);

/** Desktop WebM (VP9): up to 1280w, ~40% smaller than MP4 */
const desktopWebm = path.join(OUT_DIR, "showreel.webm");
run([
  "-y", "-i", src,
  "-c:v", "libvpx-vp9",
  "-crf", "35",
  "-b:v", "0",
  "-deadline", "good",
  "-cpu-used", "2",
  "-row-mt", "1",
  "-tile-columns", "2",
  "-pix_fmt", "yuv420p",
  "-vf", "scale='min(1280,iw)':-2",
  "-an",
  desktopWebm,
]);

/** Mobile MP4: 640w, CRF 30, no audio */
run([
  "-y", "-i", src,
  "-c:v", "libx264",
  "-preset", "slow",
  "-crf", "30",
  "-profile:v", "main",
  "-level", "3.1",
  "-pix_fmt", "yuv420p",
  "-vf", "scale='min(640,iw)':-2",
  "-movflags", "+faststart",
  "-an",
  mobileOut,
]);

/** Mobile WebM (VP9): 640w */
const mobileWebm = path.join(OUT_DIR, "showreel-mobile.webm");
run([
  "-y", "-i", src,
  "-c:v", "libvpx-vp9",
  "-crf", "40",
  "-b:v", "0",
  "-deadline", "good",
  "-cpu-used", "3",
  "-row-mt", "1",
  "-pix_fmt", "yuv420p",
  "-vf", "scale='min(640,iw)':-2",
  "-an",
  mobileWebm,
]);

/** Poster frame */
run(["-y", "-ss", "00:00:01", "-i", src, "-frames:v", "1", "-q:v", "2", "-update", "1", posterJpg]);

await sharp(posterJpg)
  .resize({ width: 1920, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(posterWebp);

fs.unlinkSync(posterJpg);

for (const f of [desktopOut, desktopWebm, mobileOut, mobileWebm, posterWebp]) {
  const s = fs.statSync(f);
  console.log(`${path.basename(f)}: ${(s.size / 1024 / 1024).toFixed(2)} MB`);
}

console.log("Done.");
