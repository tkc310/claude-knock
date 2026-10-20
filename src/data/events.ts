// 行事定義。名前は「タイ語 / ローマ字 / カタカナ」を必ず併記する
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
}

/** 日付はタイ太陰暦から計算する。規則は src/core/ で扱う */
export interface EventDefinition {
  id: EventId;
  name: EventName;
}

export const events: readonly EventDefinition[] = [
  {
    id: 'wan-phra',
    name: { th: 'วันพระ', romaji: 'Wan Phra', kana: 'ワンプラ' },
  },
  {
    id: 'makha-bucha',
    name: { th: 'วันมาฆบูชา', romaji: 'Makha Bucha', kana: 'マーカ・ブーチャー' },
  },
  {
    id: 'visakha-bucha',
    name: { th: 'วันวิสาขบูชา', romaji: 'Visakha Bucha', kana: 'ウィサーカ・ブーチャー' },
  },
  {
    id: 'asarnha-bucha',
    name: { th: 'วันอาสาฬหบูชา', romaji: 'Asarnha Bucha', kana: 'アーサーラハ・ブーチャー' },
  },
  {
    id: 'khao-phansa',
    name: { th: 'วันเข้าพรรษา', romaji: 'Khao Phansa', kana: 'カオパンサー' },
  },
  {
    id: 'ok-phansa',
    name: { th: 'วันออกพรรษา', romaji: 'Ok Phansa', kana: 'オークパンサー' },
  },
  {
    id: 'thot-kathin',
    name: { th: 'ทอดกฐิน', romaji: 'Thot Kathin', kana: 'トートカティン' },
  },
];

export function formatEventName({ th, romaji, kana }: EventName): string {
  return `${th} / ${romaji} / ${kana}`;
}
