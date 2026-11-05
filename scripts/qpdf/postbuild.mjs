// QPDF post-build step. Runs after `vite build` and prepares dist/ for
// Cloudflare Pages:
//   1. Moves pages to clean, trailing-slash URLs (<slug>/index.html).
//   2. Rewrites internal links from upstream page names to QPDF slugs.
//   3. Writes sitemap.xml, robots.txt, _headers and _redirects.
//   4. Computes each tool's offline file list (offline-manifest.json) and
//      the asset list used by the service worker to prune old files.
//   5. Fills the service worker placeholders.
//   6. Audits every file against Cloudflare Pages' 25 MiB limit (fails the
//      build if exceeded) and the 20,000-file limit.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  ENABLED_TOOLS,
  DISABLED_TOOL_IDS,
  PAGES,
  SITE,
  LIBREOFFICE_ENABLED,
} from './context.mjs';
import { TOOLS } from '../../src/data/tools.mjs';
import { loadGuides, ROOT } from './guides.mjs';

const DIST = path.join(ROOT, 'dist');
const MAX_FILE = 25 * 1024 * 1024; // 26,214,400 bytes
const MAX_FILES = 20000;
const AUTO_OFFLINE_LIMIT = 40 * 1024 * 1024; // auto-cache tools needing ≤ 40 MiB
const log = (...a) => console.log('[postbuild]', ...a);

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  throw new Error('dist/index.html not found — run vite build first');
}

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};
const rel = (p) => '/' + path.relative(DIST, p).split(path.sep).join('/');
const move = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
};

// ── 1. Clean URLs ─────────────────────────────────────────────────────────
const idToSlug = new Map(TOOLS.map((t) => [t.id, t.slug]));
for (const t of ENABLED_TOOLS) {
  const from = path.join(DIST, `${t.id}.html`);
  if (!fs.existsSync(from)) throw new Error(`Missing built page ${t.id}.html`);
  move(from, path.join(DIST, t.slug, 'index.html'));
}
for (const key of Object.keys(PAGES)) {
  if (['index', '404', 'guides'].includes(key)) continue;
  const from = path.join(DIST, `${key}.html`);
  if (fs.existsSync(from)) move(from, path.join(DIST, key, 'index.html'));
}
const guides = loadGuides();
for (const g of guides) {
  const from = path.join(DIST, 'guides', `${g.slug}.html`);
  if (!fs.existsSync(from)) throw new Error(`Missing built guide ${g.slug}`);
  move(from, path.join(DIST, 'guides', g.slug, 'index.html'));
}
// Upstream pages that are not published must not linger in dist/.
for (const id of DISABLED_TOOL_IDS) fs.rmSync(path.join(DIST, `${id}.html`), { force: true });

