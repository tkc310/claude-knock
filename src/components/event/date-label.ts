// 画面に出す日付の書き方（例: 2026 年 11 月 24 日（火））。暦の計算はしない（src/core の結果を書くだけ）

const weekday = (iso: string) => '日月火水木金土'[new Date(`${iso}T00:00:00Z`).getUTCDay()];

export function dateLabel(iso: string, { year = true }: { year?: boolean } = {}): string {
  const md = `${Number(iso.slice(5, 7))} 月 ${Number(iso.slice(8, 10))} 日（${weekday(iso)}）`;
  return year ? `${iso.slice(0, 4)} 年 ${md}` : md;
}

export function spanLabel(start: string, end: string): string {
  if (start === end) return dateLabel(start);
  return `${dateLabel(start)}〜${dateLabel(end, { year: start.slice(0, 4) !== end.slice(0, 4) })}`;
}
