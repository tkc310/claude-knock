// ロゴ（A 案）と OGP バナー。scripts/brand/ で作り、public/ にコミットする（make brand）
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';

const pub = (f: string) => join(import.meta.dirname, '../public', f);
const pngSize = (file: string) => {
  const b = readFileSync(file);
  expect(b.subarray(1, 4).toString('latin1')).toBe('PNG');
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
};

describe('ロゴと OGP バナー', () => {
  it('OGP バナーは 1200x630 の PNG', () => {
    expect(pngSize(pub('og.png'))).toEqual({ width: 1200, height: 630 });
  });

  it('ロゴの SVG は読み上げ用の名前を持ち、文字をアウトライン化している（<text> を使わない）', () => {
    const svg = readFileSync(pub('logo.svg'), 'utf8');
    expect(svg).toContain('<title>タイ仏教行事カレンダー</title>');
    expect(svg).toContain('aria-label="タイ仏教行事カレンダー"');
    expect(svg).not.toContain('<text');
    expect(svg).not.toMatch(/[฀-๿]/);
  });

  it('ロゴの PNG は SVG の 3 倍の大きさ', () => {
    const svg = readFileSync(pub('logo.svg'), 'utf8');
    const [, w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/) ?? [];
    expect(pngSize(pub('logo.png'))).toEqual({ width: Number(w) * 3, height: Number(h) * 3 });
  });
});
