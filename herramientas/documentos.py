"""Eneia Estudio · genera el HTML del manual corporativo, la presentación y los documentos (MD → HTML).
Después: node herramientas/pdf.js   (convierte cada HTML a PDF).
"""
import json, os, re, markdown

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = os.path.join(ROOT, "MARCA")
B = os.path.join(ROOT, "herramientas/.build"); os.makedirs(B, exist_ok=True)
F = os.path.join(M, "05_IDENTIDAD_VISUAL/tipografias")
U = lambda p: "file://" + os.path.join(M, p)

def svg(p, w=None):
    s = open(os.path.join(M, "04_LOGOTIPOS/svg", p)).read()
    s = re.sub(r' width="[\d.]+" height="[\d.]+"', "", s, count=1)
    return s if not w else s.replace("<svg ", f'<svg style="width:{w}" ', 1)

PAL = json.load(open(os.path.join(M, "05_IDENTIDAD_VISUAL/color/ENEIA_paleta_v1.json")))
COMP = json.load(open(os.path.join(M, "04_LOGOTIPOS/componentes.json")))

BASE_CSS = f"""
@font-face{{font-family:IS;src:url(file://{F}/InstrumentSans-Variable.ttf)}}
@font-face{{font-family:ISe;src:url(file://{F}/InstrumentSerif-Regular.ttf)}}
@font-face{{font-family:ISi;src:url(file://{F}/InstrumentSerif-Italic.ttf)}}
*{{box-sizing:border-box}} html,body{{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
body{{font:400 10.5pt/1.55 IS;color:#0E1A20}}
.eb{{font:600 7.5pt IS;letter-spacing:.24em;text-transform:uppercase;color:#2E5B60}}
.d .eb{{color:#8B908C}}
h1,h2{{font-family:ISe;font-weight:400;letter-spacing:-.01em;margin:0}}
.mono{{font:500 7pt IS;letter-spacing:.16em;text-transform:uppercase}}
svg{{display:block}}
"""

# ═════════════════════════ MANUAL (A4 apaisado) ═════════════════════════
def page(n, title, body, dark=False, sec=""):
    bg = "#0E1A20" if dark else "#EEF0EB"; fg = "#EEF0EB" if dark else "#0E1A20"
    return f"""<section class="pg{' d' if dark else ''}" style="background:{bg};color:{fg}">
<div class="hd mono"><span>Eneia Estudio · Manual de identidad v1</span><span>{sec}</span></div>
{f'<h2 class="pt">{title}</h2>' if title else ''}<div class="bd">{body}</div>
<div class="ft mono"><span>{n:02d}</span></div></section>"""

def sw(c, big=False):
    fg = "#EEF0EB" if c["contraste_con_noite"] < 4.5 else "#0E1A20"
    r, g, b = c["rgb"]; cc = c["cmyk_aprox"]
    return f"""<div class="sw{' big' if big else ''}" style="background:{c['hex']};color:{fg}">
<div class="swn">{c['nombre']}</div><div class="mono swr">{c['rol']}</div>
<div class="swv mono">HEX {c['hex']}<br>RGB {r} · {g} · {b}<br>CMYK* {cc[0]} · {cc[1]} · {cc[2]} · {cc[3]}</div></div>"""

def construction():
    W, H = COMP["w"], COMP["h"]; fr = COMP["marco"]; x0, y0 = fr["x"], fr["y"]
    pad_x, pad_y = 74, 52; capy = y0 + pad_y
    s = [f'<svg viewBox="-60 -40 {W + 120} {H + 90}" style="width:100%">',
         '<defs><pattern id="gr" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#c9cdc6" stroke-width=".4"/></pattern></defs>',
         f'<rect x="-60" y="-40" width="{W + 120}" height="{H + 90}" fill="url(#gr)"/>',
         f'<path d="{COMP["esquinas"]}" fill="#0E1A20"/>' + "".join(f'<path d="{d}" fill="#0E1A20"/>' for d in COMP["letras"]),
         f'<circle cx="{COMP["punto"]["cx"]}" cy="{COMP["punto"]["cy"]}" r="{COMP["punto"]["r"]}" fill="#E4412B"/><path d="{COMP["descriptor"]}" fill="#0E1A20"/>']
    st = 'stroke="#E4412B" stroke-width=".8" fill="none"'
    tx = lambda x, y, t, a="middle": f'<text x="{x}" y="{y}" font-family="IS" font-size="9" fill="#E4412B" text-anchor="{a}">{t}</text>'
    # líneas de altura de mayúscula
    s += [f'<line x1="-40" y1="{capy}" x2="{W + 40}" y2="{capy}" {st} stroke-dasharray="3 3"/>',
          f'<line x1="-40" y1="{capy + 100}" x2="{W + 40}" y2="{capy + 100}" {st} stroke-dasharray="3 3"/>',
          tx(-44, capy + 54, "x", "end"),
          f'<line x1="{x0}" y1="{y0 - 18}" x2="{x0 + pad_x}" y2="{y0 - 18}" {st}/>', tx(x0 + pad_x / 2, y0 - 22, "0,74 x"),
          f'<line x1="{x0 - 18}" y1="{y0}" x2="{x0 - 18}" y2="{y0 + pad_y}" {st}/>', tx(x0 - 22, y0 + pad_y / 2 + 3, "0,52 x", "end"),
          f'<line x1="{x0}" y1="{y0 + fr["h"] + 16}" x2="{x0 + fr["brazo"]}" y2="{y0 + fr["h"] + 16}" {st}/>', tx(x0 + 17, y0 + fr["h"] + 30, "brazo 0,34 x"),
          tx(COMP["punto"]["cx"] + 16, COMP["punto"]["cy"] - 12, "punto Ø 0,17 x", "start"),
          f'<line x1="{x0 + pad_x}" y1="{capy + 100 + 4}" x2="{x0 + pad_x}" y2="{capy + 148}" {st}/>', tx(x0 + pad_x + 6, capy + 128, "0,48 x", "start"),
          tx(x0 + fr["w"] - 4, y0 + fr["h"] + 30, "grosor marco 0,05 x · descriptor 0,13 x", "end"),
          "</svg>"]
    return "".join(s)

