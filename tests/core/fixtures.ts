import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseIsoDate, supportedRange, type IsoDate } from '../../src/core';
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

/** 年表の中の日付。年型を確かめるために、年表より前の年の告示も fixtures に置く */
export const officialDatesInTable = officialDates.filter(
  ({ date }) => date >= supportedRange.from && date <= supportedRange.to,
);
