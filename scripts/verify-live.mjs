import https from "https";

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "Cache-Control": "no-cache" } }, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () =>
          resolve({
            url,
            status: res.statusCode,
            lastModified: res.headers["last-modified"],
            body,
          }),
        );
      })
      .on("error", reject);
  });
}

const poster = await get(
  "https://albertvostrikov2001.github.io/Zakulicie/video/showreel-poster.webp",
);
const home = await get("https://albertvostrikov2001.github.io/Zakulicie/");
const rawHome = await get(
  "https://raw.githubusercontent.com/albertvostrikov2001/Zakulicie/gh-pages/index.html",
);

console.log("poster:", poster.status, poster.lastModified ?? "-");
console.log("home:", home.status, home.lastModified ?? "-", "showreel:", home.body.includes("showreel"));
console.log("raw gh-pages index len:", rawHome.body.length, "showreel:", rawHome.body.includes("showreel"));
console.log("deploy synced:", home.body.length === rawHome.body.length && home.body.includes("showreel") === rawHome.body.includes("showreel"));
