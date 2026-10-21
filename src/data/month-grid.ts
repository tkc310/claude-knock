// トップページのカレンダー（月表）。日曜始まりの週に、行事をその日へ並べる
import { addDays, type DateRange, type IsoDate, type Occurrence } from '../core';
import type { EventDefinition } from './events';

/** day: その日の行事 / start・end: 長い期間の行事（トートカティン）の始まりと終わり */
export type CalendarMark = 'day' | 'start' | 'end';

export interface CalendarItem {
  event: EventDefinition;
  mark: CalendarMark;
}

export interface CalendarDay {
  date: IsoDate;
  /** その月の日か。前後の月の日は枠を埋めるためだけに置き、行事は載せない */
  inMonth: boolean;
  items: CalendarItem[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  weeks: CalendarDay[][];
}

/** これより長い期間の行事は、毎日ではなく始まりと終わりの日にだけ出す */
const LONG_SPAN_DAYS = 7;

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` as IsoDate;
const weekday = (date: IsoDate) => new Date(`${date}T00:00:00Z`).getUTCDay();
const spanDays = (start: IsoDate, end: IsoDate) =>
  (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000 + 1;

export function calendarMonths(
  range: DateRange,
  list: readonly Occurrence<EventDefinition>[],
): CalendarMonth[] {
  const byDate = new Map<string, CalendarItem[]>();
  const put = (date: IsoDate, item: CalendarItem) =>
    byDate.set(date, [...(byDate.get(date) ?? []), item]);
  for (const o of list) {
    if (spanDays(o.start, o.end) > LONG_SPAN_DAYS) {
      put(o.start, { event: o.event, mark: 'start' });
      put(o.end, { event: o.event, mark: 'end' });
      continue;
    }
    for (let d = o.start; d <= o.end; d = addDays(d, 1)) put(d, { event: o.event, mark: 'day' });
  }

  const months: CalendarMonth[] = [];
  let [y, m] = range.from.split('-').map(Number) as [number, number];
  const last = range.to.slice(0, 7);
  while (iso(y, m, 1).slice(0, 7) <= last) {
    const first = iso(y, m, 1);
    const days: CalendarDay[] = [];
    for (let d = addDays(first, -weekday(first)); ; d = addDays(d, 1)) {
      const inMonth = d.slice(0, 7) === first.slice(0, 7);
      if (!inMonth && d > first && weekday(d) === 0) break;
      days.push({ date: d, inMonth, items: inMonth ? (byDate.get(d) ?? []) : [] });
    }
    const weeks = Array.from({ length: days.length / 7 }, (_, i) => days.slice(i * 7, i * 7 + 7));
    months.push({ year: y, month: m, weeks });
    [y, m] = m === 12 ? [y + 1, 1] : [y, m + 1];
  }
  return months;
}
