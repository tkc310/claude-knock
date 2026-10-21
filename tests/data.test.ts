import { describe, expect, it } from 'vite-plus/test';
import { events, formatEventName } from '../src/data/events';

describe('events', () => {
  it('id が重複しない', () => {
    const ids = events.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(events)(
    '$id は ローマ字 / カタカナ / 日本語訳 がそろい、タイ文字を含まない',
    ({ name }) => {
      expect(Object.values(name).join('')).not.toMatch(/\p{Script=Thai}/u);
      expect(name.romaji).toMatch(/^[A-Za-z][A-Za-z .'-]*$/);
      expect(name.kana).toMatch(/^[\p{Script=Katakana}ー・]+$/u);
      expect(name.ja).toMatch(/^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー・]+$/u);
      // 日本語訳は音写（カタカナ）の繰り返しにしない
      expect(name.ja).not.toBe(name.kana);
    },
  );

  it('民間行事は ADR-0007 で例外にしたロイクラトンとソンクラーンだけ', () => {
    // 民間行事を足すときは ADR を書き、ここを更新する
    const folk = events.filter((e) => e.category === 'folk').map((e) => e.id);
    expect(folk).toEqual(['loi-krathong', 'songkran']);
  });

  it('ソンクラーンのほかは、タイ太陰暦から計算する', () => {
    const solar = events.filter((e) => e.date.kind === 'solar-span').map((e) => e.id);
    expect(solar).toEqual(['songkran']);
  });

  it('ソンクラーンは太陽暦の 4/13〜15 に固定', () => {
    expect(events.find((e) => e.id === 'songkran')?.date).toEqual({
      kind: 'solar-span',
      start: { month: 4, day: 13 },
      end: { month: 4, day: 15 },
    });
  });

  it('アッタミー・ブーチャーは แรม 8 ค่ำ เดือน 6（閏月の年は เดือน 7）', () => {
    expect(events.find((e) => e.id === 'atthami-bucha')).toMatchObject({
      category: 'buddhist',
      date: {
        kind: 'lunar-day',
        at: { month: { common: 6, adhikamas: 7 }, phase: 'waning', day: 8 },
      },
    });
  });

  it('名前を「カタカナ（日本語訳）/ ローマ字」で表示する', () => {
    expect(formatEventName({ romaji: 'Wan Phra', kana: 'ワンプラ', ja: '布薩日' })).toBe(
      'ワンプラ（布薩日）/ Wan Phra',
    );
  });
});
