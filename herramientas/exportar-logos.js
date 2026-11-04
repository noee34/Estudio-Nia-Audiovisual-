// Exporta cada SVG del sistema de logotipos a PNG transparente (alta resolución) y PDF vectorial.
// Uso: node herramientas/exportar-logos.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'MARCA/04_LOGOTIPOS');
const manifest = JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.json'), 'utf8'));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const item of manifest) {
    const svg = fs.readFileSync(path.join(OUT, item.svg), 'utf8');
    const [, , , w, h] = svg.match(/viewBox="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)"/).map(Number);
    const base = path.basename(item.svg, '.svg');
    const dir = path.dirname(item.svg).replace(/^svg/, '');
    // PNG: 3000 px en el lado mayor, fondo transparente
    const scale = 3000 / Math.max(w, h);
    const W = Math.round(w * scale), Hh = Math.round(h * scale);
    const big = svg.replace(/width="[\d.]+" height="[\d.]+"/, `width="${W}" height="${Hh}"`);
    await page.setViewportSize({ width: W, height: Hh });
    await page.setContent(`<html><body style="margin:0;background:transparent">${big}</body></html>`);
    fs.mkdirSync(path.join(OUT, 'png', dir), { recursive: true });
    await page.screenshot({ path: path.join(OUT, 'png', dir, base + '.png'), omitBackground: true, clip: { x: 0, y: 0, width: W, height: Hh } });
    // PDF vectorial al tamaño del arte (1 unidad = 1 pt aprox.)
    fs.mkdirSync(path.join(OUT, 'pdf', dir), { recursive: true });
    const pw = Math.round(w), ph = Math.round(h);
    const fitted = svg.replace(/width="[\d.]+" height="[\d.]+"/, `width="${pw}" height="${ph}"`);
    const dark = item.oscuro ? '#0E1A20' : 'transparent'; // los PDF de versiones claras sobre fondo oscuro llevan fondo para poder verse
    await page.setContent(`<html><head><style>@page{size:${pw}px ${ph}px;margin:0}html,body{margin:0;background:${dark}}svg{display:block}</style></head><body>${fitted}</body></html>`);
    await page.pdf({ path: path.join(OUT, 'pdf', dir, base + '.pdf'), width: `${pw}px`, height: `${ph}px`, printBackground: item.oscuro, pageRanges: '1' });
  }
  // Favicons e iconos de app a partir del avatar
  const avatar0 = fs.readFileSync(path.join(OUT, 'svg/redes/ENEIA_avatar-redes_v1.svg'), 'utf8');
  const fav = fs.readFileSync(path.join(OUT, 'svg/redes/ENEIA_favicon_v1.svg'), 'utf8');
  fs.mkdirSync(path.join(OUT, 'png/favicon'), { recursive: true });
  for (const n of [16, 32, 48, 180, 192, 512]) {
    await page.setViewportSize({ width: n, height: n });
    const avatar = n <= 48 ? fav : avatar0;
    await page.setContent(`<body style="margin:0">${avatar.replace(/width="[\d.]+" height="[\d.]+"/, `width="${n}" height="${n}"`)}</body>`);
    await page.screenshot({ path: path.join(OUT, `png/favicon/ENEIA_favicon-${n}_v1.png`), omitBackground: true });
  }
  await browser.close();
  console.log('Exportados', manifest.length, 'logotipos');
})();
