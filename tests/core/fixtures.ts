import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseIsoDate, type IsoDate } from '../../src/core';
import type { EventId } from '../../src/data/events';

export interface OfficialDate {
  eventId: EventId;
  date: IsoDate;
}

const file = join(import.meta.dirname, '..', 'fixtures', 'official-dates.json');

/** 形式の検査は tests/fixtures.test.ts が行う。ここでは日付を IsoDate にするだけ */
export const officialDates: readonly OfficialDate[] = (
  JSON.parse(readFileSync(file, 'utf8')) as { eventId: EventId; date: string }[]
).map(({ eventId, date }) => ({ eventId, date: parseIsoDate(date) }));
