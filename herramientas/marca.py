"""Eneia Estudio · generador del sistema de logotipos (vector puro, sin texto vivo).

Concepto definitivo «Encuadre REC»: el nombre, dibujado a medida, se compone dentro de
las marcas de encuadre del visor de cámara; el punto rojo de grabación indica que la
historia ya está rodando. El isotipo es el visor con el punto REC.

Uso:  python3 herramientas/marca.py
"""
import json, os
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from shapely.geometry import LineString, box
from shapely.ops import unary_union
from shapely.affinity import translate, scale as sscale

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "MARCA/05_IDENTIDAD_VISUAL/tipografias")
OUT = os.path.join(ROOT, "MARCA/04_LOGOTIPOS")

C = {
    "noite": "#0E1A20",   # Noite Atlántica · principal
    "neboa": "#EEF0EB",   # Néboa · neutro claro
    "rec":   "#E4412B",   # Vermello Corte · acento
    "mar":   "#2E5B60",   # Mar de Fóra · secundario
    "pedra": "#8B908C",   # Pedra · neutro medio
    "area":  "#D3C6AE",   # Area · cálido de apoyo
    "negro": "#000000", "blanco": "#FFFFFF",
}

H = 100.0  # altura de mayúscula (módulo de construcción)

def d_of(geom):
    polys = [geom] if geom.geom_type == "Polygon" else list(geom.geoms)
    out = []
    for p in polys:
        for ring in [p.exterior, *p.interiors]:
            pts = list(ring.coords)[:-1]
            out.append("M" + " L".join(f"{a:.2f} {b:.2f}" for a, b in pts) + " Z")
    return " ".join(out)

BAND = box(-1000, 0, 5000, H)
def stroke_line(pts, s):
    return LineString(pts).buffer(s / 2, cap_style="flat", join_style="mitre", mitre_limit=40)

# ── letras dibujadas (no tipográficas) ──────────────────────────
def L_E(s, w=54.0, mid=0.84, mirror=False):
    g = unary_union([box(0, 0, s, H), box(0, 0, w, s), box(0, (H - s) / 2, w * mid, (H + s) / 2), box(0, H - s, w, H)])
    if mirror:
        g = translate(sscale(g, -1, 1, origin=(0, 0)), w, 0)
    return g, w

def L_N(s, w=72.0):
    diag = stroke_line([(s / 2, -H), (s / 2, 0), (w - s / 2, H), (w - s / 2, 2 * H)], s)
    g = unary_union([box(0, 0, s, H), box(w - s, 0, w, H), diag]).intersection(box(0, 0, w, H))
    return g, w

def L_I(s):
    return box(0, 0, s, H), s

def L_A(s, w=80.0, bar_y=64.0):
    k = 0.8
    legs = stroke_line([(-w / 2 * k, H * (1 + k)), (w / 2, 0), (w + w / 2 * k, H * (1 + k))], s)
    g = legs.intersection(BAND)
    g = translate(g, -g.bounds[0], 0); W = g.bounds[2]
    bar = box(0, bar_y, W, bar_y + s * 0.92).intersection(g.convex_hull)
    return unary_union([g, bar]), W

# ── logotipo ENEIA ──────────────────────────────────────────────
WM_S = 10.5        # grosor del trazo del logotipo
WM_GAP = 30.0      # interletraje (espaciado de títulos de crédito)

def wordmark(x=0.0, y=0.0, cap=H):
    """Devuelve (d_tinta, d_corte, ancho) del logotipo a la altura de mayúscula `cap`."""
    s = WM_S
    parts = [L_E(s), L_N(s), L_E(s), L_I(s), L_A(s)]
    ink, cut, cx = [], None, 0.0
    for i, (g, w) in enumerate(parts):
        gg = translate(g, cx, 0)
        if i == 3:
            cut = gg
        else:
            ink.append(gg)
        cx += w + (WM_GAP if i < 4 else 0)
    k = cap / H
    ink = translate(sscale(unary_union(ink), k, k, origin=(0, 0)), x, y)
    cut = translate(sscale(cut, k, k, origin=(0, 0)), x, y)
    return d_of(ink), d_of(cut), cx * k

