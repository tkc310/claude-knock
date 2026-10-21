import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vite-plus/test';
import { events } from '../src/data/events';

// astro:content は Astro の仮想モジュールで、Vitest からは解決できない
vi.mock('astro:content', () => ({ defineCollection: <T>(config: T) => config }));

const { eventEntrySchema } = await import('../src/content.config');

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
