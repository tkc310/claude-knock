// fixtures に依存しない不変条件。年表の全年で確かめる
import { describe, expect, it } from 'vite-plus/test';
import { buildCalendar, calendar, formatLunarDate, toLunarIn } from '../../src/core/calendar';
import { fromDayNumber, toDayNumber, type IsoDate } from '../../src/core/day';
import { yearKind } from '../../src/core/suriyayatra';
import { occurrencesIn } from '../../src/core/rules';
import { events, type EventId } from '../../src/data/events';

const whole = {
  from: fromDayNumber(calendar.years[0]!.start),
  to: fromDayNumber(calendar.years.at(-1)!.start + calendar.years.at(-1)!.length - 1),
};
const all = occurrencesIn(calendar, events, whole);
const startsOf = (id: EventId) => all.filter((o) => o.event.id === id).map((o) => o.start);

describe('年表', () => {
  it('年の長さは 354・355・384 日のどれか', () => {
    for (const y of calendar.years) {
      expect({ year: y.year, length: y.length }).toEqual({
        year: y.year,
        length: { common: 354, adhikavara: 355, adhikamasa: 384 }[y.kind],
      });
    }
  });

  it('年と月が隙間なく続く', () => {
    const months = calendar.years.flatMap((y) => y.months);
    for (const [i, m] of months.entries()) {
      const next = months[i + 1];
      if (next) expect(next.start).toBe(m.start + m.length);
    }
    for (const y of calendar.years) expect(y.months[0]!.start).toBe(y.start);
  });
});

describe('ワンプラ', () => {
  const starts = startsOf('wan-phra');

  it('間隔は 6・7・8 日のどれか', () => {
    const gaps = new Set(starts.slice(1).map((d, i) => days(starts[i]!, d)));
    expect([...gaps].sort((a, b) => a - b)).toEqual([6, 7, 8]);
  });

  it('西暦 1 年に 49〜50 日', () => {
    // 年表の最初と最後の西暦年は、途中までしか入っていないので数えない
    const counts = [...Map.groupBy(starts, (d) => d.slice(0, 4))].slice(1, -1);
    for (const [year, list] of counts) expect([49, 50], year).toContain(list.length);
  });
});

// docs/events/README.md の「規則どうしの関係」
describe('行事どうしの関係', () => {
  const pairs = (a: EventId, b: EventId) => {
    const as = startsOf(a);
    const bs = startsOf(b);
    expect(as.length).toBe(bs.length);
    return as.map((d, i) => days(d, bs[i]!));
  };

  it('カオパンサー = アーサーラハ・ブーチャーの翌日', () => {
    expect(new Set(pairs('asarnha-bucha', 'khao-phansa'))).toEqual(new Set([1]));
  });

  it('オークパンサー = カオパンサーの 88 日後', () => {
    expect(new Set(pairs('khao-phansa', 'ok-phansa'))).toEqual(new Set([88]));
  });

  it('トートカティンはオークパンサーの翌日から 1 か月後（ロイクラトン）まで', () => {
    expect(new Set(pairs('ok-phansa', 'thot-kathin'))).toEqual(new Set([1]));
    const kathin = all.filter((o) => o.event.id === 'thot-kathin');
    expect(kathin.map((o) => o.end)).toEqual(startsOf('loi-krathong'));
    expect(new Set(kathin.map((o) => days(o.start, o.end)))).toEqual(new Set([28]));
  });

  it('ウィサーカ = マーカの 88〜89 日後、アーサーラハ = ウィサーカの 59〜60 日後', () => {
    expect(new Set(pairs('makha-bucha', 'visakha-bucha'))).toEqual(new Set([88, 89]));
    expect(new Set(pairs('visakha-bucha', 'asarnha-bucha'))).toEqual(new Set([59, 60]));
  });

  it('満月の行事の日は、どれもワンプラでもある', () => {
    const wanPhra = new Set(startsOf('wan-phra'));
    for (const id of ['makha-bucha', 'visakha-bucha', 'asarnha-bucha', 'ok-phansa'] as const) {
      expect(startsOf(id).filter((d) => !wanPhra.has(d))).toEqual([]);
    }
  });
});

it('Occurrence.lunar は toLunar と一致する', () => {
  for (const o of all) expect(o.lunar).toEqual(toLunarIn(calendar, o.start));
});

it('8 แรก の表記は、その日を出した年表の年型で決まる', () => {
  // 上書きの表を試すテストは、年型を変えた年表を作る（overrides.test.ts）
  const cal = buildCalendar((y) => (y === 2570 ? 'adhikamasa' : yearKind(y)));
  const first8 = cal.years.find((y) => y.year === 2570)!.months.find((m) => m.month.month === 8)!;
  expect(formatLunarDate(toLunarIn(cal, fromDayNumber(first8.start)))).toBe('ขึ้น 1 ค่ำ เดือน 8 แรก');
});

function days(from: IsoDate, to: IsoDate): number {
  return toDayNumber(to) - toDayNumber(from);
}
