"""Eneia Estudio · recursos de identidad: paleta (JSON/CSS), patrones e iconografía (SVG).
Uso: python3 herramientas/recursos.py
"""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "MARCA/05_IDENTIDAD_VISUAL")

PALETA = [
    # id, nombre, hex, rol, uso
    ("noite", "Noite Atlántica", "#0E1A20", "Principal", "Fondos, texto, logotipo. El 60 % de cualquier pieza."),
    ("neboa", "Néboa", "#EEF0EB", "Principal claro", "Fondos claros y texto sobre oscuro. Sustituye al blanco puro."),
    ("rec", "Vermello REC", "#E4412B", "Acento", "Solo el punto REC y una llamada a la acción por pieza. Máx. 5 % de la superficie."),
    ("mar", "Mar de Fóra", "#2E5B60", "Secundario", "Bloques de apoyo, gráficos, fondos de sección."),
    ("pedra", "Pedra", "#8B908C", "Neutro medio", "Textos secundarios, líneas, metadatos de visor."),
    ("area", "Area", "#D3C6AE", "Cálido de apoyo", "Papelería, fondos cálidos, fotografía en interiores."),
    ("lousa", "Lousa", "#1E2C33", "Neutro oscuro", "Superficies sobre Noite (tarjetas, paneles web)."),
]

def rgb(h):
    h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def cmyk(h):
    """Conversión matemática RGB→CMYK (aproximación; validar con prueba de color FOGRA39)."""
    r, g, b = [v / 255 for v in rgb(h)]
    k = 1 - max(r, g, b)
    if k >= 1: return (0, 0, 0, 100)
    c, m, y = [(1 - v - k) / (1 - k) for v in (r, g, b)]
    return tuple(round(v * 100) for v in (c, m, y, k))

def lum(h):
    def ch(v):
        v /= 255; return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = rgb(h); return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)

def contrast(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True); return round((la + 0.05) / (lb + 0.05), 2)

def paleta():
    os.makedirs(os.path.join(OUT, "color"), exist_ok=True)
    data = []
    for i, n, h, rol, uso in PALETA:
        data.append({"id": i, "nombre": n, "hex": h, "rgb": rgb(h), "cmyk_aprox": cmyk(h), "rol": rol, "uso": uso,
                     "contraste_con_noite": contrast(h, "#0E1A20"), "contraste_con_neboa": contrast(h, "#EEF0EB"),
                     "pantone": "Pendiente de casar con guía física Pantone Formula Guide (ver manual)"})
    json.dump(data, open(os.path.join(OUT, "color/ENEIA_paleta_v1.json"), "w"), indent=1, ensure_ascii=False)
    css = ":root{\n" + "".join(f"  --eneia-{d['id']}: {d['hex']};\n" for d in data) + "}\n"
    open(os.path.join(OUT, "color/ENEIA_paleta_v1.css"), "w").write(css)
    # muestrario GIMP/Inkscape/Krita (.gpl)
    gpl = "GIMP Palette\nName: Eneia Estudio\nColumns: 7\n#\n" + "".join(f"{d['rgb'][0]:3d} {d['rgb'][1]:3d} {d['rgb'][2]:3d}\t{d['nombre']}\n" for d in data)
    open(os.path.join(OUT, "color/ENEIA_paleta_v1.gpl"), "w").write(gpl)
    return data

