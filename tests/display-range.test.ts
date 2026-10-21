import { expect, it } from 'vite-plus/test';
import { occurrences } from '../src/core';
import { displayRange } from '../src/data/display-range';
import { events } from '../src/data/events';

it.each([
  [new Date(2026, 0, 1), '2026-01-01', '2027-12-31'],
  [new Date(2026, 11, 31, 23, 59), '2026-01-01', '2027-12-31'],
])('%s にビルドすると、今年と来年（%s〜%s）を出す', (today, from, to) => {
  expect(displayRange(today)).toEqual({ from, to });
});

it('2027 年にビルドしても、来年（2028 年）まで計算できる（ADR-0009）', () => {
  expect(occurrences(events, displayRange(new Date(2027, 5, 1))).length).toBeGreaterThan(0);
});
