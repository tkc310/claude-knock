// 年表。年型の並びと基準日 1 つから、すべての太陰日の太陽暦の日付が決まる（ADR-0008）
import { fromDayNumber, parseIsoDate, toDayNumber, type DateRange, type IsoDate } from './day';
import { yearKind, type YearKind } from './suriyayatra';

/** 太陰月。isLeapMonth: true は閏月の年の 2 回目の 8 月（เดือน 8 หลัง）だけ */
export type LunarMonth = { month: number; isLeapMonth: false } | { month: 8; isLeapMonth: true };

/** タイ太陰暦の日付 */
export type ThaiLunarDate = LunarMonth & {
  /** 表示用の仏暦。その日の西暦年 + 543（タイの暦と同じく 1 月 1 日に替わる） */
  buddhistYear: number;
  /** 白分（ข้างขึ้น）か黒分（ข้างแรม） */
  phase: 'waxing' | 'waning';
  /** 白分・黒分の中での日（1〜15） */
  day: number;
};

/** start は 1970-01-01 からの通算日 */
export interface MonthSpan {
  month: LunarMonth;
  start: number;
  length: 29 | 30;
}

export interface LunarYear {
  /** 太陰年の番号。その年の เดือน 8 がある西暦年 + 543 */
  year: number;
  kind: YearKind;
  start: number;
  length: number;
  months: readonly MonthSpan[];
}

export interface Calendar {
  years: readonly LunarYear[];
}

/**
 * 暦法と公式の暦が食い違う年の年型。tests/core/overrides.test.ts が fixtures と両方向で照らす。
 * 足すときは、テストの失敗メッセージに出る年型を、出典を見て確かめてから書く
 */
export const YEAR_KIND_OVERRIDES: ReadonlyMap<number, YearKind> = new Map();

// 仏暦 2567 年の เดือนอ้าย ขึ้น 1 ค่ำ。公式のアーサーラハ・ブーチャー 2024-07-20 の 220 日前
const EPOCH_YEAR = 2567;
const EPOCH = toDayNumber(parseIsoDate('2023-12-13'));
const YEAR_COUNT = 100;

/** 奇数月は 29 日、偶数月は 30 日。閏日年は 7 月が 30 日、閏月年は 8 月の後に 2 回目の 8 月が入る */
function monthsOf(kind: YearKind): [LunarMonth, 29 | 30][] {
  const months: [LunarMonth, 29 | 30][] = [];
  for (let month = 1; month <= 12; month++) {
    const leapDay = month === 7 && kind === 'adhikavara';
    months.push([{ month, isLeapMonth: false }, month % 2 === 1 && !leapDay ? 29 : 30]);
    if (month === 8 && kind === 'adhikamasa') months.push([{ month: 8, isLeapMonth: true }, 30]);
  }
  return months;
}

export function buildCalendar(kindOf: (year: number) => YearKind): Calendar {
  const years: LunarYear[] = [];
  let start = EPOCH;
  for (let year = EPOCH_YEAR; year < EPOCH_YEAR + YEAR_COUNT; year++) {
    const kind = kindOf(year);
    const months: MonthSpan[] = [];
    let day = start;
    for (const [month, length] of monthsOf(kind)) {
      months.push({ month, start: day, length });
      day += length;
    }
    years.push({ year, kind, start, length: day - start, months });
    start = day;
  }
  return { years };
}

export const calendar = buildCalendar((year) => YEAR_KIND_OVERRIDES.get(year) ?? yearKind(year));

const lastYear = calendar.years.at(-1)!;

/**
 * 年表の範囲。公式告示より先の年も暦法で出す（ADR-0009）。
 * 告示が出たら tests/fixtures/ に足し、食い違えば YEAR_KIND_OVERRIDES で年型を直す
 */
export const supportedRange: DateRange = {
  from: fromDayNumber(EPOCH),
  to: fromDayNumber(lastYear.start + lastYear.length - 1),
};

export function assertSupported({ from, to }: DateRange): void {
  if (from < supportedRange.from || to > supportedRange.to) {
    throw new RangeError(
      `${from}〜${to} は年表の範囲（${supportedRange.from}〜${supportedRange.to}）の外です`,
    );
  }
}

/** 年表の中で day を含む年と月。年表の外は RangeError */
export function locate(cal: Calendar, day: number): { year: LunarYear; span: MonthSpan } {
  const last = cal.years.at(-1);
  const index = cal.years.findLastIndex((y) => y.start <= day);
  const year = cal.years[index];
  if (!year || !last || day >= last.start + last.length) {
    throw new RangeError(`${fromDayNumber(day)} は年表の外です`);
  }
  const span = year.months.findLast((m) => m.start <= day)!;
  return { year, span };
}

export function lunarYearOf(cal: Calendar, date: IsoDate): number {
  return locate(cal, toDayNumber(date)).year.year;
}

export function toLunarIn(cal: Calendar, date: IsoDate): ThaiLunarDate {
  const { span } = locate(cal, toDayNumber(date));
  const offset = toDayNumber(date) - span.start;
  return {
    ...span.month,
    buddhistYear: Number(date.slice(0, 4)) + 543,
    phase: offset < 15 ? 'waxing' : 'waning',
    day: offset < 15 ? offset + 1 : offset - 14,
  };
}

export function toLunar(date: IsoDate): ThaiLunarDate {
  assertSupported({ from: date, to: date });
  return toLunarIn(calendar, date);
}

/** "ขึ้น 8 ค่ำ เดือนอ้าย"、"แรม 1 ค่ำ เดือน 8 หลัง" のようにタイの暦の言い方で書く */
export function formatLunarDate(date: ThaiLunarDate): string {
  return `${date.phase === 'waxing' ? 'ขึ้น' : 'แรม'} ${date.day} ค่ำ ${monthName(date)}`;
}

function monthName({ month, isLeapMonth, buddhistYear }: ThaiLunarDate): string {
  if (month === 1) return 'เดือนอ้าย';
  if (month === 2) return 'เดือนยี่';
  if (month !== 8) return `เดือน ${month}`;
  if (isLeapMonth) return 'เดือน 8 หลัง';
  // 8 月は西暦の 6〜8 月にあるので、表示用の仏暦がそのまま太陰年の番号になる
  const year = calendar.years.find((y) => y.year === buddhistYear);
  if (!year) throw new RangeError(`仏暦 ${buddhistYear} 年は年表の外です`);
  return year.kind === 'adhikamasa' ? 'เดือน 8 แรก' : 'เดือน 8';
}
