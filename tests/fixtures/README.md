# tests/fixtures

行事日付の正解データ。暦計算（`src/core/`）のテストはここを正とする。

## ファイル

- `official-dates.json`: `docs/events/README.md` の日付表で ◎（公式機関の出典を開いて確かめた）の日付だけ。△（報道のみ）は入れない

## 形式

1 ファイル 1 年・1 行事でも、複数をまとめてもよい。拡張子は `.json`。

```json
[
  {
    "eventId": "makha-bucha",
    "date": "2026-03-03",
    "sourceUrl": "https://example.go.th/..."
  }
]
```

- `eventId`: `src/data/events.ts` の `EventId`
- `date`: タイ時間での日付（`YYYY-MM-DD`）。期間の行事は開始日
- 項目はこの 3 つだけ（余分な項目は検査で落ちる）
- `sourceUrl`: **必須**。公式機関（タイ政府・内閣官房・宗教局など）の出典 URL（https）

出典の無いデータは追加しない。`tests/fixtures.test.ts` が全件を検査する。
