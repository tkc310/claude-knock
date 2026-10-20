import { defineConfig } from 'vite-plus';

const generated = ['src/components/ui/**', 'src/lib/**', 'src/styles/8341-ui.css'];

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    environment: 'node',
  },
  lint: {
    ignorePatterns: ['dist/**', '.astro/**', ...generated],
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    ignorePatterns: ['dist/**', '.astro/**', 'pnpm-lock.yaml', 'CLAUDE.md', ...generated],
    singleQuote: true,
  },
});
