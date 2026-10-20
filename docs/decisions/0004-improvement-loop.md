# 0004 改善ループ（バックログ・ログ・ADR・改善スキル）を置く

- 日付: 2026-10-20
- 状態: 採用

## 背景

開発の多くを AI エージェントと進めます。会話で受けた指摘がその場で直るだけだと、別の会話で同じ失敗を繰り返し、判断の理由も残りません。
このカレンダーでは、日付の誤りが利用者の行動（寺へ行く日）に直結します。

## 決定

[tkc310/yorozuya の ADR 0008](https://github.com/tkc310/yorozuya/blob/main/docs/decisions/0008-improvement-loop.md) に倣い、次を置く。

- `docs/improvement-loop.md`: 使う → 気づく → 記録する → 直す → 再発を防ぐ → 振り返る の手順と、問題の種類ごとに足す再発防止の対応表
- `docs/improvement/backlog.md`: 改善候補。`docs/improvement/log.md`: 直したことを 1 改善 1 行で記録
- `docs/decisions/`: ADR
- `.claude/skills/improve/SKILL.md`: エージェントが 1 件の改善を回す手順
- `AGENTS.md` の「まず読むもの」「守ること」

yorozuya にある Issue テンプレートと PR テンプレートは、remote を作ってから足します（バックログに記載）。

## 理由

- 指摘をテスト・検査・ルールに変えれば、どのエージェント・どの会話でも同じ失敗を防げる
- ADR とログがあれば、後から来た人やエージェントが「なぜこうなっているか」を追える

## 影響・トレードオフ

- 改善ごとに `log.md` を 1 行書く手間が増える
- CI が無いので、検査は手元の `make check`・`make test`・`make build` に頼る
- ログとバックログは手で保守するので、古くなったらまとめて整理する
