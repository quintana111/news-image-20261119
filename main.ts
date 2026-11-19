// main.ts — Node 22, stdlib only.
// Copies entry.png to /output/entry.png and verifies byte-length + sha256 on read-back.
import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'entry.png');
const dst = '/output/entry.png';

function sha256(buf: Buffer): string {
  return createHash('sha256').update(buf).digest('hex');
}

const MAX_SIZE = 1_048_576; // 1 MiB

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);

function detectFormat(buf: Buffer): 'PNG' | 'JPEG' {
  if (buf.length >= PNG_MAGIC.length && buf.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) return 'PNG';
  if (buf.length >= JPEG_MAGIC.length && buf.subarray(0, JPEG_MAGIC.length).equals(JPEG_MAGIC)) return 'JPEG';
  throw new Error('unsupported image format: expected PNG (89 50 4E 47 0D 0A 1A 0A) or JPEG (FF D8 FF) magic bytes');
}

function pngDimensions(buf: Buffer): { width: number; height: number } {
  // IHDR chunk: 8-byte signature, 4-byte length, 4-byte 'IHDR', then 4-byte width + 4-byte height (big-endian).
  if (buf.length < 33 || buf.subarray(12, 16).toString('ascii') !== 'IHDR') {
    throw new Error('PNG missing IHDR chunk: cannot read dimensions');
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

mkdirSync('/output', { recursive: true });
const srcBuf = readFileSync(src);
const srcStat = statSync(src);
if (srcStat.size > MAX_SIZE) {
  throw new Error(`entry.png is ${srcStat.size} bytes, over the 1 MiB (${MAX_SIZE} bytes) limit`);
}
const format = detectFormat(srcBuf);
if (format === 'PNG') {
  const { width, height } = pngDimensions(srcBuf);
  console.log(`format: PNG, dimensions: ${width}x${height}`);
} else {
  console.log('format: JPEG (dimensions not parsed)');
}
console.log(`size: ${srcStat.size} bytes (limit ${MAX_SIZE} bytes)`);
copyFileSync(src, dst);
const dstBuf = readFileSync(dst);
const dstStat = statSync(dst);

console.log(`source: ${src} (${srcStat.size} bytes, sha256 ${sha256(srcBuf)})`);
console.log(`output: ${dst} (${dstStat.size} bytes, sha256 ${sha256(dstBuf)})`);
if (srcStat.size !== dstStat.size) throw new Error('byte-length mismatch after copy');
if (sha256(srcBuf) !== sha256(dstBuf)) throw new Error('sha256 mismatch after copy');
console.log('OK: /output/entry.png verified — byte-length and sha256 match');
