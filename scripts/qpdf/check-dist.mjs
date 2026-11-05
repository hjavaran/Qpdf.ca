// Static checks on the built site (run after `npm run build`):
//   - every page: <title>, meta description, canonical (https://qpdf.ca + path),
//     exactly one <h1>, valid JSON-LD, no unintended noindex
//   - titles and descriptions are unique across indexable pages
//   - every internal link and asset reference resolves to a file in dist/
//   - sitemap.xml lists only existing, indexable, canonical URLs
//   - robots.txt points to the sitemap
//   - no leftover upstream branding or third-party runtime hosts in output
//   - no file above Cloudflare Pages' 25 MiB limit
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://qpdf.ca';
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);

const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};
const files = walk(DIST);
const rel = (f) => '/' + path.relative(DIST, f).split(path.sep).join('/');
const exists = (urlPath) => {
  const p = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (p.endsWith('/')) return fs.existsSync(path.join(DIST, p, 'index.html'));
  return fs.existsSync(path.join(DIST, p)) || fs.existsSync(path.join(DIST, p, 'index.html'));
};
const redirects = new Set(
  fs.readFileSync(path.join(DIST, '_redirects'), 'utf8').split('\n').map((l) => l.split(/\s+/)[0]).filter(Boolean)
);

// Pages that are not landing pages and need not be in the sitemap.
const NON_INDEXABLE = new Set(['/404.html']);
const pages = files.filter((f) => f.endsWith('.html') && !/\/(pdfjs-viewer|pdfjs-annotation-viewer|libreoffice-wasm|wasm|vendor)\//.test(rel(f)));
const seenTitle = new Map();
const seenDesc = new Map();
const indexable = new Set();

for (const f of pages) {
  const r = rel(f);
  const html = fs.readFileSync(f, 'utf8');
  const url = r === '/index.html' ? '/' : r.replace(/index\.html$/, '');
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.trim();
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const robots = (html.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || '';
  const h1s = (html.match(/<h1\b/g) || []).length;
  if (!title) err(`${r}: missing <title>`);
  if (!desc) err(`${r}: missing meta description`);
  if (desc && desc.length > 170) warnings.push(`${r}: description ${desc.length} chars`);
  if (title && title.length > 70) warnings.push(`${r}: title ${title.length} chars`);
  if (h1s !== 1) err(`${r}: ${h1s} <h1> elements`);
  if (!/lang="en-CA"|lang="en"/.test(html)) warnings.push(`${r}: html lang not set to en-CA`);
  if (NON_INDEXABLE.has(r)) {
    if (!/noindex/.test(robots)) err(`${r}: should be noindex`);
  } else {
    if (/noindex/.test(robots)) err(`${r}: unexpected noindex`);
    if (canonical !== `${SITE}${url}`) err(`${r}: canonical ${canonical} ≠ ${SITE}${url}`);
    indexable.add(url);
    if (title) {
      if (seenTitle.has(title)) err(`duplicate title "${title}" on ${r} and ${seenTitle.get(title)}`);
      seenTitle.set(title, r);
    }
    if (desc) {
      if (seenDesc.has(desc)) err(`duplicate description on ${r} and ${seenDesc.get(desc)}`);
      seenDesc.set(desc, r);
    }
  }
  const ldTypes = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const o = JSON.parse(m[1]);
      if (!o['@context'] || !o['@type']) err(`${r}: JSON-LD missing @context/@type`);
      ldTypes.push(o['@type']);
      if (o['@type'] === 'Article') {
        for (const k of ['headline', 'datePublished', 'dateModified', 'mainEntityOfPage']) if (!o[k]) err(`${r}: Article JSON-LD missing ${k}`);
        if (/rating|review/i.test(JSON.stringify(o))) err(`${r}: Article JSON-LD must not contain ratings or reviews`);
      }
    } catch (e) {
      err(`${r}: invalid JSON-LD (${e.message})`);
    }
  }
  if (/^\/guides\/[a-z0-9-]+\/index\.html$/.test(r) && !ldTypes.includes('Article')) err(`${r}: guide without Article JSON-LD`);
  if (/og:url" content="(?!https:\/\/qpdf\.ca)/.test(html)) err(`${r}: og:url not on qpdf.ca`);
  if (/bentopdf\.com/i.test(html)) err(`${r}: references bentopdf.com`);
  if (/cdn\.jsdelivr\.net|unpkg\.com|googleapis|gstatic|githack/.test(html)) err(`${r}: third-party host in HTML`);
  // External links: new tab + noopener noreferrer; nofollow unless wealththeory.ca
  for (const m of html.matchAll(/<a\b([^>]*)>/gi)) {
    const hm = m[1].match(/\shref="(https?:\/\/[^"]+)"/i);
    if (!hm) continue;
    let host = '';
    try { host = new URL(hm[1]).hostname.toLowerCase(); } catch { continue; }
    if (host === 'qpdf.ca' || host.endsWith('.qpdf.ca')) continue;
    const follow = host === 'wealththeory.ca' || host.endsWith('.wealththeory.ca');
    if (!/target="_blank"/.test(m[1]) || !/rel="noopener noreferrer( nofollow)?"/.test(m[1])) err(`${r}: external link without target/rel: ${hm[1]}`);
    else if (follow === /nofollow/.test(m[1])) err(`${r}: wrong nofollow for ${hm[1]}`);
  }
  // Internal links and assets
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const u = m[1];
    if (u.startsWith('//')) continue;
    const p = u.split(/[?#]/)[0];
    if (!exists(p) && !redirects.has(p)) err(`${r}: broken internal link ${u}`);
  }
}

