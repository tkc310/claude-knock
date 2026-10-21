# 0018 www.koyomi.tkc310.com を独自ドメインにして証明書を作り、Redirect Rule で転送する

- 日付: 2026-10-22
- 状態: 採用

## 背景

利用者から、`www.koyomi.tkc310.com` へのアクセスを `koyomi.tkc310.com` へリダイレクトしたいと求められた。`www.koyomi.tkc310.com` は `tkc310.com` から見て 2 階層目のサブドメインで、Cloudflare の Universal SSL の証明書は効かない（1 階層目まで）。DNS のレコードを足すだけでは HTTPS が証明書のエラーになる。

## 決定

- `wrangler.json` の `routes` に `www.koyomi.tkc310.com` を独自ドメイン（`custom_domain: true`）として足す。独自ドメインにすると、DNS のレコードとそのホスト名の証明書を Cloudflare が作る
- 転送は Cloudflare のダッシュボードの Redirect Rule（Single Redirects）で行う。ホスト名が `www.koyomi.tkc310.com` のとき、`concat("https://koyomi.tkc310.com", http.request.uri.path)` へ 301、クエリ文字列を保つ。Redirect Rule は Worker より前に評価される

## 理由

- Advanced Certificate Manager（有料）を使わずに、2 階層目のサブドメインの証明書を用意できる
- Worker は静的アセットだけでスクリプトを持たない（ADR-0016）。ホスト名での転送は `_redirects` ではできないので、ゾーンの Redirect Rule に任せる

## 影響・トレードオフ

- Redirect Rule はリポジトリの外（ダッシュボード）の設定になる。作るまでは、www でも同じサイトがそのまま表示される（canonical は `koyomi.tkc310.com` を指すので、検索エンジンの評価は分かれない）
- `www.koyomi.tkc310.com` に既存の DNS レコード（CNAME など）があると、デプロイが失敗する
