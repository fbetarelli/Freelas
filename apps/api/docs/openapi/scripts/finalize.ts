import { readFile, rename, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const temporary = fileURLToPath(new URL("../reference.tmp.html", import.meta.url));
const destination = fileURLToPath(new URL("../reference.html", import.meta.url));
const html = await readFile(temporary, "utf8");
const json = await readFile(fileURLToPath(new URL("../openapi.json", import.meta.url)), "utf8");

// The inline bundle is local, but Redoc's default sidebar logo is fetched from a CDN.
// Remove only that decorative image so opening the file does not need the network.
const offlineHtml = html.replace(/<img[^>]*src="https:\/\/[^" ]*redocly[^" ]*"[^>]*>/gi, "");
if (/<(?:script|link|img)[^>]+(?:src|href)=["']https?:\/\//i.test(offlineHtml)) {
  throw new Error("Redoc output still contains an external asset");
}
const hash = createHash("sha256").update(json).digest("hex");
await writeFile(temporary, `<!-- openapi-sha256:${hash} -->\n${offlineHtml}`);
await rename(temporary, destination);
