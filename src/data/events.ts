// 行事定義。名前は「タイ語 / ローマ字 / カタカナ / 日本語訳」を必ず併記する
export type EventId =
  | 'wan-phra'
  | 'makha-bucha'
  | 'visakha-bucha'
  | 'asarnha-bucha'
  | 'khao-phansa'
  | 'ok-phansa'
  | 'thot-kathin';

export interface EventName {
  th: string;
  romaji: string;
  kana: string;
  /** 意味をとった日本語訳（音写のカタカナとは別） */
  ja: string;
}

/** 日付はタイ太陰暦から計算する。規則は src/core/ で扱う */
export interface EventDefinition {
  id: EventId;
  name: EventName;
}

export const events: readonly EventDefinition[] = [
  {
    id: 'wan-phra',
    name: { th: 'วันพระ', romaji: 'Wan Phra', kana: 'ワンプラ', ja: '布薩日' },
  },
  {
    id: 'makha-bucha',
    name: { th: 'วันมาฆบูชา', romaji: 'Makha Bucha', kana: 'マーカ・ブーチャー', ja: '万仏節' },
  },
  {
    id: 'visakha-bucha',
    name: {
      th: 'วันวิสาขบูชา',
      romaji: 'Visakha Bucha',
      kana: 'ウィサーカ・ブーチャー',
      ja: '仏誕節',
    },
  },
  {
    id: 'asarnha-bucha',
    name: {
      th: 'วันอาสาฬหบูชา',
      romaji: 'Asarnha Bucha',
      kana: 'アーサーラハ・ブーチャー',
      ja: '三宝節',
    },
  },
  {
    id: 'khao-phansa',
    name: { th: 'วันเข้าพรรษา', romaji: 'Khao Phansa', kana: 'カオパンサー', ja: '入安居' },
  },
  {
    id: 'ok-phansa',
    name: { th: 'วันออกพรรษา', romaji: 'Ok Phansa', kana: 'オークパンサー', ja: '出安居' },
  },
  {
    id: 'thot-kathin',
    name: { th: 'ทอดกฐิน', romaji: 'Thot Kathin', kana: 'トートカティン', ja: 'カティナ衣奉献' },
  },
];

export function formatEventName({ th, romaji, kana, ja }: EventName): string {
  return `${th} / ${romaji} / ${kana} / ${ja}`;
}
