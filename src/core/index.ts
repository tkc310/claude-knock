// 暦計算。Astro・React に依存しない純粋関数だけを置く（ICS 生成や Workers からも使う）
// 計算の実装は tests/fixtures/ の公式日付でテストを書いてから足す

/** タイ太陰暦の日付 */
export interface ThaiLunarDate {
  /** 仏暦（B.E.） */
  buddhistYear: number;
  /** 太陰月（1〜12。閏月の年は 8 月が 2 回ある） */
  month: number;
  /** 閏 8 月（แปดแปด）なら true */
  isLeapMonth: boolean;
  /** 白分（上弦: ข้างขึ้น）か黒分（下弦: ข้างแรม） */
  phase: 'waxing' | 'waning';
  /** 白分・黒分の中での日（1〜15） */
  day: number;
}

/** 太陽暦の日付（ISO 8601 の YYYY-MM-DD） */
export type IsoDate = `${number}-${number}-${number}`;
