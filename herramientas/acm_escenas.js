// ACM Performance · escenas en estilo «telemetría» (líneas de luz sobre negro):
//   A · faros con anillos de luz encendiéndose · B · mano abriendo la manilla · C · cuadro a 8000 rpm en zona roja
// Genera un MP4 por escena y formato (9:16 y 16:9) con su sonido, y monta el anuncio v9:
//   v8[0–1,8 s] + A + B + C + v8[4,0 s–final] (banco de potencia, «Siente la diferencia» y cierre).
// Uso: node herramientas/acm_escenas.js
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const P = path.join(ROOT, 'MARCA/10_AUDIOVISUAL/proyectos/acm-performance');
const F = path.join(P, 'fuentes');
const FPS = 25, SD = 2.2; // duración de cada escena
const TMP = process.env.ENEIA_TMP || path.join(os.tmpdir(), 'acm-esc');

const html = (W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(file://${F}/Saira-Variable.ttf)}
@font-face{font-family:SI;src:url(file://${F}/Saira-Italic-Variable.ttf)}
html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style></head><body>
<canvas id="c" width="${W}" height="${H}"></canvas><script>
const W=${W},H=${H},V=H>W,U=V?W/1080:H/1080;
const c=document.getElementById('c'),x=c.getContext('2d');
const L=document.createElement('canvas');L.width=W;L.height=H;const g=L.getContext('2d');
const SD=${SD};
const cl=v=>Math.max(0,Math.min(1,v)),eo=v=>1-Math.pow(1-cl(v),3),eio=v=>{v=cl(v);return v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2};
const RED='#E1262D';
function stroke(ctx,col,w,a=1){ctx.strokeStyle=col;ctx.lineWidth=w*U;ctx.globalAlpha=a;ctx.stroke();ctx.globalAlpha=1}
function ell(ctx,cx,cy,rx,ry,a0=0,a1=Math.PI*2){ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,a0,a1)}
function bloom(){ // copia desenfocada sumada (resplandor)
  x.globalCompositeOperation='lighter';
  x.filter='blur('+(6*U)+'px)';x.globalAlpha=.9;x.drawImage(L,0,0);
  x.filter='blur('+(22*U)+'px)';x.globalAlpha=.65;x.drawImage(L,0,0);
  x.filter='none';x.globalAlpha=1;x.globalCompositeOperation='source-over';
}
function hud(tag,t){ // rótulo de sección arriba a la izquierda, como en el banco
  x.font='700 '+(22*U)+'px S';x.fillStyle='#fff';x.globalAlpha=eo((t-0.25)/0.3);
  const y=60*U+22*U;x.beginPath();x.arc(57*U,y-8*U,7*U,0,7);x.fillStyle=RED;x.fill();x.fillStyle='#fff';
  x.letterSpacing=(0.3*22*U)+'px';x.fillText(tag,76*U,y);x.letterSpacing='0px';x.globalAlpha=1;
}
function wipe(t){ // barrido de franjas de la marca al entrar
  const p=t/0.32;if(p<0||p>1)return;const cols=['#d9d9d9','#8c8c8c',RED];
  cols.forEach((col,i)=>{const k=eio(p-i*0.08);const bx=(-0.6+k*1.9)*W;x.save();x.fillStyle=col;x.translate(bx,0);x.transform(1,0,-0.45,1,0,0);x.fillRect(0,-H*0.2,(V?380:520)*U,H*1.4);x.restore()});
}
function grain(t){x.globalAlpha=.05;for(let i=0;i<900;i++){const r=Math.sin(i*12.9898+t*78.233)*43758.5453;const f=r-Math.floor(r);const r2=Math.sin(i*4.1+t*13.7)*9871.3;const f2=r2-Math.floor(r2);x.fillStyle=f>.5?'#fff':'#000';x.fillRect(f*W,f2*H,2,2)}x.globalAlpha=1}

// ── A · FAROS ──────────────────────────────────────────
function faros(t){
  const s=(V?1.12:1.0)*U*(1+0.07*eo(t/SD)), cx=W/2, cy=H*(V?0.42:0.48);
  g.save();g.translate(cx,cy);g.scale(s,s);
  const draw=eo((t-0.05)/0.5);
  // carcasa del faro (forma alargada, más alta en el lado exterior)
  g.beginPath();g.moveTo(-430,-95);g.bezierCurveTo(-200,-150,200,-150,420,-120);g.bezierCurveTo(470,-110,480,40,430,95);
  g.bezierCurveTo(200,130,-200,120,-420,70);g.bezierCurveTo(-470,55,-470,-80,-430,-95);
  g.setLineDash([3000]);g.lineDashOffset=3000*(1-draw);stroke(g,'#cfd3d8',2.2);g.setLineDash([]);
  // nervio interior y reflector
  g.beginPath();g.moveTo(-400,-60);g.bezierCurveTo(-150,-100,150,-100,400,-80);stroke(g,'#5d6268',1.2,draw);
  const lamps=[[-205,-5,118],[175,-10,112]];
  lamps.forEach(([lx,ly,r],i)=>{
    const on=cl((t-(0.45+i*0.18))/0.15); // anillos (angel eyes)
    const xen=t>0.95+i*0.05?(t<1.15?(Math.sin(t*140+i)*0.5+0.5):1):0; // proyectores con parpadeo de encendido
    ell(g,lx,ly,r,r*0.92);stroke(g,'#8a8f96',1.6,draw);
    ell(g,lx,ly,r*0.86,r*0.8);stroke(g,on?'#dfeaff':'#3a3e43',on?5:1.2,on?0.4+0.6*on:draw);
    ell(g,lx,ly,r*0.45,r*0.42);stroke(g,xen?'#ffffff':'#4a4e54',xen?3:1.2,draw);
    if(xen){g.beginPath();g.arc(lx,ly,r*0.28,0,7);g.fillStyle='rgba(225,236,255,'+(0.75*xen)+')';g.fill()}
    for(let k=0;k<6;k++){const a=k/6*Math.PI*2;g.beginPath();g.moveTo(lx+Math.cos(a)*r*0.5,ly+Math.sin(a)*r*0.47);g.lineTo(lx+Math.cos(a)*r*0.82,ly+Math.sin(a)*r*0.76);stroke(g,'#30343a',1,draw)}
  });
  // haces de luz con bruma
  const beam=eo((t-1.15)/0.6);
  if(beam>0){g.globalCompositeOperation='lighter';lamps.forEach(([lx,ly])=>{for(let k=-6;k<=6;k++){g.beginPath();g.moveTo(lx,ly);g.lineTo(lx+k*90,ly+1400);stroke(g,'#9fb4ff',2.2,0.12*beam*(1-Math.abs(k)/7))}});g.globalCompositeOperation='source-over'}
  g.restore();
}
// ── B · MANILLA ────────────────────────────────────────
function manilla(t){
  const s=(V?1.0:0.92)*U*(1+0.06*eo(t/SD)), cx=W/2, cy=H*(V?0.5:0.52);
  g.save();g.translate(cx,cy);g.scale(s,s);
  const draw=eo((t-0.05)/0.45), open=eio((t-1.35)/0.5);
  // línea de cintura y separación de puerta
  g.beginPath();g.moveTo(-560,-250);g.bezierCurveTo(-200,-262,200,-262,560,-250);stroke(g,'#cfd3d8',2,draw);
  g.beginPath();g.moveTo(-560,-180);g.lineTo(560,-170);stroke(g,RED,2.2,draw);
  g.save();g.translate(-open*18,0);
  g.beginPath();g.moveTo(330,-330);g.bezierCurveTo(345,-50,345,200,330,420);stroke(g,'#cfd3d8',2,draw);
  g.restore();
  if(open>0){g.beginPath();g.moveTo(336,-320);g.bezierCurveTo(350,-50,350,200,336,410);stroke(g,RED,4+8*open,0.6*open)}
  // hueco y tirador (E46: tirador horizontal con cerradura en el extremo)
  g.beginPath();g.roundRect(-230,-95,400,120,60);stroke(g,'#6b7076',1.6,draw);
  const pull=eio((t-0.95)/0.4);
  // mano: los dedos entran por detrás del tirador (quedan tapados por él) y tiran
  const reach=eo((t-0.4)/0.55);
  g.save();g.translate(0,(1-reach)*420+pull*14);
  [[-178,-40],[-108,-52],[-38,-48],[32,-36]].forEach(([f,top])=>{g.beginPath();g.roundRect(f,top,64,200,32);stroke(g,'#e8e8e8',2.2,reach)});
  g.beginPath();g.moveTo(-190,140);g.bezierCurveTo(-215,260,-170,400,-40,450);g.bezierCurveTo(70,490,150,420,120,150);stroke(g,'#e8e8e8',2.2,reach);
  g.beginPath();g.moveTo(-190,170);g.bezierCurveTo(-260,150,-300,90,-285,40);g.bezierCurveTo(-270,10,-235,20,-225,60);g.bezierCurveTo(-215,100,-200,120,-185,125);stroke(g,'#e8e8e8',2.2,reach);
  g.restore();
  g.save();g.translate(0,pull*14);
  g.beginPath();g.roundRect(-250,-62,430,64,32);g.fillStyle='#000';g.fill();stroke(g,'#ffffff',2.6,draw);
  g.beginPath();g.arc(140,-30,16,0,7);stroke(g,'#ffffff',2,draw);g.beginPath();g.moveTo(140,-40);g.lineTo(140,-20);stroke(g,'#ffffff',2,draw);
  g.restore();
  g.restore();
}
// ── C · CUADRO A 8000 RPM ──────────────────────────────
function rpmAt(t){ if(t<0.35) return 0.9+0.05*Math.sin(t*60); const v=0.9+7.1*eio((t-0.35)/1.05); return t>1.4? 8.0+0.06*Math.sin(t*75)-0.12*(Math.sin(t*12)>0.6?1:0) : v; }
function cuadro(t){
  const s=(V?1.0:0.9)*U, cx=W/2, cy=H*(V?0.46:0.5), R=360;
  const shake=t>1.4?(Math.sin(t*90)*2):0;
  g.save();g.translate(cx+shake*U,cy);g.scale(s,s);
  const draw=eo((t-0.05)/0.4), A0=Math.PI*0.75, A1=Math.PI*2.25, maxR=9;
  const ang=v=>A0+(A1-A0)*v/maxR;
  g.beginPath();g.arc(0,0,R,A0,A1);stroke(g,'#5d6268',2,draw);
  g.beginPath();g.arc(0,0,R,ang(8),ang(9));stroke(g,RED,10,draw);
  for(let i=0;i<=maxR*2;i++){const a=ang(i/2),big=i%2===0;g.beginPath();g.moveTo(Math.cos(a)*(R-6),Math.sin(a)*(R-6));g.lineTo(Math.cos(a)*(R-(big?52:28)),Math.sin(a)*(R-(big?52:28)));stroke(g,i>=16?RED:'#e6e6e6',big?4:2,draw);
    if(big){g.globalAlpha=draw;g.fillStyle=i>=16?RED:'#e6e6e6';g.font='800 '+54+'px SI';g.textAlign='center';g.textBaseline='middle';g.fillText(String(i/2),Math.cos(a)*(R-100),Math.sin(a)*(R-100));g.globalAlpha=1}}
  const r=rpmAt(t);
  // estela de la aguja (desenfoque de movimiento)
  for(let k=6;k>=0;k--){const rr=rpmAt(t-k*0.012);const a=ang(rr);g.beginPath();g.moveTo(Math.cos(a)*-40,Math.sin(a)*-40);g.lineTo(Math.cos(a)*(R-30),Math.sin(a)*(R-30));stroke(g,k?'#ff5a2a':'#ff6a3a',k?6:7,k?0.12:1)}
  g.beginPath();g.arc(0,0,22,0,7);g.fillStyle=RED;g.globalAlpha=draw;g.fill();g.globalAlpha=1;
  // zona roja que late a 8000
  if(t>1.4){const p=0.5+0.5*Math.sin(t*30);g.beginPath();g.arc(0,0,R+18,ang(8),ang(9));stroke(g,RED,6,0.4+0.6*p)}
  g.globalAlpha=draw;g.textAlign='center';g.fillStyle='#fff';g.font='800 italic 96px SI';g.fillText(String(Math.min(8000,Math.round(r*1000/10)*10)),0,R*0.95);
  g.fillStyle='#8a8f96';g.font='600 26px S';g.letterSpacing='8px';g.fillText('RPM',0,R*0.95+52);g.letterSpacing='0px';g.globalAlpha=1;
  g.restore();
}
window.render=(scene,t)=>{
  g.clearRect(0,0,W,H);g.fillStyle='#000';g.fillRect(0,0,W,H);
  ({faros,manilla,cuadro})[scene](t);
  x.globalCompositeOperation='source-over';x.fillStyle='#000';x.fillRect(0,0,W,H);
  const vg=x.createRadialGradient(W/2,H*0.45,0,W/2,H*0.45,Math.max(W,H)*0.7);vg.addColorStop(0,'#141518');vg.addColorStop(1,'#000');x.fillStyle=vg;x.fillRect(0,0,W,H);
  x.globalCompositeOperation='lighter';x.drawImage(L,0,0);x.globalCompositeOperation='source-over';bloom();
  hud({faros:'ENCENDIDO',manilla:'ACCESO',cuadro:'8000 RPM'}[scene],t);
  grain(t);wipe(t);
  x.fillStyle='#000';x.globalAlpha=cl((t-(${SD}-0.12))/0.12)*0.6;x.fillRect(0,0,W,H);x.globalAlpha=1;
};
</script></body></html>`;

function audio(scene, file) {
  const wh = `0.22*(random(0)*2-1)*exp(-pow((t-0.16)*7,2))`;
  const ex = {
    faros: `${wh}+0.25*(random(0)*2-1)*exp(-(t-0.45)*60)*gte(t,0.45)+0.25*(random(0)*2-1)*exp(-(t-0.63)*60)*gte(t,0.63)+0.12*sin(2*PI*3200*t)*exp(-(t-0.95)*18)*gte(t,0.95)+0.06*sin(2*PI*120*t)*gte(t,0.95)+0.08*sin(2*PI*55*t)`,
    manilla: `${wh}+0.3*(random(0)*2-1)*exp(-(t-1.05)*45)*gte(t,1.05)+0.5*sin(2*PI*85*(t-1.35))*exp(-(t-1.35)*14)*gte(t,1.35)+0.2*(random(0)*2-1)*exp(-(t-1.35)*35)*gte(t,1.35)+0.08*sin(2*PI*55*t)`,
    cuadro: `${wh}+0.26*between(t,0.1,2.2)*tanh(3*(sin(2*PI*(45*t+38*pow(max(0,t-0.35),2)))+0.5*sin(4*PI*(45*t+38*pow(max(0,t-0.35),2)))+0.3*sin(6*PI*(45*t+38*pow(max(0,t-0.35),2)))))*(1-0.5*gte(t,1.4)*gt(sin(2*PI*12*t),0.6))`,
  }[scene];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', `aevalsrc='${ex}':s=48000:d=${SD}`, '-af', 'lowpass=f=7000,alimiter=limit=0.9', '-ac', '2', '-c:a', 'pcm_s16le', file]);
}

(async () => {
  fs.mkdirSync(TMP, { recursive: true });
  const b = await chromium.launch();
  const out = {};
  for (const [W, H, tag] of [[1080, 1920, '9x16'], [1920, 1080, '16x9']]) {
    const dir = fs.mkdtempSync(path.join(TMP, 'esc-'));
    fs.writeFileSync(path.join(dir, 'p.html'), html(W, H));
    const p = await b.newPage({ viewport: { width: W, height: H } });
    await p.goto('file://' + path.join(dir, 'p.html')); await p.evaluate(() => document.fonts.ready);
    out[tag] = [];
    for (const sc of ['faros', 'manilla', 'cuadro']) {
      const fd = path.join(dir, sc); fs.mkdirSync(fd);
      for (let f = 0; f < Math.round(SD * FPS); f++) { await p.evaluate(([s, t]) => window.render(s, t), [sc, f / FPS]); await p.screenshot({ path: path.join(fd, `f${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 93 }); }
      const wav = path.join(dir, sc + '.wav'); audio(sc, wav);
      const mp4 = path.join(dir, sc + '.mp4');
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(fd, 'f%04d.jpg'), '-i', wav, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-shortest', mp4]);
      fs.copyFileSync(path.join(fd, 'f0040.jpg'), path.join(P, 'video', `ACM_escena-${sc}_${tag}_fotograma.jpg`));
      out[tag].push(mp4);
    }
    await p.close();
    // montaje v9: v8[0–1,8] + escenas + v8[4,0–fin]
    const v8 = path.join(P, 'video', `ACM_anuncio-reprogramacion_${tag}_v8.mp4`);
    const dst = path.join(P, 'video', `ACM_anuncio-reprogramacion_${tag}_v9.mp4`);
    const [a, bb, cc] = out[tag];
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', v8, '-i', a, '-i', bb, '-i', cc, '-filter_complex',
      '[0:v]trim=0:1.8,setpts=PTS-STARTPTS,fps=25[v0];[0:a]atrim=0:1.8,asetpts=PTS-STARTPTS,aresample=48000,afade=t=out:st=1.77:d=0.03[a0];' +
      '[1:v]fps=25,setpts=PTS-STARTPTS[v1];[1:a]aresample=48000,asetpts=PTS-STARTPTS[a1];[2:v]fps=25,setpts=PTS-STARTPTS[v2];[2:a]aresample=48000,asetpts=PTS-STARTPTS[a2];[3:v]fps=25,setpts=PTS-STARTPTS[v3];[3:a]aresample=48000,asetpts=PTS-STARTPTS[a3];' +
      '[0:v]trim=start=4.0,setpts=PTS-STARTPTS,fps=25[v4];[0:a]atrim=start=4.0,asetpts=PTS-STARTPTS,aresample=48000,afade=t=in:d=0.03[a4];' +
      '[v0][a0][v1][a1][v2][a2][v3][a3][v4][a4]concat=n=5:v=1:a=1[v][au]',
      '-map', '[v]', '-map', '[au]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', dst]);
    console.log('OK', path.basename(dst));
  }
  await b.close();
})();
