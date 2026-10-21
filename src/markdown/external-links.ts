// 本文（src/content/events/）の外部リンクを新しいタブで開く Sätteri の hast プラグイン。astro.config.mjs で使う
import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';

type HastPlugin = NonNullable<SatteriProcessorOptions['hastPlugins']>[number];

export const externalLinks = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      if (!/^https?:\/\//.test(String(node.properties?.href))) return;
      ctx.setProperty(node, 'target', '_blank');
      ctx.setProperty(node, 'rel', ['noopener', 'noreferrer']);
      // 新しいタブで開くことを、見た目に出さず読み上げで伝える
      ctx.appendChild(node, {
        type: 'element',
        tagName: 'span',
        properties: { className: ['sr-only'] },
        children: [{ type: 'text', value: '（新しいタブで開きます）' }],
      });
    },
  },
} satisfies HastPlugin;
