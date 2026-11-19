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

mkdirSync('/output', { recursive: true });
const srcBuf = readFileSync(src);
copyFileSync(src, dst);
const dstBuf = readFileSync(dst);
const srcStat = statSync(src);
const dstStat = statSync(dst);

console.log(`source: ${src} (${srcStat.size} bytes, sha256 ${sha256(srcBuf)})`);
console.log(`output: ${dst} (${dstStat.size} bytes, sha256 ${sha256(dstBuf)})`);
if (srcStat.size !== dstStat.size) throw new Error('byte-length mismatch after copy');
if (sha256(srcBuf) !== sha256(dstBuf)) throw new Error('sha256 mismatch after copy');
console.log('OK: /output/entry.png verified — byte-length and sha256 match');
