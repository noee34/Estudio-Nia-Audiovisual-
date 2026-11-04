// Vídeo viral «satisfactorio»: una bola rebota dentro de un círculo, crece con cada rebote y cada rebote suena.
// 1080×1920, 30 fps, ~61 s (por encima del minuto que exige el programa de recompensas de TikTok). Música original sintetizada.
// Uso: node herramientas/viral/rebote.js [semilla] [crecimiento] [vmin]
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'MARCA/10_AUDIOVISUAL/proyectos/viral');
const FONT = path.join(ROOT, 'MARCA/10_AUDIOVISUAL/proyectos/acm-performance/fuentes/Saira-Italic-Variable.ttf');
const FONT2 = path.join(ROOT, 'MARCA/10_AUDIOVISUAL/proyectos/acm-performance/fuentes/Saira-Variable.ttf');
const SEED = +process.argv[2] || 15838, GROW = +process.argv[3] || 2, VMIN = +process.argv[4] || 800;
const FPS = 30, W = 1080, H = 1920, R = 430, CX = 540, CY = 1010, END_EXTRA = 7.2;

// ── simulación determinista ─────────────────────────────
function simulate() {
  let s = SEED; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const g = 1500, dt = 1 / 1200;
  let x = 60, y = -200, vx = 520, vy = 0, r = 16, t = 0, n = 0;
  const frames = [], hits = []; let nextF = 0;
  while (r < R * 0.97 && t < 200) {
    vy += g * dt; x += vx * dt; y += vy * dt;
    const d = Math.hypot(x, y);
    if (d + r >= R) {
      const nx = x / d, ny = y / d, vn = vx * nx + vy * ny;
      if (vn > 0) {
        vx -= 2 * vn * nx; vy -= 2 * vn * ny;
        const sp = Math.hypot(vx, vy), k = Math.max(sp, VMIN) / sp; vx *= k; vy *= k; vx += (rnd() - 0.5) * 40;
        n++; r += GROW; hits.push({ t, n, ang: Math.atan2(ny, nx) });
      }
      const pen = d + r - R; x -= nx * pen; y -= ny * pen;
    }
    t += dt;
    if (t >= nextF / FPS) { frames.push({ x, y, r, n }); nextF++; }
  }
  return { frames, hits, T: t };
}

// ── síntesis de audio (melodía pentatónica original, una nota por rebote) ──
function synth(hits, T, dur, file) {
  const SR = 48000, N = Math.ceil(dur * SR), buf = new Float32Array(N);
  const scale = [0, 2, 4, 7, 9]; // pentatónica mayor
  const pat = [0, 2, 4, 2, 1, 3, 5, 3, 2, 4, 6, 4, 3, 5, 7, 5];
  const note = (i) => { const step = pat[i % pat.length] + Math.floor(i / 48) % 3; const o = Math.floor(step / 5), d = step % 5; return 261.63 * Math.pow(2, (scale[d] + 12 * o) / 12); };
  const add = (t0, f, amp, dec) => { const i0 = Math.floor(t0 * SR), L = Math.floor(dec * 6 * SR); for (let i = 0; i < L && i0 + i < N; i++) { const tt = i / SR, e = Math.exp(-tt / dec) * Math.min(1, tt * 400); buf[i0 + i] += amp * e * (Math.sin(2 * Math.PI * f * tt) + 0.35 * Math.sin(4 * Math.PI * f * tt) + 0.12 * Math.sin(6 * Math.PI * f * tt)); } };
  hits.forEach((h, i) => add(h.t, note(i), 0.16, 0.22));
  // final: acorde + golpe grave
  [261.63, 329.63, 392.0, 523.25, 659.25].forEach((f, k) => add(T + 0.02 * k, f, 0.12, 1.4));
  add(T, 55, 0.5, 0.5);
  // pad suave de fondo que crece con la tensión
  for (let i = 0; i < Math.min(N, Math.floor(T * SR)); i++) { const tt = i / SR, k = Math.min(1, tt / T); buf[i] += 0.03 * (0.4 + k) * (Math.sin(2 * Math.PI * 65.41 * tt) + 0.5 * Math.sin(2 * Math.PI * 98 * tt)); }
  // eco sencillo
  const D = Math.floor(0.18 * SR); for (let i = D; i < N; i++) buf[i] += 0.28 * buf[i - D];
  let m = 0; for (const v of buf) m = Math.max(m, Math.abs(v)); const sc = 0.89 / m;
  const pcm = Buffer.alloc(N * 2); for (let i = 0; i < N; i++) pcm.writeInt16LE(Math.round(buf[i] * sc * 32767), i * 2);
  const hdr = Buffer.alloc(44); hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write('WAVEfmt ', 8); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(1, 22); hdr.writeUInt32LE(SR, 24); hdr.writeUInt32LE(SR * 2, 28); hdr.writeUInt16LE(2, 32); hdr.writeUInt16LE(16, 34); hdr.write('data', 36); hdr.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(file, Buffer.concat([hdr, pcm]));
}

