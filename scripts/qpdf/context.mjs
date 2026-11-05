// Build-time page model for Qpdf.
//
// getPageContext(pagePath) returns the Handlebars context for any HTML entry:
// site constants, navigation, page metadata (title, description, canonical,
// breadcrumbs, JSON-LD), the tool registry grouped by category, guides, and
// — for tool pages and guide articles — the page-specific record.

import { SITE, PAGES, NAV } from '../../src/data/site.mjs';
import { CATEGORIES, TOOLS, LIBREOFFICE_TOOL_IDS, EXCLUDED_PAGE_IDS } from '../../src/data/tools.mjs';
import { loadGuides, GUIDE_CATEGORIES, ROOT } from './guides.mjs';
import fs from 'node:fs';
import path from 'node:path';

const env = process.env;

/** True when the LibreOffice asset host (R2) is configured for this build. */
/** Cloudflare Web Analytics site token (public identifier, not a secret). Optional. */
export const ANALYTICS_TOKEN = /^[a-f0-9]{32}$/i.test(env.CF_ANALYTICS_TOKEN || '')
  ? env.CF_ANALYTICS_TOKEN
  : '';

export const LIBREOFFICE_ENABLED = Boolean(env.VITE_LIBREOFFICE_ASSET_URL);

export const ENGINE_INFO = {
  core: { label: 'Built in', download: null },
  vips: { label: 'Built in', download: null },
  cpdf: { label: 'CoherentPDF engine', download: '9 MB' },
  pymupdf: { label: 'PyMuPDF engine', download: '54 MB' },
  gs: { label: 'Ghostscript engine', download: '15 MB' },
  tesseract: { label: 'Tesseract OCR engine', download: '15 MB' },
  libreoffice: { label: 'LibreOffice engine', download: '75 MB' },
  network: { label: 'Online service', download: null },
};

export function isToolEnabled(tool) {
  if (tool.disabled) return false;
  if (EXCLUDED_PAGE_IDS.includes(tool.id)) return false;
  if (tool.needs === 'libreoffice' && !LIBREOFFICE_ENABLED) return false;
  return true;
}

export const ENABLED_TOOLS = TOOLS.filter(isToolEnabled);
export const DISABLED_TOOL_IDS = [
  ...TOOLS.filter((t) => !isToolEnabled(t)).map((t) => t.id),
  ...EXCLUDED_PAGE_IDS,
].filter((v, i, a) => a.indexOf(v) === i);

const byId = new Map(TOOLS.map((t) => [t.id, t]));
export const toolUrl = (t) => `/${t.slug}/`;
export const abs = (p) => `${SITE.url}${p}`;

function card(t) {
  return {
    id: t.id,
    slug: t.slug,
    url: toolUrl(t),
    name: t.name,
    short: t.short,
    icon: t.icon,
    popular: !!t.popular,
    kw: [t.name, t.short, t.kw || ''].join(' ').toLowerCase(),
    engine: t.engine,
    heavy: !!ENGINE_INFO[t.engine]?.download,
  };
}

export const CATEGORY_GROUPS = CATEGORIES.map((c) => ({
  ...c,
  tools: ENABLED_TOOLS.filter((t) => t.cat === c.key).map(card),
})).filter((c) => c.tools.length > 0);

// "Popular" order follows the product priority list.
const POPULAR_ORDER = [
  'compress-pdf', 'merge-pdf', 'split-pdf', 'edit-pdf', 'sign-pdf', 'jpg-to-pdf',
  'pdf-to-jpg', 'organize-pdf', 'extract-pages', 'delete-pages', 'rotate-pdf',
  'page-numbers', 'add-watermark', 'protect-pdf', 'unlock-pdf', 'flatten-pdf',
  'remove-metadata', 'ocr-pdf', 'redact-pdf', 'word-to-pdf',
];
export const POPULAR = POPULAR_ORDER.map((id) => byId.get(id))
  .filter((t) => t && isToolEnabled(t))
  .map(card);

function privacyNote(t) {
  const info = ENGINE_INFO[t.engine];
  const base =
    'This tool runs entirely in your browser. Your file is read from your device, processed in memory, and saved back to your device — it is never uploaded to Qpdf or anyone else.';
  if (t.engine === 'libreoffice') {
    return `${base} The first time you use it, your browser downloads the LibreOffice conversion engine (software only, about ${info.download}) from Qpdf’s asset server.`;
  }
  if (info?.download) {
    return `${base} The first time you use it, your browser downloads the ${info.label} (software only, about ${info.download}) from qpdf.ca and keeps it for offline use.`;
  }
  return `${base} Once this page has loaded, the tool also works with your internet connection switched off.`;
}

function breadcrumbLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.url),
    })),
  };
}

