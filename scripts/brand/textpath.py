"""日本語テキストをアウトライン化した SVG パスにする（palt＝プロポーショナル詰めを適用）"""
from fontTools.ttLib import TTCollection
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import math
_cache={}
def load(path, index=0):
    k=(path,index)
    if k not in _cache:
        f=TTCollection(path).fonts[index]
        _cache[k]=(f, f.getGlyphSet(), f.getBestCmap(), palt_table(f), f['head'].unitsPerEm)
    return _cache[k]
def palt_table(font):
    adj={}
    if 'GPOS' not in font: return adj
    g=font['GPOS'].table
    idx=set()
    for fr in g.FeatureList.FeatureRecord:
        if fr.FeatureTag=='palt': idx.update(fr.Feature.LookupListIndex)
    for li in idx:
        lk=g.LookupList.Lookup[li]
        for st in lk.SubTable:
            if lk.LookupType==9: st=st.ExtSubTable
            if getattr(st,'Format',None) is None: continue
            cov=st.Coverage.glyphs
            if st.Format==1:
                v=st.Value
                for gn in cov: adj[gn]=(getattr(v,'XPlacement',0) or 0, getattr(v,'XAdvance',0) or 0)
            else:
                for gn,v in zip(cov,st.Value): adj[gn]=(getattr(v,'XPlacement',0) or 0, getattr(v,'XAdvance',0) or 0)
    return adj
def text_path(text, font, index=0, size=40, x=0, y=0, tracking=0, palt=True):
    """y はベースライン。tracking は em 比。戻り値 (d, width)"""
    f,gs,cmap,adj,upm=load(font,index)
    s=size/upm; ds=[]; cx=0.0
    hmtx=f['hmtx']
    for i,ch in enumerate(text):
        if ch==' ':
            cx+=size*0.3; continue
        gn=cmap[ord(ch)]
        adv=hmtx[gn][0]; xp,xa=(adj.get(gn,(0,0)) if palt else (0,0))
        pen=SVGPathPen(gs)
        tp=TransformPen(pen,(s,0,0,-s,x+(cx+xp)*1 if False else x+cx+xp*s,y))
        gs[gn].draw(tp)
        ds.append(pen.getCommands())
        cx+=(adv+xa)*s
        if i<len(text)-1: cx+=tracking*size
    return ' '.join(ds), cx
