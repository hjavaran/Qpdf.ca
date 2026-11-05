/*
 * QPDF service worker — offline support for the application itself.
 *
 * It only ever caches QPDF's own software (HTML pages, scripts, styles,
 * WebAssembly engines and fonts) that the browser downloads from qpdf.ca.
 * It never sees, stores or transmits your documents: files you select are
 * read with the File API and never pass through fetch().
 *
 * Caches
 *   qpdf-pages-v1          HTML pages, network-first (fallback when offline)
 *   qpdf-assets-v1         content-hashed /assets/* files, cache-first;
 *                          pruned on activate against /build-assets.json
 *   qpdf-engines-<hash>    /wasm/* and /vendor/* engines, cache-first; the
 *                          hash changes when an engine version changes
 *   qpdf-static-<build>    other unversioned files (workers, PDF.js viewer,
 *                          qpdf.wasm…), cache-first, replaced every deploy
 *
 * __QPDF_*__ placeholders are filled in by scripts/qpdf/postbuild.mjs.
 */

const BUILD_ID = '__QPDF_BUILD_ID__';
const ENGINE_HASH = '__QPDF_ENGINE_HASH__';
const EXTRA_ORIGINS = '__QPDF_EXTRA_ORIGINS__'.split(',').filter((o) => /^https?:\/\//.test(o));

const PAGES = 'qpdf-pages-v1';
const ASSETS = 'qpdf-assets-v1';
const ENGINES = `qpdf-engines-${ENGINE_HASH}`;
const STATIC = `qpdf-static-${BUILD_ID}`;

const STATIC_PREFIXES = ['/images/', '/pdfjs-viewer/', '/pdfjs-annotation-viewer/', '/libreoffice-wasm/', '/workers/', '/locales/'];
const ENGINE_PREFIXES = ['/wasm/', '/vendor/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((c) => c.addAll(['/', '/privacy/']).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(
            (n) =>
              (n.startsWith('qpdf-engines-') && n !== ENGINES) ||
              (n.startsWith('qpdf-static-') && n !== STATIC) ||
              n.startsWith('bentopdf-')
          )
          .map((n) => caches.delete(n))
      );
      // Prune hashed assets that are no longer part of the deployed build.
      try {
        const res = await fetch('/build-assets.json', { cache: 'no-store' });
        if (res.ok) {
          const keep = new Set((await res.json()).assets);
          const cache = await caches.open(ASSETS);
          for (const req of await cache.keys()) {
            const path = new URL(req.url).pathname;
            if (path.startsWith('/assets/') && !keep.has(path)) await cache.delete(req);
          }
        }
      } catch {
        /* offline during activation: prune next time */
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'qpdf:version') {
    event.source?.postMessage({ type: 'qpdf:version', build: BUILD_ID, engines: ENGINES, static: STATIC });
  }
});

function cacheFor(url) {
  if (url.origin !== self.location.origin) return ENGINES;
  if (url.pathname.startsWith('/assets/')) return ASSETS;
  if (ENGINE_PREFIXES.some((p) => url.pathname.startsWith(p))) return ENGINES;
  if (STATIC_PREFIXES.some((p) => url.pathname.startsWith(p))) return STATIC;
  if (/\.(woff2?|ttf|otf|wasm|icc|ico|png|svg)$/.test(url.pathname)) return STATIC;
  return null;
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request, { ignoreVary: true, ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
    cache.put(request, res.clone()).catch(() => undefined);
  }
  return res;
}

async function networkFirst(request) {
  const cache = await caches.open(PAGES);
  try {
    const res = await fetch(request);
    if (res.ok && res.type === 'basic') cache.put(request, res.clone()).catch(() => undefined);
    return res;
  } catch (err) {
    const hit =
      (await cache.match(request, { ignoreSearch: true })) ||
      (request.mode === 'navigate' ? await cache.match('/') : undefined);
    if (hit) return hit;
    throw err;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // never touch uploads or form posts
  if (request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !EXTRA_ORIGINS.includes(url.origin)) return;

  if (sameOrigin && (request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html'))) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (sameOrigin && (url.pathname === '/offline-manifest.json' || url.pathname === '/site.webmanifest')) {
    event.respondWith(networkFirst(request));
    return;
  }
  const cacheName = cacheFor(url);
  if (cacheName) event.respondWith(cacheFirst(request, cacheName));
});
