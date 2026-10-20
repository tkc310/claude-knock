import { describe, expect, it } from 'vite-plus/test';
import { events, formatEventName } from '../src/data/events';

describe('events', () => {
  it('id が重複しない', () => {
    const ids = events.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(events)('$id は タイ語 / ローマ字 / カタカナ がそろっている', ({ name }) => {
    expect(name.th).toMatch(/\p{Script=Thai}/u);
    expect(name.romaji).toMatch(/^[A-Za-z][A-Za-z .'-]*$/);
    expect(name.kana).toMatch(/^[\p{Script=Katakana}ー・]+$/u);
  });

  it('ソンクラーンは太陽暦の 4/13〜15 に固定', () => {
    const songkran = events.find((e) => e.id === 'songkran');
    expect(songkran).toMatchObject({
      calendar: 'solar',
      start: { month: 4, day: 13 },
      end: { month: 4, day: 15 },
    });
  });

  it('名前を「タイ語 / ローマ字 / カタカナ」で表示する', () => {
    expect(formatEventName({ th: 'วันพระ', romaji: 'Wan Phra', kana: 'ワンプラ' })).toBe(
      'วันพระ / Wan Phra / ワンプラ',
    );
  });
});
