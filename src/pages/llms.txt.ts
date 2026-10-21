// llms.txt（https://llmstxt.org/ 、ADR-0019）。AI 向けに、サイトの概要と全ページを Markdown で渡す。
// 行事ごとに由来・行うこと・表示範囲（今年と来年）の日付を書き、ページを開かなくても要点が分かるようにする
import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { occurrences } from '@/core';
import { displayRange } from '@/data/display-range';
import { events, formatEventName } from '@/data/events';

export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const builtAt = new Date();
  const range = displayRange(builtAt);
  const list = occurrences(events, range);
  const entries = new Map((await getCollection('events')).map((e) => [e.id, e.data]));
  const tambun = await getEntry('guides', 'tambun');

  const eventLines = events.map((event) => {
    const entry = entries.get(event.id);
    const dates =
      event.date.kind === 'uposatha'
        ? '太陰暦の各月の 8 日・15 日と、月末（14 日か 15 日）。月に 4 回'
        : list
            .filter((o) => o.event.id === event.id)
            .map((o) => (o.start === o.end ? o.start : `${o.start}〜${o.end}`))
            .join('、');
    const kind = event.category === 'folk' ? '民間行事。' : '';
    const notes = `${kind}由来: ${entry?.origin}。行うこと: ${entry?.practice}。日付: ${dates}`;
    return `- [${formatEventName(event.name)}](${url(`/events/${event.id}/`)}): ${notes}`;
  });

  const body = `# タイ仏教行事カレンダー

> タイの仏教行事（ワンプラ、マーカ・ブーチャー、ウィサーカ・ブーチャー、カオパンサーなど）の日付と意味を、日本語でまとめたカレンダーです。日付はタイの太陰暦から計算し、タイ政府・タイ中央銀行の公式発表と照らし合わせています。

- 行事名は「カタカナ（日本語訳）/ ローマ字」で書いています
- 太陰暦の行事は、年によって太陽暦の日付が変わります。下の日付は ${range.from.slice(0, 4)}〜${range.to.slice(0, 4)} 年のもので、${builtAt.toISOString().slice(0, 10)} に作りました
- 載せているのは、仏典（経・律）やブッダの生涯に根拠がある行事です。ロイクラトンとソンクラーンは、タイで広く行われる民間行事として例外的に載せています

## 行事

${eventLines.join('\n')}

## 説明

- [${tambun?.data.title}（功徳を積む行い）](${url('/tambun/')}): ${tambun?.data.description}

## Optional

- [calendar.ics](${url('/calendar.ics')}): ${range.from.slice(0, 4)}〜${range.to.slice(0, 4)} 年の行事（ICS。カレンダーアプリに取り込める）
- [sitemap.xml](${url('/sitemap.xml')}): 全ページの一覧
- [ソースコード](https://github.com/tkc310/koyomi): 暦の計算・行事の資料と出典（GitHub）
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
