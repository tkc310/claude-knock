// スリヤヤートラ（Suriyayatra）の暦法で、太陰年の年型を出す。整数演算だけを使う
// 式と閾値は pythaidate（https://pypi.org/project/pythaidate/）の LSYear に合わせた。
// 公式の日付で確かめたのは tests/fixtures/ の 2024〜2027 年だけ（ADR-0008）

/** common: 平年 354 日 / adhikavara: 閏日年 355 日 / adhikamasa: 閏月年 384 日 */
export type YearKind = 'common' | 'adhikavara' | 'adhikamasa';

/** 小暦（Chula Sakarat）の年の元日の値 */
function elements(cs: number) {
  const elapsed = cs * 292207 + 373;
  const horakhun = Math.floor(elapsed / 800) + 1;
  const kammacapon = 800 - (elapsed % 800);
  const quotient = Math.floor((horakhun * 11 + 650) / 692);
  const avoman = (horakhun * 11 + 650) % 692 || 692;
  const tithi = ((quotient + horakhun) % 30) - (avoman === 692 ? 1 : 0);
  return { kammacapon, avoman, tithi };
}

function hasLeapMonth(cs: number): boolean {
  const { tithi } = elements(cs);
  const next = elements(cs + 1).tithi;
  if (tithi === 24 && next === 6) return true;
  if (tithi === 25 && next === 5) return false;
  return tithi > 24 || tithi < 6;
}

function wantsLeapDay(cs: number): boolean {
  const { kammacapon, avoman } = elements(cs);
  // kammacapon が 207 以下なら、太陽年の閏年
  return kammacapon <= 207 ? avoman <= 126 : avoman <= 137;
}

/** buddhistYear は太陰年の番号（その年の เดือน 8 がある西暦年 + 543） */
export function yearKind(buddhistYear: number): YearKind {
  const cs = buddhistYear - 1181;
  if (hasLeapMonth(cs)) return 'adhikamasa';
  if (wantsLeapDay(cs)) return 'adhikavara';
  // 閏月と閏日は同じ年に置けないので、閏日を翌年に送る。送る向きは公式の日付で確かめていない
  if (wantsLeapDay(cs - 1) && hasLeapMonth(cs - 1)) return 'adhikavara';
  return 'common';
}
