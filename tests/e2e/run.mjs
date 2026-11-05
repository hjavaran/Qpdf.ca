// QPDF end-to-end tests (functional, offline and network-privacy checks).
//
//   python3 tests/fixtures/make_fixtures.py [--large]   # synthetic fixtures
//   npm run build && npm run serve:dist                  # http://localhost:4173
//   node tests/e2e/run.mjs [filter] [--large]
//
// Requires Playwright with Chromium (not a project dependency) and the
// poppler-utils commands pdfinfo/pdftotext.
//
// For every tool run the harness records all network requests made by the
// page, its workers and the service worker, and fails the test if any request
// is not a GET, goes to another origin, or is made to a non-static path after
// a document has been selected.

import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FIX = path.join(ROOT, 'tests/fixtures/out');
const ART = path.join(ROOT, 'tests/e2e/artifacts');
const BASE = process.env.QPDF_URL || 'http://localhost:4173';
const ORIGIN = new URL(BASE).origin;
const args = process.argv.slice(2);
const filter = args.find((a) => !a.startsWith('--'));
const LARGE = args.includes('--large');
fs.mkdirSync(ART, { recursive: true });

const fx = (n) => path.join(FIX, n);
const sh = (cmd, a) => execFileSync(cmd, a, { encoding: 'utf8' });
const pdfinfo = (f) => {
  const out = sh('pdfinfo', [f]);
  const get = (k) => (out.match(new RegExp(`^${k}:[ \\t]*(.*)$`, 'm')) || [])[1]?.trim() ?? '';
  return { pages: Number(get('Pages')), encrypted: get('Encrypted'), author: get('Author'), title: get('Title'), raw: out };
};
const pdftext = (f) => sh('pdftotext', ['-layout', f, '-']);
const py = (code) => sh('python3', ['-c', code]);
const STATIC = /^\/(assets|wasm|vendor|pdfjs-viewer|pdfjs-annotation-viewer|images|locales|workers|libreoffice-wasm)\/|^\/(qpdf\.wasm|sRGB_IEC61966-2-1_no_black_scaling\.icc|favicon\.ico|site\.webmanifest|offline-manifest\.json|build-assets\.json|sw\.js|config\.json|theme-init\.js)$/;

const results = [];
function record(name, ok, detail, extra = {}) {
  results.push({ name, ok, detail, ...extra });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

async function newContext(browser) {
  const ctx = await browser.newContext({ acceptDownloads: true, serviceWorkers: 'allow', viewport: { width: 1280, height: 900 } });
  ctx.requests = [];
  ctx.on('request', (r) => {
    let post;
    try {
      post = r.postDataBuffer()?.length ?? 0;
    } catch {
      post = -1;
    }
    ctx.requests.push({ url: r.url(), method: r.method(), post, t: Date.now(), sw: !!r.serviceWorker() });
  });
  return ctx;
}

function auditRequests(ctx, since) {
  const bad = [];
  for (const r of ctx.requests.filter((x) => x.t >= since)) {
    if (r.url.startsWith('data:') || r.url.startsWith('blob:')) continue;
    const u = new URL(r.url);
    if (u.origin !== ORIGIN) bad.push(`cross-origin ${r.method} ${r.url}`);
    else if (r.method !== 'GET') bad.push(`${r.method} ${u.pathname}`);
    else if (r.post) bad.push(`body on ${u.pathname}`);
    else if (!STATIC.test(u.pathname) && !/\/$/.test(u.pathname)) bad.push(`non-static GET ${u.pathname}`);
  }
  return bad;
}

async function waitReady(page, { allowDownload = true, timeout = 240000 } = {}) {
  const status = page.locator('.qp-offline');
  await status.waitFor({ timeout: 30000 });
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const state = await status.getAttribute('data-state');
    const text = (await status.textContent()) || '';
    if (state === 'ready') return true;
    if (/Reload the page/.test(text)) {
      await page.reload();
      await status.waitFor();
      continue;
    }
    if (allowDownload && state === 'idle' && (await status.locator('button').count())) {
      await status.locator('button').click();
    }
    if (state === 'error') return false;
    await page.waitForTimeout(500);
  }
  return false;
}