const page = (TOTAL) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:SI;src:url(file://${FONT})}@font-face{font-family:S;src:url(file://${FONT2})}
html,body{margin:0;background:#000}canvas{display:block}</style></head><body><canvas id="c" width="${W}" height="${H}"></canvas><script>
const c=document.getElementById('c'),x=c.getContext('2d');const R=${R},CX=${CX},CY=${CY};
const trail=[];let lastN=0,flash=0,flashHue=0;
const hue=n=>(n*7)%360;
window.draw=(f,t,T,hitAng)=>{
  x.fillStyle='#000';x.fillRect(0,0,${W},${H});
  const end=t>=T, k=end?Math.min(1,(t-T)/0.5):0;
  if(f.n>lastN){flash=1;flashHue=hue(f.n);lastN=f.n}
  // estela
  if(!end){trail.push({x:f.x,y:f.y,r:f.r,h:hue(f.n)});if(trail.length>26)trail.shift()}
  x.save();x.translate(CX,CY);
  trail.forEach((p,i)=>{x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.strokeStyle='hsla('+p.h+',100%,60%,'+(i/trail.length*0.55)+')';x.lineWidth=3;x.stroke()});
  // anillo
  x.beginPath();x.arc(0,0,R+6,0,7);x.lineWidth=8;x.strokeStyle=flash>0?'hsl('+flashHue+',100%,'+(55+35*flash)+'%)':'#e9e9e9';x.shadowColor=x.strokeStyle;x.shadowBlur=30*flash+10;x.stroke();x.shadowBlur=0;
  // bola
  const rr=end?f.r+(R-f.r)*k:f.r;
  const gr=x.createRadialGradient(f.x*(1-k)-rr*0.35,f.y*(1-k)-rr*0.35,rr*0.1,f.x*(1-k),f.y*(1-k),rr);
  gr.addColorStop(0,'hsl('+hue(f.n)+',100%,75%)');gr.addColorStop(1,'hsl('+hue(f.n)+',100%,45%)');
  x.beginPath();x.arc(f.x*(1-k),f.y*(1-k),rr,0,7);x.fillStyle=gr;x.shadowColor='hsl('+hue(f.n)+',100%,60%)';x.shadowBlur=40;x.fill();x.shadowBlur=0;
  // partículas finales
  if(end){for(let i=0;i<90;i++){const a=i*2.399,sp=(200+(i*37)%500)*(t-T);x.beginPath();x.arc(Math.cos(a)*(R+sp),Math.sin(a)*(R+sp),6,0,7);x.fillStyle='hsla('+((i*23)%360)+',100%,65%,'+Math.max(0,1-(t-T)/2.5)+')';x.fill()}
    x.fillStyle='rgba(255,255,255,'+Math.max(0,0.9-(t-T)*2.5)+')';x.beginPath();x.arc(0,0,R,0,7);x.fill()}
  x.restore();
  flash=Math.max(0,flash-0.18);
  // textos
  x.textAlign='center';x.fillStyle='#fff';
  x.font='900 italic 74px SI';x.fillText(end?'¡LLENO!':'¿CUÁNTOS REBOTES',540,250);
  x.font='900 italic 74px SI';x.fillText(end?f.n+' REBOTES':'PARA LLENARLO?',540,335);
  x.font='600 36px S';x.fillStyle='#bdbdbd';x.fillText(end?'¿Acertaste? Dímelo en comentarios':'Comenta tu apuesta antes del final',540,410);
  x.font='900 italic 150px SI';x.fillStyle='hsl('+hue(f.n)+',100%,65%)';x.fillText(String(f.n),540,1640);
  x.font='700 30px S';x.fillStyle='#8a8a8a';x.letterSpacing='10px';x.fillText('REBOTES',540,1700);x.letterSpacing='0px';
  // barra de llenado
  const p=Math.min(1,(f.r-16)/(R*0.97-16));x.fillStyle='#222';x.fillRect(240,1760,600,10);x.fillStyle='hsl('+hue(f.n)+',100%,60%)';x.fillRect(240,1760,600*(end?1:p),10);
};
</script></body></html>`;

(async () => {
  const { frames, hits, T } = simulate();
  const TOTAL = T + END_EXTRA, NF = Math.round(TOTAL * FPS);
  console.log('rebotes', hits.length, 'llenado en', T.toFixed(1), 's · total', TOTAL.toFixed(1), 's');
  const tmp = fs.mkdtempSync(path.join(process.env.ENEIA_TMP || os.tmpdir(), 'viral-'));
  fs.writeFileSync(path.join(tmp, 'p.html'), page(TOTAL));
  const wav = path.join(tmp, 'a.wav'); synth(hits, T, TOTAL, wav);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: H } });
  await p.goto('file://' + path.join(tmp, 'p.html')); await p.evaluate(() => document.fonts.ready);
  for (let i = 0; i < NF; i++) {
    const t = i / FPS, f = frames[Math.min(i, frames.length - 1)];
    await p.evaluate(([f, t, T]) => window.draw(f, t, T), [f, t, T]);
    await p.screenshot({ path: path.join(tmp, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 90 });
  }
  await b.close();
  fs.mkdirSync(OUT, { recursive: true });
  const dst = path.join(OUT, `VIRAL_rebotes-circulo_9x16_v1.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%05d.jpg'), '-i', wav, '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', dst]);
  for (const s of [1, 25, 50, Math.floor(T) + 1]) fs.copyFileSync(path.join(tmp, `f${String(Math.min(NF - 1, s * FPS)).padStart(5, '0')}.jpg`), path.join(OUT, `VIRAL_rebotes_fotograma-${s}s.jpg`));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('OK', dst);
})();
