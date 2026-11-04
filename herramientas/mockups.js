// Eneia Estudio · aplicaciones de marca (mockups) renderizadas a PNG 3200×2000.
// Uso: node herramientas/mockups.js   (requiere capturas web en MARCA/09_WEB/capturas)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const L = (p) => fs.readFileSync(path.join(ROOT, 'MARCA/04_LOGOTIPOS/svg', p), 'utf8').replace(/ width="[\d.]+" height="[\d.]+"/, '');
const F = path.join(ROOT, 'MARCA/05_IDENTIDAD_VISUAL/tipografias');
const OUT = path.join(ROOT, 'MARCA/07_MOCKUPS');
const CAP = path.join(ROOT, 'MARCA/09_WEB/capturas');
const img = (p) => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');

const lc = L('principal/ENEIA_principal_color-fondo-claro_v1.svg');
const lo = L('principal/ENEIA_principal_color-fondo-oscuro_v1.svg');
const so = L('secundario/ENEIA_secundario_color-fondo-oscuro_v1.svg');
const sc = L('secundario/ENEIA_secundario_color-fondo-claro_v1.svg');
const io = L('isotipo/ENEIA_isotipo_color-fondo-oscuro_v1.svg');
const ic = L('isotipo/ENEIA_isotipo_color-fondo-claro_v1.svg');
const hc = L('horizontal/ENEIA_horizontal_color-fondo-claro_v1.svg');
const ho = L('horizontal/ENEIA_horizontal_color-fondo-oscuro_v1.svg');
const vo = L('visor/ENEIA_visor_color-fondo-oscuro_v1.svg');
const iw = L('isotipo/ENEIA_isotipo_mono-blanco_v1.svg');

const CSS = `
@font-face{font-family:IS;src:url(file://${F}/InstrumentSans-Variable.ttf)}
@font-face{font-family:ISe;src:url(file://${F}/InstrumentSerif-Regular.ttf)}
@font-face{font-family:ISi;src:url(file://${F}/InstrumentSerif-Italic.ttf)}
*{box-sizing:border-box}body{margin:0;font-family:IS;color:#0E1A20}
.sc{width:1600px;height:1000px;position:relative;overflow:hidden}
.lbl{position:absolute;left:48px;bottom:36px;font:600 13px IS;letter-spacing:.24em;text-transform:uppercase;opacity:.6}
.sh{box-shadow:0 30px 60px -20px rgba(0,0,0,.45),0 8px 18px -6px rgba(0,0,0,.25)}
svg{display:block}
.meta{font:500 10px IS;letter-spacing:.16em;text-transform:uppercase}
`;

const card = (front) => front
  ? `<div class="sh" style="width:510px;height:300px;background:#0E1A20;display:grid;place-items:center;border-radius:6px"><div style="width:330px">${lo}</div></div>`
  : `<div class="sh" style="width:510px;height:300px;background:#EEF0EB;border-radius:6px;position:relative;padding:44px 46px">
      <div style="position:absolute;right:42px;top:40px;width:58px">${ic}</div>
      <div style="font:400 34px ISe">Nombre Apellido</div><div class="meta" style="color:#2E5B60;margin-top:6px">Dirección · Imagen</div>
      <div style="position:absolute;left:46px;bottom:40px;font:400 14px/1.7 IS">+34 600 000 000<br>nombre@eneiaestudio.com<br>eneiaestudio.com · Galicia</div>
      <div style="position:absolute;right:46px;bottom:44px;font:400 italic 16px ISi;color:#2E5B60">Mirada de cine. Oficio de empresa.</div></div>`;

const tee = (fill, logo, w = 520) => `<svg viewBox="0 0 520 560" width="${w}"><path d="M150 20 L200 0 Q260 40 320 0 L370 20 L510 90 L460 210 L400 185 L400 560 L120 560 L120 185 L60 210 L10 90 Z" fill="${fill}"/><path d="M200 0 Q260 40 320 0" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="6"/></svg><div style="position:absolute;left:${w * 0.39}px;top:${w * 0.27}px;width:${w * 0.2}px">${logo}</div>`;

