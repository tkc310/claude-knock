// 太陽暦の日付。Date を使わず、1970-01-01 からの通算日の整数で計算する

declare const isoDate: unique symbol;

/** 実在する YYYY-MM-DD。parseIsoDate か core の戻り値でしか作れない */
export type IsoDate = string & { readonly [isoDate]: true };

/** 両端を含む期間 */
export interface DateRange {
  from: IsoDate;
  to: IsoDate;
}

/** 月日（太陽暦）。month は 1 始まり */
export interface MonthDay {
  month: number;
  day: number;
}

// 通算日と年月日の変換は Howard Hinnant の days_from_civil / civil_from_days
// https://howardhinnant.github.io/date_algorithms.html

function daysFromCivil(year: number, month: number, day: number): number {
  const y = month <= 2 ? year - 1 : year;
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (month + (month > 2 ? -3 : 9)) + 2) / 5) + day - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

function civilFromDays(days: number): [year: number, month: number, day: number] {
  const z = days + 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor(
    (doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365,
  );
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const day = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const month = mp < 10 ? mp + 3 : mp - 9;
  return [yoe + era * 400 + (month <= 2 ? 1 : 0), month, day];
}

const pad = (n: number, width: number) => String(n).padStart(width, '0');

export function toDayNumber(date: IsoDate): number {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return daysFromCivil(y, m, d);
}

export function fromDayNumber(days: number): IsoDate {
  const [y, m, d] = civilFromDays(days);
  return `${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}` as IsoDate;
}

/** 境界での検証。実在しない日付は RangeError */
export function parseIsoDate(value: string): IsoDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) {
    const date = fromDayNumber(daysFromCivil(Number(match[1]), Number(match[2]), Number(match[3])));
    if (date === value) return date;
  }
  throw new RangeError(`実在する YYYY-MM-DD ではありません: ${value}`);
}

export function addDays(date: IsoDate, days: number): IsoDate {
  return fromDayNumber(toDayNumber(date) + days);
}

export function gregorianYear(year: number): DateRange {
  return { from: parseIsoDate(`${pad(year, 4)}-01-01`), to: parseIsoDate(`${pad(year, 4)}-12-31`) };
}

/** その年の月日。2/29 のように実在しなければ RangeError */
export function onMonthDay(year: number, { month, day }: MonthDay): IsoDate {
  return parseIsoDate(`${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`);
}
