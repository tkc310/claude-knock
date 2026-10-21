// Service Worker が保存する URL の選び方（src/integrations/service-worker.ts。ADR-0013）
import { expect, it } from 'vite-plus/test';
import { precacheUrls } from '../src/integrations/service-worker';

const files: Record<string, string> = {
  'index.html': '<script src="/_astro/page.abc.js"></script><link href="/_astro/a.css">',
  'events/wan-phra/index.html': '<p>本文</p>',
  'calendar.ics': 'BEGIN:VCALENDAR',
  'manifest.webmanifest': '{}',
  'icons/icon-192.png': '',
  '_astro/page.abc.js': '',
  '_astro/a.css': '',
  '_astro/client.unused.js': '',
  'sw.js': '',
  'robots.txt': '',
  _headers: '/sw.js\n  Cache-Control: no-cache',
};

it('ページは末尾が / の URL にし、ICS・マニフェスト・アイコンを含める', () => {
  const urls = precacheUrls(Object.keys(files), (f) => files[f]!);
  expect(urls).toEqual([
    '/',
    '/_astro/a.css',
    '/_astro/page.abc.js',
    '/calendar.ics',
    '/events/wan-phra/',
    '/icons/icon-192.png',
    '/manifest.webmanifest',
  ]);
});

it('どのページも読み込まない _astro/ のファイルと、sw.js・robots.txt は保存しない', () => {
  const urls = precacheUrls(Object.keys(files), (f) => files[f]!);
  expect(urls).not.toContain('/_astro/client.unused.js');
  expect(urls).not.toContain('/sw.js');
  expect(urls).not.toContain('/robots.txt');
});

// _headers・_redirects は Cloudflare が読むだけで配られない（404）。保存の対象に入れると cache.addAll が失敗し、
// Service Worker のインストールそのものが失敗する（ADR-0016）
it('Cloudflare の設定ファイル（_headers・_redirects）は保存しない', () => {
  const urls = precacheUrls([...Object.keys(files), '_redirects'], (f) => files[f] ?? '');
  expect(urls).not.toContain('/_headers');
  expect(urls).not.toContain('/_redirects');
});
