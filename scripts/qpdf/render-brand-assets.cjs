// Renders public/images icons and the Open Graph image from qpdf-mark.svg.
// Usage: node scripts/qpdf/render-brand-assets.cjs public/images  (needs Playwright + Chromium)
// Then build favicon.ico from favicon-16/32/48.png (see docs/DEVELOPMENT.md).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const out = process.argv[2];
const mark = fs.readFileSync(path.join(out, 'qpdf-mark.svg'), 'utf8');
const fontCss = (w) => `@font-face{font-family:'DM Sans';font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync(require.resolve(`@fontsource/dm-sans/files/dm-sans-latin-${w}-normal.woff2`, {paths:[process.cwd()]})).toString('base64')}) format('woff2');}`;
const leaf = 'M50 0 57 14 65 10 61 33 75 19 79 27 93 24 87 39 97 45 74 62 78 73 56 69 52 70 52.5 96 47.5 96 48 70 44 69 22 73 26 62 3 45 13 39 7 24 21 27 25 19 39 33 35 10 43 14Z';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  // App icons: mark on a padded white/red background for maskable safety
  for (const [size, name, pad, bg] of [[192, 'icon-192.png', 0.14, '#B8202F'], [512, 'icon-512.png', 0.14, '#B8202F'], [180, 'apple-touch-icon.png', 0.12, '#B8202F'], [32, 'favicon-32.png', 0, 'transparent'], [16, 'favicon-16.png', 0, 'transparent'], [48, 'favicon-48.png', 0, 'transparent']]) {
    await page.setViewportSize({ width: size, height: size });
    const inner = Math.round(size * (1 - pad * 2));
    const svg = pad ? mark.replace('<svg ', `<svg width="${inner}" height="${inner}" `).replace(/<path d="M8 0h15\.5L32 8\.5V24a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V8a8 8 0 0 1 8-8Z" fill="#B8202F"\/><path d="M23\.5 0v5\.5a3 3 0 0 0 3 3H32Z" fill="#E7959C"\/>/, '') : mark.replace('<svg ', `<svg width="${size}" height="${size}" `);
    await page.setContent(`<html><body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;background:${bg}">${svg}</body></html>`);
    await page.screenshot({ path: path.join(out, name), omitBackground: bg === 'transparent' });
  }
  // Open Graph image 1200x630
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`<html><head><style>${fontCss(400)}${fontCss(600)}${fontCss(700)}
  body{margin:0;width:1200px;height:630px;background:#F8F7F4;font-family:'DM Sans';position:relative;overflow:hidden}
  .leaf{position:absolute;right:-120px;top:-60px;width:720px;height:720px}
  .wrap{position:absolute;left:88px;top:72px;right:400px}
  .brand{display:flex;align-items:center;gap:18px;font-size:44px;font-weight:700;color:#17171A}
  .brand span{color:#8b8983;font-weight:500;margin-left:-16px}
  h1{margin:52px 0 0;font-size:76px;line-height:1.02;letter-spacing:-2.5px;color:#17171A;font-weight:700}
  h1 em{font-style:normal;color:#B8202F}
  p{margin:24px 0 0;font-size:27px;color:#67655F;line-height:1.35}
  .pill{position:absolute;left:88px;bottom:72px;display:flex;gap:16px;font-size:24px;color:#2f2e2b;font-weight:600}
  .pill b{display:inline-block;padding:10px 18px;border:2px solid #E7E5DF;border-radius:999px;background:#fff;font-weight:600}
  </style></head><body>
  <svg class="leaf" viewBox="0 0 100 100"><path d="${leaf}" fill="#B8202F" fill-opacity="0.05" stroke="#B8202F" stroke-opacity="0.14" stroke-width="0.3"/></svg>
  <div class="wrap"><div class="brand">${mark.replace('<svg ', '<svg width="64" height="64" ')}QPDF<span>.ca</span></div>
  <h1>Private PDF tools.<br><em>Simple by design.</em></h1>
  <p>Compress, merge, split and convert PDFs in your browser. Your documents stay on your device.</p></div>
  <div class="pill"><b>Processed locally</b><b>No file uploads</b><b>Free to use</b></div>
  </body></html>`);
  await page.screenshot({ path: path.join(out, 'og-qpdf.png') });
  await browser.close();
})();
