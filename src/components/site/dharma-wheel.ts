// 法輪（ダルマチャクラ）の形。ヘッダーのロゴ（Base.astro）と、favicon・PWA のアイコン（scripts/icons.ts）で同じ形を使う。
// 行事のイラスト（EventIllustration.astro のアーサーラハ・ブーチャー）と同じく、外輪・8 本の輻・先端の飾りを
// 平らな金色で描き、中心（轂）だけ僧衣のサフラン色にする。小さく出すので、線はイラストより太くする。
// viewBox は 0 0 64 64。scale は中心からの縮尺（maskable アイコンの余白に使う）

export const wheelColors = {
  gold: '#D99A2B',
  saffron: '#E07B2B',
  cream: '#FFF3D6',
} as const;

const round = (n: number) => Number(n.toFixed(2));

/** 法輪の図形（<svg viewBox="0 0 64 64"> の中身） */
export function wheelShapes(scale = 1): string {
  const { gold, saffron, cream } = wheelColors;
  const c = 32;
  const at = (i: number, r: number) => {
    const a = (i * Math.PI) / 4;
    return [round(c + Math.cos(a) * r * scale), round(c + Math.sin(a) * r * scale)] as const;
  };
  const spokes = Array.from({ length: 8 }, (_, i) => `M${c} ${c}L${at(i, 19).join(' ')}`).join('');
  const knobs = Array.from({ length: 8 }, (_, i) => {
    const [x, y] = at(i, 25);
    return `<circle cx="${x}" cy="${y}" r="${round(3.5 * scale)}"/>`;
  }).join('');
  return [
    `<circle cx="${c}" cy="${c}" r="${round(19 * scale)}" fill="none" stroke="${gold}" stroke-width="${round(4 * scale)}"/>`,
    `<path d="${spokes}" stroke="${gold}" stroke-width="${round(3 * scale)}" stroke-linecap="round"/>`,
    `<g fill="${gold}">${knobs}</g>`,
    `<circle cx="${c}" cy="${c}" r="${round(7 * scale)}" fill="${saffron}"/>`,
    `<circle cx="${c}" cy="${c}" r="${round(2.5 * scale)}" fill="${cream}"/>`,
  ].join('');
}

/**
 * 背景つきの法輪。
 * - circle: 丸い淡い金色の地（ヘッダーのロゴ・favicon・通常のアイコン）
 * - square: 四角い地を全面に敷き、法輪を縮める（maskable・apple-touch-icon。端末が角を丸めたり切り抜いたりする）
 */
export function wheelIcon(background: 'circle' | 'square', scale = 1): string {
  const ground =
    background === 'circle'
      ? `<circle cx="32" cy="32" r="32" fill="${wheelColors.cream}"/>`
      : `<rect width="64" height="64" fill="${wheelColors.cream}"/>`;
  return ground + wheelShapes(scale);
}
