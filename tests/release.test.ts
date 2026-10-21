// リリースノートとバージョンの自動化（release-please。ADR-0021）
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';

const read = (f: string) => readFileSync(join(import.meta.dirname, '..', f), 'utf8');

describe('release-please', () => {
  it('main への push で release-please を動かし、リリースの PR・タグ・リリースノートを作る', () => {
    const workflow = read('.github/workflows/release.yml');
    expect(workflow).toMatch(/push:\s*\n\s+branches: \[main\]/);
    expect(workflow).toContain('uses: googleapis/release-please-action@v5');
    expect(workflow).toContain('config-file: release-please-config.json');
    expect(workflow).toContain('manifest-file: .release-please-manifest.json');
    expect(workflow).toMatch(/contents: write/);
    expect(workflow).toMatch(/pull-requests: write/);
    // GITHUB_TOKEN で作った PR では CI が動かないので、トークンがあればそちらを使う
    expect(workflow).toContain('token: ${{ secrets.RELEASE_PLEASE_TOKEN || github.token }}');
  });

  it('Node のパッケージとして、package.json とマニフェストの版をそろえる', () => {
    const config = JSON.parse(read('release-please-config.json'));
    expect(config['release-type']).toBe('node');
    expect(config.packages['.']).toBeDefined();
    const manifest = JSON.parse(read('.release-please-manifest.json'));
    const pkg = JSON.parse(read('package.json'));
    expect(manifest['.']).toBe(pkg.version);
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('リリースノートは日本語の見出しで、feat・fix・perf・docs を載せ、ほかは載せない', () => {
    type Section = { type: string; section: string; hidden?: boolean };
    const config = JSON.parse(read('release-please-config.json'));
    const sections: Section[] = config['changelog-sections'];
    const shown = sections.filter((s) => !s.hidden).map((s) => s.type);
    expect(shown).toEqual(['feat', 'fix', 'perf', 'docs']);
    expect(sections.find((s) => s.type === 'feat')?.section).toBe('新機能');
  });

  it('生成される CHANGELOG.md は整形の対象から外す', () => {
    expect(read('vite.config.ts')).toMatch(/ignorePatterns: \[[^\]]*'CHANGELOG\.md'/);
  });
});
