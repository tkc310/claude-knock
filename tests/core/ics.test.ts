// ICS 生成（RFC 5545）。src/pages/calendar.ics.ts は toIcs を呼ぶだけ
import { describe, expect, it } from 'vite-plus/test';
import { gregorianYear, occurrences, toIcs } from '../../src/core';
import { events, type EventId } from '../../src/data/events';

const builtAt = new Date('2026-10-21T03:04:05Z');
const name = 'タイ仏教行事カレンダー';
const ics = toIcs(occurrences(events, gregorianYear(2026)), { builtAt, name });

/** 折り返しを戻した論理行 */
const lines = ics.replaceAll('\r\n ', '').split('\r\n').slice(0, -1);

/** その行事の VEVENT の論理行 */
function vevent(id: EventId, start: string): string[] {
  const blocks: string[][] = [];
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') blocks.push([]);
    blocks.at(-1)?.push(line);
  }
  const kana = events.find((e) => e.id === id)!.name.kana;
  // 満月の行事の日はワンプラでもあるので、日付と SUMMARY で探す
  const block = blocks.find(
    (b) =>
      b.includes(`DTSTART;VALUE=DATE:${start.replaceAll('-', '')}`) &&
      b.some((l) => l.startsWith(`SUMMARY:${kana}（`)),
  );
  if (!block) throw new Error(`${id} ${start} の VEVENT が無い`);
  return block;
}

const uids = (text: string) =>
  text
    .replaceAll('\r\n ', '')
    .split('\r\n')
    .filter((l) => l.startsWith('UID:'));

describe('改行と折り返し', () => {
  it('行は CRLF で区切り、CRLF で終わる', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics.replaceAll('\r\n', '')).not.toMatch(/[\r\n]/);
  });

  it('物理行は 75 オクテット以下で、続きの行は空白 1 つで始まる', () => {
    const physical = ics.split('\r\n').slice(0, -1);
    for (const line of physical) {
      expect(new TextEncoder().encode(line).length, line).toBeLessThanOrEqual(75);
    }
    // 75 オクテットを超える SUMMARY（アーサーラハ・ブーチャー）が折り返されている
    expect(physical.some((l) => l.startsWith(' '))).toBe(true);
  });

  it('日本語とタイ語の文字を途中で切らない（戻すと元の SUMMARY になる）', () => {
    expect(ics).not.toContain('�');
    expect(vevent('asarnha-bucha', '2026-07-29')).toContain(
      'SUMMARY:アーサーラハ・ブーチャー（วันอาสาฬหบูชา）',
    );
  });
});

it('購読したときのカレンダー名（X-WR-CALNAME）は VCALENDAR に 1 つ', () => {
  const header = lines.slice(0, lines.indexOf('BEGIN:VEVENT'));
  expect(header).toContain('X-WR-CALNAME:タイ仏教行事カレンダー');
  expect(lines.filter((l) => l.startsWith('X-WR-CALNAME:'))).toHaveLength(1);
});

describe('VEVENT', () => {
  it('SUMMARY は「カタカナ（タイ語）」', () => {
    expect(vevent('wan-phra', '2026-02-16')).toContain('SUMMARY:ワンプラ（วันพระ）');
  });

  it('1 日の行事は終日（DTSTART;VALUE=DATE）', () => {
    const lines = vevent('asarnha-bucha', '2026-07-29');
    expect(lines).toContain('DTSTART;VALUE=DATE:20260729');
    expect(lines.some((l) => l.startsWith('DTSTART:'))).toBe(false);
  });

  it('トートカティンは期間で、DTEND は終わりの翌日（排他的）', () => {
    // 2026-10-27〜2026-11-24（ロイクラトンの日まで）
    expect(vevent('thot-kathin', '2026-10-27')).toContain('DTEND;VALUE=DATE:20261125');
  });

  it('ソンクラーンも期間で、DTEND は 4/16', () => {
    expect(vevent('songkran', '2026-04-13')).toContain('DTEND;VALUE=DATE:20260416');
  });

  it('DTSTAMP は引数のビルド日時（UTC）', () => {
    const stamps = lines.filter((l) => l.startsWith('DTSTAMP:'));
    expect(stamps.length).toBe(lines.filter((l) => l === 'BEGIN:VEVENT').length);
    expect(new Set(stamps)).toEqual(new Set(['DTSTAMP:20261021T030405Z']));
  });
});

describe('UID', () => {
  it('1 回の出力の中で重ならない（ワンプラは 1 年に約 50 回ある）', () => {
    const list = uids(ics);
    expect(list.length).toBe(lines.filter((l) => l === 'BEGIN:VEVENT').length);
    expect(new Set(list).size).toBe(list.length);
  });

  it('同じ行事日なら、範囲やビルド日時が変わっても同じ UID', () => {
    const wider = toIcs(
      occurrences(events, { from: gregorianYear(2026).from, to: gregorianYear(2027).to }),
      { builtAt: new Date('2027-01-01T00:00:00Z'), name },
    );
    const uid = vevent('asarnha-bucha', '2026-07-29').find((l) => l.startsWith('UID:'));
    expect(uid).toContain('asarnha-bucha');
    expect(uids(wider)).toContain(uid);
  });
});

it('同じ入力なら同じ出力（時計を読まない）', () => {
  expect(toIcs(occurrences(events, gregorianYear(2026)), { builtAt, name })).toBe(ics);
});
