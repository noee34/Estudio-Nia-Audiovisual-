// ACM Performance · anuncio de reprogramación de centralitas (18 s) en 9:16 y 16:9.
// Gráficos en movimiento propios (portátil, software, cuentarrevoluciones) + logotipo del cliente + sonido sintetizado.
// Uso: node herramientas/acm_video.js
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const P = path.join(ROOT, 'MARCA/10_AUDIOVISUAL/proyectos/acm-performance');
const F = path.join(P, 'fuentes');
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(F, 'ACM_logo_transparente.png')).toString('base64');
const FPS = 25, DUR = 19.5;
const D0 = 8.4, D1 = 12.9, SHIFT = 1.5; // ventana del banco de potencia y desplazamiento del resto
const TMP = process.env.ENEIA_TMP || path.join(require('os').tmpdir(), 'acm');

function page(W, H) {
  const v = H > W; const u = v ? W / 1080 : H / 1080; // unidad de escala
  // celdas del mapa de inyección (valores deterministas)
  let cells = '';
  for (let r = 0; r < 8; r++) for (let c = 0; c < 12; c++) cells += `<i data-r="${r}" data-c="${c}"></i>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(file://${F}/Saira-Variable.ttf)}
@font-face{font-family:SI;src:url(file://${F}/Saira-Italic-Variable.ttf)}
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
#st{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:radial-gradient(90% 70% at 50% 45%,#1a1b1e 0%,#08090a 60%,#000 100%);font-family:S;color:#fff}
.c{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
.big{font:900 ${(v ? 150 : 140) * u}px/0.92 SI;letter-spacing:-.01em;text-transform:uppercase;text-align:center;white-space:nowrap}
.mid{font:800 ${(v ? 96 : 92) * u}px/1 SI;text-transform:uppercase;text-align:center;white-space:nowrap}
.sub{font:600 ${30 * u}px S;letter-spacing:.42em;text-transform:uppercase;color:#bdbdbd;text-align:center;white-space:nowrap}
.red{color:#E1262D}
#wipe{position:absolute;inset:0;pointer-events:none}
#wipe b{position:absolute;top:-20%;height:140%;width:${(v ? 380 : 520) * u}px;transform:skewX(-24deg)}
#tach{width:${(v ? 760 : 620) * u}px}
#lap{width:${(v ? 960 : 1240) * u}px}
.scr{position:relative;background:#0b0d10;border:${14 * u}px solid #16181b;border-bottom-width:${20 * u}px;border-radius:${18 * u}px ${18 * u}px 0 0;aspect-ratio:16/10;overflow:hidden;box-shadow:0 0 ${80 * u}px rgba(225,38,45,.18)}
.base{height:${26 * u}px;background:linear-gradient(#2a2c30,#121315);border-radius:0 0 ${30 * u}px ${30 * u}px;margin:0 -${40 * u}px;position:relative}
.base:after{content:"";position:absolute;left:42%;right:42%;top:0;height:${8 * u}px;background:#0c0d0e;border-radius:0 0 ${8 * u}px ${8 * u}px}
.hdr{display:flex;justify-content:space-between;align-items:center;padding:${12 * u}px ${18 * u}px;background:#121418;border-bottom:1px solid #23262b;font:700 ${15 * u}px S;letter-spacing:.18em;color:#cfd2d6}
.hdr span{color:#E1262D}
.ui{display:grid;grid-template-columns:1.05fr 1fr;gap:${14 * u}px;padding:${14 * u}px ${16 * u}px}
.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:${2 * u}px}
.grid i{display:block;aspect-ratio:1.3;border-radius:${2 * u}px;font:600 ${9 * u}px S;color:rgba(0,0,0,.65);display:grid;place-items:center}
.lbl{font:600 ${11 * u}px S;letter-spacing:.2em;color:#8a8f96;margin:${6 * u}px 0}
.kpi{display:flex;gap:${10 * u}px;margin-top:${10 * u}px}.kpi div{flex:1;border:1px solid #2a2e34;padding:${8 * u}px;font:700 ${13 * u}px S;color:#cfd2d6;letter-spacing:.1em}
.kpi b{display:block;font:800 ${24 * u}px SI;color:#fff;letter-spacing:0;margin-top:${2 * u}px}
#streaks{position:absolute;inset:0;opacity:0}
#streaks i{position:absolute;height:${3 * u}px;border-radius:2px;background:linear-gradient(90deg,transparent,#fff,transparent)}
#grain{position:absolute;inset:0;opacity:.06;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2' seed='SEED'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>")}
#logo{width:${(v ? 880 : 900) * u}px}
.pill{display:inline-block;background:#E1262D;color:#fff;font:800 ${34 * u}px SI;letter-spacing:.06em;padding:${16 * u}px ${42 * u}px;transform:skewX(-12deg)}
#fade{position:absolute;inset:0;background:#000;opacity:0}
.bar{position:absolute;left:0;right:0;height:${v ? 140 * u : 0}px;background:#000}
#dyno{position:absolute;inset:0;opacity:0;background:#000}
#dimg{position:absolute;left:0;top:0;width:${v ? W : 1000 * u}px;height:${v ? 1100 * u : H}px;object-fit:cover}
#dpan{position:absolute;${v ? `left:0;right:0;top:${1100 * u}px;bottom:0;padding:${30 * u}px ${60 * u}px ${110 * u}px` : `left:${1000 * u}px;right:0;top:0;bottom:0;padding:${120 * u}px ${70 * u}px ${100 * u}px ${40 * u}px`};display:flex;flex-direction:column}
.dl{font:700 ${22 * u}px S;letter-spacing:.3em;color:#9aa0a6}.dl b{color:#E1262D}
.dro{display:flex;gap:${40 * u}px;margin:${14 * u}px 0 ${10 * u}px}.dro div{font:600 ${18 * u}px S;letter-spacing:.2em;color:#9aa0a6}
.dro b{display:block;font:900 ${(v ? 84 : 74) * u}px/1 SI;color:#fff;letter-spacing:-.01em}
.dro .r b{color:#E1262D}
#dtag{position:absolute;left:${50 * u}px;top:${v ? 60 * u : 60 * u}px;font:700 ${22 * u}px S;letter-spacing:.3em;color:#fff}
#dtag:before{content:"";display:inline-block;width:${14 * u}px;height:${14 * u}px;border-radius:50%;background:#E1262D;margin-right:${12 * u}px}
#drpm{position:absolute;left:${50 * u}px;top:${(v ? 100 : 100) * u}px;font:800 ${40 * u}px SI;color:#fff}
.disc{font:500 ${14 * u}px S;letter-spacing:.2em;color:#5c6168;margin-top:auto}
</style></head><body><div id="st">
<div id="streaks">${Array.from({ length: 26 }, (_, i) => `<i data-i="${i}"></i>`).join('')}</div>
<div class="c big" id="t1">Más<br><span class="red">potencia.</span></div>
<div class="c" id="tachw"><svg id="tach" viewBox="-160 -160 320 245">
 <path d="M-130 60 A140 140 0 1 1 130 60" fill="none" stroke="#2a2c30" stroke-width="10"/>
 <path id="arc" d="M-130 60 A140 140 0 1 1 130 60" fill="none" stroke="#E1262D" stroke-width="10" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
 ${Array.from({ length: 9 }, (_, i) => { const a = (-210 + i * 30) * Math.PI / 180; const x1 = Math.cos(a) * 118, y1 = Math.sin(a) * 118, x2 = Math.cos(a) * 100, y2 = Math.sin(a) * 100, tx = Math.cos(a) * 82, ty = Math.sin(a) * 82; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${i >= 7 ? '#E1262D' : '#ddd'}" stroke-width="3"/><text x="${tx}" y="${ty + 6}" fill="${i >= 7 ? '#E1262D' : '#bbb'}" font-family="S" font-weight="700" font-size="17" text-anchor="middle">${i}</text>`; }).join('')}
 <g id="needle"><line x1="0" y1="0" x2="0" y2="-112" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle r="9" fill="#E1262D"/></g>
 <text id="rpm" x="0" y="55" fill="#fff" font-family="SI" font-weight="800" font-size="34" text-anchor="middle">0</text>
 <text x="0" y="74" fill="#888" font-family="S" font-weight="600" font-size="11" letter-spacing="3" text-anchor="middle">RPM ×1000</text></svg>
 <div class="mid" id="t2" style="margin-top:${70 * u}px">Precisión</div></div>
