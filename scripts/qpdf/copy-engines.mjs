// Copy pinned, self-hosted processing engines from node_modules into
// public/wasm and public/vendor (both gitignored). Vite copies public/ into
// dist/ during the build, so the same layout works in dev and production.
//
//   /wasm/pymupdf/{dist,assets}/…   @bentopdf/pymupdf-wasm   (AGPL-3.0)
//   /wasm/gs/gs.{js,wasm}           @bentopdf/gs-wasm        (AGPL-3.0)
//   /wasm/cpdf/coherentpdf.browser.min.js  coherentpdf      (AGPL-3.0)
//   /wasm/tesseract/…               tesseract.js, tesseract.js-core, @tesseract.js-data/* (Apache-2.0)
//   /vendor/embedpdf/fonts-*@1.0.0/fonts/…  @embedpdf/fonts-* (SIL OFL 1.1)
//   /vendor/ocr-fonts/NotoSans-Regular.ttf (SIL OFL 1.1)
//
// Every individual file must stay under Cloudflare Pages' 25 MiB limit;
// scripts/qpdf/postbuild.mjs enforces this on the final dist/.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const NM = path.join(ROOT, 'node_modules');
const PUB = path.join(ROOT, 'public');
const require = createRequire(import.meta.url);

const pkgDir = (name) => path.join(NM, name);
const pkgVersion = (name) =>
  JSON.parse(fs.readFileSync(path.join(pkgDir(name), 'package.json'), 'utf8')).version;

function copy(from, to) {
  if (!fs.existsSync(from)) throw new Error(`copy-engines: missing ${path.relative(ROOT, from)}`);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true });
}

function reset(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

const wasmDir = path.join(PUB, 'wasm');
const vendorDir = path.join(PUB, 'vendor');
reset(wasmDir);
reset(vendorDir);

const versions = {};

// PyMuPDF (Pyodide) — the loader imports <base>dist/index.js and reads <base>assets/
{
  const name = '@bentopdf/pymupdf-wasm';
  copy(path.join(pkgDir(name), 'dist'), path.join(wasmDir, 'pymupdf/dist'));
  copy(path.join(pkgDir(name), 'assets'), path.join(wasmDir, 'pymupdf/assets'));
  copy(path.join(pkgDir(name), 'LICENSE'), path.join(wasmDir, 'pymupdf/LICENSE'));
  versions[name] = pkgVersion(name);
}

// Ghostscript — the loader fetches <base>gs.js and <base>gs.wasm
{
  const name = '@bentopdf/gs-wasm';
  for (const f of ['gs.js', 'gs.wasm']) {
    copy(path.join(pkgDir(name), 'assets', f), path.join(wasmDir, 'gs', f));
  }
  const lic = ['LICENSE', 'LICENSE.md', 'COPYING'].map((f) => path.join(pkgDir(name), f)).find(fs.existsSync);
  if (lic) copy(lic, path.join(wasmDir, 'gs/LICENSE'));
  versions[name] = pkgVersion(name);
}

// CoherentPDF — workers importScripts(<base>coherentpdf.browser.min.js)
{
  const name = 'coherentpdf';
  copy(path.join(pkgDir(name), 'dist/coherentpdf.browser.min.js'), path.join(wasmDir, 'cpdf/coherentpdf.browser.min.js'));
  const lic = ['LICENSE', 'LICENSE.md', 'COPYING'].map((f) => path.join(pkgDir(name), f)).find(fs.existsSync);
  if (lic) copy(lic, path.join(wasmDir, 'cpdf/LICENSE'));
  versions[name] = pkgVersion(name);
}

// Tesseract.js — worker, WebAssembly cores and English/French language data
{
  const tjs = path.dirname(require.resolve('tesseract.js/package.json'));
  copy(path.join(tjs, 'dist/worker.min.js'), path.join(wasmDir, 'tesseract/worker.min.js'));
  const core = path.dirname(require.resolve('tesseract.js-core/package.json', { paths: [tjs] }));
  for (const f of fs.readdirSync(core)) {
    if (/^tesseract-core.*\.wasm\.js$/.test(f)) {
      copy(path.join(core, f), path.join(wasmDir, 'tesseract/core', f));
    }
  }
  for (const lang of ['eng', 'fra']) {
    const name = `@tesseract.js-data/${lang}`;
    copy(
      path.join(pkgDir(name), `4.0.0_best_int/${lang}.traineddata.gz`),
      path.join(wasmDir, `tesseract/lang/${lang}.traineddata.gz`)
    );
    versions[name] = pkgVersion(name);
  }
  versions['tesseract.js'] = pkgVersion('tesseract.js');
  versions['tesseract.js-core'] = JSON.parse(fs.readFileSync(path.join(core, 'package.json'), 'utf8')).version;
}

// Editor fallback fonts — keep the upstream CDN path layout
{
  const packs = {
    latin: 'NotoSans-Regular.ttf',
    jp: 'NotoSansJP-Regular.otf',
    kr: 'NotoSansKR-Regular.otf',
    sc: 'NotoSansHans-Regular.otf',
    tc: 'NotoSansHant-Regular.otf',
    arabic: 'NotoNaskhArabic-Regular.ttf',
    hebrew: 'NotoSansHebrew-Regular.ttf',
  };
  for (const [pack, file] of Object.entries(packs)) {
    const name = `@embedpdf/fonts-${pack}`;
    const v = pkgVersion(name);
    copy(path.join(pkgDir(name), 'fonts', file), path.join(vendorDir, `embedpdf/fonts-${pack}@${v}/fonts/${file}`));
    versions[name] = v;
  }
  // OCR text-layer font for Latin-script languages (eng, fra)
  copy(
    path.join(pkgDir('@embedpdf/fonts-latin'), 'fonts/NotoSans-Regular.ttf'),
    path.join(vendorDir, 'ocr-fonts/NotoSans-Regular.ttf')
  );
}

fs.writeFileSync(path.join(wasmDir, 'versions.json'), JSON.stringify(versions, null, 2) + '\n');

let total = 0;
let count = 0;
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else {
      total += fs.statSync(p).size;
      count++;
    }
  }
};
walk(wasmDir);
walk(vendorDir);
console.log(`copy-engines: ${count} files, ${(total / 1048576).toFixed(1)} MiB → public/wasm, public/vendor`);
