# Thai Buddhist Calendar (JA)

## 目的
タイ仏教行事カレンダーの日本語版。Web表示 + ICS配信。

## ドメインルール
- 行事名は「タイ語 / ローマ字 / カタカナ」を併記する
  例: วันพระ / Wan Phra / ワンプラ
- 太陰暦の行事（ワンプラ、マーカ/ウィサーカ/アーサーラハ・ブーチャー、
  カオパンサー、オークパンサー、トートカティン、ロイクラトン）はタイ太陰暦から計算する
- ソンクラーンは太陽暦の 4/13〜15 に固定
- 日付の正解データは tests/fixtures/ に置き、出典URLを必ず付ける

## 作業ルール
- 実装より先にテストを書く
- 大きな変更はプランモード（Shift+Tab）で計画してから実行する
- 改善や指摘への対応は docs/improvement-loop.md と improve スキル（.claude/skills/improve/SKILL.md）に従い、docs/improvement/log.md に記録する

