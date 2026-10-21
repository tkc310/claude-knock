"""OGP バナー（1200x630）を public/og.png に書き出す。実行: python3 scripts/brand/og.py（make brand）"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from textpath import text_path
from brand import wheel, render_png, PUBLIC, SANS_B, SANS_M, SANS_R, GOLD, SAFFRON, CREAM, FG, SUB
W,H=1200,630
BG='#FFFBF2'
parts=[f'<rect width="{W}" height="{H}" fill="{BG}"/>']
# 右の大きな法輪（透かし）。一部を画面外に逃がす
parts.append(f'<g opacity="0.13">{wheel(1035,300,560,ground=None,ground_fill=BG)}</g>')
# 上下の金の帯
parts.append(f'<rect width="{W}" height="10" fill="{GOLD}"/><rect y="{H-10}" width="{W}" height="10" fill="{GOLD}"/>')
X=80
# ロゴ A（法輪＋サイト名）
parts.append(wheel(X+48,150,96))
d,tw=text_path('タイ仏教行事カレンダー',SANS_B,0,size=60,x=X+120,y=172,tracking=0.02)
parts.append(f'<path d="{d}" fill="{FG}"/>')
# 見出し
d,_=text_path('タイの仏教行事の日付と意味を、日本語で。',SANS_B,0,size=40,x=X,y=290,tracking=0.02)
parts.append(f'<path d="{d}" fill="{FG}"/>')
d,_=text_path('タイの太陰暦から計算し、公式発表と照らし合わせています。',SANS_R,0,size=27,x=X,y=346)
parts.append(f'<path d="{d}" fill="{SUB}"/>')
# 行事のチップ
names=['ワンプラ','マーカ・ブーチャー','ウィサーカ・ブーチャー','カオパンサー','オークパンサー','ロイクラトン']
cx,cy=X,410; row_h=54; maxw=W-80
for n in names:
    _,w=text_path(n,SANS_M,0,size=24)
    cw=w+40
    if cx+cw>maxw: cx=X; cy+=row_h+12
    parts.append(f'<rect x="{cx}" y="{cy}" width="{cw:.1f}" height="{row_h}" rx="27" fill="{CREAM}" stroke="{GOLD}" stroke-width="2"/>')
    d,_=text_path(n,SANS_M,0,size=24,x=cx+20,y=cy+36)
    parts.append(f'<path d="{d}" fill="#7A4E12"/>')
    cx+=cw+12
# 右下: ICS
d,w=text_path('カレンダーアプリに取り込めます（ICS）',SANS_M,0,size=24)
d,_=text_path('カレンダーアプリに取り込めます（ICS）',SANS_M,0,size=24,x=W-80-w,y=H-52)
parts.append(f'<path d="{d}" fill="{SAFFRON}"/>')
svg_text=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="タイ仏教行事カレンダー"><title>タイ仏教行事カレンダー</title>{"".join(parts)}</svg>'
render_png(svg_text, W, H, os.path.join(PUBLIC, 'og.png'))