// ── 2. Rewrite internal links ─────────────────────────────────────────────
const linkRe = /(href=["'])\/([a-z0-9-]+?)(?:\.html)?(\/?)(["'#?])/g;
const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
for (const f of htmlFiles) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  s = s.replace(linkRe, (m, pre, id, slash, post) => {
    if (idToSlug.has(id)) return `${pre}/${idToSlug.get(id)}/${post}`;
    if (PAGES[id] && id !== 'index' && id !== '404') return `${pre}/${id}/${post}`;
    return m;
  });
  if (s !== before) fs.writeFileSync(f, s);
}

// ── 3. sitemap.xml, robots.txt, _redirects, _headers ──────────────────────
const urls = [
  { loc: '/', priority: '1.0' },
  ...ENABLED_TOOLS.map((t) => ({ loc: `/${t.slug}/`, priority: t.popular ? '0.9' : '0.7' })),
  ...['tools', 'privacy', 'about', 'guides', 'privacy-policy', 'terms', 'site-index', 'licenses'].map((k) => ({
    loc: PAGES[k].path,
    priority: ['tools', 'privacy'].includes(k) ? '0.8' : '0.4',
  })),
  ...guides.map((g) => ({ loc: g.path, lastmod: g.reviewed, priority: '0.6' })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${SITE.url}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  `# QPDF — https://qpdf.ca
User-agent: *
Allow: /
Disallow: /wasm/
Disallow: /vendor/

Sitemap: ${SITE.url}/sitemap.xml
`
);

const redirects = [];
for (const t of TOOLS) {
  const target = ENABLED_TOOLS.includes(t) ? `/${t.slug}/` : '/tools/';
  if (t.id !== t.slug || !ENABLED_TOOLS.includes(t)) redirects.push(`/${t.id} ${target} 301`, `/${t.id}/ ${target} 301`);
  redirects.push(`/${t.id}.html ${target} 301`);
}
redirects.push('/wasm-settings /tools/ 301', '/wasm-settings.html /tools/ 301');
for (const key of ['about', 'privacy', 'terms']) redirects.push(`/${key}.html /${key}/ 301`);
redirects.push('/faq /about/ 301', '/contact /about/ 301', '/licensing /licenses/ 301', '/index.html / 301');
fs.writeFileSync(path.join(DIST, '_redirects'), redirects.join('\n') + '\n');

const extraOrigins = [];
if (LIBREOFFICE_ENABLED) extraOrigins.push(new URL(process.env.VITE_LIBREOFFICE_ASSET_URL).origin);
const csp = [
  "default-src 'self'",
  // 'wasm-unsafe-eval' for WebAssembly; 'unsafe-eval' and blob: are required
  // by the bundled engines (wasm-vips, Ghostscript loader, Pyodide).
  "script-src 'self' 'wasm-unsafe-eval' 'unsafe-eval' blob:",
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' blob: data:${extraOrigins.map((o) => ' ' + o).join('')}`,
  "media-src 'self' blob:",
  "frame-src 'self' blob:",
  "child-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  // Omitted only for local testing against an http:// asset host.
  ...(extraOrigins.some((o) => o.startsWith('http:')) ? [] : ['upgrade-insecure-requests']),
].join('; ');
const headers = `/*
  Content-Security-Policy: ${csp}
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Resource-Policy: same-origin
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/wasm/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

/vendor/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

/*.wasm
  Content-Type: application/wasm

/pdfjs-viewer/*
  Cache-Control: public, max-age=86400

/pdfjs-annotation-viewer/*
  Cache-Control: public, max-age=86400

/images/*
  Cache-Control: public, max-age=604800

/sw.js
  Cache-Control: no-cache

/offline-manifest.json
  Cache-Control: no-cache

/build-assets.json
  Cache-Control: no-cache
`;
fs.writeFileSync(path.join(DIST, '_headers'), headers);

// ── 4. Offline manifest ───────────────────────────────────────────────────
const allFiles = walk(DIST);
const assetNames = new Map(); // basename → /assets/path
for (const f of allFiles) {
  const r = rel(f);
  if (r.startsWith('/assets/')) assetNames.set(path.basename(f), r);
}
const sizeOf = (r) => fs.statSync(path.join(DIST, r)).size;
const textCache = new Map();
const readText = (r) => {
  if (!textCache.has(r)) textCache.set(r, fs.readFileSync(path.join(DIST, r), 'utf8'));
  return textCache.get(r);
};
const refRe = /[A-Za-z0-9_.@-]+\.(?:js|mjs|css|wasm|woff2|json|data|bin)\b/g;
// Root-level public files that code references by plain path strings
// (BASE_URL + '...'), so they never appear as hashed /assets/ references.
const viewerFiles = (dir) =>
  dirFiles(dir).filter(
    (r) =>
      !r.endsWith('.map') &&
      !/\/locale\/(?!en-US\/|locale\.json)/.test(r) &&
      !/\/cmaps\//.test(r) &&
      !/testdata/.test(r)
  );
const RUNTIME_REFS = [
  [/qpdf\.wasm/, () => ['/qpdf.wasm']],
  [/pdfjs-viewer\/wasm\//, () => dirFiles('pdfjs-viewer/wasm').filter((r) => !/LICENSE/.test(r))],
  [/pdfjs-viewer\/viewer\.html/, () => viewerFiles('pdfjs-viewer')],
  [/pdfjs-annotation-viewer\/web\/viewer\.html/, () => viewerFiles('pdfjs-annotation-viewer')],
  [/sRGB_IEC61966-2-1_no_black_scaling\.icc/, () => ['/sRGB_IEC61966-2-1_no_black_scaling.icc']],
];
function runtimeRefs(text) {
  const out = [];
  for (const [re, files] of RUNTIME_REFS) if (re.test(text)) out.push(...files());
  for (const m of text.matchAll(/workers\/([a-z0-9-]+\.worker\.js)/g)) out.push(`/workers/${m[1]}`);
  return out;
}
function closure(seedHtml) {
  const html = readText(seedHtml);
  const seen = new Set();
  const queue = [];
  for (const m of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) queue.push(m[1]);
  while (queue.length) {
    const r = queue.pop();
    if (seen.has(r)) continue;
    seen.add(r);
    if (!/\.(m?js|css)$/.test(r) || !r.startsWith('/assets/')) continue;
    const text = readText(r);
    for (const m of text.matchAll(refRe)) {
      const hit = assetNames.get(m[0]);
      if (hit && !seen.has(hit)) queue.push(hit);
    }
    for (const extra of runtimeRefs(text)) if (fs.existsSync(path.join(DIST, extra))) seen.add(extra);
  }
  return [...seen];
}
const dirFiles = (d) =>
  fs.existsSync(path.join(DIST, d)) ? walk(path.join(DIST, d)).map(rel).filter((r) => !/LICENSE|versions\.json$/.test(r)) : [];
const ENGINE_FILES = {
  cpdf: () => ['/wasm/cpdf/coherentpdf.browser.min.js'],
  pymupdf: () => dirFiles('wasm/pymupdf'),
  gs: () => [...dirFiles('wasm/gs'), ...dirFiles('wasm/pymupdf'), '/sRGB_IEC61966-2-1_no_black_scaling.icc'],
  tesseract: () => [
    '/wasm/tesseract/worker.min.js',
    ...dirFiles('wasm/tesseract/core').filter((r) => /lstm\.wasm\.js$/.test(r)),
    ...dirFiles('wasm/tesseract/lang'),
    '/vendor/ocr-fonts/NotoSans-Regular.ttf',
  ],
};
const SHARED = ['/vendor/embedpdf/fonts-latin@1.0.0/fonts/NotoSans-Regular.ttf', '/locales/en/common.json', '/locales/en/tools.json'];
const EXTRA_FOR = {
  'pdf-to-word': ['gs'],
  'pdf-to-pdfa': ['pymupdf'],
  'merge-pdf': ['cpdf'],
  'split-pdf': ['cpdf'],
};
const offline = {};
for (const t of ENABLED_TOOLS) {
  if (t.engine === 'libreoffice' || t.engine === 'network') continue;
  const html = `/${t.slug}/index.html`;
  const set = new Set([`/${t.slug}/`, ...closure(html)]);
  for (const eng of [t.engine, ...(EXTRA_FOR[t.id] || [])]) {
    for (const r of (ENGINE_FILES[eng] || (() => []))()) set.add(r);
  }
  for (const r of SHARED) if (fs.existsSync(path.join(DIST, r))) set.add(r);
  const list = [...set].filter((r) => r.endsWith('/') || fs.existsSync(path.join(DIST, r)));
  offline[t.slug] = {
    id: t.id,
    engine: t.engine,
    urls: list,
    bytes: list.reduce((n, r) => n + (r.endsWith('/') ? fs.statSync(path.join(DIST, r, 'index.html')).size : sizeOf(r)), 0),
  };
}
const versions = fs.existsSync(path.join(DIST, 'wasm/versions.json'))
  ? fs.readFileSync(path.join(DIST, 'wasm/versions.json'), 'utf8')
  : '{}';
const engineHash = crypto.createHash('sha256').update(versions).digest('hex').slice(0, 10);
const buildId = `${new Date().toISOString().slice(0, 10)}-${crypto
  .createHash('sha256')
  .update(fs.readFileSync(path.join(DIST, 'index.html')))
  .update(JSON.stringify([...assetNames.keys()].sort()))
  .digest('hex')
  .slice(0, 8)}`;
fs.writeFileSync(
  path.join(DIST, 'offline-manifest.json'),
  JSON.stringify({
    build: buildId,
    engineCache: `qpdf-engines-${engineHash}`,
    assetCache: 'qpdf-assets-v1',
    staticCache: `qpdf-static-${buildId}`,
    autoLimit: AUTO_OFFLINE_LIMIT,
    pages: offline,
  })
);
fs.writeFileSync(path.join(DIST, 'build-assets.json'), JSON.stringify({ build: buildId, assets: [...assetNames.values()].sort() }));

// ── 5. Service worker placeholders ────────────────────────────────────────
const swPath = path.join(DIST, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
for (const [k, v] of Object.entries({
  __QPDF_BUILD_ID__: buildId,
  __QPDF_ENGINE_HASH__: engineHash,
  __QPDF_EXTRA_ORIGINS__: extraOrigins.join(','),
})) {
  if (!sw.includes(k)) throw new Error(`sw.js placeholder ${k} missing`);
  sw = sw.replaceAll(k, v);
}
fs.writeFileSync(swPath, sw);

// Vite's manifest is a build artefact, not something to publish.
fs.rmSync(path.join(DIST, '.vite'), { recursive: true, force: true });

// ── 6. Cloudflare Pages limits ────────────────────────────────────────────
const finalFiles = walk(DIST);
const tooBig = finalFiles.filter((f) => fs.statSync(f).size > MAX_FILE);
const totalBytes = finalFiles.reduce((n, f) => n + fs.statSync(f).size, 0);
const largest = finalFiles
  .map((f) => [rel(f), fs.statSync(f).size])
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);
log(`${finalFiles.length} files, ${(totalBytes / 1048576).toFixed(1)} MiB total`);
log('largest files:', largest.map(([r, s]) => `${r} (${(s / 1048576).toFixed(1)} MiB)`).join(', '));
if (tooBig.length) {
  throw new Error(
    `Files exceed Cloudflare Pages' 25 MiB limit:\n${tooBig.map((f) => `  ${rel(f)} ${fs.statSync(f).size}`).join('\n')}`
  );
}
if (finalFiles.length > MAX_FILES) throw new Error(`Too many files for Cloudflare Pages: ${finalFiles.length}`);
const heavy = Object.entries(offline).sort((a, b) => b[1].bytes - a[1].bytes);
log(
  `offline manifest: ${heavy.length} tools; ` +
    `${heavy.filter(([, e]) => e.bytes <= AUTO_OFFLINE_LIMIT).length} auto-prepared, ` +
    `largest ${heavy[0][0]} ${(heavy[0][1].bytes / 1048576).toFixed(1)} MiB`
);
log(`sitemap: ${urls.length} URLs · LibreOffice tools ${LIBREOFFICE_ENABLED ? 'enabled' : 'disabled (no asset host configured)'}`);
log(`build ${buildId} ready for Cloudflare Pages`);