// Main third-party components, with versions and licences read from the
// installed packages so the licences page never goes stale.
const COMPONENTS = [
  ['bentopdf-pdfium', 'PDFium-based editing engine from BentoPDF', 'https://github.com/alam00000/bentopdf'],
  ['bentopdf-viewer', 'PDF viewer and annotation editor (EmbedPDF-based)', 'https://github.com/alam00000/bentopdf'],
  ['hyper-compress-wasm', 'Hyper Compress PDF compression engine', 'https://github.com/alam00000/bentopdf-hyper-compress'],
  ['@bentopdf/pymupdf-wasm', 'PyMuPDF / MuPDF on Pyodide (conversions, extraction)', 'https://github.com/alam00000/bentopdf-pymupdf-wasm'],
  ['@bentopdf/gs-wasm', 'Ghostscript (PDF/A, font outlining)', 'https://www.ghostscript.com/'],
  ['coherentpdf', 'CoherentPDF (merge with bookmarks, attachments, page labels)', 'https://github.com/coherentgraphics/coherentpdf.js'],
  ['@neslinesli93/qpdf-wasm', 'qpdf library compiled to WebAssembly (encryption, repair)', 'https://github.com/qpdf/qpdf'],
  ['pdfjs-dist', 'PDF.js rendering', 'https://github.com/mozilla/pdf.js'],
  ['pdf-lib', 'PDF creation and modification', 'https://github.com/Hopding/pdf-lib'],
  ['tesseract.js', 'Tesseract OCR in the browser', 'https://github.com/naptha/tesseract.js'],
  ['tesseract.js-core', 'Tesseract OCR engine (WebAssembly)', 'https://github.com/naptha/tesseract.js-core'],
  ['@tesseract.js-data/eng', 'OCR language data (English; French from the same project)', 'https://github.com/naptha/tessdata'],
  ['wasm-vips', 'libvips image processing (TIFF export)', 'https://github.com/kleisauke/wasm-vips'],
  ['@matbee/libreoffice-converter', 'LibreOffice document conversion (when enabled)', 'https://github.com/matbeedotcom/libreoffice-document-converter'],
  ['zgapdfsigner', 'Digital signatures', 'https://github.com/zboris12/zgapdfsigner'],
  ['node-forge', 'Cryptography for digital signatures', 'https://github.com/digitalbazaar/forge'],
  ['jspdf', 'PDF generation', 'https://github.com/parallax/jsPDF'],
  ['jszip', 'ZIP archives', 'https://github.com/Stuk/jszip'],
  ['heic2any', 'HEIC image decoding', 'https://github.com/alexcorvi/heic2any'],
  ['markdown-it', 'Markdown rendering', 'https://github.com/markdown-it/markdown-it'],
  ['dompurify', 'HTML sanitisation', 'https://github.com/cure53/DOMPurify'],
  ['@phosphor-icons/web', 'Phosphor icons', 'https://phosphoricons.com/'],
  ['lucide', 'Lucide icons', 'https://lucide.dev/'],
  ['@fontsource/dm-sans', 'DM Sans typeface', 'https://fonts.google.com/specimen/DM+Sans'],
  ['@embedpdf/fonts-latin', 'Noto fonts used by the editor and OCR', 'https://notofonts.github.io/'],
  ['tailwindcss', 'Tailwind CSS', 'https://tailwindcss.com/'],
];

export function thirdParty() {
  return COMPONENTS.map(([pkg, role, url]) => {
    let version = '';
    let license = '';
    try {
      const pj = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules', pkg, 'package.json'), 'utf8'));
      version = pj.version;
      license = typeof pj.license === 'string' ? pj.license : pj.license?.type || '';
    } catch {
      /* not installed */
    }
    return { pkg, role, url, version, license };
  }).filter((c) => c.version);
}

let guidesCache;
function guides() {
  if (!guidesCache || env.NODE_ENV !== 'production') guidesCache = loadGuides();
  return guidesCache;
}

function guideCard(g) {
  return {
    slug: g.slug,
    url: g.path,
    title: g.title,
    description: g.description,
    category: g.category,
    categoryName: g.categoryName,
    published: g.published,
    reviewed: g.reviewed,
    readingMinutes: g.readingMinutes,
  };
}

function base() {
  const all = guides();
  return {
    site: SITE,
    nav: NAV,
    year: new Date().getFullYear(),
    baseUrl: '/',
    categories: CATEGORY_GROUPS,
    popular: POPULAR,
    toolCount: ENABLED_TOOLS.length,
    analyticsToken: ANALYTICS_TOKEN,
    analyticsEnabled: Boolean(ANALYTICS_TOKEN),
    libreofficeEnabled: LIBREOFFICE_ENABLED,
    guides: all.map(guideCard),
    hasGuides: all.length > 0,
    guideCategories: GUIDE_CATEGORIES.map((c) => ({
      ...c,
      guides: all.filter((g) => g.category === c.key).map(guideCard),
    })).filter((c) => c.guides.length > 0),
    thirdParty: thirdParty(),
    infoPages: ['privacy', 'privacy-policy', 'about', 'terms', 'licenses', 'tools', 'guides', 'site-index'].map(
      (k) => ({ key: k, url: PAGES[k].path, name: PAGES[k].crumb || PAGES[k].title })
    ),
  };
}

