# Thai Buddhist Calendar (JA)

## 目的
タイ仏教行事カレンダーの日本語版。Web表示 + ICS配信。

## ドメインルール
- 行事名は「タイ語 / ローマ字 / カタカナ / 日本語訳」を併記する
  例: วันพระ / Wan Phra / ワンプラ / 布薩日
- 太陰暦の行事（ワンプラ、マーカ/ウィサーカ/アーサーラハ・ブーチャー、
  カオパンサー、オークパンサー、トートカティン、ロイクラトン）はタイ太陰暦から計算する
- ソンクラーンは太陽暦の 4/13〜15 に固定
- 対象は原始仏教にとって重要な行事に限る（パーリ三蔵の経・律かブッダの生涯に根拠があるもの）。民間の習俗・地方の祭り・バラモン教に由来する儀礼は扱わない。例外として、タイで仏教と結びついて国民的に行われるロイクラトンとソンクラーンは「民間行事」として扱う（ADR-0007）。判断は docs/events/candidates.md に残す
- 日付の正解データは tests/fixtures/ に置き、出典URLを必ず付ける

## 作業ルール
- 実装より先にテストを書く
- 大きな変更はプランモード（Shift+Tab）で計画してから実行する
- 改善や指摘への対応は docs/improvement-loop.md と improve スキル（.claude/skills/improve/SKILL.md）に従い、docs/improvement/log.md に記録する

## pstack ルーティング（hook の代替）
複数ファイルに触れる / 設計判断を含む / 原因不明のバグ → `pstack:poteto-mode` を起動して従う。
意図が明確なら直接: `pstack:tdd` `pstack:architect` `pstack:arena` `pstack:interrogate`。
単一ファイルの小変更・質問は直接作業する。

## ディレクトリ責務
- src/core/ : 暦計算などのドメインロジック。Astro/React/DOM に依存しない純粋な TS。
  公開 API は src/core/index.ts から export する
- src/lib/  : UI ユーティリティ（tv, tw-merge 等のサードパーティの抽象・設定層）
- src/data/ : 行事定義（core を使って日付を得る）

## 並列作業ルール
- 1 セッション 1 タスク、1 PR。main 向け
- 着手前に docs/improvement/backlog.md と open PR を確認し、同じ課題に手を付けない
- 対象行事の追加・削除は PR を作るがマージ前にユーザーに確認
- 完了したら backlog から消し、docs/improvement/log.md に 1 行記録

