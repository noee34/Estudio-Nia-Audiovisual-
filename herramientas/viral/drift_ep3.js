// Serie «Cómo empezar en el drift» · Episodio 3: coche para empezar y errores de novato, con Driftzilla (personaje original).
// Dos lecciones por vídeo, información real con humor. Uso: node herramientas/viral/drift_ep3.js
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
const SC = [['intro', 4.0], ['p1', 7.8], ['p2', 4.6], ['p3', 9.9], ['p4', 4.0], ['outro', 5.6]];
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
  wh(-68,-70,opt.front);wh(68,-70,opt.front);wh(-68,78,opt.rear);wh(68,78,opt.rear);if(opt.lock){for(const sx of[-68,68]){rr(sx-20,44,40,68,12);x.fillStyle='#9aa0a6';x.fill();ink(6)}}
  if(opt.spoiler){rr(-110,150,220,34,12);x.fillStyle=INK;x.fill();rr(-40,125,12,40,4);x.fill();rr(28,125,12,40,4);x.fill()}
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

function inset(X,Y,w,h,k){x.save();x.translate(X,Y);x.scale(k,k);rr(-w/2,-h/2,w,h,30);x.fillStyle='rgba(255,255,255,.96)';x.fill();ink(7);}
function steps(list,cur,t){const y0=1520;list.forEach((st,i)=>{const on=i===cur,done=i<cur;x.globalAlpha=on?1:(done?0.75:0.35);
  txt((i+1)+'. '+st,540,y0+i*62,on?50:42,on?YEL:'#fff','center',true,0)});x.globalAlpha=1}
