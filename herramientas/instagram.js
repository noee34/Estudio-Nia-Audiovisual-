// Eneia Estudio · carrusel de presentación para Instagram (7 diapositivas 1080×1350, 4:5).
// Uso: node herramientas/instagram.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const F = path.join(ROOT, 'MARCA/05_IDENTIDAD_VISUAL/tipografias');
const OUT = path.join(ROOT, 'MARCA/08_MARKETING/instagram');
const L = (p) => fs.readFileSync(path.join(ROOT, 'MARCA/04_LOGOTIPOS/svg', p), 'utf8').replace(/ width="[\d.]+" height="[\d.]+"/, '');
const LO = L('principal/ENEIA_principal_color-fondo-oscuro_v1.svg');
const LC = L('principal/ENEIA_principal_color-fondo-claro_v1.svg');
const N = 7;

const css = `
@font-face{font-family:IS;src:url(file://${F}/InstrumentSans-Variable.ttf)}
@font-face{font-family:ISe;src:url(file://${F}/InstrumentSerif-Regular.ttf)}
@font-face{font-family:ISi;src:url(file://${F}/InstrumentSerif-Italic.ttf)}
*{box-sizing:border-box}html,body{margin:0}
.s{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:IS;padding:150px 110px}
.dk{background:radial-gradient(120% 90% at 50% 30%,#152731 0%,#0E1A20 60%,#0a1317 100%);color:#EEF0EB}
.lt{background:#EEF0EB;color:#0E1A20}
.c{position:absolute;width:76px;height:76px;border:0 solid currentColor}
.c1{left:56px;top:56px;border-width:4px 0 0 4px}.c2{right:56px;top:56px;border-width:4px 4px 0 0}.c3{left:56px;bottom:56px;border-width:0 0 4px 4px}.c4{right:56px;bottom:56px;border-width:0 4px 4px 0}
.hud{position:absolute;font:500 24px IS;letter-spacing:.16em;opacity:.75}
.tl{left:156px;top:76px}.tr{right:156px;top:76px}.bl{left:156px;bottom:76px}.br{right:156px;bottom:76px;font-variant-numeric:tabular-nums}
.dot{display:inline-block;width:18px;height:18px;border-radius:50%;background:#E4412B;margin-right:12px;vertical-align:1px}
.eb{font:600 26px IS;letter-spacing:.24em;text-transform:uppercase;color:#8B908C;margin-bottom:44px}
.lt .eb{color:#2E5B60}
h1{font:400 128px/1 ISe;letter-spacing:-.015em;margin:0}
h2{font:400 104px/1.02 ISe;letter-spacing:-.01em;margin:0}
.mu{color:#8B908C}.lt .mu{color:#6f7a76}
.it{font-family:ISi}
p{font:400 38px/1.45 IS;margin:44px 0 0;max-width:820px;opacity:.88}
.red{color:#E4412B}
.list{list-style:none;padding:0;margin:56px 0 0}.list li{display:flex;gap:34px;align-items:baseline;border-top:2px solid rgba(238,240,235,.25);padding:30px 0}
.lt .list li{border-color:#C5CAC3}
.list b{font:400 64px ISe;color:#E4412B;min-width:90px}.list span{font:600 36px IS;letter-spacing:.14em;text-transform:uppercase}.list small{display:block;font:400 30px/1.4 IS;letter-spacing:0;text-transform:none;opacity:.8;margin-top:8px}
.swipe{position:absolute;right:156px;bottom:150px;font:600 24px IS;letter-spacing:.2em;opacity:.7}
.mid{position:absolute;left:110px;right:110px;top:50%;transform:translateY(-50%)}
`;
// regla de marca: un solo elemento rojo por pieza → el punto REC del visor solo aparece si la diapositiva no tiene otro acento rojo
const frame = (n, dot = true) => `<i class="c c1"></i><i class="c c2"></i><i class="c c3"></i><i class="c c4"></i>
<div class="hud tl">${dot ? '<span class="dot"></span>' : ''}REC</div><div class="hud tr">${String(n).padStart(2, '0')} / ${String(N).padStart(2, '0')}</div>
<div class="hud bl">ENEIA ESTUDIO</div><div class="hud br">00:00:${String((n - 1) * 3).padStart(2, '0')}:00</div>`;