function pageMeta({ key, title, description, path, crumbs, noindex, ogType = 'website', jsonLd = [] }) {
  const canonical = abs(path === '/404' ? '/' : path);
  const ld = [...jsonLd];
  if (crumbs && crumbs.length > 1) ld.push(breadcrumbLd(crumbs));
  return {
    key,
    title,
    description,
    path,
    canonical,
    ogType,
    ogImage: abs('/images/og-qpdf.png'),
    noindex: !!noindex,
    breadcrumbs: crumbs && crumbs.length > 1 ? crumbs : null,
    jsonLd: ld.map((o) => JSON.stringify(o).replace(/</g, '\\u003c')),
  };
}

const HOME = { name: 'Home', url: '/' };

function toolContext(t) {
  const cat = CATEGORIES.find((c) => c.key === t.cat);
  const url = toolUrl(t);
  const related = (t.related || [])
    .map((id) => byId.get(id))
    .filter((r) => r && isToolEnabled(r))
    .map(card);
  const crumbs = [HOME, { name: 'Tools', url: '/tools/' }, { name: t.name, url }];
  const info = ENGINE_INFO[t.engine] || ENGINE_INFO.core;
  return {
    page: pageMeta({
      key: `tool:${t.id}`,
      title: t.title,
      description: t.desc,
      path: url,
      crumbs,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: `${t.name} — Qpdf`,
          url: abs(url),
          description: t.desc,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any (runs in a web browser)',
          browserRequirements: 'Requires JavaScript and WebAssembly',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
          publisher: { '@type': 'Organization', name: 'Qpdf', url: SITE.url },
        },
      ],
    }),
    tool: {
      ...t,
      url,
      categoryName: cat?.name,
      related,
      privacyNote: privacyNote(t),
      engineLabel: info.label,
      engineDownload: info.download,
      offlineCapable: t.engine !== 'network',
    },
  };
}

function staticContext(key) {
  const p = PAGES[key];
  const crumbs = key === 'index' || key === '404' ? null : [HOME, { name: p.crumb || p.title, url: p.path }];
  const jsonLd = [];
  if (key === 'index') {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Qpdf',
      url: `${SITE.url}/`,
      description: SITE.description,
      inLanguage: SITE.lang,
    });
  } else if (key !== '404') {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': key === 'about' ? 'AboutPage' : 'WebPage',
      name: p.title,
      url: abs(p.path),
      description: p.description,
      inLanguage: SITE.lang,
      isPartOf: { '@type': 'WebSite', name: 'Qpdf', url: `${SITE.url}/` },
    });
  }
  return {
    page: pageMeta({ key, title: p.title, description: p.description, path: p.path, crumbs, noindex: p.noindex, jsonLd }),
  };
}

function guideContext(g) {
  const crumbs = [HOME, { name: 'Guides', url: '/guides/' }, { name: g.title, url: g.path }];
  const relatedTools = g.relatedTools
    .map((id) => byId.get(id) || TOOLS.find((t) => t.slug === id))
    .filter((t) => t && isToolEnabled(t))
    .map(card);
  const all = guides();
  const relatedGuides = g.relatedGuides
    .map((s) => all.find((x) => x.slug === s))
    .filter(Boolean)
    .map(guideCard);
  return {
    page: pageMeta({
      key: `guide:${g.slug}`,
      title: g.metaTitle,
      description: g.description,
      path: g.path,
      crumbs,
      ogType: 'article',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: g.title,
          description: g.description,
          datePublished: g.published,
          dateModified: g.reviewed,
          inLanguage: g.lang,
          author: { '@type': 'Organization', name: g.author },
          publisher: { '@type': 'Organization', name: 'Qpdf', url: SITE.url },
          mainEntityOfPage: abs(g.path),
        },
      ],
    }),
    article: { ...g, relatedTools, relatedGuides },
  };
}

/**
 * @param {string} pagePath Vite-normalized path of the HTML entry, e.g.
 *   "/index.html", "/src/pages/merge-pdf.html", "/guides/foo.html".
 */
export function getPageContext(pagePath) {
  const ctx = base();
  const p = pagePath.replace(/^\/+/, '/');
  let m;
  if ((m = p.match(/\/src\/pages\/([a-z0-9-]+)\.html$/))) {
    const t = byId.get(m[1]);
    if (t) return { ...ctx, ...toolContext(t) };
    // Unregistered upstream page (not published).
    return { ...ctx, page: pageMeta({ key: m[1], title: 'Qpdf', description: '', path: `/${m[1]}/`, noindex: true }) };
  }
  if ((m = p.match(/\/guides\/([a-z0-9-]+)\.html$/))) {
    if (m[1] === 'index') return { ...ctx, ...staticContext('guides') };
    const g = guides().find((x) => x.slug === m[1]);
    if (g) return { ...ctx, ...guideContext(g) };
  }
  if ((m = p.match(/^\/([a-z0-9-]+)\.html$/)) && PAGES[m[1]]) {
    return { ...ctx, ...staticContext(m[1]) };
  }
  return { ...ctx, ...staticContext('index') };
}

export { SITE, PAGES, TOOLS, CATEGORIES, LIBREOFFICE_TOOL_IDS };
