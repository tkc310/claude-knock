import type { APIRoute } from 'astro';
import { occurrences, toIcs } from '@/core';
import { displayRange } from '@/data/display-range';
import { events } from '@/data/events';

export const GET: APIRoute = () => {
  const builtAt = new Date();
  const ics = toIcs(occurrences(events, displayRange(builtAt)), {
    builtAt,
    name: 'タイ仏教行事カレンダー',
  });
  return new Response(ics, { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
