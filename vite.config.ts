import { defineConfig } from 'vite-plus';

const generated = ['src/components/ui/**', 'src/lib/**', 'src/styles/8341-ui.css'];

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    environment: 'node',
  },
  lint: {
    ignorePatterns: ['dist/**', '.astro/**', ...generated],
    // 型エラーは astro check（.astro を含む。TypeScript 6）だけが報告する。tsgolint は型を使う lint 規則だけ（ADR-0010）
    options: { typeAware: true, typeCheck: false },
    // core の内部は core の中とテストからだけ読み込む。外からは公開 API（src/core/index.ts）を使う（ADR-0008）
    overrides: [
      {
        files: ['src/**'],
        excludeFiles: ['src/core/**'],
        rules: {
          'no-restricted-imports': [
            'error',
            {
              patterns: [
                { group: ['@/core/*', '**/core/*'], message: '公開 API の @/core から読み込む' },
              ],
            },
          ],
        },
      },
    ],
  },
  fmt: {
    ignorePatterns: ['dist/**', '.astro/**', 'pnpm-lock.yaml', 'CLAUDE.md', ...generated],
    singleQuote: true,
  },
});
