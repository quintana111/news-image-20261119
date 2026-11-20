// main.ts — news-image-20261119 v2. Node 22, stdlib only.
// Copies entry.png (resolved from THIS script's directory, never a bare
// relative path) to /output/entry.png, verifying byte-length and sha256.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'entry.png');
const dst = '/output/entry.png';
const MAX = 1_048_576; // 1 MiB

const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

const buf = readFileSync(src);
if (buf.length === 0) throw new Error('entry.png is empty');
if (buf.length > MAX) throw new Error(`entry.png is ${buf.length} bytes, over 1 MiB`);
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!buf.subarray(0, 8).equals(PNG)) throw new Error('entry.png is not a PNG');
const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
if (w !== 1024 || h !== 1024) throw new Error(`entry.png is ${w}x${h}, expected 1024x1024`);

mkdirSync('/output', { recursive: true });
copyFileSync(src, dst);
const back = readFileSync(dst);
if (back.length !== buf.length) throw new Error('byte-length mismatch after copy');
if (sha(back) !== sha(buf)) throw new Error('sha256 mismatch after copy');
console.log(`OK entry.png ${w}x${h} ${buf.length} bytes sha256=${sha(buf)} -> ${dst}`);