# ── isotipo «Plano / Contraplano» ───────────────────────────────
def emblem(small=False):
    """E · I · Ǝ. Devuelve (d_tinta, d_corte, ancho)."""
    s = 13.0 if not small else 19.0
    w = 48.0 if not small else 44.0
    gap = 14.0 if not small else 12.0
    e1, _ = L_E(s, w=w, mid=0.62)
    i, _ = L_I(s)
    e2, _ = L_E(s, w=w, mid=0.62, mirror=True)
    i = translate(i, w + gap, 0)
    e2 = translate(e2, w + gap + s + gap, 0)
    return d_of(unary_union([e1, e2])), d_of(i), 2 * w + 2 * gap + s

# ── descriptor (texto convertido a trazado) ─────────────────────
_cache = {}
def _font(name):
    if name not in _cache:
        p = os.path.join(FONTS, name)
        _cache[name] = (TTFont(p), hb.Font(hb.Face(hb.Blob.from_file_path(p))))
    return _cache[name]

def text_path(fontname, text, cap, tracking=0.0, x=0.0, base=0.0):
    tt, f = _font(fontname)
    upm = tt["head"].unitsPerEm
    size = cap / (tt["OS/2"].sCapHeight / upm)
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(f, buf, {"kern": True})
    gs = tt.getGlyphSet(); order = tt.getGlyphOrder()
    k = size / upm; px = 0.0; ds = []; n = len(buf.glyph_infos)
    for i, (inf, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        pen = SVGPathPen(gs)
        gs[order[inf.codepoint]].draw(TransformPen(pen, (k, 0, 0, -k, x + px + pos.x_offset * k, base)))
        ds.append(pen.getCommands())
        px += pos.x_advance * k + (tracking * size if i < n - 1 else 0)
    return " ".join(d for d in ds if d), px, size

DESC_FONT = "InstrumentSans-Medium.ttf"
DESC = "ESTUDIO AUDIOVISUAL"

def descriptor_fit(width, cap, x, base):
    _, w0, size = text_path(DESC_FONT, DESC, cap, 0.0)
    tr = (width - w0) / ((len(DESC) - 1) * size)
    return text_path(DESC_FONT, DESC, cap, tr, x, base)[0]

# ── composición ─────────────────────────────────────────────────
def svg(w, h, body, bg=None, title="Eneia Estudio"):
    rect = f'<rect width="{w:.2f}" height="{h:.2f}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" width="{w:.0f}" height="{h:.0f}" '
            f'role="img" aria-label="{title}"><title>{title}</title>{rect}{body}</svg>\n')

def P(d, fill, tx=0, ty=0, k=1.0):
    t = f' transform="translate({tx:.2f} {ty:.2f}) scale({k:.4f})"' if (tx or ty or k != 1) else ""
    return f'<path d="{d}" fill="{fill}"{t}/>'

def corners(x, y, w, h, L, t):
    g = []
    for cx, cy, sx, sy in [(x, y, 1, 1), (x + w, y, -1, 1), (x, y + h, 1, -1), (x + w, y + h, -1, -1)]:
        g.append(box(min(cx, cx + sx * L), min(cy, cy + sy * t), max(cx, cx + sx * L), max(cy, cy + sy * t)))
        g.append(box(min(cx, cx + sx * t), min(cy, cy + sy * L), max(cx, cx + sx * t), max(cy, cy + sy * L)))
    return d_of(unary_union(g))

def word(x, y, cap):
    wi, wc, ww = wordmark(x, y, cap)
    return wi + " " + wc, ww

DOT = 0.085      # radio del punto REC respecto a la altura de mayúscula
FT, FL = 5.0, 34.0  # grosor y brazo de las marcas de encuadre (para cap = 100)

