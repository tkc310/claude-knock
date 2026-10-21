# 0011 `.astro` は oxfmt（`vp fmt`）で丸ごと整形し、テンプレートの lint は足さない

- 日付: 2026-10-21
- 状態: 採用

## 背景

`.astro` のテンプレート部分（frontmatter の `---` より下の HTML・式・`<style>`）は、`vp fmt` も `vp lint` も見ていなかった。見ていたのは `astro check`（型）と `astro build` だけで、書き方の揺れ（インデント・改行・属性の並べ方）はレビューで拾うしかなかった。

選択肢は次のとおり。

1. Prettier と `prettier-plugin-astro` を入れ、`.astro` だけ Prettier で整形する
2. oxfmt の `astro` オプションを使い、`vp fmt` で `.astro` も整形する
3. lint に ESLint と `eslint-plugin-astro` を足す
4. 何もしない（`astro check` だけ）

調べたこと（2026-10-21 時点）:

- `vite-plus` 1.3.0 は oxfmt 0.73.0 を同梱している（`pnpm-lock.yaml`）。oxfmt は 0.73.0 で `.astro` に対応した。中身は oxfmt に組み込まれた `prettier-plugin-astro` で、frontmatter と `<script>` は oxfmt 自身が、テンプレートと `<style>` はその Prettier プラグインが整形する
- 有効にするには、設定で `astro: true`（またはオプションのオブジェクト）を指定し、`@astrojs/compiler-rs` をプロジェクトに入れる。oxfmt は `@astrojs/compiler-rs` を同梱せず、無いと整形が失敗する（[Configuration file reference](https://oxc.rs/docs/guide/usage/formatter/config-file-reference.html)・[Language support](https://oxc.rs/docs/guide/usage/formatter/language-support.html)）
- Vite+ は `vite.config.ts` の `fmt` ブロックを oxfmt の設定として渡す（[viteplus.dev/config/fmt](https://viteplus.dev/config/fmt)）
- oxlint は `.vue`・`.svelte`・`.astro` の `<script>`（Astro では frontmatter を含む）だけを lint し、テンプレートは見ない（[Oxlint の使い方](https://oxc.rs/docs/guide/usage/linter)）。テンプレートを lint する手段は、Vite+ の中には無い

## 決定

**`.astro` は oxfmt で丸ごと整形する（選択肢 2）。テンプレートの lint は足さない（選択肢 3 は採らない）。**

- `vite.config.ts` の `fmt` に `astro: true` を足す。サブオプション（`compressHTML` など）は既定のまま
- `@astrojs/compiler-rs` を devDependencies に直接書く。版は `astro` が依存している版（今は 0.5.2）に合わせる。`astro` を上げて compiler-rs の版が変わったら、こちらも合わせる
- 入口は変えない。`make check`（`vp check`）が `.astro` の整形も確かめ、`make fix`（`vp check --fix`）が整形する
- テンプレートの誤りは、これまでどおり `astro check`（型）と `make build` で見つける

## 理由

- 整形の道具を oxfmt 1 つに保てる。選択肢 1 は Prettier を別に入れ、設定（`singleQuote` など）を 2 か所で持つことになる。oxfmt の Astro 対応はもともと `prettier-plugin-astro` なので、整形の結果も大きくは変わらない
- `vp check` の中で完結するので、Makefile にも手順にも新しいコマンドが要らない（ADR-0001・0002 の「fmt・lint・test は Vite+」を崩さない）
- `@astrojs/compiler-rs` は `astro` 7 がすでに依存しているので、新しく入るものは実質無い。直接書くのは、oxfmt が「プロジェクトに入れる」ことを求めており、pnpm のピア解決にたまたま頼る形を避けるため
- テンプレートの lint（選択肢 3）は ESLint をもう 1 つ入れることになり、Vite+ に寄せた方針と合わない。`.astro` のテンプレートは 4 ファイル・100 行余りで、型とビルドで見つからない種類の誤りは今のところ出ていない

## 影響・トレードオフ

- 最初の `make fix` で、既存の `.astro` がまとめて整形し直される。整形だけのコミットに分け、`make build` の出力（`dist/`）が変わらないことを確かめる
- oxfmt の Astro 対応は出たばかり（0.73.0）。整形で HTML の空白が変わり表示が変わることがあれば、`astro.compressHTML` などのオプションで合わせるか、`fmt.overrides` で該当ファイルの `astro` を `false` にし、この ADR を更新する
- `@astrojs/compiler-rs` が入っていない環境（依存を入れる前）では、`vp check` が `.astro` で失敗する。`make install` を先に回す
- エディタの Astro 拡張（`astro-build.astro-vscode`）の整形は Prettier を使うので、結果が `make fix` とずれることがある。正は `make fix` とする
- テンプレートの書き方の規則（アクセシビリティなど）は機械で見ない。oxlint がテンプレートに対応したら、改めて判断する