# ── patrones ────────────────────────────────────────────────────
def patrones():
    d = os.path.join(OUT, "patrones"); os.makedirs(d, exist_ok=True)
    # 1 · Pauta de encuadre: retícula de marcas de esquina (tile 80×80)
    def tile(ink, bg, name):
        s = f'''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><title>Pauta de encuadre</title>
<defs><pattern id="p" width="80" height="80" patternUnits="userSpaceOnUse">
<path d="M8 8h10v2H10v8H8z M72 8H62v2h8v8h2z M8 72h10v-2H10v-8H8z M72 72H62v-2h8v-8h2z" fill="{ink}"/></pattern></defs>
<rect width="800" height="800" fill="{bg}"/><rect width="800" height="800" fill="url(#p)"/></svg>'''
        open(os.path.join(d, name), "w").write(s)
    tile("#2A3A41", "#0E1A20", "ENEIA_patron-pauta-encuadre_oscuro_v1.svg")
    tile("#CDD1CB", "#EEF0EB", "ENEIA_patron-pauta-encuadre_claro_v1.svg")
    # 2 · Línea de tiempo: marcas de fotograma (24 por segundo) con segundo marcado
    ticks = "".join(f'<rect x="{x * 10}" y="{0 if x % 24 == 0 else (8 if x % 6 == 0 else 14)}" width="1.5" height="{24 if x % 24 == 0 else (16 if x % 6 == 0 else 10)}" fill="#8B908C"/>' for x in range(0, 192))
    s = f'<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="24" viewBox="0 0 1920 24"><title>Línea de tiempo</title>{ticks}<rect x="1200" y="0" width="2" height="24" fill="#E4412B"/></svg>'
    open(os.path.join(d, "ENEIA_patron-linea-de-tiempo_v1.svg"), "w").write(s)
    # 3 · Bandas de formato: 2,39:1 · 16:9 · 4:5 · 9:16 superpuestos (recurso compositivo)
    fr = [(2.39, "#2E5B60"), (16 / 9, "#8B908C"), (4 / 5, "#8B908C"), (9 / 16, "#8B908C")]
    H = 600; body = ""
    for r, c in fr:
        w = min(1600, H * r); h = w / r if w == 1600 else H
        x, y = (1600 - w) / 2, (H - h) / 2
        body += f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="none" stroke="{c}" stroke-width="1.5"/>'
    s = f'<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="600" viewBox="0 0 1600 600"><title>Formatos</title><rect width="1600" height="600" fill="#0E1A20"/>{body}<circle cx="800" cy="300" r="5" fill="#E4412B"/></svg>'
    open(os.path.join(d, "ENEIA_patron-formatos_v1.svg"), "w").write(s)

# ── iconografía (24 px, trazo 1,5, esquinas rectas, coherente con el encuadre) ──
ICONOS = {
    "video-corporativo": '<path d="M3 6h14v12H3z"/><path d="M17 10l4-2.5v9L17 14"/><circle cx="7" cy="10" r="1" fill="currentColor" stroke="none"/>',
    "publicidad": '<path d="M3 3h4M3 3v4M21 3h-4M21 3v4M3 21h4M3 21v-4M21 21h-4M21 21v-4"/><path d="M10 9l5 3-5 3z"/>',
    "documental-de-marca": '<path d="M9 3h6v9a3 3 0 0 1-6 0z"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M8 21h8"/>',
    "redes-verticales": '<path d="M7 2h10v20H7z"/><path d="M10 19h4"/><circle cx="12" cy="9" r="2.5"/>',
    "dron": '<path d="M9 10h6v4H9zM5 6l4 4M19 6l-4 4M5 18l4-4M19 18l-4-4"/><path d="M2 6h6M16 6h6M2 18h6M16 18h6"/>',
    "fotografia": '<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="3.5"/>',
    "guion": '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4M8 11h8M8 14h8M8 17h5"/>',
    "postproduccion": '<path d="M2 8h20M2 16h20"/><path d="M5 5v6M10 13v6M15 5v6M19 13v6"/><path d="M12 3v18" stroke="#E4412B"/>',
    "sonido": '<path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 10v4M21 12h0"/>',
    "entrega": '<path d="M4 4h16v12H4z"/><path d="M8 20h8M12 16v4"/><path d="M9 10l2 2 4-4"/>',
    "galicia-localizacion": '<path d="M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z"/><circle cx="12" cy="10" r="2" fill="#E4412B" stroke="none"/>',
    "contacto": '<path d="M3 5h18v14H3z"/><path d="M3 5l9 7 9-7"/>',
}

def iconos():
    d = os.path.join(OUT, "iconos"); os.makedirs(d, exist_ok=True)
    for n, body in ICONOS.items():
        s = (f'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
             f'stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" role="img" aria-label="{n}"><title>{n}</title>{body}</svg>\n')
        open(os.path.join(d, f"ENEIA_icono-{n}_v1.svg"), "w").write(s)
    json.dump(list(ICONOS), open(os.path.join(d, "indice.json"), "w"), ensure_ascii=False)

if __name__ == "__main__":
    data = paleta(); patrones(); iconos()
    for x in data: print(x["nombre"], x["hex"], x["rgb"], x["cmyk_aprox"], x["contraste_con_noite"], x["contraste_con_neboa"])
