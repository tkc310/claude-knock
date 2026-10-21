# 改善バックログ

改善候補の一覧です。優先度の決め方は [`../improvement-loop.md`](../improvement-loop.md) を参照。
着手したら `- [x]` にし、完了したら [`log.md`](./log.md) に 1 行記録してここから消します。

## 暦

- [ ] 閏月と閏日が同じ年に重なったとき、`src/core/suriyayatra.ts` は閏日を翌年に送る。pythaidate は前後の年の曜日の並びで送る向きを決めている。重なる年（暦法では仏暦 2547 年）の公式の日付で確かめる
- [ ] 仏暦 2567〜2666 年で、`src/core` と pythaidate 0.2.0 の年型とワンプラが 5 か所（15 年）で食い違う。どれも閏月と閏日が重なる年（pythaidate の `c` 型）Y で、`src/core` は閏日を翌年 Y+1 に送り、pythaidate は前年 Y-1 に送っている。その結果、Y-1 年の 7 月末から Y+1 年の 7 月末まで、すべての太陰日が `src/core` のほうが 1 日早い（ワンプラだけでなく、その間のアーサーラハ・ブーチャー、カオパンサー、オークパンサー、ロイクラトン、マーカ・ブーチャー、ウィサーカ・ブーチャーも 1 日ずれる）。どちらが正しいかは公式の暦で確かめるまで決めない。正しいのが pythaidate なら、`YEAR_KIND_OVERRIDES` で直すか、送る向きの規則を `src/core/suriyayatra.ts` に入れる（上の項目と同じ問題。仏暦 2547 年は pythaidate も翌年に送るので一致する）
  - 食い違う年（Y-1 / Y / Y+1。年型は `src/core` → pythaidate）: 2582 common→adhikavara / 2583 adhikamasa（一致、日付は全部 1 日ずれ）/ 2584 adhikavara→common。同じ形で 2598〜2600、2639〜2641、2644〜2646、2655〜2657
  - 最初にずれるワンプラ: `src/core` 2039-06-20（แรม 14 ค่ำ เดือน 7）、pythaidate 2039-06-21（7 月の 30 日目）
  - 再現: `scripts/diff-pythaidate/run.sh`（初回は `scripts/diff-pythaidate/.venv` に pythaidate を入れる。Node 24 と python3 が要る）。食い違った年を表で出し、終了コード 1 で終わる。pythaidate 側の年型は `scripts/diff-pythaidate/.venv/bin/python -c "from pythaidate.lsyear import LSYear; from pythaidate import CsDate; print([(be, LSYear(be-1181).cal_type, CsDate.calculate_year0(be-1181).cal_type) for be in range(2582, 2585)])"` で、`c`（重なり）が `C` になり、前年が `B` になるのが見える
  - 確かめ方: 2039 年（仏暦 2582）のアーサーラハ・ブーチャーは `src/core` では 2039-07-05、pythaidate では 2039-07-06。公式の告示が出るのはだいぶ先なので、先に過去の重なり年（2547 年以外にもあれば）の公式の日付で送る向きを確かめる
- [ ] アッタミー・ブーチャー（วันอัฏฐมีบูชา / Atthami Bucha / アッタミー・ブーチャー）を行事に足す。แรม 8 ค่ำ เดือน 6（閏月の年は เดือน 7）。根拠と見送った候補は [`docs/events/candidates.md`](../events/candidates.md)
- [ ] タイ中央銀行告示 37/2569（2027 年）も、テキスト抽出で日付と行事名が別の欄に分かれている。PDF を画像にしてウィサーカ（5/20）の行を目視で確かめる（`docs/events/visakha-bucha.md`「未確認・食い違い」）。macOS では PDFKit を使う小さな Swift を `swiftc -framework PDFKit -framework AppKit` でコンパイルすれば全ページを PNG にできた（`swift` の JIT では PDFKit がリンクされない）
- [ ] ロイクラトン 2024・2026 年の公式の出典を探す（2024 年は文化省のラノーン県の行事の掲載だけ、2026 年は報道と観光サイトの 11-24 だけ。`docs/events/loi-krathong.md`）
- [ ] 過去の公式告示（タイ中央銀行の 2007〜2023 年分）を `tests/fixtures/official-dates.json` に足し、暦法の閾値（avoman・kammacapon）と、閏月の候補が 2 年続く年の分岐を確かめる（ADR-0008「決めたこと」3）
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
