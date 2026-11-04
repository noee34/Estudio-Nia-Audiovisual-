// Eneia Estudio · render de vídeos de marca (ident 6,5 s y manifiesto 20 s) en 16:9 y 9:16.
// Fotogramas con Chromium (Playwright) + banda sonora original sintetizada con ffmpeg.
// Uso: node herramientas/video.js
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'MARCA/10_AUDIOVISUAL');
const FONTS = path.join(ROOT, 'MARCA/05_IDENTIDAD_VISUAL/tipografias');
const comp = JSON.parse(fs.readFileSync(path.join(ROOT, 'MARCA/04_LOGOTIPOS/componentes.json'), 'utf8'));
const FPS = 25;

const FRASES = [
  'Hay empresas que hacen cosas extraordinarias.',
  'Y vídeos que las hacen parecer todas iguales.',
  'Primero, escuchamos.',
  'Filmamos a vuestra gente. Con su voz.',
  'Sin bancos de imágenes. Sin épica de alquiler.',
  'Mirada de cine. Oficio de empresa.',
];

function page(W, H) {
  const logo = `<svg id="logo" viewBox="0 0 ${comp.w} ${comp.h}">
    <g id="esq"><path d="${comp.esquinas}" fill="#EEF0EB"/></g>
    ${comp.letras.map((d, i) => `<path class="l" id="l${i}" d="${d}" fill="#EEF0EB"/>`).join('')}
    <circle id="dot" cx="${comp.punto.cx}" cy="${comp.punto.cy}" r="${comp.punto.r}" fill="#E4412B"/>
    <path id="desc" d="${comp.descriptor}" fill="#EEF0EB"/></svg>`;
  const vert = H > W;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:IS;src:url(file://${FONTS}/InstrumentSans-Variable.ttf)}
  @font-face{font-family:ISeI;src:url(file://${FONTS}/InstrumentSerif-Italic.ttf)}
  @font-face{font-family:ISe;src:url(file://${FONTS}/InstrumentSerif-Regular.ttf)}
  html,body{margin:0;width:${W}px;height:${H}px;background:#0E1A20;overflow:hidden}
  #stage{position:relative;width:${W}px;height:${H}px;background:radial-gradient(120% 90% at 50% 40%,#13232a 0%,#0E1A20 60%,#0a1317 100%)}
  #logo{position:absolute;left:50%;top:${vert ? 44 : 46}%;width:${vert ? 82 : 52}%;transform:translate(-50%,-50%);overflow:visible}
  #esq,.l,#dot,#desc{transform-box:fill-box;transform-origin:center}
  #tag{position:absolute;left:0;right:0;top:${vert ? 60 : 72}%;text-align:center;font:400 ${vert ? 64 : 48}px ISeI;color:#EEF0EB;opacity:0}
  #frase{position:absolute;left:${vert ? 9 : 14}%;right:${vert ? 9 : 14}%;top:50%;transform:translateY(-50%);text-align:center;font:400 ${vert ? 104 : 92}px/1.12 ISe;color:#EEF0EB;letter-spacing:-.01em}
  .vf{position:absolute;font:500 ${vert ? 30 : 24}px IS;letter-spacing:.14em;color:#EEF0EB;opacity:.85}
  .c{position:absolute;width:${vert ? 90 : 80}px;height:${vert ? 90 : 80}px;border-color:#EEF0EB;border-style:solid;opacity:.9}
  #rec::before{content:"";display:inline-block;width:.6em;height:.6em;border-radius:50%;background:#E4412B;margin-right:.5em;vertical-align:.05em}
  #grain{position:absolute;inset:0;opacity:.05;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")}
  #fade{position:absolute;inset:0;background:#0E1A20;opacity:0}
  </style></head><body><div id="stage">
  <div id="vf" style="opacity:0">
    <div class="c" style="left:5%;top:${vert ? 4 : 7}%;border-width:3px 0 0 3px"></div><div class="c" style="right:5%;top:${vert ? 4 : 7}%;border-width:3px 3px 0 0"></div>
    <div class="c" style="left:5%;bottom:${vert ? 4 : 7}%;border-width:0 0 3px 3px"></div><div class="c" style="right:5%;bottom:${vert ? 4 : 7}%;border-width:0 3px 3px 0"></div>
    <div class="vf" id="rec" style="left:calc(5% + ${vert ? 110 : 100}px);top:calc(${vert ? 4 : 7}% + 6px)">REC</div>
    <div class="vf" style="right:calc(5% + ${vert ? 110 : 100}px);top:calc(${vert ? 4 : 7}% + 6px)">${vert ? '4K · 25P · 9:16' : '4K · 25P'}</div>
    <div class="vf" style="left:calc(5% + ${vert ? 110 : 100}px);bottom:calc(${vert ? 4 : 7}% + 6px)">GALICIA</div>
    <div class="vf" id="tc" style="right:calc(5% + ${vert ? 110 : 100}px);bottom:calc(${vert ? 4 : 7}% + 6px)">00:00:00:00</div>
    <div id="frase"></div>
  </div>
  ${logo}<div id="tag">Mirada de cine. Oficio de empresa.</div><div id="grain"></div><div id="fade"></div></div>
  <script>
  const FR=${JSON.stringify(FRASES)};
  const cl=(x)=>Math.max(0,Math.min(1,x)), eo=(x)=>1-Math.pow(1-cl(x),3), io=(x)=>{x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
  const $=(id)=>document.getElementById(id);
  function logoAt(t){ // t = segundos desde el inicio de la animación del logotipo
    const e=eo((t-0.0)/0.8); $('esq').style.opacity=e; $('esq').style.transform='scale('+(1.28-0.28*e)+')';
    const d=t<0.8?0:(t<1.0?1:(t<1.15?0:1)); $('dot').style.opacity=d; $('dot').style.transform='scale('+(t<0.8?0:1)+')';
    for(let i=0;i<5;i++){const k=eo((t-1.2-0.11*i)/0.55);const el=$('l'+i);el.style.opacity=k;el.style.transform='translateY('+(14*(1-k))+'px)';}
    const k=eo((t-2.0)/0.6); $('desc').style.opacity=k; $('desc').style.transform='translateY('+(8*(1-k))+'px)';
  }
  window.renderIdent=(t)=>{ $('vf').style.opacity=0; logoAt(t-0.5); const g=eo((t-3.3)/0.7); $('tag').style.opacity=g; $('tag').style.transform='translateY('+(10*(1-g))+'px)'; $('fade').style.opacity=cl((t-6.1)/0.4); };
  window.renderManif=(t,fps)=>{
    const seg=2.8, n=FR.length, end=seg*n;
    const f=Math.round(t*fps), ff=String(f%fps).padStart(2,'0'), s=String(Math.floor(t)%60).padStart(2,'0');
    $('tc').textContent='00:00:'+s+':'+ff;
    $('rec').style.visibility=(Math.floor(t*2)%2===0)?'visible':'hidden';
    if(t<end){ const i=Math.floor(t/seg), u=t-i*seg; $('frase').textContent=FR[i];
      const a=Math.min(eo(u/0.45), 1-cl((u-(seg-0.35))/0.35)); $('frase').style.opacity=a; $('frase').style.transform='translateY(calc(-50% + '+(12*(1-eo(u/0.6)))+'px))';
      $('vf').style.opacity=eo(t/0.6); $('logo').style.opacity=0; $('tag').style.opacity=0;
    } else { $('frase').style.opacity=0; $('vf').style.opacity=1-eo((t-end)/0.5); $('logo').style.opacity=1; logoAt((t-end-0.2)*1.25); }
    $('fade').style.opacity=cl((t-19.6)/0.4);
  };
  </script></body></html>`;
}

function audio(kind, dur, file) {
  // Banda sonora original: drone (55/82,4/110 Hz con trémolo lento) + pulso + tono REC (1 kHz).
  let expr;
  if (kind === 'ident') {
    expr = `0.22*(0.6*sin(2*PI*55*t)+0.35*sin(2*PI*82.41*t)+0.2*sin(2*PI*110*t))*(0.75+0.25*sin(2*PI*0.25*t))*min(1,t/1.2)` +
      `+0.16*sin(2*PI*1000*t)*between(t,1.3,1.42)` +
      `+0.10*sin(2*PI*1500*t)*exp(-(t-1.75)*14)*gte(t,1.75)` +
      `+0.12*sin(2*PI*164.8*t)*exp(-(t-1.75)*1.2)*gte(t,1.75)`;
  } else {
    expr = `0.2*(0.6*sin(2*PI*55*t)+0.35*sin(2*PI*82.41*t)+0.18*sin(2*PI*110*t))*(0.8+0.2*sin(2*PI*0.2*t))*min(1,t/1.5)` +
      `+0.35*sin(2*PI*58*t)*exp(-mod(t,1.4)*9)*lt(t,16.8)` +
      `+0.05*sin(2*PI*329.6*t)*min(1,max(0,(t-5.6)/3))*lt(t,16.8)` +
      `+0.16*sin(2*PI*1000*t)*between(t,17.0,17.12)` +
      `+0.12*sin(2*PI*164.8*t)*exp(-(t-17.45)*1.0)*gte(t,17.45)`;
  }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', `aevalsrc='${expr}':s=48000:d=${dur}`,
    '-af', `lowpass=f=4000,afade=t=in:d=0.3,afade=t=out:st=${dur - 0.6}:d=0.6,aecho=0.6:0.5:120:0.25,alimiter=limit=0.85`,
    '-ac', '2', '-c:a', 'pcm_s16le', file]);
}

(async () => {
  const browser = await chromium.launch();
  const jobs = [
    ['ident', 6.5, 1920, 1080, 'ENEIA_ident_16x9_v1.mp4'],
    ['ident', 6.5, 1080, 1920, 'ENEIA_ident_9x16_v1.mp4'],
    ['manif', 20, 1920, 1080, 'ENEIA_manifiesto_16x9_v1.mp4'],
    ['manif', 20, 1080, 1920, 'ENEIA_manifiesto_9x16_v1.mp4'],
  ];
  fs.mkdirSync(path.join(OUT, 'video'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'storyboard'), { recursive: true });
  for (const [kind, dur, W, H, name] of jobs) {
    const base = process.env.ENEIA_TMP || os.tmpdir();
    fs.mkdirSync(base, { recursive: true });
    const tmp = fs.mkdtempSync(path.join(base, 'eneia-'));
    const htmlFile = path.join(tmp, 'p.html');
    fs.writeFileSync(htmlFile, page(W, H));
    const p = await browser.newPage({ viewport: { width: W, height: H } });
    await p.goto('file://' + htmlFile); await p.evaluate(() => document.fonts.ready);
    const N = Math.round(dur * FPS);
    for (let f = 0; f < N; f++) {
      const t = f / FPS;
      await p.evaluate(([k, t, fps]) => k === 'ident' ? window.renderIdent(t) : window.renderManif(t, fps), [kind, t, FPS]);
      await p.screenshot({ path: path.join(tmp, `f${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 94 });
    }
    await p.close();
    const wav = path.join(tmp, 'a.wav'); audio(kind, dur, wav);
    const out = path.join(OUT, 'video', name);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.jpg'), '-i', wav,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '18', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out]);
    // fotogramas clave para el storyboard
    const keys = kind === 'ident' ? [0.3, 1.2, 1.6, 2.4, 3.2, 5.0] : [1.4, 4.2, 7.0, 9.8, 12.6, 15.4, 18.8];
    keys.forEach((k, i) => fs.copyFileSync(path.join(tmp, `f${String(Math.round(k * FPS)).padStart(4, '0')}.jpg`),
      path.join(OUT, 'storyboard', `${name.replace('.mp4', '')}_${String(i + 1).padStart(2, '0')}.jpg`)));
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log('OK', name);
  }
  await browser.close();
})();
