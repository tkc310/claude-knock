"""ロゴと OGP バナーの共通部品。法輪は src/components/site/dharma-wheel.ts と同じ形・色"""
import math
D='/usr/share/fonts/opentype/noto/'
SANS_B=D+'NotoSansCJK-Bold.ttc'; SANS_M=D+'NotoSansCJK-Medium.ttc'; SANS_R=D+'NotoSansCJK-Regular.ttc'
SERIF=D+'NotoSerifCJK-SemiBold.ttc'
GOLD='#D99A2B'; SAFFRON='#E07B2B'; CREAM='#FFF3D6'; FG='#26282C'; SUB='#6A6D74'; DEEP='#3A2414'
NAME='タイ仏教行事カレンダー'

def wheel(cx,cy,size,ground='circle',ground_fill=CREAM,mono=None):
    """dharma-wheel.ts と同じ形（viewBox 64 を size に縮尺）"""
    k=size/64; c=32
    def at(i,r): a=i*math.pi/4; return (c+math.cos(a)*r, c+math.sin(a)*r)
    gold=mono or GOLD; saff=mono or SAFFRON
    spokes=''.join(f'M{c} {c}L{at(i,19)[0]:.2f} {at(i,19)[1]:.2f}' for i in range(8))
    knobs=''.join(f'<circle cx="{at(i,25)[0]:.2f}" cy="{at(i,25)[1]:.2f}" r="3.5"/>' for i in range(8))
    g=''
    if ground=='circle': g=f'<circle cx="32" cy="32" r="32" fill="{ground_fill}"/>'
    hub_hole = ground_fill if ground else CREAM
    return (f'<g transform="translate({cx-size/2:.2f} {cy-size/2:.2f}) scale({k:.4f})">{g}'
            f'<circle cx="32" cy="32" r="19" fill="none" stroke="{gold}" stroke-width="4"/>'
            f'<path d="{spokes}" stroke="{gold}" stroke-width="3" stroke-linecap="round"/>'
            f'<g fill="{gold}">{knobs}</g><circle cx="32" cy="32" r="7" fill="{saff}"/>'
            f'<circle cx="32" cy="32" r="2.5" fill="{hub_hole}"/></g>')

def svg(w,h,body,bg=None,title=NAME):
    b=f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{b}{body}</svg>')


PUBLIC = __import__('os').path.join(__import__('os').path.dirname(__file__), '../../public')

def render_png(svg_text, width, height, out, scale=1):
    """SVG を Chromium（Playwright）で PNG にする。背景は透過"""
    import asyncio
    from playwright.async_api import async_playwright
    async def run():
        async with async_playwright() as p:
            b = await p.chromium.launch()
            pg = await b.new_page(viewport={'width': width, 'height': height}, device_scale_factor=scale)
            await pg.set_content(f'<body style="margin:0;background:transparent">{svg_text}</body>')
            await pg.screenshot(path=out, omit_background=True, clip={'x': 0, 'y': 0, 'width': width, 'height': height})
            await b.close()
    asyncio.run(run())
