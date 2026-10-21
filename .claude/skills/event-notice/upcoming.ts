// 今日から N 日以内に当たる行事を出す。event-notice スキルの下ごしらえ
// 実行: node --import ./scripts/diff-pythaidate/resolve-ts.mjs .claude/skills/event-notice/upcoming.ts [日数] [今日]
import {
  addDays,
  formatLunarDate,
  occurrences,
  parseIsoDate,
  type IsoDate,
  type Occurrence,
} from '../../../src/core/index.ts';
import { events, type EventDefinition } from '../../../src/data/events.ts';

/** 期間の行事（トートカティンの約 30 日）が今日より前に始まっていても拾えるよう、開始日はこれだけさかのぼる */
const LOOKBACK_DAYS = 60;

/** today〜today+days（両端を含む）に 1 日でもかかる行事を、開始日の順に返す */
export function upcoming(today: IsoDate, days: number): Occurrence<EventDefinition>[] {
  if (!Number.isInteger(days) || days < 0) throw new RangeError(`日数は 0 以上の整数: ${days}`);
  return occurrences(events, {
    from: addDays(today, -LOOKBACK_DAYS),
    to: addDays(today, days),
  }).filter((o) => o.end >= today);
}

if (import.meta.main) {
  const [days = '14', date = new Date().toLocaleDateString('sv-SE')] = process.argv.slice(2);
  const today = parseIsoDate(date);
  const rows = upcoming(today, Number(days)).map(({ event, start, end, lunar }) => ({
    id: event.id,
    kana: event.name.kana,
    th: event.name.th,
    start,
    end,
    lunar: formatLunarDate(lunar),
  }));
  console.log(JSON.stringify({ today, to: addDays(today, Number(days)), rows }, null, 2));
}