async function runTool(browser, t) {
  const ctx = await newContext(browser);
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(e.message));
  const started = Date.now();
  try {
    await page.goto(`${BASE}/${t.slug}/`, { waitUntil: 'load' });
    let offlineNote = '';
    if (t.offline) {
      const ok = await waitReady(page);
      if (!ok) throw new Error('never reached "Ready to work offline"');
      await ctx.setOffline(true);
      offlineNote = ' [offline]';
    }
    const since = Date.now();
    await page.setInputFiles('#file-input', t.files.map(fx));
    if (t.prepare) await t.prepare(page);
    if (t.noDownload) {
      await page.locator(t.click ?? '#process-btn').first().click();
      const detail = (await t.validate(null, page)) || '';
      const bad = auditRequests(ctx, since);
      if (bad.length) throw new Error(`network audit failed: ${bad.slice(0, 5).join('; ')}`);
      record(t.name + offlineNote, true, detail);
      return;
    }
    const dlPromise = page.waitForEvent('download', { timeout: t.timeout ?? 180000 });
    await page.locator(t.click ?? '#process-btn').first().click();
    if (t.after) await t.after(page);
    const dl = await dlPromise;
    const out = path.join(ART, `${t.name.replace(/[^a-z0-9]+/gi, '_')}${path.extname(dl.suggestedFilename()) || '.bin'}`);
    await dl.saveAs(out);
    const detail = (await t.validate(out, page)) || '';
    const bad = auditRequests(ctx, since);
    if (bad.length) throw new Error(`network audit failed: ${bad.slice(0, 5).join('; ')}`);
    const secs = ((Date.now() - started) / 1000).toFixed(1);
    record(t.name + offlineNote, true, `${detail} (${secs}s, ${fs.statSync(out).size.toLocaleString()} B)`, { requests: ctx.requests.length });
  } catch (e) {
    await page.screenshot({ path: path.join(ART, `${t.name.replace(/[^a-z0-9]+/gi, '_')}-fail.png`) }).catch(() => {});
    record(t.name + (t.offline ? ' [offline]' : ''), false, `${e.message.split('\n')[0]}${consoleErrors.length ? ' | pageerror: ' + consoleErrors[0].slice(0, 160) : ''}`);
  } finally {
    await ctx.close();
  }
}

