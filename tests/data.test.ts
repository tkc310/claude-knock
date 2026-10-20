import { describe, expect, it } from 'vite-plus/test';
import { events, formatEventName } from '../src/data/events';

describe('events', () => {
  it('id が重複しない', () => {
    const ids = events.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(events)('$id は タイ語 / ローマ字 / カタカナ / 日本語訳 がそろっている', ({ name }) => {
    expect(name.th).toMatch(/\p{Script=Thai}/u);
    expect(name.romaji).toMatch(/^[A-Za-z][A-Za-z .'-]*$/);
    expect(name.kana).toMatch(/^[\p{Script=Katakana}ー・]+$/u);
    expect(name.ja).toMatch(/^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー・]+$/u);
    // 日本語訳は音写（カタカナ）の繰り返しにしない
    expect(name.ja).not.toBe(name.kana);
  });

  it('名前を「タイ語 / ローマ字 / カタカナ / 日本語訳」で表示する', () => {
    expect(
      formatEventName({ th: 'วันพระ', romaji: 'Wan Phra', kana: 'ワンプラ', ja: '布薩日' }),
    ).toBe('วันพระ / Wan Phra / ワンプラ / 布薩日');
  });
});
