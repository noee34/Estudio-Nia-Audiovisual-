// Serie «Cómo empezar en el drift» · Episodio 2: freno de mano y patada de embrague, con Driftzilla (personaje original).
// Información real de drift contada con humor. Uso: node herramientas/viral/drift_ep2.js
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
const SC = [['intro', 4.2], ['p1', 8.4], ['p2', 4.6], ['p3', 8.4], ['p4', 5], ['outro', 5.6]];
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
  x.save();x.translate(540,230);x.scale(k,k);pill('PARTE 2',0,0,RED);x.restore();
  txt('FRENO DE MANO',540,360,96,YEL,'center',true,-0.04*k);txt('Y PATADA',540,465,104,'#fff','center',true,-0.04*k);txt('DE EMBRAGUE',540,570,104,'#fff','center',true,-0.04*k);
  txt('(dos técnicas, cero excusas)',540,665,48,INK,'center',false,0);
  const cx=540+Math.sin(t*2.2)*150, ang=-0.9+Math.sin(t*4)*0.2;smoke(cx+60,1180,t,7,1.2);car(cx,1110,ang,1.15,RED,1,{rear:true});
  bubble('¡Hoy os explico\\nLOS DOS!',600,880,t,0.8);},
 p1(t){bg('#5b5f6a',t);header2('TÉCNICA 1','FRENO DE MANO',t);
  const T1=2.0,T2=2.8, v=230; // px/s
  const sd=(t<T1? t*v : T1*v+(t-T1)*v*0.95)-470;
  const P=pathPos(sd,340,1180,210);
  const slip=t<T1?0:Math.min(0.85,(t-T1)*1.4)+(t>T2?0.08*Math.sin(t*6):0);
  const nose=P.tan-slip, rot=nose+Math.PI/2, lock=t>=T1&&t<T2;
  // marcas: rectas al bloquear, curvas al derrapar
  if(t===0)marks.length=0;
  const rx=P.x-Math.cos(nose)*70, ry=P.y-Math.sin(nose)*70; if(t>=T1)marks.push([rx,ry,lock]);
  x.lineWidth=14;x.lineCap='round';for(let i=1;i<marks.length;i++){x.beginPath();x.moveTo(marks[i-1][0],marks[i-1][1]);x.lineTo(marks[i][0],marks[i][1]);x.strokeStyle=marks[i][2]?'rgba(10,10,12,.7)':'rgba(10,10,12,.4)';x.stroke()}
  if(t>=T2)smoke(rx,ry,t,6,0.85);
  car(P.x,P.y,rot,0.8,RED,lock?-1:1,{rear:t>=T2,lock});
  if(lock)bubble('¡CLAC!',P.x+150,P.y-170,t,T1);
  // inserto: palanca del freno de mano
  const k=back((t-0.6)/0.35);if(k>0){inset(830,640,300,260,k);const pull=lock?1:(t<T1?0:Math.max(0,1-(t-T2)*4));
    x.save();x.translate(-70,70);x.rotate(-0.25-0.75*pull);rr(-14,-170,28,170,14);x.fillStyle=INK;x.fill();x.beginPath();x.arc(0,-170,22,0,7);x.fillStyle=RED;x.fill();ink(6);x.restore();
    x.fillStyle=INK;x.font='700 26px F';x.textAlign='center';x.fillText('FRENO DE MANO',40,110);x.fillText(pull>0.5?'¡ARRIBA!':'',70,-70);x.restore()}
  const cur=t<1.4?0:t<T1?0:t<T2?1:t<3.6?2:3;
  steps(['Pisa el embrague','Tirón corto del freno de mano','Suelta freno y embrague','Gas + contravolante'],cur,t);},
 p2(t){bg(PINK,t);header2('OJO','NO LO MANTENGAS',t);
  const spin=t<2.6, a=spin?t*7:2.6*7;
  car(540,1050,a,1.1,RED,spin?1:-1,{dizzy:spin?0:t*10,lock:spin});if(spin)smoke(540,1120,t,6,1);
  if(!spin)bubble('Ups… ¿hola, grada?',540,700,t,2.65);
  sub('Si lo tienes tirado mucho: trompo.\\nToque corto y suelta',t,1520);},
 p3(t){bg('#5b5f6a',t);header2('TÉCNICA 2','PATADA DE EMBRAGUE',t);
  const K=2.6, kick=t>=K&&t<K+0.35, after=t>=K;
  const a=t*(after?3.0:2.4), R=after?250:235;
  x.save();x.translate(540,1080);
  if(after){x.lineWidth=18;x.strokeStyle='rgba(20,20,24,.45)';x.beginPath();x.arc(0,0,R+20,0,7);x.stroke();x.beginPath();x.arc(0,0,R-20,0,7);x.stroke()}
  x.beginPath();x.arc(0,0,58,0,7);x.fillStyle='#ff8c1a';x.fill();ink(7);x.beginPath();x.arc(0,0,34,0,7);x.fillStyle='#fff';x.fill();ink(5);x.beginPath();x.arc(0,0,16,0,7);x.fillStyle='#ff8c1a';x.fill();ink(5);
  const cxp=Math.cos(a)*R, cyp=Math.sin(a)*R, slip=after?Math.min(0.8,(t-K)*2.2)+0.08*Math.sin(t*5):0.1, nose=a+Math.PI/2+slip;
  if(after)smoke(cxp-Math.cos(nose)*70,cyp-Math.sin(nose)*70,t,6,0.9);
  car(cxp,cyp,nose+Math.PI/2,0.82,RED,1,{rear:after});x.restore();
  // inserto: pedales + cuentavueltas
  const k=back((t-0.6)/0.35);if(k>0){inset(830,620,320,280,k);
    const cd=kick?1:0; [['E',-100,cd],['F',-10,0],['G',80,1]].forEach(([l,px,d])=>{rr(px-30,-60+d*40,60,100,12);x.fillStyle=l==='G'?RED:(l==='E'?BLUE:'#bbb');x.fill();ink(5);x.fillStyle='#fff';x.font='700 30px F';x.textAlign='center';x.fillText(l,px,0+d*40)});
    const rpm=after?(t<K+0.5?4+2.8*Math.sin(Math.min(1,(t-K)/0.25)*Math.PI/2):6):4+0.2*Math.sin(t*9); const an=Math.PI*0.8+Math.PI*1.4*rpm/8;
    x.beginPath();x.arc(0,95,48,Math.PI*0.8,Math.PI*2.2);x.lineWidth=8;x.strokeStyle=INK;x.stroke();x.beginPath();x.moveTo(0,95);x.lineTo(Math.cos(an)*42,95+Math.sin(an)*42);x.lineWidth=6;x.strokeStyle=RED;x.stroke();
    x.fillStyle=INK;x.font='700 22px F';x.fillText('E  F  G',-10,-82);x.restore()}
  if(kick||(t>K&&t<K+1.2))bubble('¡PATADA!',330,640,t,K);
  const cur=t<1.2?0:t<K?0:t<K+0.35?1:t<K+1.3?2:3;
  steps(['Curva con gas','Pisa y suelta el embrague de golpe','Suben las vueltas y se suelta','Contravolante + gas'],cur,t);},
 p4(t){bg(YEL,t);header2('EFECTO SECUNDARIO','TU EMBRAGUE',t);
  // disco de embrague con cara, sudando
  const sh=Math.sin(t*30)*4;x.save();x.translate(540+sh,980);x.beginPath();x.arc(0,0,230,0,7);x.fillStyle='#c9a46b';x.fill();ink(9);x.beginPath();x.arc(0,0,150,0,7);x.fillStyle='#9aa0a6';x.fill();ink(7);
  for(let i=0;i<6;i++){const a2=i/6*Math.PI*2;rr(Math.cos(a2)*100-16,Math.sin(a2)*100-30,32,60,10);x.fillStyle='#666';x.fill();ink(5)}
  x.beginPath();x.arc(0,0,50,0,7);x.fillStyle='#555';x.fill();ink(6);
  for(const sx of[-60,60]){x.beginPath();x.arc(sx,-60,24,0,7);x.fillStyle='#fff';x.fill();ink(6);x.beginPath();x.arc(sx,-56,10,0,7);x.fillStyle=INK;x.fill()}
  x.beginPath();x.arc(0,40,40,1.15*Math.PI,1.85*Math.PI);ink(7);
  x.beginPath();x.moveTo(170,-150);x.quadraticCurveTo(190,-110,170,-90);x.quadraticCurveTo(150,-110,170,-150);x.fillStyle='#7fd3ff';x.fill();ink(5);x.restore();
  smoke(760,800,t,5,1);
  bubble('Mecánico:\\n¿Otra vez tú?',540,650,t,1.4);
  const e=back((t-2.4)/0.35);if(e>0){x.save();x.translate(540,1380);x.rotate(-0.06);x.scale(e,e);rr(-330,-60,660,120,24);x.fillStyle=RED;x.fill();ink(8);x.font='700 52px F';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff';x.fillText('EMBRAGUE NUEVO: €€€',0,4);x.restore()}
  sub('Cada patada lo castiga.\\nÚsala con cabeza',t,1560);},
 outro(t){bg(RED,t);const k=back(t/0.5);car(540,760,Math.sin(t*6)*0.15,1.05*k,YEL,1,{rear:true,look:Math.sin(t*3)});
  txt('PARTE 3: TÚ ELIGES',540,1060,76,YEL);
  [['A','COCHE PARA\\nEMPEZAR',300,0.5],['B','ERRORES\\nDE NOVATO',780,0.8]].forEach(([l,o,X,d])=>{const q=back((t-d)/0.35);if(q<=0)return;x.save();x.translate(X,1240);x.scale(q,q);x.rotate(l==='A'?-0.04:0.04);
    rr(-200,-100,400,200,30);x.fillStyle='#fff';x.fill();ink(8);x.beginPath();x.arc(-150,-90,42,0,7);x.fillStyle=YEL;x.fill();ink(7);
    x.fillStyle=INK;x.font='700 48px F';x.textAlign='center';x.textBaseline='middle';x.fillText(l,-150,-88);o.split('\\n').forEach((ln,i)=>{x.font='700 46px F';x.fillText(ln,10,-22+i*54)});x.restore()});
  const c2=eo((t-1.2)/0.4);x.globalAlpha=c2;txt('COMENTA A o B',540,1420,66,'#fff');x.globalAlpha=1;
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
  for (const [t0, len] of [[0.3, 1.8], [START[1] + 2.0, 6.2], [START[2] + 0.1, 2.5], [START[3] + 2.6, 5.6], [START[5] + 0.1, 1.2]]) add(t0, (u) => 0.12 * rnd() * Math.sin(Math.PI * Math.min(1, u / len)) * (0.6 + 0.4 * Math.sin(u * 90)), len);
  [2.4].forEach((d) => add(START[4] + d, (u) => 0.14 * (Math.sin(2 * Math.PI * 1318 * u) + Math.sin(2 * Math.PI * 1760 * u)) * Math.exp(-u * 10), 0.4));
  for (let i = 0; i < 6; i++) add(START[1] + 2.0 + i * 0.05, (u) => 0.2 * rnd() * Math.exp(-u * 80), 0.04); // carraca del freno de mano
  add(START[3] + 2.6, (u) => 0.3 * Math.tanh(3 * Math.sin(2 * Math.PI * (60 + 160 * Math.min(1, u * 3)) * u)) * Math.exp(-u * 1.5), 1.2); // subidón de vueltas
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
  const dst = path.join(OUT, 'VIRAL_driftzilla-ep2_freno-de-mano-y-patada_9x16_v2.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%05d.jpg'), '-i', a, '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', dst]);
  SC.forEach(([id], i) => fs.copyFileSync(path.join(tmp, `f${String(Math.round((START[i] + 1.8) * FPS)).padStart(5, '0')}.jpg`), path.join(OUT, `VIRAL_driftzilla-ep2_${String(i).padStart(2, '0')}-${id}.jpg`)));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('OK', dst, TOTAL.toFixed(1), 's');
})();
