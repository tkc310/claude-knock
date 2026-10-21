import { describe, expect, it } from 'vite-plus/test';
import {
  addDays,
  formatLunarDate,
  gregorianYear,
  occurrences,
  parseIsoDate,
  supportedRange,
  toLunar,
} from '../../src/core';
import { events } from '../../src/data/events';

describe('parseIsoDate', () => {
  it('実在する YYYY-MM-DD だけを通す', () => {
    expect(parseIsoDate('2024-02-29')).toBe('2024-02-29');
    for (const bad of ['2023-02-29', '2024-13-01', '2024-1-01', '20240101', '']) {
      expect(() => parseIsoDate(bad), bad).toThrow(RangeError);
    }
  });
});

it('addDays は月と年をまたぐ', () => {
  expect(addDays(parseIsoDate('2024-12-31'), 1)).toBe('2025-01-01');
  expect(addDays(parseIsoDate('2024-03-01'), -1)).toBe('2024-02-29');
});

it('gregorianYear は 1/1〜12/31', () => {
  expect(gregorianYear(2026)).toEqual({ from: '2026-01-01', to: '2026-12-31' });
});

describe('toLunar と formatLunarDate', () => {
  it.each([
    // 基準日。12 月の 1 月（เดือนอ้าย）も、仏暦はその日の西暦年 + 543（ADR-0008 の 4）
    ['2023-12-13', 2566, '太陰暦 1 月前半 1 日'],
    ['2024-07-20', 2567, '太陰暦 8 月の満月'],
    ['2025-11-05', 2568, '太陰暦 12 月の満月'],
    // 閏月の年は 8 月が 2 回あり、1 回目・2 回目と書く（タイ語の แรก・หลัง）
    ['2026-07-29', 2569, '太陰暦 8 月（2 回目）の満月'],
    ['2026-07-30', 2569, '太陰暦 8 月（2 回目）後半 1 日'],
    ['2026-06-29', 2569, '太陰暦 8 月（1 回目）の満月'],
    ['2026-02-16', 2569, '太陰暦 3 月後半 14 日'],
    // アッタミー・ブーチャー 2026 年。閏月の年なので 7 月（Thai PBS）
    ['2026-06-08', 2569, '太陰暦 7 月後半 8 日'],
  ])('%s → 仏暦 %i「%s」', (date, buddhistYear, text) => {
    const lunar = toLunar(parseIsoDate(date));
    expect(lunar.buddhistYear).toBe(buddhistYear);
    expect(formatLunarDate(lunar)).toBe(text);
  });

  it('閏 8 月だけが isLeapMonth: true', () => {
    expect(toLunar(parseIsoDate('2026-07-29'))).toMatchObject({ month: 8, isLeapMonth: true });
    expect(toLunar(parseIsoDate('2026-06-29'))).toMatchObject({ month: 8, isLeapMonth: false });
  });
});

describe('occurrences', () => {
  it('開始日の順に並ぶ', () => {
    const starts = occurrences(events, gregorianYear(2026)).map((o) => o.start);
    expect(starts).toEqual([...starts].sort());
  });

  it('範囲を分けて呼んでも、まとめて呼んでも同じ', () => {
    const whole = occurrences(events, {
      from: gregorianYear(2025).from,
      to: gregorianYear(2026).to,
    });
    const split = [
      ...occurrences(events, gregorianYear(2025)),
      ...occurrences(events, gregorianYear(2026)),
    ];
    expect(split).toEqual(whole);
  });

  it('期間の行事は開始日で範囲に入る', () => {
    const kathin = events.filter((e) => e.id === 'thot-kathin');
    const from = parseIsoDate('2026-11-01');
    expect(occurrences(kathin, { from, to: gregorianYear(2026).to })).toEqual([]);
  });

  it('ソンクラーンは 4/13〜15', () => {
    const songkran = events.filter((e) => e.id === 'songkran');
    expect(occurrences(songkran, gregorianYear(2027))).toMatchObject([
      { start: '2027-04-13', end: '2027-04-15' },
    ]);
  });

  it('公式告示より先の年も、年表の範囲なら計算で出す（ADR-0009）', () => {
    const makha = events.filter((e) => e.id === 'makha-bucha');
    expect(occurrences(makha, gregorianYear(2028))).toHaveLength(1);
  });

  it('年表の範囲（supportedRange）の外は RangeError', () => {
    expect(() => occurrences(events, gregorianYear(2023))).toThrow(RangeError);
    expect(() =>
      occurrences(events, { from: supportedRange.to, to: addDays(supportedRange.to, 1) }),
    ).toThrow(RangeError);
    expect(() => toLunar(addDays(supportedRange.from, -1))).toThrow(RangeError);
  });
});
