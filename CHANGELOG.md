# Changelog

このファイルは [release-please](https://github.com/googleapis/release-please) が更新します（ADR-0021）。

## 1.0.0 (2026-10-22)

最初の公開版です（https://koyomi.tkc310.com）。

### 新機能

* タイ太陰暦の計算エンジン（閏月・閏日、公式告示による年型の上書き）と、公式の日付での検証（ADR-0008・0009）
* 行事の一覧・月ごとのカレンダー・行事の詳細ページ（ワンプラ、マーカ・ウィサーカ・アッタミー・アーサーラハ・ブーチャー、カオパンサー、オークパンサー、トートカティン、ロイクラトン、ソンクラーン）
* タンブン（功徳を積む行い）の説明ページとイラスト
* カレンダーアプリに取り込める ICS（calendar.ics）
* ホーム画面への追加とオフライン表示（PWA、ADR-0013）
* SEO（canonical・OGP・JSON-LD・sitemap.xml・robots.txt）と llms.txt（ADR-0017・0019・0020）
* Cloudflare Workers への自動デプロイ（ADR-0016）
