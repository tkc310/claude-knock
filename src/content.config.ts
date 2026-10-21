// 行事の詳細ページの本文（docs/plans/event-pages.md）。ファイル名は src/data/events.ts の id
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 行事名は events.ts が正本なので、frontmatter に重ねて書けないよう知らない項目を弾く
export const eventEntrySchema = z.strictObject({ summary: z.string().trim().min(1) });

export const collections = {
  events: defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/events' }),
    schema: eventEntrySchema,
  }),
};
