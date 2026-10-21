// トップページのカレンダー（月表）の組み立て
import { describe, expect, it } from 'vite-plus/test';
import { gregorianYear, occurrences, type DateRange } from '../src/core';
import { events } from '../src/data/events';
import { calendarMonths } from '../src/data/month-grid';

const range: DateRange = { from: gregorianYear(2026).from, to: gregorianYear(2027).to };
const months = calendarMonths(range, occurrences(events, range));
const month = (y: number, m: number) => months.find((x) => x.year === y && x.month === m)!;
const day = (iso: string) => {
  const [y, m] = iso.split('-').map(Number);
  return month(y!, m!)
    .weeks.flat()
    .find((d) => d.date === iso && d.inMonth)!;
};
const ids = (iso: string) => day(iso).items.map((i) => `${i.event.id}:${i.mark}`);

describe('calendarMonths', () => {
  it('範囲の月を順に 1 つずつ出す', () => {
    expect(months).toHaveLength(24);
    expect([months[0]!.year, months[0]!.month]).toEqual([2026, 1]);
    expect([months.at(-1)!.year, months.at(-1)!.month]).toEqual([2027, 12]);
  });

  it('週は日曜始まりの 7 日で、前後の月の日は inMonth: false', () => {
    const oct = month(2026, 10);
    expect(oct.weeks).toHaveLength(5);
    for (const week of oct.weeks) expect(week).toHaveLength(7);
    expect(oct.weeks[0]![0]).toMatchObject({ date: '2026-09-27', inMonth: false, items: [] });
    expect(oct.weeks.at(-1)!.at(-1)).toMatchObject({ date: '2026-10-31', inMonth: true });
  });

  it('1 日の行事はその日に出す。満月の行事とワンプラは同じ日に並ぶ', () => {
    expect(ids('2026-10-26')).toEqual(expect.arrayContaining(['ok-phansa:day', 'wan-phra:day']));
  });

  it('1 週間を超える期間の行事は始まりと終わりの日にだけ出す', () => {
    expect(ids('2026-10-27')).toContain('thot-kathin:start');
    expect(ids('2026-11-24')).toContain('thot-kathin:end');
    expect(ids('2026-11-10').some((x) => x.startsWith('thot-kathin'))).toBe(false);
  });

  it('1 週間以内の期間の行事（ソンクラーン）は毎日出す', () => {
    for (const d of ['2027-04-13', '2027-04-14', '2027-04-15']) {
      expect(ids(d)).toContain('songkran:day');
    }
  });
});