const slides = [
  ['dk', `<div class="mid"><div class="eb">Estudio audiovisual con IA · Galicia</div><h1>Tu producto merece imagen de cine.</h1><p class="it" style="font:400 italic 58px/1.15 ISi;opacity:1;margin-top:48px">¿Tus fotos y vídeos lo consiguen?</p></div><div class="swipe">DESLIZA →</div>`],
  ['dk', `<div class="mid"><div class="eb">El problema</div><h2>Rodajes caros. Semanas de espera. Fotos de móvil.</h2><p>Y mientras tanto, tu competencia vende con mejor imagen.</p></div>`],
  ['lt', `<div class="mid"><div class="eb">Quiénes somos</div><h1>Somos <span class="red">Eneia</span>.</h1><p>Un estudio audiovisual que une inteligencia artificial y dirección de arte para crear fotos y vídeos que venden.</p></div>`],
  ['dk', `<div class="mid"><div class="eb">Lo que hacemos</div><h2>Fotos de producto.<br>Spots. <span class="it">Campañas.</span></h2><p>Imagen publicitaria para tu web, tus redes y tus anuncios, creada con IA a partir de tu producto real.</p></div>`],
  ['dk', `<div class="mid"><div class="eb">Método Eneia</div><h2 style="font-size:88px">La IA es la herramienta. La mirada, nuestra.</h2><ul class="list">
     <li><b>01</b><span>Escoitar</span></li><li><b>02</b><span>Guion</span></li><li><b>03</b><span>Xeración</span></li><li><b>04</b><span>Entrega</span></li></ul></div>`],
  ['lt', `<div class="mid"><div class="eb">Por qué Eneia</div><h2 style="font-size:92px">Más imagen. Menos coste.</h2><ul class="list">
     <li><b>✓</b><span>En días, no en meses<small>Primeras propuestas en 72 horas.</small></span></li>
     <li><b>✓</b><span>Desde 290 €<small>Precio cerrado antes de empezar.</small></span></li>
     <li><b>✓</b><span>Listo para usar<small>Licencia comercial y etiquetado de IA incluidos.</small></span></li></ul></div>`],
  ['dk', `<div class="mid" style="text-align:center"><div style="width:640px;margin:0 auto 70px">${LO}</div><h2 style="font-size:96px">Cuéntanos qué vendes.</h2><p style="margin:36px auto 0">Escríbenos por mensaje directo<br>o desde el enlace de la bio.</p></div>`],
];

const CAPTION = `Tu producto merece imagen de cine. 🎬

Somos Eneia, un estudio audiovisual que crea fotos y vídeos publicitarios con inteligencia artificial y dirección de arte. Imagen profesional para tu web, tus redes y tus anuncios, en días y sin rodajes.

Mirada de cine. Oficio de empresa.

📩 Cuéntanos qué vendes: mensaje directo o enlace en la bio.

#EneiaEstudio #FotografiaDeProducto #VideoPublicitario #InteligenciaArtificial #IA #ContenidoParaRedes #MarketingDigital #Galicia #EmpresasGalegas #Ecommerce #PublicidadIA
`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const tmp = path.join(OUT, '.tmp.html');
  for (let i = 0; i < slides.length; i++) {
    const [cls, body] = slides[i];
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="s ${cls}">${frame(i + 1, [0, 1, 3].includes(i))}${body}</div></body></html>`);
    await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, `ENEIA_instagram-presentacion_${String(i + 1).padStart(2, '0')}_v1.png`) });
  }
  fs.unlinkSync(tmp);
  fs.writeFileSync(path.join(OUT, 'ENEIA_instagram-presentacion_texto_v1.txt'), CAPTION);
  await b.close();
  console.log('OK', slides.length, 'diapositivas');
})();
