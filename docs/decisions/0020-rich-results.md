# 0020 リッチリザルト向けに Organization と Article の JSON-LD を出し、Event は出さない

- 日付: 2026-10-22
- 状態: 採用（ADR-0017 の JSON-LD を広げる）

## 背景

ADR-0017 で、どのページにも `WebSite`、トップ以外に `BreadcrumbList` の JSON-LD を出した。利用者から、各ページにリッチリザルト（検索結果の見た目を豊かにする構造化データ）を入れるよう求められた。

## 決定

- どのページにも運営者の `Organization`（`@id` は `https://koyomi.tkc310.com/#organization`、名前・URL・ロゴ）を出す。ロゴは PWA の `icons/icon-512.png`（512×512 の正方形の PNG）
- `WebSite` の `publisher` は `Organization` を指す。`WebSite` の `description` はページごとの説明文と混ざるので出さない
- トップ以外（行事の詳細ページ・タンブンのページ）に `Article` を出す。`headline` はページ名、`description`、`mainEntityOfPage`（canonical）、`image`（`og.png`）、`inLanguage`、`dateModified`（ビルドした日）、`author` と `publisher`（`Organization`）
- `BreadcrumbList` はこれまでどおり
- `Event` は出さない

## 理由

- Google の Event の条件は「物理的な会場で行われ、一般の人が予約できる催し」。タイの仏教行事の日は全国で行われる記念日で、会場も予約も無いので当てはまらない。条件に合わない構造化データは、ガイドライン違反として扱われるおそれがある
- 行事の詳細ページとタンブンのページは解説の記事なので、`Article` が合う。サイト名・ロゴは `Organization` で検索結果に出せる
- FAQ・HowTo は、Google がリッチリザルトの対象を絞ったので使わない

## 影響・トレードオフ

- `dateModified` はビルドのたびに変わる。内容（日付・本文）も暦と本文からビルドのたびに作るので、実態に合う
- `datePublished` は、ページごとの公開日を持っていないので出さない（Google では推奨で、必須ではない）
