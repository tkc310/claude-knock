// 行事の詳細ページ /events/[id]（docs/plans/event-pages.md の「ルートとテンプレート」）。
// 本文（src/content/events/）は別の作業で書くので、作業コピーを一時ディレクトリに写し、仮の本文を置いてビルドする
import { execFileSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';
import { formatLunarDate, occurrences } from '../src/core';
import { displayRange } from '../src/data/display-range';
import { events, formatEventName } from '../src/data/events';

const repo = join(import.meta.dirname, '..');
const astro = join(repo, 'node_modules/astro/bin/astro.mjs');

function copyProject(): string {
  const root = mkdtempSync(join(tmpdir(), 'event-pages-'));
  for (const f of ['astro.config.mjs', 'tsconfig.json', 'package.json', 'public']) {
    cpSync(join(repo, f), join(root, f), { recursive: true });
  }
  cpSync(join(repo, 'src'), join(root, 'src'), {
    recursive: true,
    filter: (src) => src !== join(repo, 'src/content'),
  });
  symlinkSync(join(repo, 'node_modules'), join(root, 'node_modules'), 'dir');
  return root;
}

function writeEntries(root: string, ids: readonly string[]) {
  const dir = join(root, 'src/content/events');
  mkdirSync(dir, { recursive: true });
  for (const id of ids) {
    writeFileSync(
      join(dir, `${id}.md`),
      `---\norigin: ${id} の由来\npractice: ${id} で行うこと\n---\n\n## 由来\n\n${id} の本文。\n\n## 出典\n\n- https://example.com/${id}\n`,
    );
  }
}

function build(root: string) {
  return execFileSync(process.execPath, [astro, 'build'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

const roots: string[] = [];
afterAll(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
});

describe('/events/[id]', { timeout: 120_000 }, () => {
  let root: string;
  const page = (path: string) => readFileSync(join(root, 'dist', path), 'utf8');

  beforeAll(() => {
    root = copyProject();
    roots.push(root);
    writeEntries(
      root,
      events.map((e) => e.id),
    );
    build(root);
  }, 120_000);

  it.each(events)('$id のページに行事名・説明文・本文が出る', (event) => {
    const html = page(`events/${event.id}/index.html`);
    expect(html).toContain(`<h1`);
    expect(html).toContain(formatEventName(event.name));
    expect(html).toContain(
      `<meta name="description" content="${event.id} の由来。${event.id} で行うこと。"`,
    );
    expect(html).not.toMatch(/[\u0E00-\u0E7F]/);
    expect(html).toContain(`${event.id} の本文。`);
    expect(html).toContain('href="/"');
    expect(html).toContain(
      `<a href="https://example.com/${event.id}" target="_blank" rel="noopener noreferrer">`,
    );
  });

  it.each(events)('$id のページにトップページと同じタグと日付が出る', (event) => {
    const html = page(`events/${event.id}/index.html`);
    expect(html).toContain(event.date.kind === 'solar-span' ? '太陽暦' : '太陰暦');
    expect(html.includes('民間行事')).toBe(event.category === 'folk');

    const dates = occurrences(events, displayRange(new Date())).filter(
      (o) => o.event.id === event.id,
    );
    expect(dates.length).toBeGreaterThan(0);
    if (event.date.kind === 'uposatha') {
      expect(html).toContain('月に 4 回');
    } else {
      for (const o of dates) {
        expect(html).toContain(o.start);
        expect(html).toContain(formatLunarDate(o.lunar));
      }
    }
  });

  it('トップページの各カードから詳細ページへリンクし、由来と行うことを出す', () => {
    const html = page('index.html');
    for (const event of events) {
      expect(html).toContain(`href="/events/${event.id}/"`);
      expect(html).toContain(`${event.id} の由来`);
      expect(html).toContain(`${event.id} で行うこと`);
    }
    expect(html).not.toMatch(/[\u0E00-\u0E7F]/);
  });

  it('トップページにサイトの概要と、ICS のダウンロードと取り込み手順を出す', () => {
    const html = page('index.html');
    expect(html).toContain('このサイトについて');
    expect(html).toMatch(/<a [^>]*href="\/calendar\.ics"[^>]*download/);
    for (const app of ['Google カレンダー', 'iPhone', 'Outlook']) expect(html).toContain(app);
  });

  it.each(events)('$id のイラストを一覧のカードと詳細ページに出す', (event) => {
    const mark = `data-illustration="${event.id}"`;
    expect(page('index.html')).toContain(mark);
    expect(page(`events/${event.id}/index.html`)).toContain(mark);
  });

  it.each(['index.html', 'events/wan-phra/index.html'])(
    '%s は OS がダークモードでも白い配色にする',
    (path) => {
      expect(page(path)).toMatch(/<html [^>]*data-theme="light"/);
    },
  );
});

it('本文の無い行事があればビルドが失敗する', { timeout: 120_000 }, () => {
  const root = copyProject();
  roots.push(root);
  writeEntries(
    root,
    events.filter((e) => e.id !== 'songkran').map((e) => e.id),
  );
  expect(() => build(root)).toThrow(/songkran/);
});
