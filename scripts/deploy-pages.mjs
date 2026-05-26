/**
 * Локальный деплой на GitHub Pages (ветка gh-pages).
 * Повторяет CI: удаляет app/api и app/studio, собирает static export, публикует out/.
 *
 * Требования: git push в origin, в Settings → Pages → Source: branch gh-pages / root.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoName = "Zakulicie";
const remote = "origin";
const branch = "gh-pages";
const removedDirs = ["app/api", "app/studio"];

function run(cmd, env = {}, cwd = root) {
  execSync(cmd, { cwd, stdio: "inherit", env: { ...process.env, ...env } });
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

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
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

fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

const topLevel = fs.readdirSync(outDir);
const junk = topLevel.filter((name) => [".github", "package.json", "app"].includes(name));
if (junk.length) {
  console.error("out/ содержит лишние файлы:", junk.join(", "));
  process.exit(1);
}

console.log(`→ Публикация ${topLevel.length} элементов в ветку ${branch}…`);

const remoteUrl = execSync(`git remote get-url ${remote}`, {
  cwd: root,
  encoding: "utf8",
}).trim();

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "zakulicie-pages-"));
try {
  copyDir(outDir, workDir);
  run("git init", {}, workDir);
  run(`git checkout -b ${branch}`, {}, workDir);
  run(`git config user.email "deploy@zakulicie.local"`, {}, workDir);
  run(`git config user.name "Zakulicie Pages Deploy"`, {}, workDir);
  run(`git remote add ${remote} ${remoteUrl}`, {}, workDir);
  run("git add --all", {}, workDir);
  run(`git commit -m "deploy: ${new Date().toISOString()}"`, {}, workDir);
  run(`git push --force ${remote} ${branch}`, {}, workDir);
} finally {
  fs.rmSync(workDir, { recursive: true, force: true });
}

console.log("✓ Готово. Проверьте: https://albertvostrikov2001.github.io/Zakulicie/");
