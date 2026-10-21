"""ロゴ（A 案: 法輪＋横組みのサイト名）を public/logo.svg と public/logo.png（3 倍）に書き出す。
文字は Noto Sans CJK JP Bold をアウトライン化するので、表示側に書体が無くても崩れない。
実行: python3 scripts/brand/logo.py（fontTools・playwright と Noto Sans CJK が要る。make brand）"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from textpath import text_path
from brand import wheel, svg, render_png, SANS_B, FG, NAME, PUBLIC

# 文字の上下の中央（字面）を、法輪の中心（y=40）にそろえる
d, tw = text_path(NAME, SANS_B, 0, size=36, x=84, y=54, tracking=0.02)
W, H = round(84 + tw + 8), 80
out = svg(W, H, wheel(36, 40, 64) + f'<path d="{d}" fill="{FG}"/>')
open(os.path.join(PUBLIC, 'logo.svg'), 'w').write(out + '\n')
render_png(out, W, H, os.path.join(PUBLIC, 'logo.png'), scale=3)