def lockup(ink, dot, x0, y0, cap=100.0, frame=True, visor=False, show_dot=True):
    """Logotipo ENEIA + punto REC + descriptor, opcionalmente dentro del encuadre. Devuelve (body, w, h)."""
    k = cap / 100.0
    padx, pady = (74 * k, (70 if visor else 52) * k) if frame else (0, 0)
    _, ww = word(0, 0, cap)
    dr = cap * DOT
    gap_desc = 48 * k
    W = ww + 2 * padx + (0 if (frame or not show_dot) else dr * 2.6)
    Hh = cap + gap_desc + 2 * pady
    body = ""
    if frame:
        body += P(corners(x0, y0, W, Hh, FL * k, FT * k), ink)
    wd, ww = word(x0 + padx, y0 + pady, cap)
    body += P(wd, ink)
    if not visor and show_dot:
        body += f'<circle cx="{x0 + padx + ww + dr * 1.6:.2f}" cy="{y0 + pady + dr:.2f}" r="{dr:.2f}" fill="{dot}"/>'
    body += P(descriptor_fit(ww, cap * 0.13, x0 + padx, y0 + pady + cap + gap_desc), ink)
    if visor:
        c = 11 * k; ins = 22 * k; top = y0 + ins + 16 * k; bot = y0 + Hh - ins - 4 * k
        lab = lambda t, x, b: text_path(DESC_FONT, t, c, 0.12, x, b)
        body += f'<circle cx="{x0 + ins + 5.5 * k:.2f}" cy="{top - c / 2:.2f}" r="{5.5 * k:.2f}" fill="{dot}"/>'
        body += P(lab("REC", x0 + ins + 17 * k, top)[0], ink)
        w2 = lab("4K · 25P", 0, 0)[1]; body += P(lab("4K · 25P", x0 + W - ins - w2, top)[0], ink)
        body += P(lab("GALICIA", x0 + ins, bot)[0], ink)
        w4 = lab("00:00:00:01", 0, 0)[1]; body += P(lab("00:00:00:01", x0 + W - ins - w4, bot)[0], ink)
    return body, W, Hh

def iso(ink, dot, x0, y0, s=100.0, small=False):
    t = s * (0.07 if not small else 0.10); L = s * (0.30 if not small else 0.34)
    r = s * (0.15 if not small else 0.19)
    return P(corners(x0, y0, s, s, L, t), ink) + f'<circle cx="{x0 + s / 2:.2f}" cy="{y0 + s / 2:.2f}" r="{r:.2f}" fill="{dot}"/>'

def build(ink, dot, bg=None):
    out = {}
    m = 24.0  # margen exterior del archivo
    b, W, Hh = lockup(ink, dot, m, m)
    out["principal"] = svg(W + 2 * m, Hh + 2 * m, b, bg)
    b, W, Hh = lockup(ink, dot, m, m, visor=True)
    out["visor"] = svg(W + 2 * m, Hh + 2 * m, b, bg)
    b, W, Hh = lockup(ink, dot, m, m, frame=False)
    out["secundario"] = svg(W + 2 * m, Hh + 2 * m, b, bg)
    out["isotipo"] = svg(100 + 2 * m, 100 + 2 * m, iso(ink, dot, m, m), bg)
    out["icono-reducido"] = svg(100 + 2 * 12, 100 + 2 * 12, iso(ink, dot, 12, 12, small=True), bg)
    # imagotipo horizontal: isotipo + logotipo con descriptor (un solo punto rojo: el del isotipo)
    cap = 52.0; s = 100.0
    bl, wl, hl = lockup(ink, dot, 0, 0, cap=cap, frame=False, show_dot=False)
    gx = m + s + 44
    bl, wl, hl = lockup(ink, dot, gx, m + (s - hl) / 2, cap=cap, frame=False, show_dot=False)
    out["horizontal"] = svg(gx + wl + m, s + 2 * m, iso(ink, dot, m, m) + bl, bg)
    # imagotipo vertical
    cap = 44.0
    _, wl, hl = lockup(ink, dot, 0, 0, cap=cap, frame=False, show_dot=False)
    Wt = max(s, wl) + 2 * m
    bl, _, _ = lockup(ink, dot, (Wt - wl) / 2, m + s + 40, cap=cap, frame=False, show_dot=False)
    out["vertical"] = svg(Wt, m + s + 40 + hl + m, iso(ink, dot, (Wt - s) / 2, m) + bl, bg)
    return out

