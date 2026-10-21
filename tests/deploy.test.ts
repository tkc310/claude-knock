// Cloudflare Workers の静的アセットへのデプロイ（ADR-0016）。
// dist/ をそのまま配る。Worker のスクリプトと Astro のアダプターは使わない
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';

const read = (f: string) => readFileSync(join(import.meta.dirname, '..', f), 'utf8');

describe('Cloudflare Workers へのデプロイ', () => {
  it('wrangler.json は dist/ を静的アセットとして配り、Worker のスクリプトを持たない', () => {
    const config = read('wrangler.json');
    expect(config).toMatch(/"name":\s*"koyomi"/);
    expect(config).toMatch(/"compatibility_date":\s*"\d{4}-\d{2}-\d{2}"/);
    expect(config).toMatch(/"directory":\s*"\.\/dist"/);
    expect(config).not.toMatch(/"main":/);
  });

  it('_headers で Service Worker を毎回確かめさせ、ICS を text/calendar で返す', () => {
    const headers = read('public/_headers');
    expect(headers).toMatch(/^\/sw\.js\n\s+Cache-Control: no-cache$/m);
    expect(headers).toMatch(/^\/calendar\.ics\n\s+Content-Type: text\/calendar; charset=utf-8$/m);
  });

  it('公開先は koyomi.tkc310.com（site と独自ドメイン）', () => {
    const site = /site: process\.env\.SITE_URL \|\| 'https:\/\/koyomi\.tkc310\.com'/;
    expect(read('astro.config.mjs')).toMatch(site);
    const domain = /"pattern": "koyomi\.tkc310\.com",\s*"custom_domain": true/;
    expect(read('wrangler.json')).toMatch(domain);
  });

  it('デプロイは main の CI が通った後にだけ動き、手元と同じ make deploy を走らせる', () => {
    const workflow = read('.github/workflows/deploy.yml');
    expect(workflow).toMatch(/workflow_run:\s*\n\s+workflows: \[CI\]\s*\n\s+types: \[completed\]/);
    expect(workflow).toMatch(/branches: \[main\]/);
    expect(workflow).toContain("github.event.workflow_run.conclusion == 'success'");
    const runs = [...workflow.matchAll(/^\s*run:\s*(.*)$/gm)].map((m) => m[1]!.trim());
    expect(runs).toEqual(['make tools', 'make install', 'make deploy']);
    expect(workflow).toContain('CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}');
    expect(workflow).toContain('CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}');
  });

  it('make deploy は build と verify の後に wrangler で送る', () => {
    expect(read('Makefile')).toMatch(/^deploy: build verify .*\n\tpnpm dlx .*wrangler@4 deploy$/m);
  });

  it('wrangler を入れるときに esbuild と workerd のビルドを許す（pnpm の allowBuilds）', () => {
    const workspace = read('pnpm-workspace.yaml');
    expect(workspace).toMatch(/^allowBuilds:\n(?:\s+.*\n)*?\s+esbuild: true/m);
    expect(workspace).toMatch(/^allowBuilds:\n(?:\s+.*\n)*?\s+workerd: true/m);
  });
});
