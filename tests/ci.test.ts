// CI はローカルと同じ make のコマンドだけを走らせる。act が無くても、手元の make で CI の手順を再現できる
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vite-plus/test';

const workflow = readFileSync(join(import.meta.dirname, '../.github/workflows/ci.yml'), 'utf8');
const runs = [...workflow.matchAll(/^\s*(?:-\s+)?run:\s*(.*)$/gm)].map((m) => m[1].trim());

it('ワークフローの run は make のコマンドだけ', () => {
  expect(runs.length).toBeGreaterThan(0);
  // 複数行（| や >）にすると 1 行目しか見えないので、1 行で書く
  for (const run of runs) expect(run).toMatch(/^make [a-z-]+$/);
});

it('依存を入れ、check・test・build・verify を別々の step で走らせる', () => {
  expect(runs).toEqual([
    'make tools',
    'make install',
    'make check',
    'make test',
    'make build',
    'make verify',
  ]);
});

it('.tool-versions の版を使う', () => {
  expect(workflow).toContain('jdx/mise-action');
  expect(workflow).not.toMatch(/node-version:|version:\s*\d/);
});
