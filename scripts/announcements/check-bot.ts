// タイ中央銀行（BOT）の API の金融機関の休日を、暦の計算と正解データ（tests/fixtures）に照らす（ADR-0023）。
// 3 つのブーチャー（とカオパンサー）の公式の日付が合えば、その年の年型（閏月・閏日）が正しいと確かめられる。
// 実行: make announcements（BOT_API_TOKEN が要る。結果は announcements-report.md と GITHUB_OUTPUT の status）
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { gregorianYear, occurrences } from '../../src/core/index.ts';
import { events, type EventId } from '../../src/data/events.ts';

const ENDPOINT = 'https://gateway.api.bot.or.th/financial-institutions-holidays/';

export interface BotHoliday {
  date: string;
  description: string;
}

export interface Row {
  eventId: EventId;
  /** BOT の休日の日付 */
  official: string;
  /** 暦で計算したその年の日付 */
  computed: string[];
  status: 'match' | 'mismatch';
  /** 正解データ（tests/fixtures/official-dates.json）に入っているか */
  inFixtures: boolean;
}

/** API の応答を読む。新しい API は配列、古い API は { result: { data: [...] } } で返す */
export function parseBotHolidays(json: unknown): BotHoliday[] {
  const wrapped = json as { result?: { data?: unknown } };
  const list = Array.isArray(json) ? json : wrapped?.result?.data;
  if (!Array.isArray(list)) throw new Error('BOT の応答に休日の一覧がありません');
  const text = (value: unknown) => (typeof value === 'string' ? value : '');
  return list.map((item: { Date?: unknown; HolidayDescription?: unknown }) => ({
    date: text(item.Date),
    description: text(item.HolidayDescription),
  }));
}

/** 休日の英語名から行事を当てる。振替休日（Substitution for ...）は外す */
export function matchEvent(description: string): EventId | undefined {
  if (/substitut/i.test(description)) return undefined;
  if (/makha/i.test(description)) return 'makha-bucha';
  if (/visakha|wisakha|vesak/i.test(description)) return 'visakha-bucha';
  if (/asa(?:r)?nha|asalha|asanha/i.test(description)) return 'asarnha-bucha';
  if (/buddhist lent|khao phansa/i.test(description)) return 'khao-phansa';
  return undefined;
}

/** その年の BOT の休日を、暦の計算と正解データに照らす */
export function compareYear(
  year: number,
  holidays: readonly BotHoliday[],
  fixtures: readonly { eventId: string; date: string }[],
): Row[] {
  const computed = occurrences(events, gregorianYear(year));
  return holidays.flatMap(({ date, description }) => {
    const eventId = matchEvent(description);
    if (!eventId || !date.startsWith(`${year}-`)) return [];
    const dates: string[] = computed.filter((o) => o.event.id === eventId).map((o) => o.start);
    return [
      {
        eventId,
        official: date,
        computed: dates,
        status: dates.includes(date) ? 'match' : 'mismatch',
        inFixtures: fixtures.some((f) => f.eventId === eventId && f.date === date),
      } satisfies Row,
    ];
  });
}

/** none: まだ告示が無い / ok: すべて確認済み / new: 正解データに無い公式の日付 / mismatch: 計算と食い違い */
export function summarize(rows: readonly Row[]): 'none' | 'ok' | 'new' | 'mismatch' {
  if (rows.length === 0) return 'none';
  if (rows.some((r) => r.status === 'mismatch')) return 'mismatch';
  if (rows.some((r) => !r.inFixtures)) return 'new';
  return 'ok';
}

function row(r: Row): string {
  const computed = r.computed.join(', ') || '（無し）';
  const status = r.status === 'match' ? '一致' : '**食い違い**';
  const fixture = r.inFixtures ? 'あり' : '**無し**';
  return `| ${r.eventId} | ${r.official} | ${computed} | ${status} | ${fixture} |`;
}

function report(year: number, rows: readonly Row[]): string {
  const status = summarize(rows);
  const lines = [
    `## ${year} 年（${status}）`,
    '',
    status === 'none'
      ? 'まだタイ中央銀行の休日の告示がありません。'
      : '| 行事 | 公式の日付 | 暦の計算 | 照合 | 正解データ |\n| --- | --- | --- | --- | --- |',
    ...rows.map(row),
    '',
  ];
  return lines.join('\n');
}

async function fetchYear(year: number, token: string): Promise<BotHoliday[]> {
  const res = await fetch(`${ENDPOINT}?year=${year}`, {
    headers: { Authorization: token, Accept: 'application/json' },
  });
  // 告示の前の年は、空の一覧かエラーで返ることがある。どちらも「まだ無い」とみなす
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`BOT の API が ${res.status} を返しました（${year} 年）`);
  const text = await res.text();
  return text.trim() ? parseBotHolidays(JSON.parse(text)) : [];
}

if (import.meta.main) {
  const token = process.env.BOT_API_TOKEN;
  if (!token) {
    console.error('BOT_API_TOKEN がありません（GitHub の secrets に登録する）');
    process.exit(1);
  }
  const fixtures = JSON.parse(readFileSync('tests/fixtures/official-dates.json', 'utf8'));
  const thisYear = new Date().getFullYear();
  const order = ['ok', 'none', 'new', 'mismatch'] as const;
  let worst: (typeof order)[number] = 'ok';
  const sections: string[] = [];
  for (const year of [thisYear, thisYear + 1]) {
    const rows = compareYear(year, await fetchYear(year, token), fixtures);
    const status = summarize(rows);
    // 来年の告示がまだ無い（none）のは毎年 8 月ごろまでの普通の状態なので、知らせない
    const level = status === 'none' && year > thisYear ? 'ok' : status;
    if (order.indexOf(level) > order.indexOf(worst)) worst = level;
    sections.push(report(year, rows));
  }
  const body = [
    '# タイ中央銀行の休日の告示の照合',
    '',
    `API: ${ENDPOINT}（${new Date().toISOString().slice(0, 10)} に取得）`,
    '',
    ...sections,
  ].join('\n');
  writeFileSync('announcements-report.md', body);
  console.log(body);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `status=${worst}\n`);
}
