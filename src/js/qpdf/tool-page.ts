// Tool pages: favourite toggle and the "Ready to work offline" indicator.
//
// "Ready to work offline" is shown only after every file this tool needs
// (its scripts, workers, WebAssembly engines and fonts, as listed in
// /offline-manifest.json by the build) is stored in the browser cache AND a
// service worker controls the page, so the tool can genuinely run with the
// network disconnected. Heavy engines are downloaded only on request.
import { isFavorite, toggleFavorite, onFavoritesChange } from './favorites.js';
import { registerServiceWorker, whenControlled } from './sw.js';
import { initFileIcons } from './file-icons.js';

interface OfflineEntry {
  id: string;
  engine: string;
  urls: string[];
  bytes: number;
}
interface OfflineManifest {
  build: string;
  engineCache: string;
  assetCache: string;
  staticCache: string;
  autoLimit: number;
  pages: Record<string, OfflineEntry>;
}

const slug = location.pathname.replace(/^\/|\/(index\.html)?$/g, '');
const card = document.querySelector<HTMLElement>('#tool-uploader, #tool-interface .bg-gray-800, main .bg-gray-800') ?? null;
const heading = card?.querySelector('h1') ?? document.querySelector('h1');

function fmtMB(bytes: number): string {
  const mb = bytes / 1048576;
  return mb >= 10 ? `${Math.round(mb)} MB` : `${mb.toFixed(1)} MB`;
}

// ── Toolbar (favourite + offline status) ────────────────────────────────
const bar = document.createElement('div');
bar.className = 'qp-toolbar';
const status = document.createElement('span');
status.className = 'qp-offline';
status.setAttribute('role', 'status');
status.setAttribute('aria-live', 'polite');
status.dataset.state = 'idle';
status.textContent = 'Checking offline…';

const toolId = document.querySelector<HTMLElement>('[data-qp-tool]')?.dataset.qpTool;
const fav = document.createElement('button');
fav.type = 'button';
fav.className = 'qp-tool-fav';
fav.innerHTML =
  '<svg class="qp-star" viewBox="0 0 256 256" width="15" height="15" aria-hidden="true"><path class="qp-star-off" fill="currentColor" d="M128,24l29.4,62.4L224,94.5l-48.6,46.7L187.3,208,128,175.2,68.7,208l11.9-66.8L32,94.5l66.6-8.1Z" opacity=".25"/><path class="qp-star-on" fill="currentColor" d="M128,24l29.4,62.4L224,94.5l-48.6,46.7L187.3,208,128,175.2,68.7,208l11.9-66.8L32,94.5l66.6-8.1Z"/></svg><span></span>';
const favLabel = fav.querySelector('span')!;
function syncFav(): void {
  if (!toolId) return;
  const on = isFavorite(toolId);
  fav.setAttribute('aria-pressed', String(on));
  favLabel.textContent = on ? 'Favourite' : 'Add to favourites';
}
if (toolId) {
  fav.addEventListener('click', () => {
    toggleFavorite(toolId);
    syncFav();
  });
  onFavoritesChange(syncFav);
  syncFav();
  bar.append(status, fav);
} else {
  bar.append(status);
}

if (heading?.parentElement) {
  const back = heading.parentElement.querySelector('#back-to-tools');
  if (back) back.after(bar);
  else heading.before(bar);
}

// ── Offline readiness ───────────────────────────────────────────────────
function setStatus(state: 'idle' | 'loading' | 'ready' | 'error', text: string, action?: HTMLElement) {
  status.dataset.state = state;
  status.replaceChildren(document.createTextNode(text));
  if (action) {
    status.append(' ');
    status.append(action);
  }
}

// Must match cacheFor() in public/sw.js.
function cacheNameFor(url: string, m: OfflineManifest): string {
  if (url.startsWith('/assets/')) return m.assetCache;
  if (url.startsWith('/wasm/') || url.startsWith('/vendor/')) return m.engineCache;
  if (url.endsWith('/')) return 'qpdf-pages-v1';
  return m.staticCache;
}

async function missingUrls(entry: OfflineEntry, m: OfflineManifest): Promise<string[]> {
  const out: string[] = [];
  for (const url of entry.urls) {
    const cache = await caches.open(cacheNameFor(url, m));
    if (!(await cache.match(url, { ignoreVary: true }))) out.push(url);
  }
  return out;
}

async function warm(entry: OfflineEntry, m: OfflineManifest, missing: string[]): Promise<void> {
  let done = 0;
  const total = missing.length;
  const queue = [...missing];
  const worker = async () => {
    while (queue.length) {
      const url = queue.shift()!;
      const res = await fetch(url, { credentials: 'same-origin', cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      await (await caches.open(cacheNameFor(url, m))).put(url, res);
      done++;
      setStatus('loading', `Preparing offline use… ${Math.round((done / total) * 100)}%`);
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, total) }, worker));
}

async function initOffline(): Promise<void> {
  if (!('caches' in window) || !('serviceWorker' in navigator) || !window.isSecureContext) {
    setStatus('idle', 'Offline mode not supported in this browser');
    return;
  }
  const reg = await registerServiceWorker();
  if (!reg) {
    setStatus('idle', 'Offline mode unavailable');
    return;
  }
  let manifest: OfflineManifest;
  try {
    const res = await fetch('/offline-manifest.json', { cache: 'no-cache' });
    manifest = await res.json();
  } catch {
    setStatus('idle', 'Offline status unavailable');
    return;
  }
  const entry = manifest.pages[slug];
  if (!entry) {
    // Only the LibreOffice converters have no offline entry: their engine is
    // fetched from assets.qpdf.ca the first time and then kept by the browser.
    setStatus('idle', 'First use automatically downloads the converter in your browser. Your file never leaves your device.');
    return;
  }
  const controlled = await Promise.race([
    whenControlled(),
    new Promise<boolean>((r) => setTimeout(() => r(false), 8000)),
  ]);
  const missing = await missingUrls(entry, manifest);
  const ready = () => {
    if (navigator.serviceWorker.controller) {
      setStatus('ready', 'Ready to work offline');
    } else {
      setStatus('idle', 'Reload the page once to enable offline use');
    }
  };
  if (missing.length === 0) {
    ready();
    return;
  }
  const missingBytes = Math.round((entry.bytes * missing.length) / Math.max(1, entry.urls.length));
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const constrained = !!conn?.saveData || /(^|-)2g|3g/.test(conn?.effectiveType ?? '');
  const start = async () => {
    setStatus('loading', 'Preparing offline use…');
    try {
      await warm(entry, manifest, missing);
      ready();
    } catch (err) {
      console.warn('[Qpdf] Offline preparation failed:', err);
      setStatus('error', 'Could not prepare offline use. Check your connection.');
    }
  };
  if (entry.bytes <= manifest.autoLimit && !constrained && controlled) {
    await start();
  } else {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = `Download for offline use (${fmtMB(missingBytes)})`;
    btn.addEventListener('click', start, { once: true });
    setStatus('idle', 'Works offline after a one-time download.', btn);
  }
}

const idle = (cb: () => void) =>
  'requestIdleCallback' in window
    ? (window as Window & { requestIdleCallback: (cb: () => void, o?: object) => void }).requestIdleCallback(cb, { timeout: 3000 })
    : setTimeout(cb, 1200);

if (document.readyState === 'complete') idle(() => void initOffline());
else window.addEventListener('load', () => idle(() => void initOffline()), { once: true });

initFileIcons();
