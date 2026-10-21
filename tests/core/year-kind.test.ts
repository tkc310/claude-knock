// 年型を、年表を使わずに公式の日付だけで確かめる（年表より前の年の分岐も確かめられる）
import { expect, it } from 'vite-plus/test';
import { YEAR_KIND_OVERRIDES } from '../../src/core/calendar';
import { toDayNumber } from '../../src/core/day';
import { yearKind, type YearKind } from '../../src/core/suriyayatra';
import { officialDates } from './fixtures';

// 8 月の満月から翌年の 8 月の満月までの日数で、翌年の年型が決まる。
// 閏日年は 7 月が 1 日長く、閏月年はアーサーラハ・ブーチャーが 2 回目の 8 月に来る
const kindByGap = new Map<number, YearKind>([
  [354, 'common'],
  [355, 'adhikavara'],
  [384, 'adhikamasa'],
]);

const asarnha = officialDates
  .filter((d) => d.eventId === 'asarnha-bucha')
  .map((d) => d.date)
  .sort();
const consecutive = asarnha
  .slice(1)
  .map((date, i) => [asarnha[i]!, date] as const)
  .filter(([prev, date]) => Number(date.slice(0, 4)) - Number(prev.slice(0, 4)) === 1);

it('連続する 2 年の公式のアーサーラハ・ブーチャーがある', () => {
  expect(consecutive.length).toBeGreaterThan(0);
});

it.each(consecutive)(
  'アーサーラハ・ブーチャー %s → %s の間隔が、後の年の年型と合う',
  (prev, date) => {
    // アーサーラハ・ブーチャーは西暦 6〜8 月なので、太陰年の番号は西暦年 + 543
    const year = Number(date.slice(0, 4)) + 543;
    const gap = toDayNumber(date) - toDayNumber(prev);
    expect(YEAR_KIND_OVERRIDES.get(year) ?? yearKind(year), `仏暦 ${year} 年、間隔 ${gap} 日`).toBe(
      kindByGap.get(gap),
    );
  },
);
