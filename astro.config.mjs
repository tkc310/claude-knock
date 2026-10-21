// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import { externalLinks } from './src/markdown/external-links';
import { serviceWorker } from './src/integrations/service-worker';

// 静的出力を Cloudflare Workers の静的アセットで配る（ADR-0016）。アダプターは使わない
// https://astro.build/config
export default defineConfig({
  output: 'static',
  // 公開先の URL（ADR-0016）。canonical・sitemap・OGP の og:image・og:url を絶対 URL にするのに使う。
  // 別の URL でビルドするとき（プレビューなど）は SITE_URL で上書きする
  site: process.env.SITE_URL || 'https://koyomi.tkc310.com',
  // serviceWorker: dist/sw.js に保存する URL と版を書き込む（ADR-0013）
  integrations: [react(), serviceWorker()],
  // CSS はページに埋め込み、表示を妨げる読み込み（render-blocking）を無くす（ADR-0013）
  build: { inlineStylesheets: 'always' },
  markdown: {
    processor: satteri({ hastPlugins: [externalLinks] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
