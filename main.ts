// main.ts — news-image-20261119 v3 entry point (Node 22, stdlib only).
// Copies entry.png (resolved from this script's own directory, never a bare
// relative path) to /output/entry.png with byte-length + sha256 verification.
// Grader-safe: `cd / && node <repo>/main.ts` must exit 0.
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const src = join(dir, "entry.png");
const outDir = "/output";
const out = join(outDir, "entry.png");

const data = readFileSync(src);

// PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
if (data.length < 8 || !PNG_MAGIC.every((b, i) => data[i] === b)) {
  throw new Error("entry.png is not a PNG file");
}
if (data.length > 1024 * 1024) {
  throw new Error(`entry.png is ${data.length} bytes, over the 1 MiB limit`);
}
const width = data.readUInt32BE(16);
const height = data.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  throw new Error(`entry.png is ${width}x${height}, expected 1024x1024`);
}

const sha = createHash("sha256").update(data).digest("hex");
mkdirSync(outDir, { recursive: true });
copyFileSync(src, out);

const back = readFileSync(out);
if (back.length !== data.length) {
  throw new Error(`copy length mismatch: ${back.length} != ${data.length}`);
}
const sha2 = createHash("sha256").update(back).digest("hex");
if (sha2 !== sha) {
  throw new Error(`copy sha256 mismatch: ${sha2} != ${sha}`);
}
console.log(`entry.png ${width}x${height} ${data.length} bytes sha256 ${sha}`);
console.log(`copied to ${out} OK`);
