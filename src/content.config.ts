// 行事の詳細ページの本文（docs/plans/event-pages.md）。ファイル名は src/data/events.ts の id
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 行事名は events.ts が正本なので、frontmatter に重ねて書けないよう知らない項目を弾く
// origin（由来）と practice（行うこと）は一覧のカードにも出すので、それぞれ 1 行で書く
export const eventEntrySchema = z.strictObject({
  origin: z.string().trim().min(1),
  practice: z.string().trim().min(1),
});

export const collections = {
  events: defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/events' }),
    schema: eventEntrySchema,
  }),
};
