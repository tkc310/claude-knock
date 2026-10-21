// 行事の日付の規則と、その解釈。規則の値は src/data/events.ts が持つ
import {
  assertSupported,
  calendar,
  locate,
  toLunarIn,
  type Calendar,
  type LunarYear,
  type ThaiLunarDate,
} from './calendar';
import {
  fromDayNumber,
  onMonthDay,
  toDayNumber,
  type DateRange,
  type IsoDate,
  type MonthDay,
} from './day';

/** 月の番号。'second-8' は閏月の年の 2 回目の 8 月（เดือน 8 หลัง）。閏月の年の 8 は 1 回目の 8 月 */
export type MonthRef = number | 'second-8';

export interface LunarDayRule {
  /** 閏月の年にずれる行事は { common, adhikamas } で書く */
  month: MonthRef | { common: MonthRef; adhikamas: MonthRef };
  phase: 'waxing' | 'waning';
  day: number;
}

export type DateRule =
  | { kind: 'lunar-day'; at: LunarDayRule }
  | { kind: 'lunar-span'; start: LunarDayRule; end: LunarDayRule }
  /** ワンプラ。各月の白分 8 日・白分 15 日・黒分 8 日・月末 */
  | { kind: 'uposatha' }
  | { kind: 'solar-span'; start: MonthDay; end: MonthDay };

export interface Occurrence<E> {
  event: E;
  start: IsoDate;
  /** 両端を含む */
  end: IsoDate;
  lunar: ThaiLunarDate;
}

function resolve(year: LunarYear, rule: LunarDayRule): number {
  const { month, phase, day } = rule;
  const ref =
    typeof month === 'object'
      ? year.kind === 'adhikamasa'
        ? month.adhikamas
        : month.common
      : month;
  const span = year.months.find((m) =>
    ref === 'second-8' ? m.month.isLeapMonth : m.month.month === ref && !m.month.isLeapMonth,
  );
  const offset = phase === 'waxing' ? day - 1 : day + 14;
  if (!span || day < 1 || day > 15 || offset >= span.length) {
    throw new RangeError(`仏暦 ${year.year} 年に ${JSON.stringify(rule)} の日はありません`);
  }
  return span.start + offset;
}

/** 範囲の中に開始日がある行事を、開始日の順に返す。範囲は年表の中に限る */
export function occurrencesIn<E extends { date: DateRule }>(
  cal: Calendar,
  events: readonly E[],
  range: DateRange,
): Occurrence<E>[] {
  const from = toDayNumber(range.from);
  const to = toDayNumber(range.to);
  if (from > to) throw new RangeError(`${range.from} が ${range.to} より後です`);
  locate(cal, from);
  locate(cal, to);
  const years = cal.years.filter((y) => y.start <= to && y.start + y.length > from);
  const firstYear = Number(range.from.slice(0, 4));
  const lastYear = Number(range.to.slice(0, 4));

  const found: { event: E; start: number; end: number }[] = [];
  for (const event of events) {
    const { date } = event;
    switch (date.kind) {
      case 'lunar-day':
        for (const y of years) {
          const day = resolve(y, date.at);
          found.push({ event, start: day, end: day });
        }
        break;
      case 'lunar-span':
        for (const y of years)
          found.push({ event, start: resolve(y, date.start), end: resolve(y, date.end) });
        break;
      case 'uposatha':
        for (const { start, length } of years.flatMap((y) => y.months)) {
          // 小の月（29 日）は แรม 14 ค่ำ、大の月（30 日）は แรม 15 ค่ำ が月末
          for (const offset of [7, 14, 22, length - 1]) {
            found.push({ event, start: start + offset, end: start + offset });
          }
        }
        break;
      case 'solar-span':
        for (let year = firstYear; year <= lastYear; year++) {
          found.push({
            event,
            start: toDayNumber(onMonthDay(year, date.start)),
            end: toDayNumber(onMonthDay(year, date.end)),
          });
        }
        break;
    }
  }

  return found
    .filter((o) => from <= o.start && o.start <= to)
    .sort((a, b) => a.start - b.start)
    .map(({ event, start, end }) => ({
      event,
      start: fromDayNumber(start),
      end: fromDayNumber(end),
      lunar: toLunarIn(cal, fromDayNumber(start)),
    }));
}

/** 範囲の中に開始日がある行事を、開始日の順に返す。年表の範囲（supportedRange）の外は RangeError */
export function occurrences<E extends { date: DateRule }>(
  events: readonly E[],
  range: DateRange,
): Occurrence<E>[] {
  assertSupported(range);
  return occurrencesIn(calendar, events, range);
}
