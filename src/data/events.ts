// 行事定義。名前は「タイ語 / ローマ字 / カタカナ / 日本語訳」を必ず併記する
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

/** 月日（太陽暦）。month は 1 始まり */
export interface MonthDay {
  month: number;
  day: number;
}

interface BaseEvent {
  id: EventId;
  name: EventName;
  category: EventCategory;
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
    category: 'buddhist',
    calendar: 'lunar',
    name: { th: 'วันพระ', romaji: 'Wan Phra', kana: 'ワンプラ', ja: '布薩日' },
  },
  {
    id: 'makha-bucha',
    category: 'buddhist',
    calendar: 'lunar',
    name: { th: 'วันมาฆบูชา', romaji: 'Makha Bucha', kana: 'マーカ・ブーチャー', ja: '万仏節' },
  },
  {
    id: 'visakha-bucha',
    category: 'buddhist',
    calendar: 'lunar',
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
    calendar: 'lunar',
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
    calendar: 'lunar',
    name: { th: 'วันเข้าพรรษา', romaji: 'Khao Phansa', kana: 'カオパンサー', ja: '入安居' },
  },
  {
    id: 'ok-phansa',
    category: 'buddhist',
    calendar: 'lunar',
    name: { th: 'วันออกพรรษา', romaji: 'Ok Phansa', kana: 'オークパンサー', ja: '出安居' },
  },
  {
    id: 'thot-kathin',
    category: 'buddhist',
    calendar: 'lunar',
    name: { th: 'ทอดกฐิน', romaji: 'Thot Kathin', kana: 'トートカティン', ja: 'カティナ衣奉献' },
  },
  {
    id: 'loi-krathong',
    category: 'folk',
    calendar: 'lunar',
    name: { th: 'ลอยกระทง', romaji: 'Loi Krathong', kana: 'ロイクラトン', ja: '灯籠流し' },
  },
  {
    id: 'songkran',
    category: 'folk',
    calendar: 'solar',
    start: { month: 4, day: 13 },
    end: { month: 4, day: 15 },
    name: { th: 'สงกรานต์', romaji: 'Songkran', kana: 'ソンクラーン', ja: 'タイ正月' },
  },
];

export function formatEventName({ th, romaji, kana, ja }: EventName): string {
  return `${th} / ${romaji} / ${kana} / ${ja}`;
}
