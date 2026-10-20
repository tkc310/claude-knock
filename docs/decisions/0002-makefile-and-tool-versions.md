# 0002 コマンドの入口を Makefile と vp に集め、ツールの版は .tool-versions だけで持つ

- 日付: 2026-10-20
- 状態: 採用

## 背景

Astro のコマンドと Vite+ のコマンドが混ざると、文書やエージェントの指示に書く形がばらばらになります。Node.js と pnpm の版も、置き場所が複数あるとずれます。

## 決定

- すべてのコマンドを `Makefile` に置き、`make`（`make help`）で一覧を出す
- `Makefile` の中身は `vp` を呼ぶだけにする。例外は `make tools`（mise か asdf を呼ぶ）と `make clean`（`rm -rf`）
- `VP ?= pnpm exec vp` とし、`vp` をグローバルに入れていなくてもプロジェクト内の `vite-plus` で動くようにする
- Node.js と pnpm の版は `.tool-versions` だけで持つ。`package.json` に `engines` と `packageManager` は置かない

## 理由

人もエージェントも、覚える入口が 1 つで済みます。版の置き場所が 1 か所なら、版のずれが起きません。

## 影響・トレードオフ

- `make` と、mise か asdf が必要になる
- `vp` をグローバルに入れている人は `make VP=vp ...` で差し替えられる
