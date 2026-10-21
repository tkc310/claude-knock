// タイ中央銀行の API の休日と、暦の計算・正解データ（fixtures）を比べる（ADR-0023）
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import {
  compareYear,
  matchEvent,
  parseBotHolidays,
  summarize,
  type BotHoliday,
} from '../scripts/announcements/check-bot';

const read = (f: string) => readFileSync(join(import.meta.dirname, '..', f), 'utf8');
const fixtures: { eventId: string; date: string }[] = JSON.parse(
  read('tests/fixtures/official-dates.json'),
);

// 2027 年のタイ中央銀行の休日（API の応答の形。ADR-0008 の公式の日付と同じ）
const bot2027 = [
  { Date: '2027-01-01', HolidayDescription: "New Year's Day" },
  { Date: '2027-02-22', HolidayDescription: 'Substitution for Makha Bucha Day' },
  { Date: '2027-02-21', HolidayDescription: 'Makha Bucha Day' },
  { Date: '2027-05-20', HolidayDescription: 'Visakha Bucha Day' },
  { Date: '2027-07-18', HolidayDescription: 'Asarnha Bucha Day' },
];

describe('タイ中央銀行の休日の読み取り', () => {
  it('配列の応答と、result.data に入った応答の両方を読む', () => {
    const fromArray = parseBotHolidays(bot2027);
    const fromWrapped = parseBotHolidays({ result: { data: bot2027 } });
    expect(fromArray).toEqual(fromWrapped);
    expect(fromArray).toHaveLength(5);
    expect(fromArray[0]).toEqual({ date: '2027-01-01', description: "New Year's Day" });
  });

  it('行事名から行事を当て、振替休日と関係の無い休日は外す', () => {
    expect(matchEvent('Makha Bucha Day')).toBe('makha-bucha');
    expect(matchEvent('Visakha Bucha Day')).toBe('visakha-bucha');
    expect(matchEvent('Asarnha Bucha Day')).toBe('asarnha-bucha');
    expect(matchEvent('Asalha Bucha Day')).toBe('asarnha-bucha');
    expect(matchEvent('Buddhist Lent Day')).toBe('khao-phansa');
    expect(matchEvent('Substitution for Makha Bucha Day')).toBeUndefined();
    expect(matchEvent("New Year's Day")).toBeUndefined();
  });
});

describe('暦の計算・正解データとの照合', () => {
  const holidays: BotHoliday[] = parseBotHolidays(bot2027);

  it('公式の日付が暦の計算と合い、正解データにもあれば ok', () => {
    const rows = compareYear(2027, holidays, fixtures);
    expect(rows.map((r) => [r.eventId, r.status])).toEqual([
      ['makha-bucha', 'match'],
      ['visakha-bucha', 'match'],
      ['asarnha-bucha', 'match'],
    ]);
    expect(rows.every((r) => r.inFixtures)).toBe(true);
    expect(summarize(rows)).toBe('ok');
  });

  it('正解データに無い公式の日付が出たら new', () => {
    const rows = compareYear(2027, holidays, []);
    expect(rows.every((r) => r.status === 'match' && !r.inFixtures)).toBe(true);
    expect(summarize(rows)).toBe('new');
  });

  it('公式の日付が暦の計算と食い違ったら mismatch（年型の上書きが要る）', () => {
    const shifted = holidays.map((h) =>
      h.description === 'Makha Bucha Day' ? { ...h, date: '2027-03-22' } : h,
    );
    const rows = compareYear(2027, shifted, fixtures);
    const makha = rows.find((r) => r.eventId === 'makha-bucha');
    expect(makha).toMatchObject({ status: 'mismatch', official: '2027-03-22' });
    expect(makha?.computed).toEqual(['2027-02-21']);
    expect(summarize(rows)).toBe('mismatch');
  });

  it('まだ告示が無い年（休日の一覧が空）は none', () => {
    expect(summarize(compareYear(2030, [], fixtures))).toBe('none');
  });
});

describe('毎月の照合のワークフロー', () => {
  it('毎月 make announcements を BOT_API_TOKEN で走らせ、知らせることがあれば Issue にする', () => {
    const workflow = read('.github/workflows/announcements.yml');
    expect(workflow).toMatch(/schedule:\s*\n\s+- cron: '\S+ \S+ \d+ \* \*'/);
    expect(workflow).toContain('run: make announcements');
    expect(workflow).toContain('BOT_API_TOKEN: ${{ secrets.BOT_API_TOKEN }}');
    expect(workflow).toMatch(/issues: write/);
    expect(workflow).toContain('gh issue create');
    const target = /^announcements: .*\n\tnode .*scripts\/announcements\/check-bot\.ts$/m;
    expect(read('Makefile')).toMatch(target);
  });

  it('Keepalive が Announcements も有効にし直す（60 日で止まらないように）', () => {
    const keepalive = read('.github/workflows/keepalive.yml');
    expect(keepalive).toContain('gh workflow enable announcements.yml');
  });
});
