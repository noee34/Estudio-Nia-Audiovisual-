// Serie «Cómo empezar en el drift» · Episodio 1 (≈43 s, 9:16) con el personaje original «Driftzilla» (un coche de dibujos).
// Información real de drift contada con humor.
// Dibujos animados vectoriales en canvas + música y efectos sintetizados (sin derechos de terceros).
// Uso: node herramientas/viral/drift_ep1.js
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'MARCA/10_AUDIOVISUAL/proyectos/viral');
const FONT = path.join(OUT, 'fuentes/Fredoka-Variable.ttf');
const FPS = 30, W = 1080, H = 1920;
// escenas: [id, duración]
const SC = [['intro', 3.8], ['p1', 6.6], ['p2', 6], ['p3', 8.4], ['p4', 5.4], ['outro', 5.6]];
const START = []; let acc = 0; for (const [, d] of SC) { START.push(acc); acc += d; } const TOTAL = acc;

const page = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:F;src:url(file://${FONT})}html,body{margin:0;background:#000}canvas{display:block}</style></head><body>
<canvas id="c" width="${W}" height="${H}"></canvas><script>
const SC=${JSON.stringify(SC)},START=${JSON.stringify(START)};
const c=document.getElementById('c'),x=c.getContext('2d');
const cl=v=>Math.max(0,Math.min(1,v)),eo=v=>1-Math.pow(1-cl(v),3),eio=v=>{v=cl(v);return v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2};
const back=v=>{v=cl(v);const s=1.70158;return 1+(s+1)*Math.pow(v-1,3)+s*Math.pow(v-1,2)}; // rebote cómico
const INK='#16161a',RED='#ff3b3b',YEL='#ffd23f',TEAL='#2ec4b6',PINK='#ff7eb6',BLUE='#3a86ff';
function rr(X,Y,w,h,r){x.beginPath();x.roundRect(X,Y,w,h,r)}
function ink(lw=8){x.lineWidth=lw;x.strokeStyle=INK;x.lineJoin='round';x.lineCap='round';x.stroke()}
function txt(s,X,Y,size,col='#fff',align='center',stroke=true,rot=0){x.save();x.translate(X,Y);x.rotate(rot);x.font='700 '+size+'px F';x.textAlign=align;x.textBaseline='middle';
  if(stroke){x.lineWidth=size*0.16;x.strokeStyle=INK;x.lineJoin='round';x.strokeText(s,0,0)}x.fillStyle=col;x.fillText(s,0,0);x.restore()}
function pill(s,X,Y,col){x.font='700 52px F';const w=x.measureText(s).width+70;x.save();x.translate(X,Y);x.rotate(-0.04);rr(-w/2,-42,w,84,42);x.fillStyle=col;x.fill();ink(7);x.restore();txt(s,X,Y,52,'#fff','center',false,-0.04)}
function check(X,Y,s,ok){x.save();x.translate(X,Y);x.scale(s,s);x.beginPath();x.arc(0,0,48,0,7);x.fillStyle=ok?'#2ecc71':RED;x.fill();ink(7);x.beginPath();
  if(ok){x.moveTo(-22,2);x.lineTo(-6,18);x.lineTo(24,-16)}else{x.moveTo(-18,-18);x.lineTo(18,18);x.moveTo(18,-18);x.lineTo(-18,18)}x.lineWidth=12;x.strokeStyle='#fff';x.stroke();x.restore()}
function smoke(X,Y,t,n=6,sc=1){for(let i=0;i<n;i++){const k=((t*1.6+i/n)%1);x.beginPath();x.arc(X-k*160*sc+Math.sin(i*3)*20,Y-k*60*sc+Math.cos(i)*15,(22+k*50)*sc,0,7);x.fillStyle='rgba(240,240,245,'+(0.85*(1-k))+')';x.fill();x.lineWidth=5;x.strokeStyle='rgba(22,22,26,'+(0.6*(1-k))+')';x.stroke()}}
// coche visto desde arriba (morro hacia arriba). mood: 1 feliz, -1 triste. rear: ruedas traseras resaltadas
function car(X,Y,ang,s,col,mood=1,opt={}){x.save();x.translate(X,Y);x.rotate(ang);x.scale(s,s);
  const wh=(wx,wy,glow)=>{rr(wx-20,wy-34,40,68,12);x.fillStyle=glow?RED:INK;x.fill();if(glow){ink(6)}};
  wh(-68,-70,opt.front);wh(68,-70,opt.front);wh(-68,78,opt.rear);wh(68,78,opt.rear);
  rr(-62,-140,124,280,56);x.fillStyle=col;x.fill();ink(9);
  rr(-44,-58,88,56,18);x.fillStyle='#bfe8ff';x.fill();ink(6); // parabrisas
  rr(-40,40,80,40,14);x.fillStyle='#9fd3f0';x.fill();ink(6);    // luneta
  for(const sx of[-30,30]){x.beginPath();x.arc(sx,-112,19,0,7);x.fillStyle='#fff';x.fill();ink(6);if(opt.dizzy){x.beginPath();for(let a=0;a<12;a+=0.3){const rr2=a*1.3;a?x.lineTo(sx+Math.cos(a+opt.dizzy)*rr2,-112+Math.sin(a+opt.dizzy)*rr2):x.moveTo(sx,-112)}ink(4)}else{x.beginPath();x.arc(sx+(opt.look||0)*6,-114,8,0,7);x.fillStyle=INK;x.fill()}
    x.beginPath();if(mood>0){x.moveTo(sx-16,-140);x.lineTo(sx+16,-136)}else{x.moveTo(sx-16,-134);x.lineTo(sx+16,-142)}ink(6)}
  x.beginPath();if(mood>0)x.arc(0,-96,16,0.15*Math.PI,0.85*Math.PI);else x.arc(0,-78,14,1.15*Math.PI,1.85*Math.PI);ink(6);
  if(opt.helmet){x.beginPath();x.arc(0,-10,30,Math.PI,0);x.fillStyle=YEL;x.fill();ink(6)}
  x.restore()}
function bubble(s,X,Y,t,t0,tail=1){const k=back((t-t0)/0.35);if(k<=0)return;x.save();x.translate(X,Y);x.scale(k,k);x.font='700 46px F';const ls=s.split('\\n');const w=Math.max(...ls.map(l=>x.measureText(l).width))+60,h=ls.length*56+40;
  rr(-w/2,-h/2,w,h,30);x.fillStyle='#fff';x.fill();ink(7);x.beginPath();x.moveTo(-30*tail,h/2-4);x.lineTo(-60*tail,h/2+50);x.lineTo(10*tail,h/2-4);x.fillStyle='#fff';x.fill();ink(7);x.fillRect(-34*tail-(tail<0?-4:0),h/2-10,48,12);
  x.fillStyle=INK;x.textAlign='center';x.textBaseline='middle';ls.forEach((l,i)=>x.fillText(l,0,-h/2+20+28+i*56));x.restore()}
function bg(col,t){x.fillStyle=col;x.fillRect(0,0,${W},${H});x.globalAlpha=0.08;for(let i=-4;i<24;i++){x.beginPath();x.moveTo(i*120+(t*60)%120,0);x.lineTo(i*120-600+(t*60)%120,${H});x.lineWidth=40;x.strokeStyle='#fff';x.stroke()}x.globalAlpha=1}
function header(n,title,t){const k=back(t/0.45);x.save();x.translate(540,250);x.scale(k,k);pill('PASO '+n,0,0,RED);x.restore();
  title.split('\\n').forEach((l,i)=>txt(l,540,380+i*96,84,'#fff','center',true,0));}
function sub(s,t,y=1560){const k=eo((t-0.5)/0.4);x.globalAlpha=k;s.split('\\n').forEach((l,i)=>txt(l,540,y+i*70,52,'#fff'));x.globalAlpha=1}

const S={
 intro(t){bg(TEAL,t);const k=back(t/0.6);
  txt('CÓMO EMPEZAR',540,320,108,YEL,'center',true,-0.05*k);txt('EN EL DRIFT',540,440,128,'#fff','center',true,-0.05*k);
  txt('(rompiendo lo menos posible)',540,550,52,INK,'center',false,0);
  const cx=540+Math.sin(t*2.2)*150, ang=-0.9+Math.sin(t*4)*0.2;smoke(cx+60,1120,t,7,1.2);car(cx,1050,ang,1.25,RED,1,{rear:true});
  bubble('¡Soy DRIFTZILLA!',600,760,t,0.6);
  txt('4 PASOS',540,1580,96,'#fff','center',true,0.04);},
 p1(t){bg(PINK,t);header(1,'COMPRA UN\\nCOCHE BARATO',t);
  const ads=[['BMW 318','900 €','Pasa ITV… en 2019',RED],['Coupé','650 €','Hace un ruidito',BLUE],['Compacto','1.200 €','Echa humo (azul)','#2ecc71'],['Berlina','500 €','Arranca empujando',YEL]];
  ads.forEach(([n,pr,d,col],i)=>{const k=back((t-0.4-i*0.45)/0.4);if(k<=0)return;const X=i%2?790:290,Y=i<2?820:1200;
   x.save();x.translate(X,Y);x.scale(k,k);x.rotate((i%2?1:-1)*0.03);rr(-215,-170,430,340,30);x.fillStyle='#fff';x.fill();ink(7);
   rr(-185,-145,370,170,20);x.fillStyle='#e9eef5';x.fill();ink(5);
   car(0,-60,Math.PI/2,0.48,col,i===3?-1:1,{});
   x.textAlign='left';x.fillStyle=RED;x.font='700 50px F';x.fillText(pr,-185,72);
   x.fillStyle=INK;x.font='700 34px F';x.fillText(n,-185,112);x.fillStyle='#666';x.font='600 30px F';x.fillText(d,-185,148);x.restore()});
  const st=back((t-2.6)/0.35);if(st>0){x.save();x.translate(540,1010);x.rotate(-0.1);x.scale(st,st);rr(-420,-62,840,124,24);x.fillStyle=RED;x.fill();ink(8);x.font='700 54px F';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff';x.fillText('(A SER POSIBLE QUE ARRANQUE)',0,4);x.restore()}
  bubble('A mí me compraron\\npor 900 € y un bocadillo',540,1490,t,3.6);
  sub('Wallapop o segunda mano: lo barato\\nsale caro… pero menos',t,1660);},
 p2(t){bg(YEL,t);header(2,'COCHE DE\\nPROPULSIÓN',t);
  const a=eo((t-0.3)/0.5),b=eo((t-1.4)/0.5);
  x.globalAlpha=a;car(320,950,0,1.05,RED,1,{rear:true});check(320,1210,a,true);txt('TRACCIÓN',320,1300,46,'#fff');txt('TRASERA',320,1356,46,'#fff');x.globalAlpha=1;
  x.globalAlpha=b;car(770,950,Math.sin(t*20)*0.03*(t>1.4),1.05,BLUE,-1,{front:true});check(770,1210,b,false);txt('TRACCIÓN',770,1300,46,'#fff');txt('DELANTERA',770,1356,46,'#fff');x.globalAlpha=1;
  bubble('Yo solo sé\\nir recto…',800,700,t,2.2,-1);
  sub('Las ruedas de atrás empujan\\n(BMW E36/E46, MX-5, GT86…)',t,1580);},
 p3(t){bg('#5b5f6a',t);header(3,'EL CONO',t);
  const drift=t>=3.4, a=t*(drift?3.2:2.2), R=drift?250:230;
  x.save();x.translate(540,1080);
  // marcas de neumático
  if(drift){x.lineWidth=18;x.strokeStyle='rgba(20,20,24,.5)';x.beginPath();x.arc(0,0,R+20,0,7);x.stroke();x.beginPath();x.arc(0,0,R-20,0,7);x.stroke()}
  // cono (visto desde arriba)
  x.beginPath();x.arc(0,0,58,0,7);x.fillStyle='#ff8c1a';x.fill();ink(7);x.beginPath();x.arc(0,0,34,0,7);x.fillStyle='#fff';x.fill();ink(5);x.beginPath();x.arc(0,0,16,0,7);x.fillStyle='#ff8c1a';x.fill();ink(5);
  const cxp=Math.cos(a)*R, cyp=Math.sin(a)*R, slip=drift?0.75+0.12*Math.sin(t*5):0.12, nose=a+Math.PI/2+slip;
  if(drift)smoke(cxp-Math.cos(nose)*70,cyp-Math.sin(nose)*70,t,6,0.9);
  car(cxp,cyp,nose+Math.PI/2,0.85,RED,1,{rear:drift});
  x.restore();
  // inserto arriba a la derecha: volante + gas
  if(drift){const k=back((t-3.5)/0.35);x.save();x.translate(840,560);x.scale(k,k);rr(-200,-120,400,240,30);x.fillStyle='rgba(255,255,255,.95)';x.fill();ink(7);
    const sw=-0.55-0.25*Math.sin(t*5);x.save();x.translate(-80,0);x.rotate(sw);x.beginPath();x.arc(0,0,70,0,7);x.lineWidth=18;x.strokeStyle=INK;x.stroke();x.beginPath();x.moveTo(-70,0);x.lineTo(70,0);x.moveTo(0,0);x.lineTo(0,70);x.lineWidth=14;x.stroke();x.beginPath();x.arc(0,0,18,0,7);x.fillStyle=RED;x.fill();x.restore();
    const gas=0.55+0.35*Math.sin(t*5+1);rr(90,-90,70,180,16);x.fillStyle='#eee';x.fill();ink(5);rr(98,82-164*gas,54,164*gas,10);x.fillStyle=RED;x.fill();
    x.fillStyle=INK;x.font='700 26px F';x.textAlign='center';x.fillText('VOLANTE',-80,105);x.fillText('GAS',125,105);x.restore()}
  if(!drift)bubble('Vuelta 1… vuelta 2…\\nvuelta 47…',540,640,t,0.9);
  else bubble('¡Se me va!\\n¡¡CONTRAVOLANTE!!',330,640,t,3.45);
  sub(drift?'Cuando la trasera se suelta: gira hacia\\ndonde se va y dosifica el gas':'Da vueltas al cono y busca el límite\\n(despacio y mejor en mojado)',t,1560);},
 p4(t){bg(YEL,t);header(4,'PRACTICA\\n(MUCHO)',t);
  const n=Math.floor(cl(t/3.2)*15);let k=0;for(let row=0;row<5&&k<n;row++)for(let i=0;i<5-row&&k<n;i++,k++){const X=540+(i-(4-row)/2)*130,Y=1330-row*95;x.beginPath();x.ellipse(X,Y,62,46,0,0,7);x.fillStyle=INK;x.fill();x.beginPath();x.ellipse(X,Y,26,18,0,0,7);x.fillStyle='#777';x.fill()}
  txt('×'+(n*2),850,860,96,RED);
  bubble('Tu sueldo: ruedas.\\nTus amigos: ¿quedamos?\\nTú: tengo tanda.',540,690,t,1.2);
  sub('Ruedas usadas y baratas.\\nCada tanda cuenta',t,1540);},
 outro(t){bg(RED,t);const k=back(t/0.5);car(540,760,Math.sin(t*6)*0.15,1.05*k,YEL,1,{rear:true,look:Math.sin(t*3)});
  txt('PARTE 2: PRÓXIMAMENTE',540,1060,76,YEL);
  [['1','FRENO\\nDE MANO',300,0.5],['2','PATADA DE\\nEMBRAGUE',780,0.8]].forEach(([l,o,X,d])=>{const q=back((t-d)/0.35);if(q<=0)return;x.save();x.translate(X,1240);x.scale(q,q);x.rotate(l==='1'?-0.04:0.04);
    rr(-200,-100,400,200,30);x.fillStyle='#fff';x.fill();ink(8);x.beginPath();x.arc(-150,-90,42,0,7);x.fillStyle=YEL;x.fill();ink(7);
    x.fillStyle=INK;x.font='700 48px F';x.textAlign='center';x.textBaseline='middle';x.fillText(l,-150,-88);o.split('\\n').forEach((ln,i)=>{x.font='700 46px F';x.fillText(ln,10,-22+i*54)});x.restore()});
  const c2=eo((t-1.2)/0.4);x.globalAlpha=c2;txt('¿Cuál te da más miedo? Comenta',540,1420,58,'#fff');x.globalAlpha=1;
  const p=0.5+0.5*Math.sin(t*8);x.save();x.translate(540,1560);x.scale(1+0.06*p,1+0.06*p);rr(-260,-58,520,116,58);x.fillStyle='#fff';x.fill();ink(8);x.restore();txt('SÍGUEME →',540,1560,62,RED,'center',false);
  const e=eo((t-1.8)/0.4);x.globalAlpha=e;txt('(y para más errores financieros,',540,1680,42,'#fff');txt('sigue también)',540,1730,42,'#fff');x.globalAlpha=1;
  bubble('O Driftzilla\\nse pone triste',540,470,t,0.7);},
};
window.draw=(t)=>{let i=0;while(i<SC.length-1&&t>=START[i+1])i++;const tl=t-START[i];S[SC[i][0]](tl);
  // transición: barrido blanco rápido al cambiar de escena
  if(tl<0.12&&i>0){x.fillStyle='rgba(255,255,255,'+(1-tl/0.12)+')';x.fillRect(0,0,${W},${H})}
  // pie fijo
  txt('Practica solo en circuito',540,1850,30,'rgba(255,255,255,.85)','center',false);};
</script></body></html>`;

function wav(file, dur) {
  const SR = 48000, N = Math.ceil(dur * SR), b = new Float32Array(N);
  const BPM = 128, beat = 60 / BPM;
  const add = (t0, fn, len) => { const i0 = Math.floor(t0 * SR), L = Math.floor(len * SR); for (let i = 0; i < L && i0 + i < N; i++) b[i0 + i] += fn(i / SR); };
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 * 2 - 1; };
  const bass = [55, 55, 65.41, 73.42, 55, 55, 82.41, 73.42];
  const lead = [440, 523.25, 587.33, 659.25, 587.33, 523.25, 440, 392];
  for (let k = 0; k * beat < dur - 0.2; k++) {
    const t = k * beat;
    add(t, (u) => 0.55 * Math.sin(2 * Math.PI * (55 + 90 * Math.exp(-u * 30)) * u) * Math.exp(-u * 9), 0.3); // bombo
    if (k % 2) add(t, (u) => 0.22 * rnd() * Math.exp(-u * 22), 0.2); // palmada
    add(t + beat / 2, (u) => 0.08 * rnd() * Math.exp(-u * 60), 0.06); // charles
    const f = bass[k % 8]; add(t, (u) => 0.22 * Math.tanh(3 * Math.sin(2 * Math.PI * f * u)) * Math.exp(-u * 3), beat);
    if (k % 2 === 0) { const g = lead[(k / 2) % 8]; add(t, (u) => 0.07 * (Math.sin(2 * Math.PI * g * u) + 0.3 * Math.sin(4 * Math.PI * g * u)) * Math.exp(-u * 5), beat * 2); }
  }
  // derrapes (ruido filtrado) en intro, donut y salida
  for (const [t0, len] of [[0.3, 1.6], [START[3] + 3.4, 4.8], [START[5] + 0.1, 1.2]]) add(t0, (u) => 0.12 * rnd() * Math.sin(Math.PI * Math.min(1, u / len)) * (0.6 + 0.4 * Math.sin(u * 90)), len);
  [0.4, 0.85, 1.3, 1.75].forEach((d) => add(START[1] + d, (u) => 0.14 * (Math.sin(2 * Math.PI * 1318 * u) + Math.sin(2 * Math.PI * 1760 * u)) * Math.exp(-u * 10), 0.4));
  // «boing» al entrar cada paso
  START.slice(1).forEach((t0) => add(t0, (u) => 0.18 * Math.sin(2 * Math.PI * (300 + 500 * Math.exp(-u * 12)) * u) * Math.exp(-u * 8), 0.4));
  let m = 0; for (const v of b) m = Math.max(m, Math.abs(v)); const sc = 0.9 / m;
  const pcm = Buffer.alloc(N * 2); for (let i = 0; i < N; i++) pcm.writeInt16LE(Math.round(b[i] * sc * 32767), i * 2);
  const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, pcm]));
}

(async () => {
  const tmp = fs.mkdtempSync(path.join(process.env.ENEIA_TMP || os.tmpdir(), 'drift-'));
  fs.writeFileSync(path.join(tmp, 'p.html'), page);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: H } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + path.join(tmp, 'p.html')); await p.evaluate(() => document.fonts.ready);
  const NF = Math.round(TOTAL * FPS);
  for (let i = 0; i < NF; i++) { await p.evaluate((t) => window.draw(t), i / FPS); await p.screenshot({ path: path.join(tmp, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 90 }); }
  await b.close(); if (errs.length) console.log('ERRORES', errs.slice(0, 3));
  const a = path.join(tmp, 'a.wav'); wav(a, TOTAL);
  const dst = path.join(OUT, 'VIRAL_driftzilla-ep1_como-empezar_9x16_v5.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%05d.jpg'), '-i', a, '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', dst]);
  SC.forEach(([id], i) => fs.copyFileSync(path.join(tmp, `f${String(Math.round((START[i] + 1.8) * FPS)).padStart(5, '0')}.jpg`), path.join(OUT, `VIRAL_driftzilla-ep1_${String(i).padStart(2, '0')}-${id}.jpg`)));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('OK', dst, TOTAL.toFixed(1), 's');
})();
