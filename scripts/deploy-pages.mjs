/**
 * Локальный деплой на GitHub Pages (ветка gh-pages).
 * Повторяет CI: удаляет app/api и app/studio, собирает static export, публикует out/.
 *
 * Требования: git push в origin, в Settings → Pages → Source: branch gh-pages / root.
 * Если Source = GitHub Actions — запустите workflow вручную или переключите источник.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoName = "Zakulicie";
const removedDirs = ["app/api", "app/studio"];

function run(cmd, env = {}) {
  execSync(cmd, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

function removeStaticBlockers() {
  for (const rel of removedDirs) {
    const abs = path.join(root, rel);
    if (fs.existsSync(abs)) fs.rmSync(abs, { recursive: true, force: true });
  }
}

function restoreStaticBlockers() {
  try {
    run("git checkout -- app/api app/studio");
  } catch {
    console.warn("Не удалось восстановить app/api или app/studio — проверьте git checkout.");
  }
}

const buildEnv = {
  GITHUB_PAGES: "true",
  NEXT_PUBLIC_PAGES_BASE_PATH: `/${repoName}`,
  NEXT_PUBLIC_SITE_URL: `https://albertvostrikov2001.github.io/${repoName}`,
};

console.log("→ Сборка static export для GitHub Pages…");
removeStaticBlockers();
try {
  run("npm run build", buildEnv);
} finally {
  restoreStaticBlockers();
}

const outDir = path.join(root, "out");
if (!fs.existsSync(outDir)) {
  console.error("Папка out/ не найдена после сборки.");
  process.exit(1);
}

console.log("→ Публикация в ветку gh-pages…");
run(`npx --yes gh-pages -d out -m "deploy: ${new Date().toISOString()}"`);

console.log("✓ Готово. Проверьте: https://albertvostrikov2001.github.io/Zakulicie/");
