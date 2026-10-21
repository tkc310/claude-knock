// 画面に出す日付の書き方（例: 2026 年 11 月 24 日（火））
import { describe, expect, it } from 'vite-plus/test';
import { dateLabel, spanLabel } from '../src/components/event/date-label';

describe('dateLabel', () => {
  it('年・月・日と曜日を書く', () => {
    expect(dateLabel('2026-11-24')).toBe('2026 年 11 月 24 日（火）');
  });
  it('年を省ける', () => {
    expect(dateLabel('2027-01-03', { year: false })).toBe('1 月 3 日（日）');
  });
});

describe('spanLabel', () => {
  it('1 日だけなら日付 1 つ', () => {
    expect(spanLabel('2026-11-24', '2026-11-24')).toBe('2026 年 11 月 24 日（火）');
  });
  it('同じ年の期間は、終わりの年を省く', () => {
    expect(spanLabel('2027-04-13', '2027-04-15')).toBe(
      '2027 年 4 月 13 日（火）〜4 月 15 日（木）',
    );
  });
  it('年をまたぐ期間は、終わりにも年を書く', () => {
    expect(spanLabel('2026-12-20', '2027-01-03')).toBe(
      '2026 年 12 月 20 日（日）〜2027 年 1 月 3 日（日）',
    );
  });
});
