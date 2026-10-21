import { gregorianYear, type DateRange } from '../core';

/** 出すのは今年と来年の行事だけ（ADR-0008 の 1）。core は時計を読まないので、ビルドの日を受け取る */
export function displayRange(today: Date): DateRange {
  const year = today.getFullYear();
  return { from: gregorianYear(year).from, to: gregorianYear(year + 1).to };
}
