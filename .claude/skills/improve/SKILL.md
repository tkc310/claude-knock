---
name: improve
description: タイ仏教行事カレンダー自体を改善するときに使う。「バックログから 1 件直して」「この指摘を直して再発しないようにして」と頼まれたとき、または会話で受けた指摘を直したあとに使う。1 件直し、再発防止を足し、改善ログに記録してコミットする。
---

# 改善を 1 件回す

[`docs/improvement-loop.md`](../../../docs/improvement-loop.md) の手順をエージェントが実行するためのスキル。

## 手順

1. **選ぶ**
   - 頼まれたものがあればそれ。無ければ `docs/improvement/backlog.md` から選ぶ
   - 優先度: 日付の誤り > ドメインルールの破れ > 表示と ICS 配信の品質 > 開発体験 > 見た目の好み
   - 1 コミット 1 改善。大きいものは分割し、残りをバックログに戻す
2. **読む**
   - `CLAUDE.md`、`AGENTS.md`、関連する ADR（`docs/decisions/`）
   - `docs/improvement/log.md` で、同じ種類の改善が過去にないか確かめる（あれば仕組みが足りていない）
3. **直す**
   - 実装より先にテストを書く。日付を扱うなら、先に `tests/fixtures/` に公式の日付と出典 URL を置く（形式は `tests/fixtures/README.md`）
   - 大きな変更はプランモードで計画を書き、確認を取ってから実行する
   - 値や方針を変えるなら `docs/decisions/` に ADR を足し、`docs/decisions/README.md` の表にも足す
4. **再発を防ぐ（省略しない）**
   - 日付 → `tests/fixtures/` の正解データと `tests/` のテスト
   - 行事名・表記 → `tests/data.test.ts` の検査か `src/data/events.ts` の `EventDefinition` 型
   - 行事ごとの項目の足し忘れ → 対応表を `Record<EventId, …>` にする
   - 書き方 → `vite.config.ts` の `lint`
   - 8341-ui の使い方・判断基準 → `AGENTS.md` か ADR。`CLAUDE.md` に足すべきなら変更案を利用者に示す
   - 手順 → `Makefile` のコマンドか `.claude/skills/` のスキル
5. **確かめる**
   - `make check`・`make test`・`make build` が通ること
   - 画面を変えたら `make dev` で見る。止めるときは `pnpm exec astro dev stop`
6. **記録する**
   - `docs/improvement/log.md` の表の先頭に 1 行追記（日付・種別・内容・再発防止）。仕組みにできなければ再発防止は「—」とし、理由をバックログに残す
   - バックログの該当行を消す。途中で見つけた別の改善はバックログに足す
   - Conventional Commits（`type(scope): 説明`）でコミットする

## やってはいけないこと

- 検査を通すために規則を緩める・外す。緩めるなら ADR に理由を書き、人の承認を得る
- 公式の出典 URL の無い正解データを `tests/fixtures/` に足す
- 8341-ui から取り込んだ `src/components/ui/`・`src/lib/`・`src/styles/8341-ui.css` を直接編集する（更新は `make ui-add`）
- 複数の改善を 1 つのコミットや PR に混ぜる
- 古い ADR を消す（状態を「廃止（→ NNNN）」にして新しい ADR を足す）
- `CLAUDE.md` を黙って書き換える（利用者の指示書。変更案を示して確認を取る）
