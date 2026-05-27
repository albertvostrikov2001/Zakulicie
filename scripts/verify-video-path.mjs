import https from "https";

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve(body));
      })
      .on("error", reject);
  });
}

const home = await get("https://albertvostrikov2001.github.io/Zakulicie/");
const chunkMatch = home.match(/\/Zakulicie\/_next\/static\/chunks\/app\/\(site\)\/page-[^"]+\.js/);
if (!chunkMatch) {
  console.log("page chunk not found");
  process.exit(1);
}

const chunk = await get(`https://albertvostrikov2001.github.io${chunkMatch[0]}`);
console.log("correct path", chunk.includes("/Zakulicie/video/showreel.mp4"));
console.log("wrong path", chunk.includes("/video/showreel.mp4") && !chunk.includes("/Zakulicie/video/showreel.mp4"));
