import { expect, it } from 'vite-plus/test';
import { upcoming } from '../.claude/skills/event-notice/upcoming';
import { parseIsoDate } from '../src/core';

const ids = (today: string, days: number) =>
  upcoming(parseIsoDate(today), days).map((o) => `${o.event.id} ${o.start}`);

it('今日から 14 日以内の行事を、開始日の順に返す（今日と 14 日後を含む）', () => {
  expect(ids('2026-10-21', 14)).toEqual([
    'wan-phra 2026-10-26',
    'ok-phansa 2026-10-26',
    'thot-kathin 2026-10-27',
    'wan-phra 2026-11-03',
  ]);
  expect(ids('2026-10-26', 0)).toEqual(['wan-phra 2026-10-26', 'ok-phansa 2026-10-26']);
});

it('開始日が今日より前でも、期間中の行事は返す', () => {
  expect(ids('2026-11-10', 3)).toContain('thot-kathin 2026-10-27');
});

it('日数が 0 未満か整数でなければ RangeError', () => {
  expect(() => upcoming(parseIsoDate('2026-10-21'), -1)).toThrow(RangeError);
  expect(() => upcoming(parseIsoDate('2026-10-21'), 1.5)).toThrow(RangeError);
});
