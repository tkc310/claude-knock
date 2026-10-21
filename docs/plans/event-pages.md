# 行事の詳細ページ /events/[id]

## 目的

トップページ（`src/pages/index.astro`）には行事名と日付だけが並ぶ。由来や行うことの調べは `docs/events/<id>.md` にあるが、開発者向けの調査メモで、サイトには出ていない。
行事ごとの詳細ページ `/events/[id]` を作り、読む人向けに書き直した本文を Astro のコンテンツコレクションで配信する。

## 決めること

- 本文は `src/content/events/<id>.md` に置く。`<id>` は `src/data/events.ts` の `EventId` と同じ
- 行事名は frontmatter に重ねて書かない。正本は `events.ts` の `name` で、見出しはテンプレートが `formatEventName` で出す。本文の見出しは `##` から始める
- 日付の表は本文に書かない。テンプレートが `occurrences`（`@/core`）で計算して出す（トップページと同じ）
- 本文の材料は `docs/events/<id>.md`。読む人向けに「由来」「行うこと」「日付の決め方」の要点を書く。調べの「未確認・食い違い」は載せない。出典 URL は本文末尾の `## 出典` に残す
- frontmatter は `origin`（由来）と `practice`（行うこと）を 1 行ずつ書く（ADR-0012 で `summary` から分けた）。詳細ページの冒頭・説明文と、一覧のカードに使う。スキーマは知らない項目（`name` など）を弾く

## スキーマ（`src/content.config.ts`）

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const eventEntrySchema = z.strictObject({
  origin: z.string().trim().min(1),
  practice: z.string().trim().min(1),
});

export const collections = {
  events: defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/events' }),
    schema: eventEntrySchema,
  }),
};
```

検査は `tests/content.test.ts`。`origin`・`practice` の有無・空白だけ・知らない項目と、`src/content/events/` のファイル名が `events` の `id` のどれかであることを見る。
3 つの作業より先に実装し、3 つの作業はどれもスキーマを変えない。変える必要が出たら作業を止めて相談する。

## 分担（互いに同じファイルを触らない）

| 作業                 | 触るファイル                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ルートとテンプレート | `src/pages/events/[id].astro`（新規）、`src/pages/index.astro`（各カードに詳細へのリンク）、`tests/` のページ用テスト |
| 本文A                | `src/content/events/` の `wan-phra`・`makha-bucha`・`visakha-bucha`・`asarnha-bucha`・`khao-phansa`（`.md`）          |
| 本文B                | `src/content/events/` の `ok-phansa`・`thot-kathin`・`loi-krathong`・`songkran`（`.md`）                              |

### ルートとテンプレート

- `getStaticPaths` は `events`（`src/data/events.ts`）から作る。`getEntry('events', id)` が無い id はビルドで失敗させる
- 本文が揃うまで仮のファイルを置かずに済むよう、マージは本文A・Bの後にする
- 見出しは `formatEventName`。タグ（太陰暦／太陽暦・民間行事）と日付はトップページと同じ表示にする
- 8341-ui の部品には Astro の要素を props で渡さず、子要素（slot）で渡す（AGENTS.md）

### 本文A・B

- 各 `docs/events/<id>.md` を読み、読む人向けに書き直す。パーリ語の用語や律蔵などの引用箇所は残す
- ロイクラトン・ソンクラーンは民間行事（ADR-0007）であることを本文でも示す

### 改善ログ

`docs/improvement/log.md` は表の先頭に書くので、3 つの作業が同時に書くと衝突する。各作業では書かず、マージするときに 1 行ずつ書く。

## 統合と確かめ方

- 3 つをマージしたら、「`events` の id ごとに `src/content/events/<id>.md` がある」テストを `tests/content.test.ts` に足す
- `make check`・`make test`・`make build` を通し、`make dev` で `/events/wan-phra` などを開いて見る