const van = () => `<svg viewBox="0 0 1400 620" width="1400">
 <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16262e"/><stop offset="1" stop-color="#0E1A20"/></linearGradient></defs>
 <path d="M40 120 Q40 70 90 70 L1010 70 Q1070 70 1110 120 L1240 300 Q1300 310 1330 340 L1340 470 Q1340 500 1310 500 L60 500 Q40 500 40 480 Z" fill="url(#g)"/>
 <path d="M1030 100 L1100 100 L1210 290 L1030 290 Z" fill="#2c3f48"/><rect x="930" y="100" width="80" height="190" fill="#2c3f48"/>
 <line x1="920" y1="80" x2="920" y2="495" stroke="#060d10" stroke-width="3"/><line x1="1020" y1="80" x2="1020" y2="495" stroke="#060d10" stroke-width="2"/>
 <rect x="1250" y="350" width="70" height="26" rx="4" fill="#E4412B" opacity=".85"/>
 <g fill="#0b0f12"><circle cx="270" cy="500" r="78"/><circle cx="1110" cy="500" r="78"/></g><g fill="#5d6a6f"><circle cx="270" cy="500" r="36"/><circle cx="1110" cy="500" r="36"/></g>
 <rect x="0" y="574" width="1400" height="10" fill="rgba(0,0,0,.25)" rx="5"/></svg>`;