function header2(lbl,title,t){const k=back(t/0.45);x.save();x.translate(540,250);x.scale(k,k);pill(lbl,0,0,RED);x.restore();title.split('\\n').forEach((l,i)=>txt(l,540,380+i*96,84,'#fff','center',true,0))}
// trayectoria: recta hacia arriba y curva a la izquierda (centro a la izquierda)
function pathPos(sd,CX,CY,R){const st=CY+R*0;if(sd<0)return{x:CX+R,y:CY-sd,tan:-Math.PI/2};const th=-sd/R;return{x:CX+R*Math.cos(th),y:CY+R*Math.sin(th),tan:th-Math.PI/2}}
const marks=[];
const S={
 intro(t){bg(TEAL,t);const k=back(t/0.6);
  x.save();x.translate(540,230);x.scale(k,k);pill('PARTE 3',0,0,RED);x.restore();
  txt('COCHE PARA',540,360,100,YEL,'center',true,-0.04*k);txt('EMPEZAR Y',540,465,100,YEL,'center',true,-0.04*k);txt('ERRORES DE NOVATO',540,575,86,'#fff','center',true,-0.04*k);
  txt('(dos lecciones, un solo bolsillo)',540,665,46,INK,'center',false,0);
  const cx=540+Math.sin(t*2.2)*150, ang=-0.9+Math.sin(t*4)*0.2;smoke(cx+60,1180,t,7,1.2);car(cx,1110,ang,1.15,RED,1,{rear:true});
  bubble('Hoy toca comprar…\\ny equivocarse',600,880,t,0.8);},
 p1(t){bg(YEL,t);header2('LECCIÓN 1','EL COCHE IDEAL',t);
  const items=['Propulsión (tracción trasera)','Cambio manual','Autoblocante (o soldado)','Recambios baratos'];
  items.forEach((it,i)=>{const k=back((t-0.5-i*0.5)/0.3);if(k<=0)return;x.save();x.translate(150,640+i*105);x.scale(k,k);check(0,0,0.7,true);x.restore();
    x.globalAlpha=Math.min(1,k);txt(it,215,640+i*105,48,'#fff','left',true,0);x.globalAlpha=1});
  const cars=[['BMW E36/E46',RED],['Nissan 200SX',BLUE],['Lexus IS200',TEAL]];
  cars.forEach(([n,col],i)=>{const k=back((t-2.8-i*0.35)/0.35);if(k<=0)return;const X=200+i*340;x.save();x.translate(X,1180);x.scale(k,k);
    rr(-150,-130,300,260,26);x.fillStyle='#fff';x.fill();ink(7);car(0,-25,Math.PI/2,0.5,col,1,{});x.fillStyle=INK;x.font='700 34px F';x.textAlign='center';x.fillText(n,0,95);x.restore()});
  bubble('Presupuesto: lo que haya\\ndebajo del sofá',540,1450,t,4.6);
  sub('Barato, fiable y con piezas en\\ncualquier desguace',t,1640);},
 p2(t){bg(BLUE,t);header2('REQUISITO','SECRETO',t);
  // garaje con la puerta a medio subir y Driftzilla escondido bajo una lona
  x.save();x.translate(540,1020);rr(-380,-300,760,560,20);x.fillStyle='#d9dce1';x.fill();ink(8);
  const door=Math.min(1,t/1.2);rr(-330,-250,660,460*(1-door*0.55),10);x.fillStyle='#9aa3ad';x.fill();ink(7);for(let i=1;i<6;i++){const yy=-250+i*80*(1-door*0.55);if(yy<-250+460*(1-door*0.55)){x.beginPath();x.moveTo(-330,yy);x.lineTo(330,yy);ink(5)}}
  x.beginPath();x.moveTo(-250,210);x.quadraticCurveTo(-260,40,-80,20);x.quadraticCurveTo(0,-10,80,20);x.quadraticCurveTo(260,40,250,210);x.closePath();x.fillStyle='#6d8f5e';x.fill();ink(7);
  for(const sx of[-40,40]){x.beginPath();x.arc(sx,90,22,0,7);x.fillStyle='#fff';x.fill();ink(6);x.beginPath();x.arc(sx+Math.sin(t*3)*8,92,9,0,7);x.fillStyle=INK;x.fill()}
  x.restore();
  bubble('Que en casa\\nno se entere nadie',540,640,t,1.4);
  sub('(y si se enteran: «es una inversión»)',t,1560);},
 p3(t){bg('#5b5f6a',t);header2('LECCIÓN 2','ERRORES DE NOVATO',t);
  const e=t<3.3?0:t<6.6?1:2, tl=t-e*3.3;
  const st=back(tl/0.3);x.save();x.translate(540,560);x.rotate(-0.06);x.scale(st,st);rr(-200,-52,400,104,20);x.fillStyle=RED;x.fill();ink(8);x.font='700 54px F';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff';x.fillText('ERROR '+(e+1),0,4);x.restore();
  if(e===0){ // demasiado gas → trompo
    const a=tl*7;car(540,1000,a,1.0,RED,tl<2?1:-1,{rear:true,dizzy:tl>2?tl*10:0});smoke(540,1080,tl,6,1);
    txt('DEMASIADO GAS',540,720,64,YEL);sub('El pie derecho no es un interruptor:\\ngas suave y progresivo',tl,1520);}
  else if(e===1){ // mirar al muro
    for(let r=0;r<3;r++)for(let c=-1;c<10;c++){rr(c*120+(r%2?60:0)-20,790+r*60,116,56,6);x.fillStyle='#c0583c';x.fill();ink(5)}
    const yy=1350-Math.min(1,tl/1.6)*330;car(540,yy,-0.5+Math.sin(tl*6)*0.05,0.95,RED,tl<1.6?1:-1,{look:-1});
    if(tl>1.6)bubble('¡PLOF!',540,1150,tl,1.6);
    txt('MIRAR AL MURO',540,700,64,YEL);sub('Mira a donde quieres ir,\\nno a lo que quieres esquivar',tl,1520);}
  else { // alerón antes que ruedas
    car(540,1020,0,1.1,RED,1,{spoiler:true});
    const k=back((tl-0.8)/0.3);if(k>0){x.save();x.translate(800,880);x.scale(k,k);rr(-150,-50,300,100,20);x.fillStyle='#fff';x.fill();ink(6);x.fillStyle=INK;x.font='700 40px F';x.textAlign='center';x.textBaseline='middle';x.fillText('Alerón: 300 €',0,2);x.restore()}
    const k2=back((tl-1.5)/0.3);if(k2>0){x.save();x.translate(280,1190);x.scale(k2,k2);rr(-170,-50,340,100,20);x.fillStyle='#fff';x.fill();ink(6);x.fillStyle=RED;x.font='700 38px F';x.textAlign='center';x.textBaseline='middle';x.fillText('Ruedas: lisas',0,2);x.restore()}
    txt('ALERÓN ANTES QUE RUEDAS',540,700,58,YEL);sub('Primero ruedas, asiento y seguridad.\\nEl alerón, después',tl,1520);}},
 p4(t){bg(PINK,t);header2('RESUMEN','ERRORES DE DRIFTZILLA',t);
  car(540,980,Math.sin(t*3)*0.1,1.1,RED,-1,{});
  const n=Math.min(3,Math.floor(t/0.5)+1);txt('×'+n+'… ¡TODOS!',540,1300,86,YEL);
  bubble('Yo los cometí todos\\npara que tú no',540,700,t,0.9);},
 outro(t){bg(RED,t);const k=back(t/0.5);car(540,760,Math.sin(t*6)*0.15,1.05*k,YEL,1,{rear:true,look:Math.sin(t*3)});
  txt('PARTE 4: PRÓXIMAMENTE',540,1060,70,YEL);
  [['1','PRIMERA\\nTANDA',300,0.5],['2','QUÉ LLEVAR\\nAL CIRCUITO',780,0.8]].forEach(([l,o,X,d])=>{const q=back((t-d)/0.35);if(q<=0)return;x.save();x.translate(X,1240);x.scale(q,q);x.rotate(l==='1'?-0.04:0.04);
    rr(-200,-100,400,200,30);x.fillStyle='#fff';x.fill();ink(8);x.beginPath();x.arc(-150,-90,42,0,7);x.fillStyle=YEL;x.fill();ink(7);
    x.fillStyle=INK;x.font='700 48px F';x.textAlign='center';x.textBaseline='middle';x.fillText(l,-150,-88);o.split('\\n').forEach((ln,i)=>{x.font='700 46px F';x.fillText(ln,10,-22+i*54)});x.restore()});
  const c2=eo((t-1.2)/0.4);x.globalAlpha=c2;txt('¿Qué coche tienes tú? Comenta',540,1420,56,'#fff');x.globalAlpha=1;
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
  for (const [t0, len] of [[0.3, 1.8], [START[3] + 0.1, 2.6], [START[5] + 0.1, 1.2]]) add(t0, (u) => 0.12 * rnd() * Math.sin(Math.PI * Math.min(1, u / len)) * (0.6 + 0.4 * Math.sin(u * 90)), len);
  [3.0, 3.35, 3.7].forEach((d) => add(START[1] + d, (u) => 0.14 * (Math.sin(2 * Math.PI * 1318 * u) + Math.sin(2 * Math.PI * 1760 * u)) * Math.exp(-u * 10), 0.4));
  add(START[3] + 3.3 + 1.6, (u) => 0.6 * Math.sin(2 * Math.PI * 55 * u) * Math.exp(-u * 10) + 0.25 * rnd() * Math.exp(-u * 25), 0.6); // «¡PLOF!» contra el muro
  add(START[2] + 0.1, (u) => 0.12 * rnd() * Math.exp(-u * 3) * (u < 1.2 ? 1 : 0), 1.2); // puerta de garaje
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
  const dst = path.join(OUT, 'VIRAL_driftzilla-ep3_coche-y-errores_9x16_v1.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%05d.jpg'), '-i', a, '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', dst]);
  SC.forEach(([id], i) => fs.copyFileSync(path.join(tmp, `f${String(Math.round((START[i] + 1.8) * FPS)).padStart(5, '0')}.jpg`), path.join(OUT, `VIRAL_driftzilla-ep3_${String(i).padStart(2, '0')}-${id}.jpg`)));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('OK', dst, TOTAL.toFixed(1), 's');
})();
