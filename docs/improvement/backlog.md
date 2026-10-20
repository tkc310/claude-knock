# 改善バックログ

改善候補の一覧です。優先度の決め方は [`../improvement-loop.md`](../improvement-loop.md) を参照。
着手したら `- [x]` にし、完了したら [`log.md`](./log.md) に 1 行記録してここから消します。

## 暦

- [ ] タイ太陰暦の計算を `src/core/` に実装する（先に `tests/fixtures/` に公式の日付と出典を置く）
- [ ] `tests/fixtures/` がまだ空なので、fixtures テストは 0 件でスキップされている
- [ ] アッタミー・ブーチャー（วันอัฏฐมีบูชา / Atthami Bucha / アッタミー・ブーチャー）を行事に足す。แรม 8 ค่ำ เดือน 6（閏月の年は เดือน 7）。根拠と見送った候補は [`docs/events/candidates.md`](../events/candidates.md)
- [ ] `EventDefinition` に太陰暦の日付規則を持たせる。ワンプラは月 4 回（8 ค่ำ と 15 ค่ำ、小の月は แรม 14 ค่ำ）、トートカティンは แรม 1 ค่ำ เดือน 11 から ขึ้น 15 ค่ำ เดือน 12 までの期間、閏月の年はマーカ 3→4 月・ウィサーカとアッタミー 6→7 月・アーサーラハとカオパンサーは 2 回目の 8 月
- [ ] 2026 年のマーカ（3/3）、ウィサーカ（5/31）、アーサーラハ（7/29）を `tests/fixtures/` に置く。出典はタイ中央銀行告示 31/2568（https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2568/EngPDF/25680162.pdf）
- [ ] 2026 年のカオパンサーとオークパンサーの公式の出典を探す（中央銀行の告示には載っていない。仏教庁と宗教局のサイトは自動取得できなかった）

## 配信

- [ ] ICS を `src/pages/calendar.ics.ts`（ビルド時に生成する静的エンドポイント）で配信する

## 検査

- [ ] `.astro` のテンプレート部分は `vp fmt` も `vp lint` も見ない（`astro check` だけ）。`prettier-plugin-astro` を入れるか判断する
- [ ] 型検査が `vp check`（tsgolint、TypeScript 7 系）と `astro check`（TypeScript 6）で二重に走っている。どちらかに寄せるか判断する

## 仕組み

- [ ] CI が無い（remote 未設定）。remote を作ったら `make check`・`make test`・`make build` を CI で回す
- [ ] remote を作ったら、Issue テンプレート「改善提案」と PR テンプレート（`log.md` への記録のチェック）を足す
- [ ] Cloudflare（Void）へのデプロイ手順を用意する（必要になったら `@astrojs/cloudflare`）
