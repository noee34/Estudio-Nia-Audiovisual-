// Foto de perfil de Driftzilla (personaje original): derrapando, con humo y un trofeo junto a la rueda trasera.
// Uso: node herramientas/viral/driftzilla_perfil.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'MARCA/10_AUDIOVISUAL/proyectos/viral');
const FONT = path.join(OUT, 'fuentes/Fredoka-Variable.ttf');

const html = (bg, name) => `<!doctype html><html><head><meta charset="utf-8"><style>@font-face{font-family:F;src:url(file://${FONT})}html,body{margin:0}canvas{display:block}</style></head><body>
<canvas id="c" width="1080" height="1080"></canvas><script>
const x=document.getElementById('c').getContext('2d');const INK='#16161a',RED='#ff3b3b',YEL='#ffd23f',GOLD='#ffc83d';
function rr(X,Y,w,h,r){x.beginPath();x.roundRect(X,Y,w,h,r)}
function ink(lw=8){x.lineWidth=lw;x.strokeStyle=INK;x.lineJoin='round';x.lineCap='round';x.stroke()}
function puff(X,Y,r,a){x.beginPath();x.arc(X,Y,r,0,7);x.fillStyle='rgba(245,245,250,'+a+')';x.fill();x.lineWidth=6;x.strokeStyle='rgba(22,22,26,'+(a*0.7)+')';x.stroke()}
function car(X,Y,ang,s,col){x.save();x.translate(X,Y);x.rotate(ang);x.scale(s,s);
  const wh=(wx,wy,glow)=>{rr(wx-20,wy-34,40,68,12);x.fillStyle=glow?RED:INK;x.fill();if(glow)ink(6)};
  wh(-68,-70,0);wh(68,-70,0);wh(-68,78,1);wh(68,78,1);
  rr(-62,-140,124,280,56);x.fillStyle=col;x.fill();ink(9);
  rr(-44,-58,88,56,18);x.fillStyle='#bfe8ff';x.fill();ink(6);rr(-40,40,80,40,14);x.fillStyle='#9fd3f0';x.fill();ink(6);
  for(const sx of[-30,30]){x.beginPath();x.arc(sx,-112,19,0,7);x.fillStyle='#fff';x.fill();ink(6);x.beginPath();x.arc(sx+5,-115,8,0,7);x.fillStyle=INK;x.fill();
    x.beginPath();x.moveTo(sx-16,-142);x.lineTo(sx+16,-134);ink(6)}
  x.beginPath();x.arc(0,-98,18,0.1*Math.PI,0.9*Math.PI);ink(6); // sonrisa
  x.beginPath();x.moveTo(-18,-98);x.quadraticCurveTo(0,-70,18,-98);x.fillStyle='#fff';x.fill(); // dientes
  rr(-50,118,100,18,8);x.fillStyle=INK;x.fill(); // alerón
  x.restore()}
function trophy(X,Y,s){x.save();x.translate(X,Y);x.scale(s,s);x.rotate(-0.12);
  x.beginPath();x.moveTo(-70,-110);x.lineTo(70,-110);x.quadraticCurveTo(70,10,0,25);x.quadraticCurveTo(-70,10,-70,-110);x.fillStyle=GOLD;x.fill();ink(8);
  for(const sx of[-1,1]){x.beginPath();x.arc(sx*78,-70,30,sx>0?-Math.PI/2:Math.PI/2,sx>0?Math.PI/2:Math.PI*1.5,sx<0);ink(10)}
  rr(-14,24,28,40,6);x.fillStyle=GOLD;x.fill();ink(7);rr(-55,62,110,34,10);x.fillStyle='#8a5a2b';x.fill();ink(7);
  x.beginPath();for(let i=0;i<10;i++){const r=i%2?14:32,a=-Math.PI/2+i*Math.PI/5;x.lineTo(Math.cos(a)*r,-55+Math.sin(a)*r)}x.closePath();x.fillStyle='#fff';x.fill();ink(5);
  x.beginPath();x.moveTo(-40,-95);x.quadraticCurveTo(-45,-40,-20,-10);x.lineWidth=10;x.strokeStyle='rgba(255,255,255,.7)';x.stroke();
  x.restore()}
// fondo
x.fillStyle='${bg}';x.fillRect(0,0,1080,1080);
x.globalAlpha=0.1;for(let i=-6;i<16;i++){x.beginPath();x.moveTo(i*110,0);x.lineTo(i*110-500,1080);x.lineWidth=36;x.strokeStyle='#fff';x.stroke()}x.globalAlpha=1;
// marcas de rueda curvas
x.lineWidth=26;x.strokeStyle='rgba(22,22,26,.35)';for(const o of[-60,60]){x.beginPath();x.arc(540+o*0.2,1450,900+o,Math.PI*1.33,Math.PI*1.58);x.stroke()}
// humo detrás
[[800,640,85,.9],[880,720,75,.8],[760,760,90,.9],[930,620,60,.7],[860,840,80,.85],[700,840,70,.8],[960,780,55,.6]].forEach(p=>puff(...p));
car(560,520,-0.95,1.75,RED);
trophy(440,830,1.0);
// destellos del trofeo
x.strokeStyle='#fff';x.lineWidth=8;x.lineCap='round';[[330,740,30],[560,790,22],[330,930,20]].forEach(([a,b,r])=>{x.beginPath();x.moveTo(a-r,b);x.lineTo(a+r,b);x.moveTo(a,b-r);x.lineTo(a,b+r);x.stroke()});
${name ? `x.font='700 100px F';x.textAlign='center';x.textBaseline='middle';x.lineWidth=20;x.strokeStyle=INK;x.lineJoin='round';x.save();x.translate(540,190);x.rotate(-0.04);x.strokeText('DRIFTZILLA',0,0);x.fillStyle=YEL;x.fillText('DRIFTZILLA',0,0);x.restore();` : ''}
</script></body></html>`;

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  for (const [bg, name, file] of [['#2ec4b6', true, 'DRIFTZILLA_perfil_con-nombre_v1.png'], ['#2ec4b6', false, 'DRIFTZILLA_perfil_v1.png'], ['#ffd23f', true, 'DRIFTZILLA_perfil_amarillo_v1.png']]) {
    const f = path.join(OUT, '.tmp.html'); fs.writeFileSync(f, html(bg, name));
    await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, file) }); fs.unlinkSync(f);
  }
  await b.close(); console.log('OK');
})();
