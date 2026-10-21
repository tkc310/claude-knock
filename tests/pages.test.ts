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
    // 行事の本文だけ仮のものに差し替える。タンブンの説明（src/content/guides/）は本物を使う
    filter: (src) => src !== join(repo, 'src/content/events'),
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
    // Vitest の NODE_ENV=test を引き継ぐと import.meta.env.PROD が false になり、本番だけの処理
    // （Service Worker の登録）が消える。make build と同じ本番のビルドにする
    env: { ...process.env, NODE_ENV: 'production' },
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

  it('ビルドした日に依存する「次の行事」「次回」の表示を出さない（年 1 回のビルドで足りるように。ADR-0015）', () => {
    const html = page('index.html');
    for (const attr of [
      'data-next-event',
      'data-next-template',
      'data-next-phra',
      'data-next-dates',
      'data-countdown',
    ]) {
      expect(html).not.toMatch(new RegExp(`\\s${attr}[\\s=>]`));
    }
    expect(html).not.toContain('次の行事');
    expect(html).not.toContain('次のワンプラ');
    expect(html).not.toMatch(/>\s*次回\s*</);
  });

  it.each(['index.html', 'events/wan-phra/index.html'])('%s に OGP のメタを出す', (path) => {
    const html = page(path);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    expect(title).toBeTruthy();
    expect(html).toContain(`<meta property="og:title" content="${title}"`);
    expect(html).toMatch(/<meta property="og:description" content="[^"]+"/);
    expect(html).toMatch(/<meta property="og:image" content="[^"]*\/og\.png"/);
    expect(html).toContain('<meta property="og:image:width" content="1200"');
    expect(html).toContain('<meta property="og:image:height" content="630"');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image"');
    expect(html).not.toMatch(/[\u0E00-\u0E7F]/);
  });

  it('トップページにサイトの概要と、ICS のダウンロードと取り込み手順を出す', () => {
    const html = page('index.html');
    expect(html).toContain('このサイトについて');
    expect(html).toMatch(/<a [^>]*href="\/calendar\.ics"[^>]*download/);
    for (const app of ['Google カレンダー', 'iPhone', 'Outlook']) expect(html).toContain(app);
  });

  it('トップページに、表示範囲の月ごとのカレンダーを出し、行事から詳細ページへリンクする', () => {
    const html = page('index.html');
    const { from, to } = displayRange(new Date());
    expect(html).toContain(`data-month="${from.slice(0, 7)}"`);
    expect(html).toContain(`data-month="${to.slice(0, 7)}"`);
    expect(html.match(/data-month="/g)).toHaveLength(24);
    expect(html).toMatch(/<table[^>]*data-month=/);
    // 最初に見せる月のほかは <template> に入れ、開いたときに DOM に出す（DOM を小さくする。ADR-0013）
    expect(html.match(/<template data-month-template="/g)).toHaveLength(23);
    expect(html).toContain('aria-label="前の月"');
    expect(html).toContain('aria-label="次の月"');
  });

  it('カレンダーに凡例と月ごとの行事の一覧を添える', () => {
    const html = page('index.html');
    for (const label of ['仏教行事', '民間行事', 'ワンプラ', '今日']) {
      expect(html).toMatch(new RegExp(`data-legend[^>]*>[\\s\\S]*${label}`));
    }
    // スマホ幅ではマスの中を色の点にし、その月の行事は表の下に文字で並べる
    expect(html.match(/\sdata-agenda="/g)).toHaveLength(24);
  });

  // PC でもスマホと同じく、由来と行うことはカードの中に出し、ホバーのポップアップにしない
  it('一覧のカードは、PC でもポップアップにせず、由来と行うことをカードの中に出す', () => {
    const html = page('index.html');
    expect(html.match(/\sdata-card[\s=>]/g)).toHaveLength(events.length);
    expect(html.match(/\sdata-details[\s=>]/g)).toHaveLength(events.length);
    expect(html).not.toMatch(/\sdata-popover[\s=>]/);
    expect(html).not.toContain('hoverable:');
    // Tailwind v4 は hover: を (hover: hover) で包むので、幅と組み合わせた hoverable: の条件が無いことを見る
    expect(html).not.toMatch(
      /\(hover:\s*hover\) and \((?:min-width:\s*48rem|width\s*>=\s*48rem)\)/,
    );
    expect(html).not.toContain('カーソルを当てると');
  });

  it('「ホーム画面に追加する」の節は、「カレンダーアプリに取り込む」と同じカード型にする', () => {
    const html = page('index.html');
    const section = (id: string) => {
      const open = `<section aria-labelledby="${id}" class="([^"]*)"[^>]*>`;
      const m = html.match(new RegExp(`${open}([\\s\\S]*?)</section>`));
      expect(m).toBeTruthy();
      return { classes: m![1]!.split(/\s+/), body: m![2]! };
    };
    const ics = section('ics');
    const app = section('app');
    for (const c of ['overflow-hidden', 'border', 'border-border-subtle', 'rounded-sm']) {
      expect(ics.classes).toContain(c);
      expect(app.classes).toContain(c);
    }
    for (const part of ['bg-gold-subtle', 'gap-px bg-border-subtle']) {
      expect(ics.body).toContain(part);
      expect(app.body).toContain(part);
    }
  });

  // ボタン（rounded-md・rounded-full のボタン）以外の面は角丸を弱くする: カード・パネルは sm、内側の面は xs
  const radiusPages = ['index.html', 'events/wan-phra/index.html', 'tambun/index.html'];
  it.each(radiusPages)('%s のボタン以外の面は角丸を sm 以下にする', (path) => {
    expect(page(path)).not.toMatch(/\brounded-(?:t-|b-|s-|e-)?(?:lg|xl|2xl|3xl)\b/);
  });

  it('ヘッダーのロゴは法輪で、favicon も同じ法輪にする', () => {
    for (const path of ['index.html', 'events/wan-phra/index.html']) {
      const html = page(path);
      expect(html).toMatch(/<svg [^>]*data-logo="dharma-wheel"/);
      expect(html).toMatch(/<link [^>]*rel="icon"[^>]*href="\/favicon\.svg"/);
      expect(html).toMatch(/<link [^>]*rel="icon"[^>]*href="\/favicon\.ico"/);
    }
    // 法輪の金色（行事のイラストのアーサーラハ・ブーチャーと同じ）
    expect(page('favicon.svg')).toContain('#D99A2B');
    expect(readFileSync(join(root, 'dist/favicon.ico')).readUInt32LE(0)).toBe(0x0001_0000);
  });

  it('トップページの冒頭にサイト名の見出しを重ねず、導入文を h1 にする', () => {
    const html = page('index.html');
    const h1 = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)].map((m) => m[0]);
    expect(h1).toHaveLength(1);
    expect(h1[0]!.replace(/<[^>]+>/g, '')).toContain('タイの仏教行事の日付と意味を');
    expect(h1[0]).not.toMatch(/>\s*タイ仏教行事カレンダー\s*</);
    for (const event of events) {
      expect(page(`events/${event.id}/index.html`).match(/<h1[\s>]/g)).toHaveLength(1);
    }
  });

  it.each(['index.html', 'events/wan-phra/index.html'])(
    '%s に viewport・説明文・テーマ色・マニフェスト・ホーム画面のアイコンを書く',
    (path) => {
      const html = page(path);
      expect(html).toMatch(/<html [^>]*lang="ja"/);
      expect(html).toContain(
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
      );
      expect(html).toMatch(/<meta name="description" content="[^"]{20,}"/);
      expect(html).toMatch(/<meta name="theme-color" content="#[0-9a-f]{6}"/);
      expect(html).toContain('<link rel="manifest" href="/manifest.webmanifest">');
      expect(html).toMatch(
        /<link rel="apple-touch-icon" [^>]*href="\/icons\/apple-touch-icon\.png"/,
      );
    },
  );

  it('Web アプリマニフェストに名前・アイコン・色・表示方法を書き、アイコンの PNG を置く', () => {
    const manifest = JSON.parse(page('manifest.webmanifest'));
    expect(manifest).toMatchObject({
      name: 'タイ仏教行事カレンダー',
      short_name: expect.any(String),
      lang: 'ja',
      start_url: '/',
      display: 'standalone',
      theme_color: expect.stringMatching(/^#[0-9a-f]{6}$/),
      background_color: expect.stringMatching(/^#[0-9a-f]{6}$/),
    });
    const icons: { src: string; sizes: string; type: string; purpose?: string }[] = manifest.icons;
    const sizes = (purpose: string) =>
      icons.filter((i) => (i.purpose ?? 'any') === purpose).map((i) => i.sizes);
    expect(sizes('any')).toEqual(expect.arrayContaining(['192x192', '512x512']));
    expect(sizes('maskable')).toContain('512x512');
    const pngs = icons.filter((i) => i.type === 'image/png').map((i) => i.src);
    for (const src of [...pngs, '/icons/apple-touch-icon.png']) {
      const png = readFileSync(join(root, 'dist', src));
      expect(png.subarray(1, 4).toString()).toBe('PNG');
    }
  });

  it('Service Worker を登録し、ページ・calendar.ics を保存する一覧と版をビルド時に書き込む', () => {
    for (const path of ['index.html', 'events/wan-phra/index.html']) {
      expect(page(path)).toMatch(/serviceWorker\.register\(["'`]\/sw\.js["'`]/);
    }
    const sw = page('sw.js');
    expect(sw).not.toContain('__SW_');
    expect(sw).toMatch(/const VERSION = "[0-9a-f]{12}"/);
    const precache: string[] = JSON.parse(sw.match(/const PRECACHE = (\[[^\]]*\])/)![1]!);
    for (const url of ['/', '/calendar.ics', '/manifest.webmanifest', '/favicon.svg']) {
      expect(precache).toContain(url);
    }
    for (const event of events) expect(precache).toContain(`/events/${event.id}/`);
    for (const url of precache) {
      const file = url.endsWith('/') ? `${url}index.html` : url;
      expect(() => readFileSync(join(root, 'dist', file))).not.toThrow();
    }
  });

  it('トップページに、ホーム画面に追加する（アプリとして使う）手順とオフラインのことを書く', () => {
    const html = page('index.html');
    expect(html).toContain('ホーム画面に追加');
    for (const app of ['iPhone', 'Android', 'Chrome', 'Edge']) expect(html).toContain(app);
    expect(html).toContain('オフライン');
    expect(page('robots.txt')).toMatch(/^User-agent: \*/m);
  });

  it.each(events)('$id のイラストを一覧のカードと詳細ページに出す', (event) => {
    const mark = `data-illustration="${event.id}"`;
    expect(page('index.html')).toContain(mark);
    expect(page(`events/${event.id}/index.html`)).toContain(mark);
  });

  it('タンブンの説明ページ /tambun/ を作り、見出し・説明文・出典を出してタイ文字を出さない', () => {
    const html = page('tambun/index.html');
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toContain('タンブン');
    expect(html).toMatch(/<meta name="description" content="[^"]{20,}"/);
    expect(html).toMatch(/<svg [^>]*data-logo="dharma-wheel"/);
    expect(html).toMatch(/<a href="https:\/\/suttacentral\.net\/an8\.36\/[^"]*" target="_blank"/);
    expect(html).not.toMatch(/[\u0E00-\u0E7F]/);
    expect(html).toContain('href="/"');
    const sw = page('sw.js');
    expect(JSON.parse(sw.match(/const PRECACHE = (\[[^\]]*\])/)![1]!)).toContain('/tambun/');
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
