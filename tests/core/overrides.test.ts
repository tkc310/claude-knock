// 上書きの表 YEAR_KIND_OVERRIDES を fixtures と両方向で照らす（ADR-0008）
import { describe, expect, it } from 'vite-plus/test';
import {
  YEAR_KIND_OVERRIDES,
  buildCalendar,
  calendar,
  lunarYearOf,
  type Calendar,
} from '../../src/core/calendar';
import { gregorianYear } from '../../src/core/day';
import { occurrencesIn } from '../../src/core/rules';
import { yearKind, type YearKind } from '../../src/core/suriyayatra';
import { events } from '../../src/data/events';
import { officialDatesInTable, type OfficialDate } from './fixtures';

const yearKinds: readonly YearKind[] = ['common', 'adhikavara', 'adhikamasa'];

function matches(cal: Calendar, fixtures: readonly OfficialDate[]): boolean {
  return fixtures.every(({ eventId, date }) => {
    const event = events.filter((e) => e.id === eventId);
    const starts = occurrencesIn(cal, event, gregorianYear(Number(date.slice(0, 4))));
    return starts.length === 1 && starts[0]?.start === date;
  });
}

// 西暦年 + 543 ではなく、日付が当たる太陰年でまとめる（12〜1 月の日付が別の年にならないように）
const byLunarYear = Map.groupBy(officialDatesInTable, ({ date }) => lunarYearOf(calendar, date));
const pure = buildCalendar(yearKind);

/** その年だけ年型を替えて、その年の fixtures をすべて満たす年型 */
function kindsThatMatch(year: number): YearKind[] {
  const fixtures = byLunarYear.get(year) ?? [];
  return yearKinds.filter((kind) =>
    matches(
      buildCalendar((y) => (y === year ? kind : (YEAR_KIND_OVERRIDES.get(y) ?? yearKind(y)))),
      fixtures,
    ),
  );
}

describe('YEAR_KIND_OVERRIDES', () => {
  it.each([...byLunarYear.keys()])('仏暦 %i 年: 暦法と合わないときだけ上書きがある', (year) => {
    const fixtures = byLunarYear.get(year) ?? [];
    const needsOverride = !matches(pure, fixtures);
    expect(
      YEAR_KIND_OVERRIDES.has(year),
      `暦法の年型は ${yearKind(year)}。fixtures をすべて満たす年型: ${kindsThatMatch(year).join(', ') || 'なし'}`,
    ).toBe(needsOverride);
  });

  it('上書きした年には、すべて根拠の fixtures がある', () => {
    expect([...YEAR_KIND_OVERRIDES.keys()].filter((y) => !byLunarYear.has(y))).toEqual([]);
  });

  it('上書きを入れた暦が fixtures をすべて満たす', () => {
    expect(matches(calendar, officialDatesInTable)).toBe(true);
  });
});
