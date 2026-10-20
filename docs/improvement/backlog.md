# 改善バックログ

改善候補の一覧です。優先度の決め方は [`../improvement-loop.md`](../improvement-loop.md) を参照。
着手したら `- [x]` にし、完了したら [`log.md`](./log.md) に 1 行記録してここから消します。

## 暦

- [ ] タイ太陰暦の計算を `src/core/` に実装する（先に `tests/fixtures/` に公式の日付と出典を置く）
- [ ] `tests/fixtures/` がまだ空なので、fixtures テストは 0 件でスキップされている
- [ ] アッタミー・ブーチャー（วันอัฏฐมีบูชา / Atthami Bucha / アッタミー・ブーチャー）を行事に足す。แรม 8 ค่ำ เดือน 6（閏月の年は เดือน 7）。根拠と見送った候補は [`docs/events/candidates.md`](../events/candidates.md)
- [ ] `EventDefinition` に太陰暦の日付規則を持たせる。ワンプラは月 4 回（8 ค่ำ と 15 ค่ำ、小の月は แรม 14 ค่ำ）、トートカティンは แรม 1 ค่ำ เดือน 11 から ขึ้น 15 ค่ำ เดือน 12 までの期間、閏月の年はマーカ 3→4 月・ウィサーカとアッタミー 6→7 月・アーサーラハとカオパンサーは 2 回目の 8 月
- [ ] 2026 年のマーカ（3/3）、ウィサーカ（5/31）、アーサーラハ（7/29）を `tests/fixtures/` に置く。出典はタイ中央銀行告示 31/2568（https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2568/EngPDF/25680162.pdf）
- [ ] `make check` が `tests/fixtures.test.ts` の型エラー 5 件で落ちる（`node:fs`・`node:path`・`import.meta.dirname` の型が無い。`@types/node` が未導入）。9ea7dd9 から
- [ ] タイ中央銀行告示 37/2569（2027 年）も、テキスト抽出で日付と行事名が別の欄に分かれている。PDF を画像にしてウィサーカ（5/20）の行を目視で確かめる（`docs/events/visakha-bucha.md`「未確認・食い違い」）。macOS では PDFKit を使う小さな Swift を `swiftc -framework PDFKit -framework AppKit` でコンパイルすれば全ページを PNG にできた（`swift` の JIT では PDFKit がリンクされない）
- [ ] ロイクラトン 2024・2026 年の公式の出典を探す（2024 年は文化省のラノーン県の行事の掲載だけ、2026 年は報道と観光サイトの 11-24 だけ。`docs/events/loi-krathong.md`）
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