const expectPages = (n) => (f) => {
  const i = pdfinfo(f);
  if (i.pages !== n) throw new Error(`expected ${n} pages, got ${i.pages}`);
  return `${n} pages`;
};
const resultText = async (page) => ((await page.locator('#qp-compress-result').textContent().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
const clickDownload = async (page) => {
  await page.locator('#qp-compress-download').waitFor({ timeout: 900000 });
  await page.click('#qp-compress-download');
};

const TESTS = [
  {
    name: 'compress image-heavy',
    slug: 'compress-pdf',
    files: ['image-heavy.pdf'],
    after: clickDownload,
    validate: async (f, page) => {
      const before = fs.statSync(fx('image-heavy.pdf')).size;
      const after = fs.statSync(f).size;
      expectPages(4)(f);
      if (!(after < before)) throw new Error(`not smaller: ${before} → ${after}`);
      await page.waitForTimeout(500);
      return `${(before / 1048576).toFixed(2)} MB → ${(after / 1048576).toFixed(2)} MB (−${(100 - (after / before) * 100).toFixed(1)}%); card: "${(await resultText(page)).slice(0, 110)}"`;
    },
  },
  {
    name: 'compress scanned',
    slug: 'compress-pdf',
    files: ['scanned.pdf'],
    after: clickDownload,
    validate: (f) => {
      const b = fs.statSync(fx('scanned.pdf')).size, a = fs.statSync(f).size;
      expectPages(3)(f);
      return `${(b / 1048576).toFixed(2)} MB → ${(a / 1048576).toFixed(2)} MB (−${(100 - (a / b) * 100).toFixed(1)}%)`;
    },
  },
  {
    name: 'compress text keeps text+links',
    slug: 'compress-pdf',
    files: ['text.pdf'],
    after: clickDownload,
    validate: async (f, page) => {
      expectPages(3)(f);
      if (!/QPDF Test Document/.test(pdftext(f))) throw new Error('text lost');
      const links = py(`from pypdf import PdfReader;r=PdfReader(${JSON.stringify(f)});print(sum(1 for p in r.pages for a in (p.get('/Annots') or []) if a.get_object().get('/Subtype')=='/Link'))`).trim();
      if (links !== '3') throw new Error(`expected 3 links, got ${links}`);
      return `text + 3 links kept; card: "${(await resultText(page)).slice(0, 90)}"`;
    },
  },
  {
    name: 'compress signed (left untouched)',
    slug: 'compress-pdf',
    files: ['signed.pdf'],
    noDownload: true,
    validate: async (_f, page) => {
      await page.locator('#alert-modal:not(.hidden)').waitFor({ timeout: 60000 });
      const msg = (await page.locator('#alert-modal').textContent()).replace(/\s+/g, ' ').trim();
      if (!/digitally signed/.test(msg)) throw new Error(`unexpected: ${msg.slice(0, 120)}`);
      return `left untouched with warning: "${msg.slice(0, 110)}"`;
    },
  },
  { name: 'compress offline', slug: 'compress-pdf', files: ['image-heavy.pdf'], offline: true, after: clickDownload, validate: expectPages(4) },
  {
    name: 'compress two files (zip)',
    slug: 'compress-pdf',
    files: ['image-heavy.pdf', 'scanned.pdf'],
    after: clickDownload,
    validate: async (f, page) => `zip with ${sh('unzip', ['-l', f]).split('\n').filter((l) => /\.pdf$/.test(l)).length} PDFs; card: "${(await resultText(page)).slice(0, 90)}"`,
  },
  {
    name: 'compress to 2 MB target',
    slug: 'compress-pdf-to-2mb',
    files: ['image-heavy.pdf'],
    after: clickDownload,
    validate: (f) => {
      const a = fs.statSync(f).size;
      if (a > 2 * 1024 * 1024) throw new Error(`above target: ${a}`);
      return `${(a / 1048576).toFixed(2)} MB ≤ 2 MB`;
    },
  },
  {
    name: 'merge two PDFs (bookmarks kept)',
    slug: 'merge-pdf',
    files: ['text.pdf', 'text-b.pdf'],
    prepare: (p) => p.waitForTimeout(2500),
    validate: (f) => {
      expectPages(5)(f);
      const n = py(`from pypdf import PdfReader;print(len(PdfReader(${JSON.stringify(f)}).outline))`).trim();
      return `5 pages, ${n} top-level bookmarks`;
    },
  },
  { name: 'merge offline', slug: 'merge-pdf', files: ['text.pdf', 'text-b.pdf'], offline: true, prepare: (p) => p.waitForTimeout(2500), validate: expectPages(5) },
  {
    name: 'split by range',
    slug: 'split-pdf',
    files: ['multipage-40.pdf'],
    prepare: async (p) => {
      await p.selectOption('#split-mode', 'range');
      await p.fill('#page-range', '1-3,5');
    },
    validate: (f) => (f.endsWith('.pdf') ? `${pdfinfo(f).pages} pages` : `zip ${sh('unzip', ['-l', f]).split('\n').filter((l) => /\.pdf$/.test(l)).length} PDFs`),
  },
  {
    name: 'split offline',
    slug: 'split-pdf',
    files: ['multipage-40.pdf'],
    offline: true,
    prepare: async (p) => {
      await p.selectOption('#split-mode', 'range');
      await p.fill('#page-range', '2-4');
    },
    validate: (f) => (f.endsWith('.pdf') ? `${pdfinfo(f).pages} pages` : 'zip'),
  },
  { name: 'extract pages', slug: 'extract-pdf-pages', files: ['text.pdf'], prepare: (p) => p.fill('#pages-to-extract', '2'), validate: (f) => (f.endsWith('.pdf') ? expectPages(1)(f) : 'zip') },
  { name: 'delete pages', slug: 'delete-pdf-pages', files: ['text.pdf'], prepare: (p) => p.fill('#pages-to-delete', '1'), validate: expectPages(2) },
  { name: 'delete pages offline', slug: 'delete-pdf-pages', files: ['text.pdf'], offline: true, prepare: (p) => p.fill('#pages-to-delete', '1'), validate: expectPages(2) },
  {
    name: 'reorder pages',
    slug: 'reorder-pdf-pages',
    files: ['text.pdf'],
    prepare: async (p) => {
      await p.waitForTimeout(1500);
      if (await p.locator('#page-order-input').isVisible().catch(() => false)) {
        await p.fill('#page-order-input', '3,2,1');
        await p.click('#apply-order-btn');
        const ok = p.locator('#alert-ok');
        if (await ok.isVisible({ timeout: 3000 }).catch(() => false)) await ok.click();
      }
    },
    validate: (f) => {
      expectPages(3)(f);
      const first = pdftext(f).split('\f')[0];
      return /page 3/.test(first) ? 'order 3,2,1 applied' : 'order unchanged';
    },
  },
  {
    name: 'rotate all pages',
    slug: 'rotate-pdf',
    files: ['text.pdf'],
    prepare: async (p) => {
      await p.waitForTimeout(1500);
      const btn = p.locator('button:has-text("Right"), button[title*="right" i], #rotate-all-right, button:has-text("Rotate All")').first();
      if (await btn.count()) await btn.click();
    },
    validate: (f) => {
      const rot = py(`from pypdf import PdfReader;print([p.rotation for p in PdfReader(${JSON.stringify(f)}).pages])`).trim();
      return `rotations ${rot}`;
    },
  },
  { name: 'add page numbers', slug: 'add-page-numbers-to-pdf', files: ['text.pdf'], validate: (f) => `${expectPages(3)(f)}; footer text: ${JSON.stringify(pdftext(f).split('\f')[1].trim().split('\n').pop().trim().slice(-20))}` },
  {
    name: 'watermark text',
    slug: 'watermark-pdf',
    files: ['text.pdf'],
    prepare: async (p) => {
      await p.waitForTimeout(1500);
      const input = p.locator('#watermark-text');
      if (await input.isVisible().catch(() => false)) await input.fill('CONFIDENTIAL');
    },
    validate: (f) => {
      const t = pdftext(f);
      if (!/CONFIDENTIAL/.test(t)) return 'watermark not found in text layer (may be flattened as image)';
      return 'CONFIDENTIAL present';
    },
  },
  { name: 'jpg to pdf', slug: 'jpg-to-pdf', files: ['photo-1.jpg', 'photo-2.jpg', 'photo-3.jpg'], validate: expectPages(3) },
  { name: 'jpg to pdf offline', slug: 'jpg-to-pdf', files: ['photo-1.jpg', 'photo-2.jpg'], offline: true, validate: expectPages(2) },
  {
    name: 'pdf to jpg',
    slug: 'pdf-to-jpg',
    files: ['text.pdf'],
    validate: (f) => (f.endsWith('.zip') ? `zip with ${sh('unzip', ['-l', f]).split('\n').filter((l) => /\.jpe?g$/i.test(l)).length} JPGs` : `single ${path.extname(f)}`),
  },
  {
    name: 'password protect',
    slug: 'password-protect-pdf',
    files: ['text.pdf'],
    prepare: async (p) => {
      await p.fill('#user-password-input', 'Qpdf-Test-2026');
    },
    validate: (f) => {
      const enc = py(`from pypdf import PdfReader;r=PdfReader(${JSON.stringify(f)});print(r.is_encrypted, r.decrypt('Qpdf-Test-2026'), len(r.pages))`).trim();
      if (!enc.startsWith('True')) throw new Error(`not encrypted: ${enc}`);
      return `encrypted; decrypt with password → ${enc}`;
    },
  },
  { name: 'password protect offline', slug: 'password-protect-pdf', files: ['text.pdf'], offline: true, prepare: (p) => p.fill('#user-password-input', 'Offline-Pass-1'), validate: (f) => {
    const enc = py(`from pypdf import PdfReader;r=PdfReader(${JSON.stringify(f)});print(r.is_encrypted, r.decrypt('Offline-Pass-1'), len(r.pages))`).trim();
    if (!enc.startsWith('True')) throw new Error(`not encrypted: ${enc}`);
    return `encrypted offline; decrypts with password → ${enc}`;
  } },
  {
    name: 'unlock with password',
    slug: 'unlock-pdf',
    files: ['encrypted.pdf'],
    prepare: (p) => p.fill('#password-input', 'test-pass-123'),
    validate: (f) => {
      const i = pdfinfo(f);
      if (!i.encrypted.startsWith('no')) throw new Error('still encrypted');
      return `decrypted, ${i.pages} pages`;
    },
  },
  {
    name: 'flatten form',
    slug: 'flatten-pdf',
    files: ['form.pdf'],
    validate: (f) => {
      const n = py(`from pypdf import PdfReader;print(len(PdfReader(${JSON.stringify(f)}).get_fields() or {}))`).trim();
      if (n !== '0') throw new Error(`${n} form fields remain`);
      return 'no interactive fields remain';
    },
  },
  {
    name: 'remove metadata',
    slug: 'remove-pdf-metadata',
    files: ['text.pdf'],
    validate: (f) => {
      const i = pdfinfo(f);
      if (/Jane Testperson/.test(i.raw)) throw new Error('author still present');
      return `author="${i.author}" title="${i.title}"`;
    },
  },
  {
    name: 'bates numbering',
    slug: 'bates-numbering',
    files: ['text.pdf', 'text-b.pdf'],
    validate: (f) => {
      const t = f.endsWith('.pdf') ? pdftext(f) : '';
      const m = t.match(/[A-Z]*0{2,}\d+/g);
      return f.endsWith('.zip') ? 'zip of numbered files' : `bates ids: ${(m || []).slice(0, 3).join(', ')}`;
    },
  },
  {
    name: 'ocr scanned (eng)',
    slug: 'ocr-pdf',
    files: ['scanned.pdf'],
    timeout: 600000,
    prepare: async (p) => {
      await p.waitForTimeout(800);
      const eng = p.locator('#lang-list input[value="eng"]');
      if ((await eng.count()) && !(await eng.isChecked())) await eng.check();
    },
    after: async (p) => {
      const dl = p.locator('#download-searchable-pdf');
      await dl.waitFor({ state: 'visible', timeout: 600000 });
      await dl.click();
    },
    validate: (f) => {
      const t = pdftext(f).toLowerCase();
      if (!/quick brown fox/.test(t)) throw new Error('recognized text not found');
      return 'searchable text found ("quick brown fox")';
    },
  },
  {
    name: 'pdf to pdf/a',
    slug: 'pdf-to-pdfa',
    files: ['text.pdf'],
    timeout: 600000,
    validate: (f) => {
      const meta = py(`from pypdf import PdfReader;r=PdfReader(${JSON.stringify(f)});x=r.xmp_metadata;print(len(r.pages), bool(x and x.pdfaid_part if hasattr(x,'pdfaid_part') else ('pdfaid' in (r.trailer['/Root'].get('/Metadata').get_object().get_data().decode('latin1')))))`).trim();
      return `pages, PDF/A id present: ${meta}`;
    },
  },
];


// Target-size presets must pass the page's target to the engine. The lossless level on a
// 7.7 MB file stays far above 4 MB by itself, so only the target can bring it under.
const MB = 1024 * 1024;
TESTS.push({
  name: 'control: lossless without target stays large',
  slug: 'compress-pdf',
  files: ['image-heavy.pdf'],
  prepare: (p) => p.selectOption('#compression-level', 'lossless'),
  after: clickDownload,
  validate: (f) => {
    const a = fs.statSync(f).size;
    if (a <= 4 * MB) throw new Error(`control too small (${a}); test would prove nothing`);
    return `${(a / MB).toFixed(2)} MB (> 4 MB without a target)`;
  },
});
for (const n of [3, 4]) {
  TESTS.push({
    name: `compress to ${n} MB preset hits target`,
    slug: `compress-pdf-to-${n}mb`,
    files: ['image-heavy.pdf'],
    prepare: async (p) => {
      const v = await p.inputValue('#target-size');
      const u = await p.inputValue('#target-size-unit');
      if (v !== String(n) || u !== 'mb') throw new Error(`page preset is ${v} ${u}, expected ${n} mb`);
      await p.selectOption('#compression-level', 'lossless');
    },
    after: clickDownload,
    validate: async (f, page) => {
      const a = fs.statSync(f).size;
      if (a > n * MB) throw new Error(`${(a / MB).toFixed(2)} MB exceeds ${n} MB target`);
      expectPages(4)(f);
      const card = await resultText(page);
      return `${(a / MB).toFixed(2)} MB ≤ ${n} MB; card: "${card.slice(0, 60)}…${/target/i.test(card) ? ' [mentions target]' : ''}"`;
    },
  });
}
TESTS.push({
  name: 'unreachable target is reported, not faked',
  slug: 'compress-pdf-to-100kb',
  files: ['scanned.pdf'],
  prepare: async (p) => {
    await p.selectOption('#compression-level', 'lossless');
  },
  after: clickDownload,
  validate: async (f, page) => {
    const a = fs.statSync(f).size;
    const card = await resultText(page);
    if (a <= 100 * 1024) return `reached ${(a / 1024).toFixed(0)} KB (target met)`;
    if (!/(still above|Target Not Reached)/i.test(card)) throw new Error('missed target without saying so: ' + card.slice(0, 120));
    return `${(a / 1024).toFixed(0)} KB > 100 KB, honestly reported: "${card.slice(0, 90)}…"`;
  },
});

TESTS.push({
  name: 'redact text (true removal)',
  slug: 'redact-pdf',
  files: ['redaction.pdf'],
  click: 'text=Download Edited PDF',
  prepare: async (p) => {
    await p.waitForTimeout(5000);
    await p.locator('button:text-is("Redact")').first().click();
    await p.waitForTimeout(600);
    await p.locator('button[aria-label="Redact"]').first().click();
    const img = p.locator('img[src^="blob:"]').first();
    await img.scrollIntoViewIfNeeded();
    await p.waitForTimeout(500);
    const box = await img.boundingBox();
    const s = box.width / 612;
    const [x0, x1, y0, y1] = [box.x + 66 * s, box.x + 580 * s, box.y + 630 * s, box.y + 648 * s];
    await p.mouse.move(x0, y0);
    await p.mouse.down();
    await p.mouse.move(x1, y1, { steps: 8 });
    await p.mouse.up();
    await p.waitForTimeout(800);
    await p.locator('button[aria-label="Apply Redaction"]').first().click();
    await p.waitForTimeout(1500);
  },
  validate: (f) => {
    const t = pdftext(f);
    const raw = fs.readFileSync(f).includes(Buffer.from('SECRET-12345'));
    if (/SECRET-12345/.test(t) || raw) throw new Error('redacted text still present');
    if (!/Redaction Test/.test(t)) throw new Error('unredacted text lost');
    return 'SECRET-12345 removed from text layer and file bytes; other text kept';
  },
});

const LARGE_TESTS = [25, 50, 100].map((mb) => ({
  name: `compress large ${mb}MB-class file`,
  slug: 'compress-pdf',
  files: [`large-${mb}mb.pdf`],
  timeout: 900000,
  after: clickDownload,
  validate: (f) => {
    const b = fs.statSync(fx(`large-${mb}mb.pdf`)).size, a = fs.statSync(f).size;
    return `${(b / 1048576).toFixed(1)} MB → ${(a / 1048576).toFixed(1)} MB, ${pdfinfo(f).pages} pages`;
  },
}));

async function favoritesTest(browser) {
  const ctx = await newContext(browser);
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}/`);
    const favIds = async () => page.$$eval('#qp-fav-grid .qp-card', (els) => els.map((e) => e.dataset.tool));
    let ids = await favIds();
    if (ids[0] !== 'compress-pdf' || ids.length !== 1) throw new Error(`first visit favourites: ${ids}`);
    // add Merge, remove Compress, reload: Compress must not come back
    await page.click('#qp-popular-grid [data-fav="merge-pdf"]');
    await page.click('#qp-fav-grid [data-fav="compress-pdf"]');
    await page.reload();
    ids = await favIds();
    if (ids.includes('compress-pdf') || !ids.includes('merge-pdf')) throw new Error(`after removal + reload: ${ids}`);
    const stored = await page.evaluate(() => localStorage.getItem('qpdf.favorites.v1'));
    record('favourites: Compress default, removal persists', true, `stored=${stored}`);
    // search
    await page.fill('#qp-search', 'password');
    const hits = await page.$$eval('#qp-results-grid .qp-card', (els) => els.map((e) => e.dataset.tool));
    if (!hits.includes('protect-pdf')) throw new Error(`search "password" → ${hits}`);
    record('tool search', true, `"password" → ${hits.slice(0, 4).join(', ')}`);
    const bad = auditRequests(ctx, 0);
    record('homepage makes only same-origin GET requests', bad.length === 0, bad.slice(0, 3).join('; ') || `${ctx.requests.length} requests`);
  } catch (e) {
    record('favourites/search', false, e.message);
  } finally {
    await ctx.close();
  }
}

const browser = await chromium.launch();
try {
  if (!filter || /fav/.test(filter)) await favoritesTest(browser);
  for (const t of [...TESTS, ...(LARGE ? LARGE_TESTS : [])]) {
    if (filter && !t.name.includes(filter) && !t.slug.includes(filter)) continue;
    await runTool(browser, t);
  }
} finally {
  await browser.close();
}
const failed = results.filter((r) => !r.ok);
fs.writeFileSync(path.join(ART, 'results.json'), JSON.stringify(results, null, 2));
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exitCode = failed.length ? 1 : 0;
