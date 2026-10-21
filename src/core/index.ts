// 暦計算の公開 API。Astro・React に依存しない純粋関数だけを置く（ICS 生成や Workers からも使う）
// 内部のファイルは core の外から読み込まない（vite.config.ts の lint で禁じている）
export { formatLunarDate, supportedRange, toLunar } from './calendar';
export type { LunarMonth, ThaiLunarDate } from './calendar';
export { addDays, gregorianYear, parseIsoDate } from './day';
export type { DateRange, IsoDate, MonthDay } from './day';
export { occurrences } from './rules';
export type { DateRule, LunarDayRule, MonthRef, Occurrence } from './rules';
