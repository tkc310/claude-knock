---
name: check-announcements
description: タイの公式告示（祝日・仏教行事日）で、tests/fixtures にまだ無い日付が出ていないか確かめ、あれば fixtures を足す PR を作る。「告示を確認して」「公式の日付が出たか見て」と頼まれたとき、または年末に翌年分を確かめるときに使う。
---

# 公式告示の確認

ADR-0009 の「告示が出て fixtures に足すまで食い違いに気づけない」を埋める手順。

## 手順

1. `tests/fixtures/official-dates.json` と `docs/events/README.md` を読み、
   公式出典（◎）が無い「年 × 行事」を一覧にする
2. 一次情報だけを調べる（報道・観光サイトは補助にとどめる）
   - タイ中央銀行の金融機関休日告示（bot.or.th の FPG 文書）
   - 内閣の祝日決定、仏教庁・宗教局の発表
3. 見つからなければ「新しい告示なし」と、確認した URL を報告して終わる。ファイルは変えない
4. 見つかったら
   - CLAUDE.md の並列作業ルールどおり、まず draft PR を作る
   - fixtures に日付と出典 URL を足し、`make test` を実行
   - `tests/core/overrides.test.ts` が落ちたら、それは暦法と公式の食い違い。
     PR 本文に年と行事を書き、`YEAR_KIND_OVERRIDES` の修正案を添える
   - docs/events/README.md の記号（△→◎）を更新し、docs/improvement/log.md に 1 行記録
5. マージはしない。ユーザーに PR の URL を伝えて終わる
