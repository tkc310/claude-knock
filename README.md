# タイ仏教行事カレンダー（日本語版）

タイ仏教の行事を日本語で見られるカレンダー。Web 表示と ICS 配信を目指す。
行事名は「カタカナ（日本語訳）/ ローマ字」で書く（例: ワンプラ（布薩日）/ Wan Phra）。サイトと ICS にはタイ文字を出さない（ADR-0012）。

## はじめる

```sh
make setup   # .tool-versions の Node.js・pnpm を入れて、依存をインストールする
make dev     # http://localhost:4321
```

`make setup` には [mise](https://mise.jdx.dev/) か [asdf](https://asdf-vm.com/) が必要。
ツールのバージョンは `.tool-versions` だけで決める。

## コマンド

`make` で一覧を表示する。どのコマンドも [Vite+](https://viteplus.dev/)（`vp`）を通して動く。
`vp` をグローバルに入れていなくても、プロジェクト内の `vite-plus` を使う（`make VP=vp ...` で差し替え可）。

| make                           | 実体                                           | 内容                                                      |
| :----------------------------- | :--------------------------------------------- | :-------------------------------------------------------- |
| `make setup`                   | `mise install` / `asdf install` + `vp install` | 初回の準備                                                |
| `make install`                 | `vp install`                                   | 依存を入れる                                              |
| `make dev`                     | `vp run dev` → `astro dev`                     | 開発サーバー                                              |
| `make build`                   | `vp run build` → `astro build`                 | `dist/` に静的ビルド                                      |
| `make preview`                 | `vp run preview` → `astro preview`             | ビルドの確認                                              |
| `make check`                   | `vp check` + `vp run typecheck`                | fmt・lint・型                                             |
| `make fix`                     | `vp check --fix`                               | fmt・lint の自動修正                                      |
| `make test`                    | `vp test`                                      | テスト                                                    |
| `make test-watch`              | `vp test watch`                                | テストの監視実行                                          |
| `make ui-add C="heading card"` | `vp dlx shadcn@latest add @8341/...`           | 8341-ui の部品を足す                                      |
| `make icons`                   | `node scripts/icons.ts`                        | 法輪の favicon・PWA のアイコンを作り直す（macOS の sips） |
| `make deploy`                  | `pnpm dlx wrangler@4 deploy`                   | Cloudflare Workers にデプロイ（ADR-0016）                 |
| `make clean`                   | `rm -rf dist .astro`                           | 成果物を消す                                              |

`vp dev` / `vp build` は素の Vite を動かすので使わない。Astro のコマンドは `package.json` の scripts に集約し、`vp run <script>` で呼ぶ。

## PWA（ホーム画面に追加・オフライン）

サイトは PWA としてホーム画面やパソコンのアプリ一覧に追加でき、一度開くとオフラインでも見られる（ADR-0013）。

- `public/manifest.webmanifest`: 名前・アイコン・色・`display: standalone`
- `public/icons/`・`public/favicon.*`: ヘッダーのロゴと同じ法輪（`src/components/site/dharma-wheel.ts`）。形や色を変えたら `make icons` で作り直してコミットする
- `public/sw.js`: 自前の Service Worker。全ページ・`calendar.ics`・アイコンを保存し、ページと ICS はネットワークを先に見て、つながらないときに保存した版を返す。保存する URL と版（中身のハッシュ）はビルドの最後に `src/integrations/service-worker.ts` が `dist/sw.js` に書き込む
- 登録は本番ビルドだけ（`make dev` では登録しない）。確かめるときは `make build` のあと `make preview` で開く

追加の手順（iPhone は Safari の共有 →「ホーム画面に追加」、Android は Chrome のメニュー →「ホーム画面に追加」/「アプリをインストール」、パソコンは Chrome・Edge のアドレスバーのインストール）はトップページの「ホーム画面に追加する」にある。

## ディレクトリ

```text
src/core/        暦計算（Astro・React に依存しない純粋関数）
src/data/        行事の定義（ローマ字 / カタカナ / 日本語訳）
src/pages/       ページ
src/layouts/     レイアウト
src/components/ui/, src/lib/, src/styles/8341-ui.css
                 8341-ui から取り込んだ生成物（直接編集しない。更新は make ui-add）
tests/           テスト
tests/fixtures/  日付の正解データ（出典 URL 必須）
docs/events/     行事ごとの資料
```

## デプロイ

Cloudflare Workers の静的アセットで `dist/` を配る（ADR-0016）。main にマージすると、CI が通った後に `.github/workflows/deploy.yml` が `make deploy` を走らせる。

- 手元から: `pnpm dlx wrangler@4 login` で一度ログインし、`make deploy`
- 公開先: https://koyomi.tkc310.com（`astro.config.mjs` の `site` と `wrangler.jsonc` の `routes`）
- GitHub に要るもの: secrets の `CLOUDFLARE_API_TOKEN`・`CLOUDFLARE_ACCOUNT_ID`

## 定期作業

定期作業は年 1 回だけ。毎年 12 月に、翌年分の公式告示を照合してビルドし、デプロイする（ADR-0015）。手順と、12 月に 1 回で足りる理由は [docs/operations.md](./docs/operations.md) にまとめている。

## ドキュメント

改善ループ、設計判断（ADR）、AI エージェントとの進め方は [docs/README.md](./docs/README.md) にまとめている。

## ルール

- 実装より先にテストを書く。
- 日付の正解データは `tests/fixtures/` に置き、出典 URL を必ず付ける。
- 行事はタイ太陰暦から計算する。ソンクラーンだけは太陽暦の 4/13〜15 に固定。
- 対象は原始仏教にとって重要な行事に限る。例外としてロイクラトンとソンクラーンを「民間行事」として扱う（ADR-0007）。