<div class="c" id="lapw"><div id="lap"><div class="scr"><div class="hdr"><div>ACM <span>TUNE</span> · ECU</div><div id="stat">LEYENDO…</div></div>
 <div class="ui"><div><div class="lbl">MAPA DE INYECCIÓN</div><div class="grid">${cells}</div>
   <div class="kpi"><div>PAR<b id="k1">—</b></div><div>POTENCIA<b id="k2">—</b></div><div>RESPUESTA<b id="k3">—</b></div></div></div>
  <div><div class="lbl">CURVA DE POTENCIA</div><svg viewBox="0 0 300 200" style="width:100%;background:#0e1115;border:1px solid #23262b">
   ${Array.from({ length: 6 }, (_, i) => `<line x1="0" x2="300" y1="${20 + i * 32}" y2="${20 + i * 32}" stroke="#1d2126"/>`).join('')}
   ${Array.from({ length: 8 }, (_, i) => `<line y1="0" y2="200" x1="${20 + i * 38}" x2="${20 + i * 38}" stroke="#1d2126"/>`).join('')}
   <path id="c1" d="M10 182 C 60 150, 100 110, 150 92 S 240 78, 292 96" fill="none" stroke="#8a8f96" stroke-width="3" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
   <path id="c2" d="M10 182 C 55 140, 95 82, 150 60 S 240 44, 292 64" fill="none" stroke="#E1262D" stroke-width="4" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
   <text x="200" y="118" fill="#8a8f96" font-family="S" font-weight="700" font-size="11" letter-spacing="2" id="l1" opacity="0">DE SERIE</text>
   <text x="200" y="38" fill="#E1262D" font-family="S" font-weight="700" font-size="11" letter-spacing="2" id="l2" opacity="0">ACM STAGE</text></svg>
   <div class="lbl" id="prog" style="margin-top:${10 * u}px">ESCRITURA ░░░░░░░░░░ 0%</div></div></div></div><div class="base"></div></div>
 <div class="sub" id="t3" style="margin-top:${(v ? 70 : 40) * u}px">Reprogramación de centralitas</div></div>