def manual():
    cl = lambda p, w=None: svg(p, w)
    P = []
    P.append(f"""<section class="pg cover d" style="background:#0E1A20;color:#EEF0EB">
<div style="position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:118mm">{cl('principal/ENEIA_principal_color-fondo-oscuro_v1.svg')}</div>
<div style="position:absolute;left:18mm;bottom:16mm" class="mono">Manual de identidad corporativa · versión 1 · noviembre 2026</div>
<div style="position:absolute;right:18mm;bottom:15mm;font:400 15pt ISi">Mirada de cine. Oficio de empresa.</div></section>""")
    idx = ["La marca", "Filosofía", "Concepto creativo", "Logotipo principal", "Construcción", "Área de seguridad y tamaños mínimos",
           "Sistema de versiones", "Versiones cromáticas", "Usos incorrectos", "Paleta cromática", "Uso del color", "Tipografía",
           "Recursos gráficos", "Iconografía", "Estilo fotográfico", "Identidad audiovisual", "Comunicación verbal", "Aplicaciones", "Archivos"]
    P.append(page(2, "Índice", '<ol class="idx">' + "".join(f"<li><span>{t}</span><b>{(i + 3 if t != 'Archivos' else 20 + (len([f for f in os.listdir(os.path.join(M, '07_MOCKUPS')) if f.endswith('.png')]) + 3) // 4):02d}</b></li>" for i, t in enumerate(idx)) + "</ol>"))
    P.append(page(3, "La marca", """<div class="c2"><div><p class="lead">Eneia Estudio es un estudio audiovisual de Galicia especializado en vídeo corporativo y publicidad. Dos socias, dos miradas y un método: aplicar la verdad del cine documental a la comunicación de empresa.</p></div>
<div><p><b>El nombre.</b> Eneia es como suena «N y A»: las iniciales de las fundadoras convertidas en palabra. Evoca además la <i>Eneida</i>, el gran relato de viaje de la tradición clásica.</p>
<p><b>La idea.</b> Antes de grabar, una cámara encuadra y se enciende el punto rojo. Ese instante —escuchar, encuadrar, empezar a contar— es la marca.</p>
<p><b>El lema.</b> <i>Mirada de cine. Oficio de empresa.</i> Se escribe igual en castellano y en gallego.</p></div></div>""", sec="01 · Marca"))
    vals = [("Verdad", "Filmamos lo que hay, no lo que queda bien."), ("Oficio", "Respetamos el del cliente y el nuestro."), ("Claridad", "Precios, plazos y entregables explícitos."),
            ("Durabilidad", "Cada pieza debe servir durante años."), ("Dos miradas", "Una dirige la historia; la otra, la imagen.")]
    P.append(page(4, "Filosofía", f"""<div class="c3"><div><div class="eb">Propósito</div><p>Que las empresas gallegas con oficio se vean —y se cuenten— tan bien como trabajan.</p>
<div class="eb">Misión</div><p>Producir vídeo corporativo y publicidad con la mirada y el rigor del cine documental: historias reales, bien filmadas, pensadas para durar.</p>
<div class="eb">Visión</div><p>Ser en cinco años el estudio de referencia en Galicia para vídeo de empresa con criterio de autor.</p></div>
<div class="span2"><div class="eb">Valores</div><div class="vals">{''.join(f'<div><h3>{a}</h3><p>{b}</p></div>' for a, b in vals)}</div>
<div class="eb" style="margin-top:7mm">Personalidad · arquetipo</div><p>Serena, precisa, cálida y exigente. Arquetipo principal <b>Creador</b>; secundario <b>Sabio</b>.</p></div></div>""", sec="01 · Marca"))
    P.append(page(5, "Concepto creativo · Encuadre REC", f"""<div class="c2"><div><p class="lead">El nombre se compone dentro de las marcas de encuadre del visor de cámara. Un único punto rojo —REC— indica que la historia ya está rodando.</p>
<p>Las letras están dibujadas a medida sobre una retícula geométrica de trazo uniforme: rectas, sin remates, con interletraje amplio de títulos de crédito. El descriptor <span class="mono">Estudio audiovisual</span> vive dentro del encuadre: lo que hacemos forma parte del plano.</p>
<p class="small">Se exploraron tres conceptos (Plano/Contraplano, Cabezal de autor y Encuadre REC). La propiedad eligió Encuadre REC con el descriptor dentro del encuadre.</p></div>
<div><img src="{U('04_LOGOTIPOS/conceptos/ENEIA_conceptos-logotipo_v1.png')}" style="width:100%"></div></div>""", sec="02 · Logotipo"))
    P.append(page(6, "", f"""<div style="display:grid;place-items:center;height:150mm"><div style="width:190mm">{cl('principal/ENEIA_principal_color-fondo-claro_v1.svg')}</div></div>
<p class="cap">Logotipo principal · versión preferente sobre Néboa</p>""", sec="02 · Logotipo"))
    P.append(page(7, "Construcción", f"""<div class="c2" style="grid-template-columns:2fr 1fr"><div>{construction()}</div>
<div><p>Toda la construcción se expresa en función de <b>x</b>, la altura de las mayúsculas.</p><ul class="ls"><li>Trazo de las letras: 0,105 x</li><li>Interletraje: 0,30 x</li><li>Marco: margen horizontal 0,74 x, vertical 0,52 x</li><li>Brazos del marco: 0,34 x · grosor 0,05 x</li><li>Punto REC: Ø 0,17 x, centrado en la línea de mayúsculas, a 0,07 x de la A</li><li>Descriptor: altura 0,13 x, separado 0,48 x de la línea base, justificado al ancho exacto de ENEIA</li></ul>
<p class="small">Los archivos maestros se generan por código (herramientas/marca.py): cualquier versión es matemáticamente idéntica.</p></div></div>""", sec="02 · Logotipo"))
    P.append(page(8, "Área de seguridad y tamaños mínimos", f"""<div class="c2"><div><div style="position:relative;padding:14mm;border:1px dashed #E4412B;display:inline-block;background:#fff">{cl('principal/ENEIA_principal_color-fondo-claro_v1.svg', '120mm')}<span class="mono" style="position:absolute;left:3mm;top:3mm;color:#E4412B">x/2</span></div>
<p>Alrededor del marco se respeta un espacio libre de <b>media x</b> (la mitad de la altura de ENEIA). Ningún texto, imagen o borde puede invadirlo.</p></div>
<div><table class="tb"><tr><th>Versión</th><th>Impresión</th><th>Pantalla</th></tr>
<tr><td>Principal (con encuadre)</td><td>35 mm de ancho</td><td>160 px</td></tr><tr><td>Secundario (sin encuadre)</td><td>22 mm</td><td>96 px</td></tr>
<tr><td>Horizontal</td><td>30 mm</td><td>130 px</td></tr><tr><td>Isotipo</td><td>8 mm</td><td>32 px</td></tr><tr><td>Icono reducido / favicon</td><td>—</td><td>16–31 px</td></tr></table>
<p class="small">Por debajo del mínimo de la versión principal, usar la secundaria; por debajo de 32 px, el icono reducido (marco y punto engrosados).</p></div></div>""", sec="02 · Logotipo"))
    vers = [("principal", "Principal · con encuadre y descriptor"), ("secundario", "Secundario · sin encuadre"), ("horizontal", "Imagotipo horizontal"),
            ("vertical", "Imagotipo vertical"), ("isotipo", "Isotipo · visor + REC"), ("visor", "Visor · solo vídeo, redes y making of")]
    P.append(page(9, "Sistema de versiones", '<div class="g3">' + "".join(f'<figure><div class="lg">{cl(f"{k}/ENEIA_{k}_color-fondo-claro_v1.svg")}</div><figcaption>{t}</figcaption></figure>' for k, t in vers[:5]) +
                  f'<figure><div class="lg" style="background:#0E1A20">{cl("visor/ENEIA_visor_color-fondo-oscuro_v1.svg")}</div><figcaption>{vers[5][1]}</figcaption></figure></div>', sec="02 · Logotipo"))
    cv = [("color-fondo-claro", "#EEF0EB", "Color · fondos claros"), ("color-fondo-oscuro", "#0E1A20", "Color · fondos oscuros"), ("positivo", "#FFFFFF", "Positivo · una tinta"),
          ("negativo", "#2E5B60", "Negativo · sobre color"), ("mono-negro", "#FFFFFF", "Monocromo negro"), ("mono-blanco", "#000000", "Monocromo blanco")]
    P.append(page(10, "Versiones cromáticas", '<div class="g3">' + "".join(f'<figure><div class="lg" style="background:{bg}">{cl(f"principal/ENEIA_principal_{k}_v1.svg")}</div><figcaption>{t}</figcaption></figure>' for k, bg, t in cv) + "</div>", sec="02 · Logotipo"))
    base = cl('principal/ENEIA_principal_color-fondo-claro_v1.svg')
    bad = [("transform:scaleX(1.35)", "", "No deformar"), ("transform:rotate(-12deg)", "", "No girar"), ("filter:drop-shadow(4px 6px 3px rgba(0,0,0,.5))", "", "No añadir sombras ni efectos"),
           ("filter:hue-rotate(160deg) saturate(2)", "", "No cambiar los colores"), ("", "background:linear-gradient(90deg,#E4412B,#D3C6AE,#2E5B60)", "No usar sobre fondos sin contraste"), ("", "", "No destacar «NIA» ni separar letras")]
    cells = []
    for i, (tf, bg, t) in enumerate(bad):
        inner = base if i < 5 else base.replace('fill="#0E1A20"', 'fill="#0E1A20"', 1)
        if i == 5:
            # simulación: letras N, I, A en rojo
            ls = COMP["letras"]
            inner = f'<svg viewBox="0 0 {COMP["w"]} {COMP["h"]}"><path d="{COMP["esquinas"]}" fill="#0E1A20"/>' + "".join(
                f'<path d="{d}" fill="{"#E4412B" if j in (1, 3, 4) else "#B9BDB8"}"/>' for j, d in enumerate(ls)) + f'<path d="{COMP["descriptor"]}" fill="#0E1A20"/></svg>'
        cells.append(f'<figure><div class="lg bad" style="{bg}"><div style="{tf}">{inner}</div><i></i></div><figcaption>✕ {t}</figcaption></figure>')
    P.append(page(11, "Usos incorrectos", '<div class="g3">' + "".join(cells) + "</div>", sec="02 · Logotipo"))
    P.append(page(12, "Paleta cromática", '<div class="pal">' + "".join(sw(c, i < 3) for i, c in enumerate(PAL)) + """</div>
<p class="small">*CMYK obtenido por conversión matemática: validar con prueba de color (perfil FOGRA39, estucado) antes de la primera tirada. Equivalencia Pantone: no se publica una referencia que no se ha podido verificar; casar en imprenta con la guía física <i>Pantone Formula Guide</i> (Coated/Uncoated) y registrar aquí el resultado.</p>""", sec="03 · Color"))
    contr = "".join(f"<tr><td>{c['nombre']}</td><td>{c['contraste_con_noite']}:1</td><td>{c['contraste_con_neboa']}:1</td></tr>" for c in PAL)
    P.append(page(13, "Uso del color", f"""<div class="c2"><div><div class="prop"><span style="flex:60;background:#0E1A20"></span><span style="flex:25;background:#EEF0EB"></span><span style="flex:10;background:#2E5B60"></span><span style="flex:5;background:#E4412B"></span></div>
<p class="mono" style="margin-top:3mm">Noite 60 · Néboa 25 · Mar / Area / Pedra 10 · Vermello REC ≤ 5</p>
<p><b>Psicología.</b> Noite Atlántica (azul petróleo casi negro) transmite profundidad, seriedad y la noche del océano; Néboa (gris niebla cálido) aporta calma y aire; Vermello REC es la señal universal de «grabando»: atención y acción, siempre en una sola dosis. Mar de Fóra y Area anclan la marca al paisaje gallego —agua y arena— sin recurrir a tópicos.</p>
<p><b>Regla del punto único.</b> En cada composición hay un solo elemento rojo: el punto REC o una llamada a la acción.</p></div>
<div><table class="tb"><tr><th>Color</th><th>Sobre Noite</th><th>Sobre Néboa</th></tr>{contr}</table>
<p class="small">Texto normal requiere ≥ 4,5:1 (WCAG AA). Vermello REC no se usa para texto pequeño sobre Néboa (3,6:1); Pedra solo para texto sobre Noite (5,45:1). Para texto secundario sobre fondo claro, usar Mar de Fóra (6,58:1).</p></div></div>""", sec="03 · Color"))
    P.append(page(14, "Tipografía", """<div class="c2"><div><div class="eb">Titulares · Instrument Serif</div><div style="font:400 44pt/1 ISe">Mirada de cine.</div><div style="font:400 30pt/1.1 ISi;margin:2mm 0 4mm">Oficio de empresa.</div>
<div class="mono" style="font-size:8pt">Aa Bb Cc Dd Ee Ff Gg Ññ 0123456789 «» € ·</div>
<div class="eb" style="margin-top:8mm">Texto e interfaz · Instrument Sans</div><div style="font:400 15pt/1.4 IS">Contamos lo que hacéis, con vuestra gente y vuestra voz.</div><div style="font:600 15pt IS">Regular 400 · Medium 500 · SemiBold 600 · Bold 700</div>
<p class="small" style="margin-top:6mm">Ambas con licencia SIL Open Font License 1.1: uso comercial, impresión, web, vídeo e incrustación permitidos sin coste. Archivos y licencias en 05_IDENTIDAD_VISUAL/tipografias. El logotipo no usa ninguna tipografía: es dibujo vectorial propio.</p></div>
<div><table class="tb"><tr><th>Nivel</th><th>Fuente · peso</th><th>Tamaño / interlineado</th><th>Espaciado</th></tr>
<tr><td>Display</td><td>Instrument Serif 400</td><td>64–124 px · 0,98</td><td>−1,5 %</td></tr>
<tr><td>Titular H2</td><td>Instrument Serif 400</td><td>34–62 px · 1,04</td><td>−1 %</td></tr>
<tr><td>Cita</td><td>Instrument Serif Italic</td><td>30–46 px · 1,15</td><td>0</td></tr>
<tr><td>Antetítulo</td><td>Instrument Sans 600 MAYÚS.</td><td>12 px · 1,2</td><td>+24 %</td></tr>
<tr><td>Texto</td><td>Instrument Sans 400</td><td>16–18 px · 1,6</td><td>0</td></tr>
<tr><td>Rótulo de vídeo</td><td>Instrument Sans 500 MAYÚS.</td><td>≥ 3,5 % alto de imagen</td><td>+14 %</td></tr>
<tr><td>Botón</td><td>Instrument Sans 600 MAYÚS.</td><td>14 px</td><td>+8 %</td></tr></table>
<p class="small">Sustitutas de sistema (si no hay instalación): Georgia para titulares y Arial/Helvetica para texto.</p></div></div>""", sec="04 · Tipografía"))
    P.append(page(15, "Recursos gráficos", f"""<div class="g2"><figure><img src="{U('05_IDENTIDAD_VISUAL/patrones/ENEIA_patron-pauta-encuadre_oscuro_v1.svg')}" style="width:100%;height:52mm;object-fit:cover"><figcaption>Pauta de encuadre · fondos de presentación, packaging de entrega, web</figcaption></figure>
<figure><img src="{U('05_IDENTIDAD_VISUAL/patrones/ENEIA_patron-formatos_v1.svg')}" style="width:100%;height:52mm;object-fit:cover"><figcaption>Formatos superpuestos (2,39 · 16:9 · 4:5 · 9:16) · composición de portadas</figcaption></figure>
<figure><div style="background:#EEF0EB;border:1px solid #d0d4ce;padding:8mm 4mm"><img src="{U('05_IDENTIDAD_VISUAL/patrones/ENEIA_patron-linea-de-tiempo_v1.svg')}" style="width:100%"></div><figcaption>Línea de tiempo con cabezal rojo · separadores, barras de progreso</figcaption></figure>
<figure><div style="background:#0E1A20;padding:6mm;height:30mm;position:relative"><div style="position:absolute;inset:4mm;border:0"></div>{cl('visor/ENEIA_visor_color-fondo-oscuro_v1.svg','60mm')}</div><figcaption>Visor de marca · metadatos REC, formato, lugar, código de tiempo</figcaption></figure></div>""", sec="05 · Recursos"))
    icons = json.load(open(os.path.join(M, "05_IDENTIDAD_VISUAL/iconos/indice.json")))
    ic = "".join(f'<figure class="ic"><div>{open(os.path.join(M, "05_IDENTIDAD_VISUAL/iconos", f"ENEIA_icono-{n}_v1.svg")).read().replace("<svg ", "<svg style=\"width:14mm;height:14mm;color:#0E1A20\" ", 1)}</div><figcaption>{n.replace("-", " ")}</figcaption></figure>' for n in icons)
    P.append(page(16, "Iconografía", f'<div class="icg">{ic}</div><p class="small">Retícula de 24 px, trazo 1,5 px, terminaciones y esquinas rectas (coherentes con el encuadre). Rojo solo como acento puntual (cabezal, ubicación). SVG editables en 05_IDENTIDAD_VISUAL/iconos.</p>', sec="05 · Recursos"))
    P.append(page(17, "Estilo fotográfico", """<div class="c2"><div><p class="lead">Fotografía de oficio: personas reales trabajando, en su lugar, con luz natural.</p>
<ul class="ls"><li><b>Luz:</b> lateral de ventana o exterior nublado atlántico; contraste moderado; nunca flash directo.</li><li><b>Encuadre:</b> mucho aire, sujeto en tercios, horizonte limpio. Planos detalle de manos, materia y herramientas.</li>
<li><b>Color:</b> negros densos con matiz Noite, blancos cálidos, piel natural. Sin filtros de moda ni teal & orange.</li><li><b>Personas:</b> mirada fuera de cámara o a cámara con naturalidad; nunca posado de banco de imágenes.</li>
<li><b>Grano:</b> ligero grano fílmico permitido (≤ 5 %).</li><li><b>Prohibido:</b> fotos de archivo de cámaras, claquetas, apretones de manos, oficinas genéricas.</li></ul></div>
<div><div class="ph"><div>Fotografía propia pendiente</div><p>Las primeras sesiones (piezas de autor, semanas 3–6 del plan) alimentarán esta página. Hasta entonces la comunicación se apoya en tipografía, color y vídeo: el sistema está diseñado para funcionar sin imágenes de archivo.</p></div>
<p class="small" style="margin-top:4mm">Tratamiento: sobre fotografía, el logotipo se coloca en versión negativa dentro de una zona tranquila; el encuadre de esquinas puede enmarcar la imagen completa.</p></div></div>""", sec="06 · Imagen"))
    sb = "".join(f'<img src="{U(f"10_AUDIOVISUAL/storyboard/{n}.jpg")}">' for n in ["ENEIA_ident_16x9_v1_03", "ENEIA_ident_16x9_v1_04", "ENEIA_ident_16x9_v1_06", "ENEIA_manifiesto_16x9_v1_01", "ENEIA_manifiesto_16x9_v1_03", "ENEIA_manifiesto_16x9_v1_06"])
    P.append(page(18, "Identidad audiovisual", f"""<div class="sb">{sb}</div><div class="c2" style="margin-top:5mm"><p><b>Ident de 6,5 s</b> (16:9 y 9:16): entran las esquinas, se enciende el punto REC con un tono de 1 kHz, se escriben las letras y aparece el lema. Banda sonora original sintetizada, sin derechos de terceros.</p>
<p><b>Reglas:</b> 25p, cortes en la acción, fundidos solo a Noite, rótulos en Instrument Sans, cortinilla de encuadre de 8 fotogramas, cierre de 2 s con logotipo principal. Guía completa y guiones en 10_AUDIOVISUAL.</p></div>""", dark=True, sec="07 · Audiovisual"))
    P.append(page(19, "Comunicación verbal", """<div class="c2"><div><p class="lead">Cercano, preciso, sereno. Frases cortas, verbos concretos, cero superlativos.</p>
<div class="eb">Lema</div><p style="font:400 22pt ISi;margin:1mm 0 5mm">Mirada de cine. Oficio de empresa.</p><div class="eb">Promesa</div><p>Contamos lo que hacéis, como merece ser visto.</p>
<div class="eb">Vocabulario propio</div><p>Método Eneia: <i>Escoitar · Guion · Rodaxe · Vida útil</i> · Kit de vida útil · Punto REC.</p></div>
<div><table class="tb"><tr><th>Sí</th><th>No</th></tr><tr><td>«Dos días de rodaje en la conservera. Cuatro entrevistas.»</td><td>«Damos vida a tus ideas.»</td></tr>
<tr><td>«Contamos lo que hacéis.»</td><td>«Somos tu partner audiovisual 360.»</td></tr><tr><td>«Subtítulos ES·GL·EN incluidos.»</td><td>«Calidad 4K profesional.»</td></tr>
<tr><td>«Os enviamos la propuesta el jueves.»</td><td>«En breve nos pondremos en contacto.»</td></tr></table>
<p class="small">Tratamiento de vosotros/as con empresas; tú en redes. Castellano y gallego en web y redes; nombres del método siempre en gallego. Escribir «Eneia» en texto corrido (no ENEIA) y nunca «N/A», «NA» ni «NIA».</p></div></div>""", sec="08 · Verbal"))
    mk = sorted(f for f in os.listdir(os.path.join(M, "07_MOCKUPS")) if f.endswith(".png"))
    for i in range(0, len(mk), 4):
        P.append(page(20 + i // 4, "Aplicaciones" if i == 0 else "", '<div class="g2 mk">' + "".join(f'<img src="{U("07_MOCKUPS/" + f)}">' for f in mk[i:i + 4]) + "</div>", sec="09 · Aplicaciones"))
    n = 20 + (len(mk) + 3) // 4
    P.append(page(n, "Archivos", """<table class="tb"><tr><th>Carpeta</th><th>Contenido</th></tr>
<tr><td>04_LOGOTIPOS/svg · png · pdf</td><td>7 piezas × 6 variantes de color + favicon y avatar. SVG editable (trazados), PNG transparente 3000 px, PDF vectorial.</td></tr>
<tr><td>05_IDENTIDAD_VISUAL</td><td>Paleta (JSON, CSS, GPL), tipografías + licencias OFL, patrones e iconos SVG.</td></tr>
<tr><td>07_MOCKUPS</td><td>Aplicaciones en PNG 3200 × 2000 y firma de correo HTML.</td></tr>
<tr><td>09_WEB · /web</td><td>Web funcional (HTML/CSS/JS), lista para publicar gratis en Vercel o GitHub Pages.</td></tr>
<tr><td>10_AUDIOVISUAL</td><td>Ident y manifiesto MP4 (16:9 y 9:16), storyboard, guía y guiones.</td></tr>
<tr><td>herramientas/</td><td>Código que regenera logotipos, recursos, vídeos, mockups y documentos.</td></tr></table>
<p class="small" style="margin-top:8mm">Eneia Estudio · Manual de identidad corporativa v1 · noviembre 2026.</p>""", sec="10 · Archivos"))
    css = BASE_CSS + """
@page{size:297mm 210mm;margin:0}
.pg{width:297mm;height:210mm;position:relative;padding:22mm 18mm 18mm;page-break-after:always;overflow:hidden}
.hd{position:absolute;left:18mm;right:18mm;top:9mm;display:flex;justify-content:space-between;opacity:.55}
.ft{position:absolute;right:18mm;bottom:8mm;opacity:.55}
.pt{font-size:30pt;margin:0 0 9mm}
.lead{font:400 17pt/1.3 ISe}
.c2{display:grid;grid-template-columns:1fr 1fr;gap:14mm}.c3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12mm}.span2{grid-column:span 2}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm}.g2{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
figure{margin:0}figcaption{font:500 7.5pt IS;letter-spacing:.1em;text-transform:uppercase;margin-top:2.5mm;opacity:.75}
.lg{height:52mm;display:grid;place-items:center;padding:7mm;border:1px solid #d6d9d3;position:relative}.lg>svg,.lg>div{max-width:100%;max-height:100%;width:80%}
.lg.bad i{position:absolute;inset:0;background:linear-gradient(to top right,transparent 49.6%,#E4412B 49.8% 50.2%,transparent 50.4%)}
.idx{columns:2;column-gap:20mm;list-style:none;padding:0;margin:0;counter-reset:x}.idx li{display:flex;justify-content:space-between;border-bottom:1px solid #cfd3cc;padding:2.2mm 0;font:400 13pt ISe;break-inside:avoid}.idx b{font:500 9pt IS;color:#2E5B60}
.vals{display:grid;grid-template-columns:repeat(5,1fr);gap:5mm}.vals h3{font:600 8pt IS;letter-spacing:.16em;text-transform:uppercase;margin:0 0 2mm;color:#E4412B}.vals p{margin:0;font-size:9pt}
.pal{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:48mm;gap:4mm}.sw{padding:5mm;position:relative;border:1px solid rgba(0,0,0,.08)}.sw.big:first-child{grid-row:span 2}
.swn{font:400 17pt ISe}.swr{opacity:.8;margin-top:1mm}.swv{position:absolute;left:5mm;bottom:5mm;line-height:1.7}
.prop{display:flex;height:20mm}.prop span{display:block}
.tb{width:100%;border-collapse:collapse;font-size:9pt}.tb th{text-align:left;font:600 7pt IS;letter-spacing:.14em;text-transform:uppercase;color:#2E5B60;border-bottom:1.5px solid #0E1A20;padding:2mm 2mm 2mm 0}.tb td{border-bottom:1px solid #cfd3cc;padding:2.2mm 2mm 2.2mm 0;vertical-align:top}
.small{font-size:8.5pt;opacity:.8}.ls{padding-left:4mm}.ls li{margin-bottom:1.6mm}
.cap{text-align:center;font:500 8pt IS;letter-spacing:.14em;text-transform:uppercase;opacity:.6}
.icg{display:grid;grid-template-columns:repeat(6,1fr);gap:6mm 4mm;margin-bottom:8mm}.ic div{background:#fff;border:1px solid #d6d9d3;height:30mm;display:grid;place-items:center}
.ph{background:repeating-linear-gradient(45deg,#e2e5df 0 10px,#EEF0EB 10px 20px);border:1px solid #cfd3cc;height:95mm;padding:12mm;display:flex;flex-direction:column;justify-content:flex-end}.ph div{font:400 20pt ISe}
.sb{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}.sb img{width:100%}
.mk img{width:100%;display:block}
.cover{padding:0}
"""
    open(os.path.join(B, "manual.html"), "w").write(f"<!doctype html><html lang='es'><head><meta charset='utf-8'><title>Eneia Estudio · Manual de identidad</title><style>{css}</style></head><body>{''.join(P)}</body></html>")

# ═════════════════════════ PRESENTACIÓN (16:9) ═════════════════════════
def presentacion():
    S = []
    def sl(body, dark=False, n=None):
        bg, fg = ("#0E1A20", "#EEF0EB") if dark else ("#EEF0EB", "#0E1A20")
        S.append(f'<section class="sl{" d" if dark else ""}" style="background:{bg};color:{fg}"><div class="fr"><i></i><i></i><i></i><i></i></div>{body}<div class="no mono">{len(S) + 1:02d} · Eneia Estudio</div></section>')
    sl(f'<div class="ctr"><div style="width:520px">{svg("principal/ENEIA_principal_color-fondo-oscuro_v1.svg")}</div><p class="tl">Mirada de cine. Oficio de empresa.</p></div>', True)
    sl('<div class="eb">El problema</div><h1>Hay empresas que hacen cosas extraordinarias.<br><span class="mu">Y vídeos que las hacen parecer todas iguales.</span></h1>')
    sl('<div class="eb">Quiénes somos</div><h1>Eneia es como suena «N&nbsp;y&nbsp;A».</h1><p class="lg2">Dos socias, dos miradas. En cada proyecto una dirige la historia y la otra la imagen. Un estudio audiovisual de Galicia para empresas con oficio.</p>')
    sl('<div class="eb">Qué hacemos</div><div class="c4">' + "".join(f'<div><h3>{a}</h3><p>{b}</p></div>' for a, b in [("Vídeo corporativo", "Presentación de empresa, ferias, comerciales."), ("Documental de marca", "Vuestra historia contada por vuestra gente."), ("Publicidad", "Spots y campañas para redes, medios y pantallas."), ("Contenido continuo", "Presencia audiovisual todo el año.")]) + '</div>')
    sl('<div class="eb">Método Eneia</div><div class="c4 steps">' + "".join(f'<div><span>{i}</span><h3>{a}</h3><p>{b}</p></div>' for i, a, b in [("01", "Escoitar", "Entendemos qué hacéis y qué debe pasar después del vídeo."), ("02", "Guion", "Enfoque por escrito, plan de rodaje y precio cerrado."), ("03", "Rodaxe", "Sonido directo, luz natural, dos directoras."), ("04", "Vida útil", "Pieza principal + cortes, subtítulos ES·GL·EN y fotogramas.")]) + '</div>', True)
    sl('<div class="eb">Formatos</div><div class="c4 pr">' + "".join(f'<div><h3>{a}</h3><p class="mono">{d}</p><p>{b}</p><b>desde {p}</b></div>' for a, d, b, p in [("Pieza", "60–90 s · 1 jornada", "Presentación para web, ferias y comerciales.", "1.600 €"), ("Historia", "2–4 min · 2 jornadas", "Documental de marca con entrevistas.", "4.200 €"), ("Campaña", "Spot + 6 piezas", "Publicidad adaptada a cada canal.", "7.500 €"), ("Continuo", "mensual", "Media jornada + 4 piezas verticales.", "950 €/mes")]) + '</div><p class="sm">Precios sin IVA. Desplazamientos incluidos en Galicia.</p>')
    sl('<div class="eb">Para quién</div><h1 style="max-width:900px">Industria · Mar y conserva · Vino y alimentación · Construcción · Turismo de calidad · Agencias · Cultura</h1>')
    sl('<div class="eb">Por qué Eneia</div><div class="c4">' + "".join(f'<div><h3>{a}</h3><p>{b}</p></div>' for a, b in [("Verdad", "Personas reales y sonido directo. Cero bancos de imágenes."), ("Claridad", "Precio, plazos y entregables desde el primer día."), ("Durabilidad", "Kit de vida útil incluido en cada proyecto."), ("Origen", "Gallego-castellano natural; versión en inglés para exportar.")]) + '</div>', True)
    sl(f'<div class="eb">Identidad audiovisual</div><div class="sbx">' + "".join(f'<img src="{U(f"10_AUDIOVISUAL/storyboard/ENEIA_manifiesto_16x9_v1_0{i}.jpg")}">' for i in (1, 3, 5, 7)) + '</div>', True)
    sl('<div class="eb">Cómo empezamos</div><h1>Una conversación de 45 minutos.</h1><p class="lg2">Nos contáis qué hacéis. En 48 horas laborables os enviamos una primera idea de enfoque y presupuesto. Sin compromiso.</p>')
    sl(f'<div class="ctr"><div style="width:440px">{svg("principal/ENEIA_principal_color-fondo-oscuro_v1.svg")}</div><p class="tl">Contamos lo que hacéis.</p><p class="mono" style="margin-top:24px;opacity:.7">eneiaestudio.com · @eneiaestudio · Galicia</p></div>', True)
    css = BASE_CSS + """
@page{size:1280px 720px;margin:0}
.sl{width:1280px;height:720px;position:relative;padding:110px 120px;page-break-after:always;overflow:hidden}
.fr i{position:absolute;width:34px;height:34px;border:0 solid currentColor;opacity:.5}
.fr i:nth-child(1){left:44px;top:40px;border-width:2px 0 0 2px}.fr i:nth-child(2){right:44px;top:40px;border-width:2px 2px 0 0}.fr i:nth-child(3){left:44px;bottom:40px;border-width:0 0 2px 2px}.fr i:nth-child(4){right:44px;bottom:40px;border-width:0 2px 2px 0}
.no{position:absolute;right:96px;bottom:50px;opacity:.5}
.eb{margin-bottom:26px}.d .eb{color:#8B908C}
h1{font:400 64px/1.04 ISe;max-width:1000px}.mu{color:#8B908C}
.lg2{font:400 24px/1.5 IS;max-width:760px;margin-top:30px;opacity:.85}
.ctr{position:absolute;inset:0;display:grid;place-items:center;align-content:center;text-align:center}.tl{font:400 34px ISi;margin-top:30px}
.c4{display:grid;grid-template-columns:repeat(4,1fr);gap:36px;margin-top:70px}.c4 h3{font:600 17px IS;letter-spacing:.16em;text-transform:uppercase;margin:0 0 16px}.c4 p{font-size:21px;line-height:1.45;opacity:.85;margin:0 0 16px}.c4>div{border-top:1px solid currentColor;padding-top:22px}
.steps span{display:block;font:400 84px/1 ISe;color:#E4412B;margin-bottom:22px}.steps>div{border-top:0!important;padding-top:0!important}
.pr>div{border-top:3px solid #0E1A20!important;padding-top:22px}.pr b{font:400 40px ISe}.sm{font-size:14px;opacity:.7;margin-top:30px}
.sbx{display:grid;grid-template-columns:1fr 1fr;gap:14px}.sbx img{width:100%}
"""
    open(os.path.join(B, "presentacion.html"), "w").write(f"<!doctype html><html lang='es'><head><meta charset='utf-8'><title>Eneia Estudio · Presentación</title><style>{css}</style></head><body>{''.join(S)}</body></html>")

# ═════════════════════════ DOCUMENTOS MD → HTML (A4) ═════════════════════════
DOCS = ["01_ESTRATEGIA/ENEIA_estrategia-de-mercado_v1.md", "02_NAMING/ENEIA_naming_v1.md", "03_BRANDING/ENEIA_plataforma-de-marca_v1.md",
        "08_MARKETING/ENEIA_plan-de-marketing-y-lanzamiento_v1.md", "09_WEB/ENEIA_web_v1.md", "10_AUDIOVISUAL/ENEIA_guia-audiovisual-y-guiones_v1.md",
        "11_ENTREGABLES_FINALES/ENEIA_auditoria-de-calidad_v1.md"]

def docs():
    css = BASE_CSS + f"""
@page{{size:A4;margin:22mm 20mm 20mm}}
body{{font-size:10pt}}
.cv{{height:250mm;background:#0E1A20;color:#EEF0EB;margin:-22mm -20mm 0;padding:30mm 22mm;position:relative;page-break-after:always}}
.cv .t{{font:400 38pt/1.05 ISe;margin-top:70mm;max-width:150mm}}
h1{{display:none}} h2{{font-size:20pt;margin:9mm 0 3mm;page-break-after:avoid}} h3{{font:600 9pt IS;letter-spacing:.14em;text-transform:uppercase;margin:6mm 0 2mm}}
p,li{{orphans:3;widows:3}} a{{color:#2E5B60;word-break:break-all}}
table{{width:100%;border-collapse:collapse;font-size:8.6pt;margin:3mm 0 5mm;page-break-inside:auto}} tr{{page-break-inside:avoid}}
th{{text-align:left;font:600 7pt IS;letter-spacing:.12em;text-transform:uppercase;color:#2E5B60;border-bottom:1.5px solid #0E1A20;padding:1.8mm 2mm 1.8mm 0}}
td{{border-bottom:1px solid #d5d9d2;padding:1.8mm 2mm 1.8mm 0;vertical-align:top}}
blockquote{{margin:4mm 0;padding:3mm 5mm;border-left:3px solid #E4412B;background:#f1f2ee;font-size:9pt}}
code{{font:500 8.5pt IS;background:#eef0eb;padding:0 1mm}}
"""
    out = []
    for d in DOCS:
        src = os.path.join(M, d)
        if not os.path.exists(src): continue
        md = open(src).read()
        title = md.splitlines()[0].lstrip("# ").strip()
        html = markdown.markdown(md, extensions=["tables", "sane_lists"])
        logo = svg("principal/ENEIA_principal_color-fondo-oscuro_v1.svg", "62mm")
        page_html = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Eneia Estudio · {title}</title><style>{css}</style></head><body>
<div class="cv">{logo}<div class="t">{title}</div><div class="mono" style="position:absolute;left:22mm;bottom:22mm;opacity:.7">Eneia Estudio · Estudio audiovisual · Galicia · noviembre 2026</div></div>{html}</body></html>"""
        name = os.path.basename(d).replace(".md", "")
        open(os.path.join(B, name + ".html"), "w").write(page_html)
        out.append([name + ".html", os.path.join(os.path.dirname(d), name + ".pdf"), "A4"])
    return out

if __name__ == "__main__":
    manual(); presentacion(); jobs = docs()
    jobs += [["manual.html", "06_MANUAL_CORPORATIVO/ENEIA_manual-de-identidad_v1.pdf", "manual"],
             ["presentacion.html", "11_ENTREGABLES_FINALES/ENEIA_presentacion-empresa_v1.pdf", "slides"]]
    json.dump(jobs, open(os.path.join(B, "jobs.json"), "w"), indent=1, ensure_ascii=False)
    print(len(jobs), "documentos preparados")
