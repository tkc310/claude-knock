// src/core の年表を pythaidate と照らす。年型（閏月・閏日）と全ワンプラ日を年ごとに比べ、食い違った年を出す
// 実行は run.sh から。食い違いがあれば終了コード 1
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { calendar, formatLunarDate, toLunarIn, type LunarYear } from '../../src/core/calendar';
import { fromDayNumber, toDayNumber, type IsoDate } from '../../src/core/day';
import { occurrencesIn } from '../../src/core/rules';
import type { YearKind } from '../../src/core/suriyayatra';
import { events } from '../../src/data/events';

interface Dump {
  years: { buddhistYear: number; kind: YearKind }[];
  /** month の 88 は 2 回目の 8 月。day は月の中の通し日（1〜30） */
  wanPhra: { date: string; month: number; day: number }[];
}

interface YearDiff {
  year: number;
  kind: { core: YearKind; pythaidate: YearKind } | null;
  onlyCore: string[];
  onlyPythaidate: string[];
}

const python = process.env.PYTHON ?? 'python3';
const first = calendar.years[0]!;
const last = calendar.years.at(-1)!;
const from = fromDayNumber(first.start);
const to = fromDayNumber(last.start + last.length - 1);

const dump = JSON.parse(
  execFileSync(
    python,
    [
      '-I',
      join(import.meta.dirname, 'dump_pythaidate.py'),
      ...[first.year, last.year].map(String),
      from,
      to,
    ],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  ),
) as Dump;

const coreWanPhra = occurrencesIn(
  calendar,
  events.filter((e) => e.id === 'wan-phra'),
  { from, to },
).map((o) => o.start as string);
const pyLabel = new Map(dump.wanPhra.map((w) => [w.date, w]));
const pyKind = new Map(dump.years.map((y) => [y.buddhistYear, y.kind]));

const inYear = (y: LunarYear) => (date: string) => {
  const day = toDayNumber(date as IsoDate);
  return y.start <= day && day < y.start + y.length;
};

const diffs: YearDiff[] = calendar.years.flatMap((y) => {
  const core = new Set(coreWanPhra.filter(inYear(y)));
  const py = new Set(dump.wanPhra.map((w) => w.date).filter(inYear(y)));
  const pythaidate = pyKind.get(y.year)!;
  const diff: YearDiff = {
    year: y.year,
    kind: y.kind === pythaidate ? null : { core: y.kind, pythaidate },
    onlyCore: [...core].filter((d) => !py.has(d)),
    onlyPythaidate: [...py].filter((d) => !core.has(d)),
  };
  return diff.kind || diff.onlyCore.length || diff.onlyPythaidate.length ? [diff] : [];
});

const coreLabel = (date: string) => formatLunarDate(toLunarIn(calendar, date as IsoDate));
const pyLabelOf = (date: string) => {
  const w = pyLabel.get(date);
  return w ? `${w.month === 88 ? '8 หลัง' : w.month} 月 ${w.day} 日目` : '';
};
const preview = (dates: string[], label: (d: string) => string) =>
  dates.length === 0
    ? '—'
    : dates
        .slice(0, 4)
        .map((d) => `${d}（${label(d)}）`)
        .join(', ') + (dates.length > 4 ? ` ほか ${dates.length - 4} 日` : '');

console.log(`対象: 仏暦 ${first.year}〜${last.year} 年（${from}〜${to}）`);
console.log(`ワンプラ: src/core ${coreWanPhra.length} 日 / pythaidate ${dump.wanPhra.length} 日`);
if (diffs.length === 0) {
  console.log('食い違いなし');
} else {
  console.log(`食い違った年: ${diffs.length} 年\n`);
  console.log(
    '| 仏暦 | 年型 src/core → pythaidate | src/core だけのワンプラ | pythaidate だけのワンプラ |',
  );
  console.log('| --- | --- | --- | --- |');
  for (const d of diffs) {
    const kind = d.kind ? `${d.kind.core} → ${d.kind.pythaidate}` : '一致';
    console.log(
      `| ${d.year} | ${kind} | ${preview(d.onlyCore, coreLabel)} | ${preview(d.onlyPythaidate, pyLabelOf)} |`,
    );
  }
  process.exitCode = 1;
}