VARIANTES = {
    "color-fondo-claro":  (C["noite"], C["rec"], None),
    "color-fondo-oscuro": (C["neboa"], C["rec"], None),
    "positivo":           (C["noite"], C["noite"], None),
    "negativo":           (C["neboa"], C["neboa"], None),
    "mono-negro":         (C["negro"], C["negro"], None),
    "mono-blanco":        (C["blanco"], C["blanco"], None),
}

def avatar():
    side = 1080.0; s = 560.0
    return svg(side, side, iso(C["neboa"], C["rec"], (side - s) / 2, (side - s) / 2, s), C["noite"])

def favicon():
    side = 200.0; s = 136.0
    return svg(side, side, f'<rect width="200" height="200" rx="36" fill="{C["noite"]}"/>' + iso(C["neboa"], C["rec"], (side - s) / 2, (side - s) / 2, s, small=True))

def main():
    manifest = []
    for var, (ink, dot, bg) in VARIANTES.items():
        for name, sv in build(ink, dot, bg).items():
            fn = f"ENEIA_{name}_{var}_v1.svg"
            os.makedirs(os.path.join(OUT, "svg", name), exist_ok=True)
            open(os.path.join(OUT, "svg", name, fn), "w").write(sv)
            manifest.append({"pieza": name, "variante": var, "svg": f"svg/{name}/{fn}",
                             "oscuro": var in ("color-fondo-oscuro", "negativo", "mono-blanco")})
    os.makedirs(os.path.join(OUT, "svg", "redes"), exist_ok=True)
    for fn, sv in [("ENEIA_avatar-redes_v1.svg", avatar()), ("ENEIA_favicon_v1.svg", favicon())]:
        open(os.path.join(OUT, "svg", "redes", fn), "w").write(sv)
        manifest.append({"pieza": "redes", "variante": fn.split("_")[1], "svg": f"svg/redes/{fn}", "oscuro": False})
    json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w"), indent=1, ensure_ascii=False)
    print(len(manifest), "SVG")

def componentes():
    """Piezas separadas del logotipo principal (para animación y web)."""
    m = 24.0; cap = 100.0; padx, pady = 74.0, 52.0
    _, ww = word(0, 0, cap)
    W = ww + 2 * padx; Hh = cap + 48 + 2 * pady
    letras, cx = [], m + padx
    for i, (g, w) in enumerate([L_E(WM_S), L_N(WM_S), L_E(WM_S), L_I(WM_S), L_A(WM_S)]):
        letras.append(d_of(translate(g, cx, m + pady))); cx += w + (WM_GAP if i < 4 else 0)
    dr = cap * DOT
    data = {"w": W + 2 * m, "h": Hh + 2 * m,
            "esquinas": [d_of(g) for g in []] or corners(m, m, W, Hh, FL, FT),
            "letras": letras,
            "punto": {"cx": m + padx + ww + dr * 1.6, "cy": m + pady + dr, "r": dr},
            "descriptor": descriptor_fit(ww, cap * 0.13, m + padx, m + pady + cap + 48),
            "marco": {"x": m, "y": m, "w": W, "h": Hh, "brazo": FL, "grosor": FT}}
    json.dump(data, open(os.path.join(OUT, "componentes.json"), "w"))

if __name__ == "__main__":
    main()
    componentes()
