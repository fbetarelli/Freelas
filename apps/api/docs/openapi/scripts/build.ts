import { readFile, rename, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { generateOpenApiDocument } from "../src/index.ts";
import { renderApiReadme } from "./readme.ts";

const directory = fileURLToPath(new URL("..", import.meta.url));
const document = generateOpenApiDocument();
const json = `${JSON.stringify(document, null, 2)}\n`;
const outputs = [
  [resolve(directory, "openapi.json"), json],
  [resolve(directory, "../README.md"), renderApiReadme(document)],
] as const;

for (const [path, content] of outputs) {
  if (process.argv.includes("--check")) {
    if (await readFile(path, "utf8") !== content) throw new Error(`Outdated generated file: ${path}`);
  } else {
    const temporary = `${path}.tmp`;
    await writeFile(temporary, content);
    await rename(temporary, path);
  }
}

if (process.argv.includes("--check")) {
  const html = await readFile(resolve(directory, "reference.html"), "utf8");
  const hash = createHash("sha256").update(json).digest("hex");
  if (!html.includes(`<!-- openapi-sha256:${hash} -->`)) {
    throw new Error("Outdated generated file: reference.html");
  }
}
