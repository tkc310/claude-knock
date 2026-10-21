// ICS 生成（RFC 5545）。時計は読まず、DTSTAMP は引数の builtAt から作る
import { addDays, type IsoDate } from './day';
import type { Occurrence } from './rules';

interface IcsEvent {
  id: string;
  name: { th: string; kana: string };
}

const encoder = new TextEncoder();

/** TEXT 値のエスケープ（RFC 5545 3.3.11） */
const escapeText = (s: string) => s.replace(/[\\;,]/g, '\\$&').replace(/\r\n|\r|\n/g, '\\n');

/** 75 オクテットで折り返す。コードポイント単位で数えるので、文字（サロゲートペアも）を割らない */
function fold(line: string): string {
  const out: string[] = [];
  let cur = '';
  let size = 0;
  for (const ch of line) {
    const n = encoder.encode(ch).length;
    if (size + n > 75) {
      out.push(cur);
      // 続きの行は先頭の空白を含めて 75 オクテット以下
      cur = ' ';
      size = 1;
    }
    cur += ch;
    size += n;
  }
  out.push(cur);
  return out.join('\r\n');
}

const ymd = (date: IsoDate) => date.replaceAll('-', '');

/** UID は行事日と行事の id だけで決まるので、範囲やビルド日時が変わっても変わらない */
export function toIcs<E extends IcsEvent>(
  occurrences: readonly Occurrence<E>[],
  { builtAt, name }: { builtAt: Date; name: string },
): string {
  const stamp = builtAt.toISOString().replace(/[-:]|\.\d+/g, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//thai-buddhist-calendar-ja//ICS//JA',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${escapeText(name)}`,
    ...occurrences.flatMap(({ event, start, end }) => [
      'BEGIN:VEVENT',
      `UID:${ymd(start)}-${event.id}@thai-buddhist-calendar-ja`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(start)}`,
      // 終日の DTEND は排他的なので、終わりの翌日
      `DTEND;VALUE=DATE:${ymd(addDays(end, 1))}`,
      `SUMMARY:${escapeText(`${event.name.kana}（${event.name.th}）`)}`,
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return lines.map((l) => `${fold(l)}\r\n`).join('');
}