<div class="c mid" id="t4"></div>
<div class="c big" id="t5">Siente la<br><span class="red">diferencia.</span></div>
<div class="c" id="endw" style="text-align:center"><img id="logo" src="${LOGO}"><div class="sub" id="t6" style="margin-top:${(v ? 60 : 40) * u}px">Reprogramación de centralitas</div><div id="t7" style="margin-top:${(v ? 70 : 40) * u}px"><span class="pill">PIDE TU CITA</span></div></div>
<div id="dyno"><img id="dimg"><div id="dtag">BANCO DE POTENCIA</div><div id="drpm">0 RPM</div>
 <div id="dpan"><div class="dl">CURVA DE POTENCIA · <b>ACM</b></div>
  <div class="dro"><div class="r">POTENCIA<b id="dcv">0 CV</b></div><div>PAR<b id="dnm">0 Nm</b></div></div>
  <svg id="dg" viewBox="0 0 600 340" style="width:100%;flex:1;min-height:0">
   ${Array.from({ length: 6 }, (_, i) => `<line x1="40" x2="590" y1="${20 + i * 58}" y2="${20 + i * 58}" stroke="#1d2126"/>`).join('')}
   ${Array.from({ length: 7 }, (_, i) => `<line y1="20" y2="310" x1="${40 + i * 91.6}" x2="${40 + i * 91.6}" stroke="#1d2126"/><text x="${40 + i * 91.6}" y="332" fill="#5c6168" font-family="S" font-size="14" text-anchor="middle">${i + 1}k</text>`).join('')}
   <path id="ds" fill="none" stroke="#6b7076" stroke-width="3" stroke-dasharray="8 6"/>
   <path id="da" fill="none" stroke="#E1262D" stroke-width="4.5"/><circle id="dd" r="7" fill="#fff"/>
   <text x="590" y="16" fill="#6b7076" font-family="S" font-size="13" text-anchor="end" letter-spacing="2">— — DE SERIE   ━ ACM</text></svg>
  <div class="disc">VALORES ILUSTRATIVOS · CADA MOTOR SE MIDE EN BANCO</div></div></div>
