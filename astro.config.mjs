// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import { externalLinks } from './src/markdown/external-links';
import { serviceWorker } from './src/integrations/service-worker';

// 今は静的出力。Cloudflare（Void）へ移すときは @astrojs/cloudflare を adapter に足す
// https://astro.build/config
export default defineConfig({
  output: 'static',
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
