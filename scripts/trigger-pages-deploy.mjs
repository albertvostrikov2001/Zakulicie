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
  for (let i = 0; i < 24; i += 1) {
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

let pages = await request("GET", `/repos/${REPO}/pages`, token);
console.log("Pages before:", pages.status, pages.build_type);

if (pages.build_type !== "workflow") {
  console.log("→ Switch Pages source to GitHub Actions…");
  await request("PUT", `/repos/${REPO}/pages`, token, { build_type: "workflow" });
  await sleep(5000);
}

console.log("→ Trigger Deploy to GitHub Pages workflow…");
await request("POST", `/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`, token, { ref: "main" });

await sleep(15000);
const runs = await request("GET", `/repos/${REPO}/actions/runs?per_page=5`, token);
const run = (runs.workflow_runs ?? []).find((r) => r.name === "Deploy to GitHub Pages");
if (!run?.id) throw new Error("Deploy workflow did not start");

const finished = await waitForRun(token, run.id);
if (finished.conclusion !== "success") {
  const jobs = await request("GET", `/repos/${REPO}/actions/runs/${run.id}/jobs`, token);
  for (const job of jobs.jobs ?? []) {
    console.log(`job ${job.name}: ${job.conclusion}`);
    for (const step of job.steps ?? []) {
      if (step.conclusion === "failure") console.log(`  failed: ${step.name}`);
    }
    const ann = await request("GET", `/repos/${REPO}/check-runs/${job.id}/annotations`).catch(() => []);
    for (const a of ann) console.log(`  ${a.message}`);
  }
  throw new Error(`Workflow failed: ${finished.html_url}`);
}

pages = await request("GET", `/repos/${REPO}/pages`, token);
console.log("Pages after workflow:", pages.status, pages.build_type);

if (!(await waitForLive())) {
  throw new Error("Workflow succeeded but showreel poster is still missing on live site");
}