<div id="wipe"><b style="background:#d9d9d9"></b><b style="background:#8c8c8c"></b><b style="background:#E1262D"></b></div>
<div id="grain"></div><div id="fade"></div></div>
<script>
const W=${W},H=${H},V=${v};
const $=id=>document.getElementById(id), cl=x=>Math.max(0,Math.min(1,x)), eo=x=>1-Math.pow(1-cl(x),3), ei=x=>{x=cl(x);return x*x*x}, eio=x=>{x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
const show=(id,a,b,t,dz=1.12)=>{const el=$(id);const k=eo((t-a)/0.35), o=Math.min(k,1-cl((t-(b-0.25))/0.25));el.style.opacity=o;el.style.transform='translate(-50%,-50%) scale('+(dz-(dz-1)*k)+')';};
const W4=[];
const WIPES=[0.0,8.55,9.45,10.35,13.85];
const cells=[...document.querySelectorAll('.grid i')];
const streaks=[...document.querySelectorAll('#streaks i')];
function heat(v){const r=Math.round(40+215*v),g=Math.round(200-150*v),b=Math.round(80-60*v);return 'rgb('+r+','+g+','+Math.max(20,b)+')'}
window.base=(t)=>{
  // barrido de franjas (como el logotipo)
  let wp=-1; for(const w of window.RW){ if(window.RT>=w&&window.RT<w+0.55) wp=(window.RT-w)/0.55; }
  [...$('wipe').children].forEach((b,i)=>{ const x=wp<0?-2:eio(wp-i*0.08); b.style.left=(-0.6+x*1.9)*W+'px'; b.style.display=wp<0?'none':'block'; });
  show('t1',0.35,1.8,t);
  // cuentarrevoluciones
  const tw=$('tachw'); const tk=eo((t-1.8)/0.35)*(1-cl((t-3.75)/0.25)); tw.style.opacity=tk; tw.style.transform='translate(-50%,-50%) scale('+(1.08-0.08*eo((t-1.8)/0.5))+')';
  const rp=eio((t-2.0)/1.4)*7.2 + (t>3.4? Math.sin(t*90)*0.06:0); $('needle').setAttribute('transform','rotate('+(-120+rp/8*240)+')');
  $('arc').style.strokeDashoffset=100-rp/8*100; $('rpm').textContent=(rp).toFixed(1);
  $('t2').style.opacity=eo((t-2.6)/0.3);
  // portátil
  const lw=$('lapw'); const lk=eo((t-4.0)/0.6)*(1-cl((t-8.35)/0.25)); lw.style.opacity=lk; lw.style.transform='translate(-50%,calc(-50% + '+(60*(1-eo((t-4.0)/0.6)))+'px)) scale('+(0.96+0.06*cl((t-4)/4.6))+')';
  const pr=cl((t-5.6)/1.6);
  cells.forEach((c,i)=>{const r=+c.dataset.r, cc=+c.dataset.c; let v=(r/7)*0.5+(cc/11)*0.4+0.05*Math.sin(r*3+cc); v=v+pr*0.18*Math.sin(cc/11*Math.PI); v=Math.max(0,Math.min(1,v)); c.style.background=heat(v); c.textContent=(10+v*90).toFixed(0)});
  $('c1').style.strokeDashoffset=100-100*eio((t-4.6)/1.0); $('l1').setAttribute('opacity',cl((t-5.5)/0.3));
  $('c2').style.strokeDashoffset=100-100*eio((t-5.8)/1.3); $('l2').setAttribute('opacity',cl((t-7.0)/0.3));
  const n=Math.round(pr*10); $('prog').textContent='ESCRITURA '+'█'.repeat(n)+'░'.repeat(10-n)+' '+Math.round(pr*100)+'%';
  $('stat').textContent=t<5.6?'LEYENDO…':(pr<1?'ESCRIBIENDO…':'✓ COMPLETADO'); $('stat').style.color=pr>=1?'#4cd27a':'#cfd2d6';
  $('k1').textContent=pr>0.99?'▲':'—'; $('k2').textContent=pr>0.99?'▲':'—'; $('k3').textContent=pr>0.99?'▲':'—';
  $('t3').style.opacity=eo((t-7.0)/0.4);
  // palabras
  const t4=$('t4'); let on=false; for(const [a,b,h] of W4){ if(t>=a&&t<b){ t4.innerHTML=h; show('t4',a+0.05,b,t,1.18); on=true; } } if(!on) t4.style.opacity=0;
  // velocidad
  const sk=eo((t-11.4)/0.3)*(1-cl((t-13.8)/0.2)); $('streaks').style.opacity=sk;
  streaks.forEach((s,i)=>{const y=((i*137)%100); const sp=1.6+((i*53)%10)/5; const len=(0.15+((i*29)%10)/30)*W; const x=((t*sp*W*0.9)+(i*311)%W)%(W+len)-len; s.style.top=y+'%'; s.style.width=len+'px'; s.style.left=(W-x)+'px'; s.style.opacity=0.25+((i*17)%10)/14;});
  show('t5',11.6,13.85,t,1.25);
  // cierre
  const e=$('endw'); e.style.opacity=t>=14.2?1:0; e.style.transform='translate(-50%,-50%) scale('+(1.04-0.04*eo((t-14.2)/2))+')';
  const rv=eio((t-14.3)/0.8); $('logo').style.clipPath='inset(0 '+(100-rv*100)+'% 0 0)';
  $('t6').style.opacity=eo((t-15.1)/0.5); $('t7').style.opacity=eo((t-15.7)/0.4); $('t7').style.transform='translateY('+(20*(1-eo((t-15.7)/0.4)))+'px)';
  $('fade').style.opacity=cl((t-17.6)/0.4);
  $('grain').style.backgroundPosition=((t*977)%220)+'px '+((t*631)%220)+'px';
};
// curvas del banco (ilustrativas): CV en función de las rpm
const Ps=r=>{const x=(r-1000)/6000;return 168*Math.sin(Math.min(1,x*1.08)*Math.PI*0.62)**1.15*(x>0.85?1-(x-0.85)*0.9:1)};
const Pa=r=>Ps(r)*(1+0.075*Math.exp(-Math.pow(((r-1000)/6000-0.62)/0.28,2)));
const X=r=>40+(r-1000)/6000*550, Y=p=>310-p/200*290;
const path=(f,r1)=>{let d='';for(let r=1000;r<=r1;r+=50)d+=(r===1000?'M':'L')+X(r).toFixed(1)+' '+Y(f(r)).toFixed(1);return d};
document.getElementById('ds').setAttribute('d',path(Ps,7000));
window.RW=[0.0,8.25,12.75,13.85+${SHIFT}];
window.dyno=(t)=>{ // t local 0..4.5
  const r=1000+6000*eio((t-0.35)/3.6);
  document.getElementById('da').setAttribute('d',path(Pa,r));
  const dd=document.getElementById('dd'); dd.setAttribute('cx',X(r)); dd.setAttribute('cy',Y(Pa(r)));
  const cv=Pa(r), nm=cv*7023/Math.max(r,1000);
  document.getElementById('dcv').textContent=Math.round(cv)+' CV'; document.getElementById('dnm').textContent=Math.round(nm)+' Nm';
  document.getElementById('drpm').textContent=Math.round(r/10)*10+' RPM';
};
window.render=(t)=>{ window.RT=t; const D0=${D0},D1=${D1};
  const dy=document.getElementById('dyno');
  if(t<D0){ dy.style.opacity=0; window.base(t); }
  else if(t<D1){ window.base(13.9); ['t1','tachw','lapw','t4','t5','endw','streaks'].forEach(i=>document.getElementById(i).style.opacity=0);
    dy.style.opacity=Math.min(1,(t-D0)/0.25)*Math.min(1,(D1-t)/0.2); window.dyno(t-D0); }
  else { dy.style.opacity=0; window.base(t-${SHIFT}); }
};
</script></body></html>`;
}

function audio(file) {
  const hits = [0.35, 1.8, 4.0, 5.8, 8.4, 12.9, 15.8];
  const whoosh = [0.0, 8.25, 12.75, 15.35];
  const hit = hits.map((h) => `0.5*sin(2*PI*48*(t-${h}))*exp(-(t-${h})*7)*gte(t,${h})`).join('+');
  const wh = whoosh.map((w) => `0.22*(random(0)*2-1)*exp(-pow((t-${w}-0.25)*7,2))`).join('+');
  // motor: frecuencia que sube (fase integrada) con armónicos y saturación
  const eng = (a, b, f0, k, g) => `${g}*between(t,${a},${b})*min(1,(t-${a})*4)*min(1,(${b}-t)*3)*tanh(3*(sin(2*PI*(${f0}*(t-${a})+${k}*pow(t-${a},2)))+0.5*sin(4*PI*(${f0}*(t-${a})+${k}*pow(t-${a},2)))+0.3*sin(6*PI*(${f0}*(t-${a})+${k}*pow(t-${a},2)))))`;
  const expr = [hit, wh, eng(1.8, 3.9, 38, 32, 0.20), eng(8.6, 12.7, 30, 14, 0.22), eng(12.8, 15.4, 60, 28, 0.17),
    `0.07*sin(2*PI*55*t)*(1-gte(t,18.7))`, `0.16*sin(2*PI*1200*t)*exp(-(t-7.2)*10)*gte(t,7.2)`].join('+');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', `aevalsrc='${expr}':s=48000:d=${DUR}`,
    '-af', `lowpass=f=7000,highpass=f=30,afade=t=out:st=${DUR - 0.6}:d=0.6,alimiter=limit=0.9`, '-ac', '2', '-c:a', 'pcm_s16le', file]);
}

const DYN = Math.round((D1 - D0) * FPS);
const dynDir = (W, H) => path.join(TMP, `dyno_${W}x${H}`);
async function renderDyno(W, H) { // fotogramas del banco 3D (servidor local para módulos ES)
  const dir = dynDir(W, H); fs.mkdirSync(dir, { recursive: true });
  const pw = W > H ? Math.round(1000 * H / 1080) : W, ph = W > H ? H : Math.round(1100 * W / 1080);
  const srv = require('http').createServer((q, r) => { const f = path.join(__dirname, 'acm_dyno', decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript' : 'text/html' }); r.end(d); }); }).listen(0);
  const port = srv.address().port;
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: pw, height: ph } });
  await p.goto(`http://127.0.0.1:${port}/dyno.html?w=${pw}&h=${ph}&sub=8`); await p.waitForFunction(() => window.ready);
  for (let k = 0; k < DYN; k++) { await p.evaluate((t) => window.renderAt(t), k / FPS); await p.screenshot({ path: path.join(dir, `d${String(k).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 93 }); }
  await b.close(); srv.close();
}

(async () => {
  fs.mkdirSync(path.join(P, 'video'), { recursive: true }); fs.mkdirSync(TMP, { recursive: true });
  await renderDyno(1080, 1920); await renderDyno(1920, 1080);
  const b = await chromium.launch();
  for (const [W, H, name] of [[1080, 1920, 'ACM_anuncio-reprogramacion_9x16_v2.mp4'], [1920, 1080, 'ACM_anuncio-reprogramacion_16x9_v2.mp4']]) {
    const tmp = fs.mkdtempSync(path.join(TMP, 'acm-'));
    fs.writeFileSync(path.join(tmp, 'p.html'), page(W, H));
    const p = await b.newPage({ viewport: { width: W, height: H } });
    await p.goto('file://' + path.join(tmp, 'p.html')); await p.evaluate(() => document.fonts.ready);
    for (let f = 0; f < DUR * FPS; f++) {
      const t = f / FPS;
      if (t >= D0 && t < D1) { const k = Math.min(DYN - 1, Math.round((t - D0) * FPS)); await p.evaluate(async (src) => { const im = document.getElementById('dimg'); im.src = src; await im.decode(); }, 'file://' + path.join(dynDir(W, H), `d${String(k).padStart(4, '0')}.jpg`)); }
      await p.evaluate((t) => window.render(t), t);
      await p.screenshot({ path: path.join(tmp, `f${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
    }
    await p.close();
    const wav = path.join(tmp, 'a.wav'); audio(wav);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.jpg'), '-i', wav,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '18', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', path.join(P, 'video', name)]);
    for (const [k, s] of [[1, 1.2], [2, 3.4], [3, 7.6], [4, 10.6], [5, 14.1], [6, 18.0]])
      fs.copyFileSync(path.join(tmp, `f${String(Math.round(s * FPS)).padStart(4, '0')}.jpg`), path.join(P, 'video', `${name.replace('.mp4', '')}_fotograma-${k}.jpg`));
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log('OK', name);
  }
  await b.close();
})();
