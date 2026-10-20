import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { events } from '../src/data/events';

interface Fixture {
  eventId: string;
  date: string;
  sourceUrl: string;
}

const dir = join(import.meta.dirname, 'fixtures');
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
const eventIds = new Set<string>(events.map((e) => e.id));

describe.skipIf(files.length === 0)('fixtures', () => {
  describe.each(files)('%s', (file) => {
    const records = JSON.parse(readFileSync(join(dir, file), 'utf8')) as Fixture[];

    it.each(records)('$eventId $date', (record) => {
      expect(eventIds).toContain(record.eventId);
      expect(record.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new URL(record.sourceUrl).protocol).toBe('https:');
      // 2024-02-30 のような実在しない日付を通さない
      expect(new Date(`${record.date}T00:00:00Z`).toISOString().slice(0, 10)).toBe(record.date);
    });

    it('同じ行事・同じ日が重複しない', () => {
      const keys = records.map((r) => `${r.eventId}:${r.date}`);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});
