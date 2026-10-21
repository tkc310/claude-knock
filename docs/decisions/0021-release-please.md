# 0021 バージョンとリリースノートを release-please で自動化する

- 日付: 2026-10-22
- 状態: 採用

## 背景

利用者から、リリースノートとバージョニングを CI で自動化するよう求められた。これまで `package.json` の版は `0.0.1` のままで、タグもリリースも無かった。PR は squash でマージし、タイトルは Conventional Commits（`feat(seo): ...`）で書いている。

## 決定

- [release-please](https://github.com/googleapis/release-please)（`googleapis/release-please-action@v5`）を `.github/workflows/release.yml` で `main` への push のたびに動かす。リリースの PR（`CHANGELOG.md`・`package.json`・`.release-please-manifest.json` の版の更新）を作り直し、マージされたらタグ `vX.Y.Z` と GitHub のリリースを作る
- 版は Semantic Versioning。今の公開版を `1.0.0` とし（`package.json` と `.release-please-manifest.json`）、`bootstrap-sha` を `1.0.0` の時点のコミットにして、それより前のコミットを次のリリースノートに入れない
- リリースノートは日本語の見出しで、`feat`（新機能）・`fix`（不具合の修正）・`perf`（性能の改善）・`docs`（ドキュメント）だけを載せる
- `CHANGELOG.md` は release-please が書くので、整形（`vp fmt`）の対象から外す
- トークンは `secrets.RELEASE_PLEASE_TOKEN` があればそれを、無ければ `GITHUB_TOKEN` を使う
- デプロイはリリースと切り離し、これまでどおり `main` へのマージのたびに行う（ADR-0016）

## 理由

- squash したタイトルがそのままコミットになるので、Conventional Commits から版とリリースノートを機械的に決められる
- リリースの PR をマージするまで版は上がらないので、いつリリースするかは人が決められる
- サイトは公開済みで利用者がいるので、`0.x` ではなく `1.0.0` から始める

## 影響・トレードオフ

- `GITHUB_TOKEN` で作った PR では CI が動かず、必須のチェックが通らない。`RELEASE_PLEASE_TOKEN` を登録するか、管理者としてチェックを飛ばしてマージする
- リポジトリの設定「Allow GitHub Actions to create and approve pull requests」を有効にする必要がある
- PR のタイトルが Conventional Commits でないと、リリースノートに載らない（CONTRIBUTING.md に書いた）
