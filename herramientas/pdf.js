// Convierte los HTML de herramientas/.build a PDF (vectorial, fuentes incrustadas).
// Uso: python3 herramientas/documentos.py && node herramientas/pdf.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const B = path.join(__dirname, '.build');
const jobs = JSON.parse(fs.readFileSync(path.join(B, 'jobs.json'), 'utf8'));
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [html, out, kind] of jobs) {
    await p.goto('file://' + path.join(B, html), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const dst = path.join(ROOT, 'MARCA', out);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    const opts = { path: dst, printBackground: true, preferCSSPageSize: true };
    if (kind === 'A4') Object.assign(opts, { displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: '<div style="width:100%;font:500 7px Helvetica;letter-spacing:.14em;color:#8B908C;padding:0 20mm;display:flex;justify-content:space-between"><span>ENEIA ESTUDIO</span><span class="pageNumber"></span></div>' });
    await p.pdf(opts);
    console.log('PDF', out);
  }
  await b.close();
})();
