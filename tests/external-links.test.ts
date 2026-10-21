import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { describe, expect, it } from 'vite-plus/test';
import { externalLinks } from '../src/markdown/external-links';

const renderer = await createSatteriMarkdownProcessor({ hastPlugins: [externalLinks] });
const render = async (md: string) => (await renderer.render(md)).code;

describe('externalLinks', () => {
  it.each([
    ['裸の URL', 'https://suttacentral.net/pli-tv-kd4', 'https://suttacentral.net/pli-tv-kd4'],
    ['リンク記法', '[出典](http://example.com/)', 'http://example.com/'],
  ])('%s の外部リンクは新しいタブで開き、そのことを読み上げる', async (_, md, href) => {
    const html = await render(md);
    expect(html).toContain(`<a href="${href}" target="_blank" rel="noopener noreferrer">`);
    expect(html).toContain('<span class="sr-only">（新しいタブで開きます）</span></a>');
  });

  it.each(['/', '/events/wan-phra/', '#dates'])('サイト内のリンク %s はそのまま', async (href) => {
    expect(await render(`[内部](${href})`)).toContain(`<a href="${href}">内部</a>`);
  });
});
