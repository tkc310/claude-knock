// favicon と PWA のアイコンを、ヘッダーのロゴと同じ法輪（src/components/site/dharma-wheel.ts）から作る。
// 生成物は public/ にコミットする。形や色を変えたら `make icons` で作り直す（ADR-0013）。
// PNG にするのに macOS の sips を使い、npm の依存は足さない。ICO は PNG をそのまま包んで書く
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { wheelIcon } from '../src/components/site/dharma-wheel.ts';

const publicDir = join(import.meta.dirname, '../public');
const work = mkdtempSync(join(tmpdir(), 'icons-'));
const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${body}</svg>\n`;

// 丸い地の法輪（favicon・通常のアイコン）と、四角い地を全面に敷いた法輪（maskable・apple-touch-icon）。
// maskable は中心から半径 40% の円の外が切られることがあるので、法輪（半径 28.5）を 0.8 倍にして収める
const round = svg(wheelIcon('circle'));
const maskable = svg(wheelIcon('square', 0.8));
const touch = svg(wheelIcon('square', 0.86));

function png(source: string, size: number, out: string) {
  const src = join(work, `${size}-${out.replaceAll('/', '_')}.svg`);
  writeFileSync(src, source);
  execFileSync(
    'sips',
    ['-s', 'format', 'png', '-z', String(size), String(size), src, '--out', out],
    {
      stdio: 'ignore',
    },
  );
}

// PNG を入れた ICO（Windows Vista 以降・主要ブラウザが読む）
function ico(pngs: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const at = 6 + 16 * i;
    header.writeUInt8(size % 256, at);
    header.writeUInt8(size % 256, at + 1);
    header.writeUInt16LE(1, at + 4);
    header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(data.length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

try {
  mkdirSync(join(publicDir, 'icons'), { recursive: true });
  writeFileSync(join(publicDir, 'favicon.svg'), round);
  png(round, 192, join(publicDir, 'icons/icon-192.png'));
  png(round, 512, join(publicDir, 'icons/icon-512.png'));
  png(maskable, 512, join(publicDir, 'icons/icon-maskable-512.png'));
  png(touch, 180, join(publicDir, 'icons/apple-touch-icon.png'));
  const small = [16, 32, 48].map((size) => {
    const out = join(work, `favicon-${size}.png`);
    png(round, size, out);
    return { size, data: readFileSync(out) };
  });
  writeFileSync(join(publicDir, 'favicon.ico'), ico(small));
} finally {
  rmSync(work, { recursive: true, force: true });
}
