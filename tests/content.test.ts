import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vite-plus/test';
import { events } from '../src/data/events';

// astro:content は Astro の仮想モジュールで、Vitest からは解決できない
vi.mock('astro:content', () => ({ defineCollection: <T>(config: T) => config }));

const { eventEntrySchema, guideEntrySchema } = await import('../src/content.config');

describe('eventEntrySchema', () => {
  const entry = { origin: '律蔵の布薩', practice: '寺で布施・持戒・聞法' };

  it('origin（由来）と practice（行うこと）の frontmatter を通す', () => {
    expect(eventEntrySchema.parse(entry)).toEqual(entry);
  });

  it.each([
    {},
    { origin: '由来' },
    { practice: '行うこと' },
    { ...entry, origin: '  ' },
    { ...entry, practice: '' },
  ])('origin・practice が無い・空なら弾く: %o', (data) => {
    expect(eventEntrySchema.safeParse(data).success).toBe(false);
  });

  it('行事名は src/data/events.ts が正本なので、frontmatter に書いたら弾く', () => {
    const name = { romaji: 'Wan Phra', kana: 'ワンプラ', ja: '布薩日' };
    expect(eventEntrySchema.safeParse({ ...entry, name }).success).toBe(false);
  });
});

it('src/content/events/ のファイル名は events の id のどれか', () => {
  const dir = join(import.meta.dirname, '../src/content/events');
  const ids = existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.slice(0, -'.md'.length))
    : [];
  const eventIds = events.map((e) => e.id as string);
  for (const id of ids) expect(eventIds).toContain(id);
});

it.each(events)('$id の本文が src/content/events/ にある', ({ id }) => {
  expect(existsSync(join(import.meta.dirname, `../src/content/events/${id}.md`))).toBe(true);
});

it.each(events)('$id の本文にタイ文字を書かない（出典の URL は除く）', ({ id }) => {
  const text = readFileSync(join(import.meta.dirname, `../src/content/events/${id}.md`), 'utf8');
  expect(text.replace(/https?:\/\/\S+/g, '')).not.toMatch(/[\u0E00-\u0E7F]/);
});

// 行事の日に在家信者が行うこと（タンブン）の説明ページ /tambun/（src/content/guides/tambun.md）
describe('guideEntrySchema', () => {
  const entry = { title: 'タンブン', description: '功徳を積む行いの説明' };

  it('title と description の frontmatter を通す', () => {
    expect(guideEntrySchema.parse(entry)).toEqual(entry);
  });

  const invalid = [{}, { title: 'タンブン' }, { ...entry, description: ' ' }, { ...entry, x: 1 }];

  it.each(invalid)('title・description が無い・空、知らない項目があれば弾く: %o', (data) => {
    expect(guideEntrySchema.safeParse(data).success).toBe(false);
  });
});

describe('タンブンの説明（src/content/guides/tambun.md）', () => {
  const read = (path: string) => readFileSync(join(import.meta.dirname, '..', path), 'utf8');
  const text = read('src/content/guides/tambun.md');

  it('タイ文字を書かない（出典の URL は除く。ADR-0012）', () => {
    expect(text.replace(/https?:\/\/\S+/g, '')).not.toMatch(/[\u0E00-\u0E7F]/);
  });

  it('布施・戒・瞑想、三宝の随念、布施の瞑想、慈悲の瞑想、随喜、放生を説明し、出典を付ける', () => {
    const words = ['布施', '五戒', '八戒', '三宝', '布施の瞑想', '慈悲の瞑想', '放生'];
    for (const word of [...words, 'アヌモータナー・サートゥ']) expect(text).toContain(word);
    // 三蔵の出典（SuttaCentral）
    for (const sutta of ['an8.36', 'an3.70', 'an8.41', 'an6.10', 'snp1.8', 'mn7']) {
      expect(text).toContain(`https://suttacentral.net/${sutta}/`);
    }
    expect(text).toMatch(/^## 出典$/m);
  });

  it.each(['wan-phra', 'visakha-bucha'])('%s の本文から /tambun/ へリンクする', (id) => {
    expect(read(`src/content/events/${id}.md`)).toContain('](/tambun/)');
  });
});

// 仏足跡四つの言い伝え。三蔵ではなく、寺の伝える縁起とネットの語りなので、出どころを分けて書く
describe('ロイクラトンの仏足跡の言い伝え（src/content/events/loi-krathong.md）', () => {
  const text = readFileSync(
    join(import.meta.dirname, '..', 'src/content/events/loi-krathong.md'),
    'utf8',
  );

  it('過去 3 仏とゴータマ仏の足跡が重なり、未来仏メッテイヤが 1 つにする話を書く', () => {
    const past = ['カクサンダ仏', 'コーナーガマナ仏', 'カッサパ仏', 'ゴータマ仏'];
    for (const word of ['シーロイ', ...past, 'メッテイヤ仏', '阿羅漢']) expect(text).toContain(word);
  });

  it('寺の縁起と、阿羅漢になる話の出典を付ける', () => {
    expect(text).toContain('https://www.blockdit.com/posts/62283a2503f10e26721184a6');
    expect(text).toContain('https://pantip.com/topic/40638895');
  });

  it('タイ文字を書かない（出典の URL は除く。ADR-0012）', () => {
    expect(text.replace(/https?:\/\/\S+/g, '')).not.toMatch(/[฀-๿]/);
  });
});
