# 0001 Astro を静的出力で使い、dev と build は Astro、fmt・lint・test は Vite+ に分ける

- 日付: 2026-10-20
- 状態: 採用

## 背景

行事の一覧と ICS は、ビルド時に決まる静的なファイルで足ります。ツールは Vite+（`vp`）にまとめたいが、Astro も Vite で動きます。

## 決定

- Astro を `output: 'static'` で使う（`astro.config.mjs`）
- 開発サーバーとビルドは Astro が担当する。`package.json` の scripts に `astro dev`・`astro build` などを置き、`vp run <script>` で呼ぶ
- フォーマット・lint・テストは Vite+ が担当する（`vp check`・`vp test`）
- `vp dev` と `vp build` は使わない

## 理由

- Astro は依存として自前の Vite（8.3.4）を持つ。`vp dev` と `vp build` は Astro を通さず素の Vite を動かすので、Astro のページを扱えない
- Astro の `vite` を `@voidzero-dev/vite-plus-core` に差し替える override もできるが、Astro との互換性が保証されないので入れない

## 影響・トレードオフ

- Vite が 2 つ入る（Astro 用と Vite+ 用）
- Cloudflare（Void）へ移すときは、後から `@astrojs/cloudflare` を adapter に足す
