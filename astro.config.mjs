// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// 今は静的出力。Cloudflare（Void）へ移すときは @astrojs/cloudflare を adapter に足す
// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
