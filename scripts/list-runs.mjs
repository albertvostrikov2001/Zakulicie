import { spawnSync } from "node:child_process";
import https from "node:https";

const t = spawnSync("git", ["credential", "fill"], {
  input: "protocol=https\nhost=github.com\n\n",
  encoding: "utf8",
})
  .stdout.split("\n")
  .find((l) => l.startsWith("password="))
  ?.slice("password=".length);

https.get(
  {
    hostname: "api.github.com",
    path: "/repos/albertvostrikov2001/Zakulicie/actions/runs?per_page=8",
    headers: {
      Authorization: `Bearer ${t}`,
      "User-Agent": "x",
      Accept: "application/vnd.github+json",
    },
  },
  (res) => {
    let d = "";
    res.on("data", (c) => (d += c));
    res.on("end", () => {
      JSON.parse(d).workflow_runs.forEach((w) =>
        console.log(w.id, w.name, w.status, w.conclusion, w.head_sha?.slice(0, 7)),
      );
    });
  },
);
