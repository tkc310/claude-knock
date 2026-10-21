// 行事定義。名前は「タイ語 / ローマ字 / カタカナ / 日本語訳」を必ず併記する
import type { DateRule, LunarDayRule } from '@/core';

export type EventId =
  | 'wan-phra'
  | 'makha-bucha'
  | 'visakha-bucha'
  | 'asarnha-bucha'
  | 'khao-phansa'
  | 'ok-phansa'
  | 'thot-kathin'
  | 'loi-krathong'
  | 'songkran';

export interface EventName {
  th: string;
  romaji: string;
  kana: string;
  /** 意味をとった日本語訳（音写のカタカナとは別） */
  ja: string;
}

/**
 * buddhist: 原始仏教にとって重要な行事（ADR-0005）
 * folk: タイで仏教と結びついて国民的に行われる民間行事。例外として加えた（ADR-0007）
 */
export type EventCategory = 'buddhist' | 'folk';

export interface EventDefinition {
  id: EventId;
  name: EventName;
  category: EventCategory;
  /** 日付の規則。解釈は src/core/ が持つ（ADR-0008） */
  date: DateRule;
}

const fullMoon = (month: LunarDayRule['month']): DateRule => ({
  kind: 'lunar-day',
  at: { month, phase: 'waxing', day: 15 },
});

export const events: readonly EventDefinition[] = [
  {
    id: 'wan-phra',
    category: 'buddhist',
    date: { kind: 'uposatha' },
    name: { th: 'วันพระ', romaji: 'Wan Phra', kana: 'ワンプラ', ja: '布薩日' },
  },
  {
    id: 'makha-bucha',
    category: 'buddhist',
    // 閏月の年は 1 か月ずれる（docs/events/makha-bucha.md）
    date: fullMoon({ common: 3, adhikamas: 4 }),
    name: { th: 'วันมาฆบูชา', romaji: 'Makha Bucha', kana: 'マーカ・ブーチャー', ja: '万仏節' },
  },
  {
    id: 'visakha-bucha',
    category: 'buddhist',
    date: fullMoon({ common: 6, adhikamas: 7 }),
    name: {
      th: 'วันวิสาขบูชา',
      romaji: 'Visakha Bucha',
      kana: 'ウィサーカ・ブーチャー',
      ja: '仏誕節',
    },
  },
  {
    id: 'asarnha-bucha',
    category: 'buddhist',
    date: fullMoon({ common: 8, adhikamas: 'second-8' }),
    name: {
      th: 'วันอาสาฬหบูชา',
      romaji: 'Asarnha Bucha',
      kana: 'アーサーラハ・ブーチャー',
      ja: '三宝節',
    },
  },
  {
    id: 'khao-phansa',
    category: 'buddhist',
    date: {
      kind: 'lunar-day',
      at: { month: { common: 8, adhikamas: 'second-8' }, phase: 'waning', day: 1 },
    },
    name: { th: 'วันเข้าพรรษา', romaji: 'Khao Phansa', kana: 'カオパンサー', ja: '入安居' },
  },
  {
    id: 'ok-phansa',
    category: 'buddhist',
    date: fullMoon(11),
    name: { th: 'วันออกพรรษา', romaji: 'Ok Phansa', kana: 'オークパンサー', ja: '出安居' },
  },
  {
    id: 'thot-kathin',
    category: 'buddhist',
    // オークパンサーの翌日から、1 か月後の満月まで
    date: {
      kind: 'lunar-span',
      start: { month: 11, phase: 'waning', day: 1 },
      end: { month: 12, phase: 'waxing', day: 15 },
    },
    name: { th: 'ทอดกฐิน', romaji: 'Thot Kathin', kana: 'トートカティン', ja: 'カティナ衣奉献' },
  },
  {
    id: 'loi-krathong',
    category: 'folk',
    date: fullMoon(12),
    name: { th: 'ลอยกระทง', romaji: 'Loi Krathong', kana: 'ロイクラトン', ja: '灯籠流し' },
  },
  {
    id: 'songkran',
    category: 'folk',
    date: { kind: 'solar-span', start: { month: 4, day: 13 }, end: { month: 4, day: 15 } },
    name: { th: 'สงกรานต์', romaji: 'Songkran', kana: 'ソンクラーン', ja: 'タイ正月' },
  },
];

export function formatEventName({ th, romaji, kana, ja }: EventName): string {
  return `${th} / ${romaji} / ${kana} / ${ja}`;
}
