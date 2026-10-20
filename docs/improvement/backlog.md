# 改善バックログ

改善候補の一覧です。優先度の決め方は [`../improvement-loop.md`](../improvement-loop.md) を参照。
着手したら `- [x]` にし、完了したら [`log.md`](./log.md) に 1 行記録してここから消します。

## 暦

- [ ] タイ太陰暦の計算を `src/core/` に実装する（先に `tests/fixtures/` に公式の日付と出典を置く）
- [ ] `tests/fixtures/` がまだ空なので、fixtures テストは 0 件でスキップされている
- [ ] 行事の追加候補を調査中（アッタミーブーチャー、タックバート・テーウォー、トートパーパー、サートタイなど）。結果を見て `src/data/events.ts` と `CLAUDE.md` の対象行事に反映する
- [ ] トートカティン（オークパンサー後の 1 か月）のような期間、ワンプラのような毎月の繰り返し、閏 8 月の扱いを `EventDefinition` で表せない

## 配信

- [ ] ICS を `src/pages/calendar.ics.ts`（ビルド時に生成する静的エンドポイント）で配信する

## 検査

- [ ] `.astro` のテンプレート部分は `vp fmt` も `vp lint` も見ない（`astro check` だけ）。`prettier-plugin-astro` を入れるか判断する
- [ ] 型検査が `vp check`（tsgolint、TypeScript 7 系）と `astro check`（TypeScript 6）で二重に走っている。どちらかに寄せるか判断する

## 仕組み

- [ ] CI が無い（remote 未設定）。remote を作ったら `make check`・`make test`・`make build` を CI で回す
- [ ] remote を作ったら、Issue テンプレート「改善提案」と PR テンプレート（`log.md` への記録のチェック）を足す
- [ ] Cloudflare（Void）へのデプロイ手順を用意する（必要になったら `@astrojs/cloudflare`）
