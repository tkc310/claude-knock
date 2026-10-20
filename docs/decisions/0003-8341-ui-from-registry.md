# 0003 デザインシステムに 8341-ui を shadcn レジストリ（v0.1.0 固定）で取り込む

- 日付: 2026-10-20
- 状態: 採用

## 背景

画面の部品とアクセシビリティを自前で作らず、デザインシステムに頼りたい。8341-ui は npm に公開されておらず、shadcn のレジストリで配られています。

## 決定

- `components.json` の `registries` に `@8341` を v0.1.0 の URL で登録し、版を固定する
- 部品は `make ui-add C="heading card"` で取り込む。8341-ui は React + Base UI + Tailwind v4 で書かれている
- 部品はハイドレーションせず、サーバー側で描画する（`client:*` を付けない）
- 取り込んだ `src/components/ui/`・`src/lib/`・`src/styles/8341-ui.css` は直接編集せず、`vite.config.ts` で fmt と lint の対象から外す

## 理由

- レジストリの URL に版を入れておけば、取り込み直しても同じ部品が入る
- 生成物を編集しなければ、`make ui-add` での更新で手直しが消えることがない

## 影響・トレードオフ

- 部品を直したいときは 8341-ui 側を直して版を上げる
- `.astro` から部品へ Astro の要素を props で渡すとビルドが失敗する。子要素（slot）で渡す（`AGENTS.md`）
