// ビルドの最後に dist/sw.js（元は public/sw.js）へ、保存する URL の一覧と版を書き込む Astro のインテグレーション（ADR-0013）。
// 版は保存するファイルの中身のハッシュにする。ビルドで中身が変われば版が変わり、利用者の端末の古い保存が入れ替わる
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

const VERSION_MARK = `'__SW_VERSION__'`;
const PRECACHE_MARK = '/* __SW_PRECACHE__ */ []';

/** dist の中のファイルから、Service Worker が保存する URL を選ぶ */
export function precacheUrls(files: readonly string[], read: (file: string) => string): string[] {
  const html = files.filter((f) => f.endsWith('.html'));
  // _astro/ はページから読み込むものだけ（React の実行時など、どのページも使わないものは外す）
  const referenced = new Set(
    html.flatMap((f) => [...read(f).matchAll(/["'(](\/_astro\/[^"')\s]+)/g)].map((m) => m[1]!)),
  );
  const pages = html.map((f) => `/${f.replace(/(^|\/)index\.html$/, '$1')}`);
  const assets = files
    .filter((f) => !f.endsWith('.html') && f !== 'sw.js' && f !== 'robots.txt')
    .map((f) => `/${f}`)
    .filter((url) => !url.startsWith('/_astro/') || referenced.has(url));
  return [...pages, ...assets].sort();
}

function listFiles(root: string): string[] {
  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => relative(root, join(d.parentPath, d.name)).split(sep).join('/'));
}

export function serviceWorker(): AstroIntegration {
  return {
    name: 'service-worker',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const read = (file: string) => readFileSync(join(root, file), 'utf8');
        const urls = precacheUrls(listFiles(root), read);
        const hash = createHash('sha256');
        for (const url of urls) {
          const file = url.endsWith('/') ? `${url}index.html` : url;
          hash.update(url).update(readFileSync(join(root, file)));
        }
        const version = hash.digest('hex').slice(0, 12);

        const sw = read('sw.js');
        if (!sw.includes(VERSION_MARK) || !sw.includes(PRECACHE_MARK)) {
          throw new Error(`public/sw.js に ${VERSION_MARK} と ${PRECACHE_MARK} の目印がありません`);
        }
        writeFileSync(
          join(root, 'sw.js'),
          sw
            .replace(VERSION_MARK, JSON.stringify(version))
            .replace(PRECACHE_MARK, JSON.stringify(urls)),
        );
        logger.info(`sw.js: 版 ${version}、保存する URL ${urls.length} 件`);
      },
    },
  };
}
