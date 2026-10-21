import { describe, expect, it } from 'vite-plus/test';
import { gregorianYear, occurrences, parseIsoDate } from '../../src/core';
import { events, type EventId } from '../../src/data/events';
import { officialDatesInTable } from './fixtures';

function startsIn(eventId: EventId, year: number): string[] {
  const event = events.filter((e) => e.id === eventId);
  return occurrences(event, gregorianYear(year)).map((o) => o.start);
}

describe('公式の日付（tests/fixtures/official-dates.json）', () => {
  it.each(officialDatesInTable)('$eventId $date', ({ eventId, date }) => {
    // その西暦年に、ほかの日には出ていないことまで確かめる
    expect(startsIn(eventId, Number(date.slice(0, 4)))).toEqual([date]);
  });
});

// 報道の日付（docs/events/README.md の △）。公式の出典が無いので fixtures には入れず、ここで照らす
describe('報道の日付', () => {
  it.each([
    ['khao-phansa', '2025-07-11'],
    ['khao-phansa', '2026-07-30'],
    ['ok-phansa', '2024-10-17'],
    ['ok-phansa', '2025-10-07'],
    ['ok-phansa', '2026-10-26'],
    ['thot-kathin', '2024-10-18'],
    ['thot-kathin', '2025-10-08'],
    ['thot-kathin', '2026-10-27'],
    ['loi-krathong', '2026-11-24'],
    // アッタミー・ブーチャー（docs/events/atthami-bucha.md）。2026 年は閏月の年で เดือน 7
    ['atthami-bucha', '2024-05-30'],
    ['atthami-bucha', '2025-05-19'],
    ['atthami-bucha', '2026-06-08'],
  ] as const)('%s %s', (eventId, date) => {
    expect(startsIn(eventId, Number(date.slice(0, 4)))).toEqual([date]);
  });

  it.each([
    ['2024', '11-15'],
    ['2026', '11-24'],
  ])('トートカティン %s 年は %s に終わる', (year, end) => {
    const [kathin] = occurrences(
      events.filter((e) => e.id === 'thot-kathin'),
      gregorianYear(Number(year)),
    );
    expect(kathin?.end).toBe(`${year}-${end}`);
  });

  it('ワンプラ: Thai PBS の表の小の月の月末（2026-02-16 แรม 14 ค่ำ เดือน 3）', () => {
    const date = parseIsoDate('2026-02-16');
    const wanPhra = events.filter((e) => e.id === 'wan-phra');
    const [o] = occurrences(wanPhra, { from: date, to: date });
    expect(o?.lunar).toMatchObject({ month: 3, phase: 'waning', day: 14 });
  });
});
