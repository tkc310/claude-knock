// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import { externalLinks } from './src/markdown/external-links';

// 今は静的出力。Cloudflare（Void）へ移すときは @astrojs/cloudflare を adapter に足す
// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [react()],
  markdown: {
    processor: satteri({ hastPlugins: [externalLinks] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