// Sitemap
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!sitemap.startsWith('<?xml')) err('sitemap.xml: missing XML declaration');
for (const loc of locs) {
  if (!loc.startsWith(SITE + '/')) err(`sitemap: non-canonical host ${loc}`);
  const p = loc.slice(SITE.length);
  if (!exists(p)) err(`sitemap: ${loc} does not exist`);
  if (!indexable.has(p)) err(`sitemap: ${loc} is not an indexable page`);
}
for (const u of indexable) if (!locs.includes(SITE + u)) warnings.push(`indexable page missing from sitemap: ${u}`);
for (const m of sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(<lastmod>([^<]+)<\/lastmod>)?/g)) {
  if (/\/guides\/[a-z0-9-]+\/$/.test(m[1]) && !/^\d{4}-\d{2}-\d{2}$/.test(m[3] || '')) err(`sitemap: guide ${m[1]} without a valid lastmod`);
}
if (new Set(locs).size !== locs.length) err('sitemap: duplicate URLs');

const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) err('robots.txt: sitemap reference missing');
if (/Disallow:\s*\/\s*$/m.test(robots)) err('robots.txt: disallows everything');

// Output scan: upstream branding and third-party runtime hosts in our code
const BRAND_RE = /bentopdf\.com|bentopdf-cors-proxy|api\.github\.com\/repos\/alam00000/;
const HOST_RE = /https:\/\/(cdn\.jsdelivr\.net|unpkg\.com|rawcdn\.githack\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)/;
for (const f of files.filter((f) => /\/assets\/.*\.(js|css)$/.test(rel(f)))) {
  const t = fs.readFileSync(f, 'utf8');
  if (BRAND_RE.test(t)) err(`${rel(f)}: upstream branding/infrastructure reference`);
  const m = t.match(HOST_RE);
  if (m) warnings.push(`${rel(f)}: contains third-party URL ${m[0]} (verify it is not fetched at runtime)`);
}

// AGPL gate: bundled engine source must be documented before deploying.
const srcNotice = fs.readFileSync(path.join(ROOT, 'SOURCE-NOTICE.md'), 'utf8');
if (!/EDITCORE_SOURCE_URL:\s*https:\/\/github\.com\//.test(srcNotice)) {
  err('SOURCE-NOTICE.md: EditCore source URL missing or PENDING (AGPL release gate)');
}

// Size limits
for (const f of files) {
  if (fs.statSync(f).size > 25 * 1024 * 1024) err(`${rel(f)} exceeds 25 MiB`);
}
if (files.length > 20000) err(`${files.length} files exceeds Cloudflare Pages' 20,000-file limit`);

console.log(`check-dist: ${pages.length} pages, ${locs.length} sitemap URLs, ${files.length} files`);
for (const w of [...new Set(warnings)].slice(0, 40)) console.log('  warn:', w);
if (errors.length) {
  for (const e of errors.slice(0, 80)) console.error('  ERROR:', e);
  console.error(`check-dist: ${errors.length} error(s)`);
  process.exit(1);
}
console.log('check-dist: OK');
