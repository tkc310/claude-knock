# 0013 スマホファーストのカードと、自前の Service Worker で PWA にする

- 日付: 2026-10-21
- 状態: 採用

## 背景

トップページの行事カードは、由来・行うこと・表示年の日付をホバーのポップアップで出していた。カーソルの無いスマホでは見えず、狭い幅ではカードの下に重なって読みにくかった。ヘッダーのロゴは仮の丸、favicon は Astro の既定のままだった。

利用者から、法輪のロゴ、スマホファースト、Lighthouse の全カテゴリ 100 点、ホーム画面に追加してオフラインでも見られること（PWA）を求められた。測ると、トップページは meta description が無く（SEO 90）、カレンダーの行事名のタップ領域が 20px（アクセシビリティ 96）、DOM が 4,746 要素（24 か月分の月表を全部 DOM に置いていた）、CSS が表示を妨げる外部ファイルだった。

## 決定

### スマホファーストのカード

- CSS は既定をスマホの見た目にし、`md:` で広げる。カーソルのある md 以上の画面は `hoverable:`（`@media (hover: hover) and (min-width: 48rem)`。`globals.css` の `@custom-variant`）で分ける
- カードの由来と行うこと（`data-popover`）は 1 つの要素のまま、既定ではカードの中（次回の日付の上）に出す。`hoverable:` でだけ浮かせてポップアップにし、表示年の日付を足す。md 以上でもタッチだけの端末（タブレット）はカードの中に出す
- ポップアップには行事名を繰り返さない（すぐ隣のカードにある）。左右に置く script は `hoverable` に一致するときだけ動く
- ヘッダーの案内はスマホでもロゴの下に出し、タップ領域を 44px にする

### DOM を小さくする

- カレンダーは最初に見せる月だけを DOM に置き、残りの 23 か月は `<template data-month-template>` に入れて、前後の月へ移ったときに出す。「次の行事」の 2 件目以降も `<template>` に入れ、ワンプラの候補は 1 つの `<time>` の `data-dates` に持つ
- 行事のイラストの同じ色の繰り返しの図形（灯明・雨・輻など）は 1 つの `path` にまとめる。見た目は変えない
- CSS はページに埋め込む（`build.inlineStylesheets: 'always'`）。1 ページ約 60KB（gzip で約 10KB）増えるが、表示を妨げる読み込みが無くなる

### PWA

- `public/manifest.webmanifest` に名前・短い名前・アイコン（192・512・maskable 512・SVG）・`theme_color`・`background_color`・`display: standalone`・`start_url`・`lang: ja` を書く。`apple-touch-icon` も置く
- アイコンはヘッダーのロゴと同じ法輪（`src/components/site/dharma-wheel.ts`）から `make icons`（`scripts/icons.ts`）で作り、生成物を `public/` にコミットする。PNG は macOS の `sips`、ICO は PNG を包む数十行のコードで作り、npm の依存は足さない
- Service Worker は外部ライブラリ（Workbox など）を使わず、`public/sw.js` に自前で書く
  - インストール時に全ページ・`calendar.ics`・マニフェスト・アイコン・ページが読み込む `_astro/` を保存する
  - ページと `calendar.ics` はネットワークを先に見て（新しい日付を見せる）、つながらないときに保存した版を返す。ほかはファイル名か版で中身が決まるので保存した版を先に返す
  - 保存する URL の一覧と版は、ビルドの最後に `src/integrations/service-worker.ts` が `dist/sw.js` に書き込む。版は保存するファイルの中身のハッシュにし、中身が変わったビルドで古い保存を消す
  - 登録は `load` の後に行い、表示を遅らせない。開発サーバーでは登録しない（古い保存で変更が見えなくなるため）

## 理由

- スマホの読み手が多い。カーソルの有無で出し分ければ、スマホでも由来と行うことが読め、PC ではカードを短く保てる。同じ要素を出し分けるので、HTML に同じ文を 2 回書かない
- `<template>` の中は DOM に入らないので、24 か月分の HTML を残したまま（検索エンジン・テストから見える）DOM を 800 要素未満にできる
- 静的サイトで保存する物が少なく、Workbox の機能（ルーティング・期限切れの管理）は要らない。数十行なら読んで直せる
- 版を中身のハッシュにすると、中身が変わらないビルドでは利用者に保存し直させない

## 影響・トレードオフ

- 測定（本番ビルドを `astro preview` で配信し、Lighthouse 12.8 で測る）: トップページ・詳細ページとも、モバイル・デスクトップで Performance・Accessibility・Best Practices・SEO がすべて 100。LCP 0.9 秒以下、CLS 0、TBT 0〜5ms。採点に入らない診断の max-potential-FID はモバイルのトップで 90〜110ms（インライン CSS の配置計算）で、1.0 にはならない
- DOM の要素数はカレンダーの月の行事数で増減する。今は 800 の閾値まで余裕が 20 前後しかない。カードやヒーローに要素を足すときは Lighthouse の dom-size を見る
- JavaScript が動かない環境では、最初の月のほかのカレンダーは出ない（前後の月のボタンも動かないので、今までと同じ）
- サイトの URL が決まっていないので canonical は書いていない。決まったら `astro.config.mjs` の `site` と一緒に足す
- `tests/pages.test.ts` が、カードの出し分け（`hoverable:absolute`・既定で `absolute`/`opacity-0` が無い）、法輪のロゴと favicon、h1、head の meta、マニフェストとアイコン、Service Worker の登録と保存の一覧、ホーム画面に追加する説明を検査する。`tests/service-worker.test.ts` が保存する URL の選び方を検査する
