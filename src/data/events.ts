// 行事定義。名前は「タイ語 / ローマ字 / カタカナ」を必ず併記する
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
}

/** 月日（太陽暦）。month は 1 始まり */
export interface MonthDay {
  month: number;
  day: number;
}

interface BaseEvent {
  id: EventId;
  name: EventName;
}

/** タイ太陰暦から日付を計算する行事。規則は src/core/ で扱う */
export interface LunarEvent extends BaseEvent {
  calendar: 'lunar';
}

/** 太陽暦で日付が固定の行事 */
export interface SolarEvent extends BaseEvent {
  calendar: 'solar';
  start: MonthDay;
  end: MonthDay;
}

export type EventDefinition = LunarEvent | SolarEvent;

export const events: readonly EventDefinition[] = [
  {
    id: 'wan-phra',
    calendar: 'lunar',
    name: { th: 'วันพระ', romaji: 'Wan Phra', kana: 'ワンプラ' },
  },
  {
    id: 'makha-bucha',
    calendar: 'lunar',
    name: { th: 'วันมาฆบูชา', romaji: 'Makha Bucha', kana: 'マーカ・ブーチャー' },
  },
  {
    id: 'visakha-bucha',
    calendar: 'lunar',
    name: { th: 'วันวิสาขบูชา', romaji: 'Visakha Bucha', kana: 'ウィサーカ・ブーチャー' },
  },
  {
    id: 'asarnha-bucha',
    calendar: 'lunar',
    name: { th: 'วันอาสาฬหบูชา', romaji: 'Asarnha Bucha', kana: 'アーサーラハ・ブーチャー' },
  },
  {
    id: 'khao-phansa',
    calendar: 'lunar',
    name: { th: 'วันเข้าพรรษา', romaji: 'Khao Phansa', kana: 'カオパンサー' },
  },
  {
    id: 'ok-phansa',
    calendar: 'lunar',
    name: { th: 'วันออกพรรษา', romaji: 'Ok Phansa', kana: 'オークパンサー' },
  },
  {
    id: 'thot-kathin',
    calendar: 'lunar',
    name: { th: 'ทอดกฐิน', romaji: 'Thot Kathin', kana: 'トートカティン' },
  },
  {
    id: 'loi-krathong',
    calendar: 'lunar',
    name: { th: 'ลอยกระทง', romaji: 'Loi Krathong', kana: 'ロイクラトン' },
  },
  {
    id: 'songkran',
    calendar: 'solar',
    name: { th: 'สงกรานต์', romaji: 'Songkran', kana: 'ソンクラーン' },
    start: { month: 4, day: 13 },
    end: { month: 4, day: 15 },
  },
];

export function formatEventName({ th, romaji, kana }: EventName): string {
  return `${th} / ${romaji} / ${kana}`;
}
