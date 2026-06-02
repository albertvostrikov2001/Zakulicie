/**
 * Optimize showreel videos from existing public/video/showreel.mp4
 * Produces: optimized MP4 + WebM (VP9) for desktop and mobile
 *
 * Run: node scripts/optimize-video.mjs
 *
 * Results expected:
 *   showreel.mp4        ~4–6 MB  (was 21 MB, CRF 28, 1280px, no audio)
 *   showreel.webm       ~2–3 MB  (VP9 CRF 35, 1280px, no audio)
 *   showreel-mobile.mp4 ~0.8–1.2 MB (was 3.3 MB, CRF 30, 640px, no audio)
 *   showreel-mobile.webm ~0.5–0.8 MB (VP9 CRF 40, 640px, no audio)
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "..");
const VIDEO_DIR = path.join(ROOT, "public", "video");
const FFMPEG    = path.join(ROOT, "node_modules", "ffmpeg-static", "ffmpeg.exe");

if (!fs.existsSync(FFMPEG)) throw new Error("ffmpeg-static not found. Run: npm install");

const SRC_DESKTOP = path.join(VIDEO_DIR, "showreel.mp4");
const SRC_MOBILE  = path.join(VIDEO_DIR, "showreel-mobile.mp4");

if (!fs.existsSync(SRC_DESKTOP)) throw new Error(`Source not found: ${SRC_DESKTOP}`);
if (!fs.existsSync(SRC_MOBILE))  throw new Error(`Source not found: ${SRC_MOBILE}`);

const sizeMB = (f) => (fs.statSync(f).size / 1024 / 1024).toFixed(2) + " MB";

function run(args, label) {
  console.log(`\n▶ ${label}`);
  const start = Date.now();
  const r = spawnSync(FFMPEG, args, { stdio: "inherit" });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  if (r.status !== 0) throw new Error(`ffmpeg failed [${label}]`);
  console.log(`✓ Done in ${elapsed}s`);
}

console.log("=== Video optimization ===");
console.log(`Source desktop: ${sizeMB(SRC_DESKTOP)}`);
console.log(`Source mobile:  ${sizeMB(SRC_MOBILE)}`);

// ─── 1. Desktop MP4 ─────────────────────────────────────────────────────────
// Overwrite in-place: CRF 28 (was 22), scale to 1280px, no audio, faststart
const tmpDesktopMp4 = path.join(VIDEO_DIR, "_showreel_new.mp4");
run([
  "-y", "-i", SRC_DESKTOP,
  "-c:v", "libx264",
  "-preset", "slow",
  "-crf", "28",
  "-profile:v", "high",
  "-level", "4.1",
  "-pix_fmt", "yuv420p",
  "-vf", "scale='min(1280,iw)':-2",
  "-movflags", "+faststart",
  "-an",   // no audio — video plays muted
  tmpDesktopMp4,
], "Desktop MP4 (libx264 CRF 28, 1280px, no audio)");

// ─── 2. Desktop WebM (VP9) ───────────────────────────────────────────────────
const desktopWebm = path.join(VIDEO_DIR, "showreel.webm");
run([
  "-y", "-i", SRC_DESKTOP,
  "-c:v", "libvpx-vp9",
  "-crf", "35",
  "-b:v", "0",             // CQ mode (constant quality)
  "-deadline", "good",
  "-cpu-used", "2",
  "-row-mt", "1",
  "-tile-columns", "2",
  "-pix_fmt", "yuv420p",
  "-vf", "scale='min(1280,iw)':-2",
  "-an",
  desktopWebm,
], "Desktop WebM (VP9 CRF 35, 1280px, no audio)");

// ─── 3. Mobile MP4 ──────────────────────────────────────────────────────────
const tmpMobileMp4 = path.join(VIDEO_DIR, "_showreel_mobile_new.mp4");
run([
  "-y", "-i", SRC_MOBILE,
  "-c:v", "libx264",
  "-preset", "slow",
  "-crf", "30",
  "-profile:v", "main",
  "-level", "3.1",
  "-pix_fmt", "yuv420p",
  "-vf", "scale='min(640,iw)':-2",
  "-movflags", "+faststart",
  "-an",
  tmpMobileMp4,
], "Mobile MP4 (libx264 CRF 30, 640px, no audio)");

// ─── 4. Mobile WebM (VP9) ───────────────────────────────────────────────────
const mobileWebm = path.join(VIDEO_DIR, "showreel-mobile.webm");
run([
  "-y", "-i", SRC_MOBILE,
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
], "Mobile WebM (VP9 CRF 40, 640px, no audio)");

// ─── Replace originals ───────────────────────────────────────────────────────
fs.renameSync(tmpDesktopMp4, SRC_DESKTOP);
fs.renameSync(tmpMobileMp4, SRC_MOBILE);

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log("\n=== Results ===");
for (const f of [SRC_DESKTOP, desktopWebm, SRC_MOBILE, mobileWebm]) {
  console.log(`${path.basename(f).padEnd(28)} ${sizeMB(f)}`);
}
console.log("\nDone. Commit public/video/ and update VideoPlaceholder to serve WebM.");