const scenes = [
  ['01_tarjetas', `<div class="sc" style="background:linear-gradient(135deg,#D3C6AE,#c2b497)">
    <div style="position:absolute;left:220px;top:260px;transform:rotate(-8deg)">${card(true)}</div>
    <div style="position:absolute;left:820px;top:380px;transform:rotate(6deg)">${card(false)}</div>
    <div class="lbl">Tarjetas corporativas · 85 × 55 mm · anverso Noite, reverso Néboa</div></div>`],
  ['02_papeleria', `<div class="sc" style="background:#B9BEB7">
    <div class="sh" style="position:absolute;left:150px;top:90px;width:560px;height:792px;background:#fff;padding:60px 56px;transform:rotate(-3deg)">
      <div style="width:200px">${lc}</div>
      <div style="margin-top:80px;font:400 13px/1.9 IS;color:#33413f">Vigo, 4 de noviembre de 2026<br><br>Estimada Marta:<br><br>Gracias por la conversación del martes. Os adjuntamos la propuesta de enfoque para el documental de marca, con el plan de rodaje de dos jornadas en la planta de Arousa…</div>
      <div style="position:absolute;left:56px;right:56px;bottom:50px;border-top:1px solid #D3C6AE;padding-top:14px;display:flex;justify-content:space-between" class="meta"><span>Eneia Estudio · Galicia</span><span>eneiaestudio.com</span></div></div>
    <div class="sh" style="position:absolute;left:770px;top:180px;width:660px;height:330px;background:#0E1A20;transform:rotate(4deg);padding:40px">
      <div style="width:180px">${so}</div><div style="position:absolute;right:60px;bottom:70px;font:400 15px/1.7 IS;color:#EEF0EB">Marta Ferreiro<br>Conservas do Mar, S.L.<br>36600 Vilagarcía de Arousa</div></div>
    <div style="position:absolute;left:860px;top:600px;transform:rotate(-5deg)">${card(false)}</div>
    <div class="lbl">Papelería · carta A4, sobre DL, tarjeta · datos de ejemplo</div></div>`],
  ['03_firma-correo', `<div class="sc" style="background:#E4E7E1;display:grid;place-items:center">
    <div class="sh" style="width:1100px;background:#fff;border-radius:10px;overflow:hidden">
      <div style="background:#f3f4f2;padding:16px 24px;font:500 14px IS;color:#55615e;border-bottom:1px solid #e3e5e1">Para: marta@conservasdomar.gal · Asunto: Propuesta · Documental de marca</div>
      <div style="padding:40px 48px;font:400 16px/1.7 IS;color:#222">Hola, Marta:<br><br>Te adjunto la propuesta. Si te encaja, reservamos las jornadas del 18 y 19.<br><br>Un abrazo,<br><br>
        <table style="border-collapse:collapse"><tr><td style="padding-right:22px;border-right:2px solid #E4412B;width:90px">${ic}</td><td style="padding-left:22px;font:400 14px/1.6 IS"><b style="font:600 16px IS">Nombre Apellido</b><br><span style="color:#2E5B60">Dirección · Imagen</span><br>Eneia Estudio · Estudio audiovisual<br>+34 600 000 000 · eneiaestudio.com</td></tr></table></div></div>
    <div class="lbl">Firma de correo · HTML en 07_MOCKUPS/firma-correo</div></div>`],
  ['04_uniformes', `<div class="sc" style="background:#D3C6AE">
    <div style="position:absolute;left:140px;top:180px">${tee('#0E1A20', iw)}</div>
    <div style="position:absolute;left:820px;top:180px">${tee('#EEF0EB', ic)}</div>
    <div style="position:absolute;left:300px;top:760px;width:220px"></div>
    <div class="lbl">Ropa de rodaje · camiseta Noite (isotipo blanco) y Néboa (isotipo color) · bordado o serigrafía 1 tinta</div></div>`],
  ['05_vehiculo', `<div class="sc" style="background:linear-gradient(#D9DDD6 0 72%,#A9AFA8 72%)">
    <div style="position:absolute;left:100px;top:230px">${van()}</div>
    <div style="position:absolute;left:220px;top:370px;width:520px">${lo}</div>
    <div style="position:absolute;left:1080px;top:560px;font:600 15px IS;letter-spacing:.2em;color:#EEF0EB">ENEIAESTUDIO.COM</div>
    <div class="lbl">Rotulación de vehículo · furgoneta de rodaje · vinilo de corte Néboa + punto REC</div></div>`],
  ['06_rotulacion', `<div class="sc" style="background:#9AA19B">
    <div style="position:absolute;left:0;right:0;top:0;height:780px;background:repeating-linear-gradient(90deg,#c9c3b6 0 120px,#c3bdaf 120px 240px)"></div>
    <div style="position:absolute;left:260px;top:180px;width:1080px;height:600px;background:#0E1A20"></div>
    <div style="position:absolute;left:300px;top:220px;width:620px;height:560px;background:linear-gradient(135deg,#2a3c45,#152229);border:8px solid #0a1216"></div>
    <div style="position:absolute;left:400px;top:320px;width:420px">${lo}</div>
    <div style="position:absolute;left:980px;top:240px;width:320px;height:540px;background:#1a2a31;border:8px solid #0a1216"></div>
    <div style="position:absolute;left:1020px;top:300px;font:500 18px/2 IS;color:#EEF0EB;letter-spacing:.14em">ESTUDIO<br>AUDIOVISUAL<br><br><span style="font:400 italic 30px/1.2 ISi;letter-spacing:0">Mirada de cine.<br>Oficio de empresa.</span></div>
    <div style="position:absolute;left:0;right:0;top:780px;height:220px;background:#7d847e"></div>
    <div class="lbl" style="color:#fff;opacity:.85">Rotulación de local · vinilo en escaparate y puerta</div></div>`],
  ['07_cartel-y-mupi', `<div class="sc" style="background:#C9CEC8">
    <div class="sh" style="position:absolute;left:180px;top:80px;width:560px;height:792px;background:#0E1A20;color:#EEF0EB;padding:56px">
      <div class="meta" style="display:flex;justify-content:space-between;color:#8B908C"><span>● REC</span><span>Galicia</span></div>
      <div style="font:400 78px/1 ISe;margin-top:150px">Contamos<br>lo que<br>hacéis.</div>
      <div style="font:400 18px/1.6 IS;color:#C9CEC8;margin-top:36px;max-width:340px">Vídeo corporativo y publicidad con mirada de cine.</div>
      <div style="position:absolute;left:56px;bottom:56px;width:250px">${lo}</div></div>
    <div style="position:absolute;left:880px;top:60px;width:520px;height:880px;background:#2b3236;padding:22px;border-radius:6px" class="sh">
      <div style="width:100%;height:100%;background:#EEF0EB;position:relative;padding:48px">
        <div style="position:absolute;inset:26px"><div style="position:absolute;left:0;top:0;width:44px;height:44px;border-left:3px solid #0E1A20;border-top:3px solid #0E1A20"></div><div style="position:absolute;right:0;top:0;width:44px;height:44px;border-right:3px solid #0E1A20;border-top:3px solid #0E1A20"></div><div style="position:absolute;left:0;bottom:0;width:44px;height:44px;border-left:3px solid #0E1A20;border-bottom:3px solid #0E1A20"></div><div style="position:absolute;right:0;bottom:0;width:44px;height:44px;border-right:3px solid #0E1A20;border-bottom:3px solid #0E1A20"></div></div>
        <div style="font:400 64px/1.02 ISe;margin-top:120px">Vuestra<br>empresa,<br>como<br>trabaja.</div>
        <div style="position:absolute;left:48px;bottom:80px;width:330px">${hc}</div></div></div>
    <div class="lbl">Cartel A2 · mupi 120 × 176 cm</div></div>`],
  ['08_redes', `<div class="sc" style="background:#E4E7E1">
    <div style="position:absolute;left:120px;top:90px;display:grid;grid-template-columns:repeat(3,250px);gap:6px">
      ${[['#0E1A20', `<div style="width:170px">${io}</div>`], ['#2E5B60', `<div style="font:400 30px/1.1 ISe;color:#EEF0EB;padding:24px">Primero escuchamos.</div>`], ['#EEF0EB', `<div style="width:200px">${lc}</div>`],
         ['#D3C6AE', `<div style="font:400 italic 28px/1.1 ISi;padding:24px">«Sé cuándo una lata está bien por el sonido.»</div>`], ['#0E1A20', `<div style="width:220px">${vo}</div>`], ['#1E2C33', `<div class="meta" style="color:#EEF0EB;font-size:13px">● PUNTO REC<br><br><span style="font:400 30px/1.1 ISe;letter-spacing:0;text-transform:none">Antes de grabar</span></div>`],
         ['#EEF0EB', `<div style="font:400 30px/1.1 ISe;padding:24px">3 errores en un vídeo de feria</div>`], ['#0E1A20', `<div style="font:400 30px/1.1 ISe;color:#EEF0EB;padding:24px">Mirada de cine.<br>Oficio de empresa.</div>`], ['#2E5B60', `<div style="width:120px">${iw}</div>`]]
        .map(([bg, c]) => `<div style="width:250px;height:250px;background:${bg};display:grid;place-items:center;text-align:left">${c}</div>`).join('')}</div>
    <div class="sh" style="position:absolute;left:1000px;top:70px;width:380px;height:676px;background:#0E1A20;border-radius:28px;border:10px solid #111;overflow:hidden;color:#EEF0EB;padding:40px 32px">
      <div style="height:4px;background:#3a4a51;border-radius:2px"><div style="width:40%;height:4px;background:#EEF0EB"></div></div>
      <div class="meta" style="margin-top:24px;display:flex;justify-content:space-between;color:#8B908C"><span>● REC</span><span>00:00:12:04</span></div>
      <div style="font:400 44px/1.05 ISe;margin-top:170px">Dos días en la conservera.</div><div style="font:400 16px IS;color:#C9CEC8;margin-top:16px">Cuatro entrevistas. Un minuto y medio.</div>
      <div style="position:absolute;left:32px;bottom:44px;width:200px">${so}</div></div>
    <div class="lbl">Redes sociales · cuadrícula de Instagram y historia 9:16</div></div>`],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
  const tmp = path.join(OUT, '.tmp.html');
  // escena web (si existen las capturas)
  if (fs.existsSync(path.join(CAP, 'web-escritorio.png'))) {
    scenes.push(['09_web', `<div class="sc" style="background:linear-gradient(135deg,#2E5B60,#0E1A20)">
      <div class="sh" style="position:absolute;left:110px;top:110px;width:1080px;height:700px;background:#222;border-radius:14px;padding:30px 30px 0;overflow:hidden"><div style="width:100%;height:100%;background:url(${img(path.join(CAP, 'web-escritorio.png'))}) top/cover"></div></div>
      <div class="sh" style="position:absolute;left:1180px;top:260px;width:300px;height:620px;background:#111;border-radius:40px;padding:12px;overflow:hidden"><div style="width:100%;height:100%;border-radius:30px;background:url(${img(path.join(CAP, 'web-movil.png'))}) top center/100% auto"></div></div>
      <div class="lbl" style="color:#EEF0EB">Web · escritorio y móvil</div></div>`]);
  }
  for (const [name, html] of scenes) {
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${html}</body></html>`);
    await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, `ENEIA_mockup-${name}_v1.png`) });
    console.log('OK', name);
  }
  fs.unlinkSync(tmp);
  await b.close();
})();
