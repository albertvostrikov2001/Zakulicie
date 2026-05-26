import { spawnSync } from "node:child_process";
import https from "node:https";

const REPO = "albertvostrikov2001/Zakulicie";
const WORKFLOW = "deploy-github-pages.yml";

function getGitHubToken() {
  const result = spawnSync("git", ["credential", "fill"], {
    input: "protocol=https\nhost=github.com\n\n",
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(result.stderr || "git credential fill failed");
  const password = result.stdout
    .split("\n")
    .find((line) => line.startsWith("password="))
    ?.slice("password=".length);
  if (!password) throw new Error("GitHub token not found");
  return password;
}

function request(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: "api.github.com",
        path,
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "Zakulicie-Deploy",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(payload
            ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) }
            : {}),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          const parsed = data ? JSON.parse(data) : {};
          if (res.statusCode >= 400) {
            reject(new Error(`${method} ${path} -> ${res.statusCode}: ${parsed.message || data}`));
            return;
          }
          resolve(parsed);
        });
      },
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyLive() {
  return new Promise((resolve) => {
    https
      .get(
        "https://albertvostrikov2001.github.io/Zakulicie/video/showreel-poster.webp",
        { headers: { "Cache-Control": "no-cache" } },
        (res) => resolve(res.statusCode),
      )
      .on("error", () => resolve(0));
  });
}

async function waitForRun(token, runId) {
  for (let i = 0; i < 60; i += 1) {
    const run = await request("GET", `/repos/${REPO}/actions/runs/${runId}`, token);
    console.log(`run ${runId}: ${run.status} (${run.conclusion ?? "…"})`);
    if (run.status === "completed") return run;
    await sleep(15000);
  }
  throw new Error(`Workflow run ${runId} did not finish in time`);
}

async function waitForLive() {
  for (let i = 0; i < 20; i += 1) {
    const status = await verifyLive();
    console.log(`poster check: ${status}`);
    if (status === 200) {
      console.log("✓ Site updated: https://albertvostrikov2001.github.io/Zakulicie/");
      return true;
    }
    await sleep(15000);
  }
  return false;
}

const token = getGitHubToken();

const pages = await request("GET", `/repos/${REPO}/pages`, token);
console.log("Pages source:", pages.source?.branch ?? pages.build_type, pages.source?.path ?? "");

if (pages.build_type === "workflow") {
  console.log("→ Switch Pages source to GitHub Actions…");
  await request("PUT", `/repos/${REPO}/pages`, token, { build_type: "workflow" });
}

console.log("→ Trigger Deploy to GitHub Pages workflow…");
await request("POST", `/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`, token, { ref: "main" });

await sleep(12000);
const runs = await request("GET", `/repos/${REPO}/actions/runs?event=workflow_dispatch&per_page=1`, token);
const runId = runs.workflow_runs?.[0]?.id;
if (!runId) throw new Error("Workflow dispatch did not create a run");

const run = await waitForRun(token, runId);
if (run.conclusion !== "success") {
  const jobs = await request("GET", `/repos/${REPO}/actions/runs/${runId}/jobs`, token);
  for (const job of jobs.jobs ?? []) {
    console.log(`job ${job.name}: ${job.conclusion}`);
  }
  throw new Error(`Workflow failed: ${run.html_url}`);
}

if (!(await waitForLive())) {
  throw new Error("Workflow succeeded but showreel poster is still missing on live site");
}
