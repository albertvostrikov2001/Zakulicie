/**
 * Local dev without GitHub Pages basePath (clears machine-level GITHUB_PAGES env).
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = { ...process.env };
delete env.GITHUB_PAGES;
delete env.NEXT_PUBLIC_PAGES_BASE_PATH;

const nextBin = path.join(root, "node_modules/next/dist/bin/next");
const child = spawn(
  process.execPath,
  ["--max-old-space-size=8192", nextBin, "dev", "-p", "3000"],
  { cwd: root, stdio: "inherit", env },
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
