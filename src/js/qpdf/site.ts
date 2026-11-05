// Site-wide behaviour for every Qpdf page: navigation state, mobile menu and
// offline service worker registration.
import { registerServiceWorker } from './sw.js';

const path = location.pathname.replace(/index\.html$/, '');
for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-nav]')) {
  const href = a.getAttribute('href') || '';
  if (href !== '/' && path.startsWith(href)) a.setAttribute('aria-current', 'page');
}

// ── Theme (light default; saved in localStorage; applied early by /theme-init.js) ──
const root = document.documentElement;
const themeBtn = document.getElementById('qp-theme-toggle');
const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
const isDark = () => root.getAttribute('data-theme') === 'dark';
function syncThemeUi(): void {
  themeBtn?.setAttribute('aria-pressed', String(isDark()));
  if (themeColor) themeColor.content = isDark() ? '#151517' : '#f8f7f4';
}
function setTheme(dark: boolean, persist: boolean): void {
  root.classList.add('qp-theme-anim');
  window.setTimeout(() => root.classList.remove('qp-theme-anim'), 260);
  if (dark) root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
  if (persist) {
    try {
      localStorage.setItem('qpdf.theme', dark ? 'dark' : 'light');
    } catch {
      /* storage blocked: theme applies for this page view only */
    }
  }
  syncThemeUi();
  window.dispatchEvent(new CustomEvent('qpdf:themechange', { detail: { dark } }));
}
syncThemeUi();
themeBtn?.addEventListener('click', () => setTheme(!isDark(), true));
window.addEventListener('storage', (e) => {
  if (e.key === 'qpdf.theme') setTheme(e.newValue === 'dark', false);
});

const btn = document.querySelector<HTMLButtonElement>('.qp-menu-btn');
const menu = document.getElementById('qp-mobile-nav');
if (btn && menu) {
  btn.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
}

if (document.readyState === 'complete') registerServiceWorker();
else window.addEventListener('load', () => registerServiceWorker(), { once: true });

// Cloudflare Web Analytics (optional; enabled at build time with CF_ANALYTICS_TOKEN).
// Cookieless page-view statistics only. It is not loaded for visitors who send
// Do Not Track or Global Privacy Control, nor in dev. It never sees documents:
// files are read by the File API and never pass through the page's network code.
function loadAnalytics(): void {
  const token = document.querySelector<HTMLMetaElement>('meta[name="qpdf-wa"]')?.content;
  if (!token || !/^[a-f0-9]{32}$/i.test(token) || import.meta.env.DEV) return;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  if (nav.globalPrivacyControl || nav.doNotTrack === '1' || nav.msDoNotTrack === '1') return;
  const s = document.createElement('script');
  s.defer = true;
  s.crossOrigin = 'anonymous';
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token, spa: false }));
  document.head.append(s);
}
if (document.readyState === 'complete') loadAnalytics();
else window.addEventListener('load', loadAnalytics, { once: true });

// Safety net for links created at runtime (tools, messages): external links open in a
// new tab with noopener noreferrer (+ nofollow, except wealththeory.ca). Static pages are
// rewritten at build time (scripts/qpdf/postbuild.mjs).
document.addEventListener(
  'click',
  (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || !/^https?:$/.test(a.protocol)) return;
    const h = a.hostname.toLowerCase();
    if (h === location.hostname || h === 'qpdf.ca' || h.endsWith('.qpdf.ca')) return;
    a.target = '_blank';
    a.rel = h === 'wealththeory.ca' || h.endsWith('.wealththeory.ca') ? 'noopener noreferrer' : 'noopener noreferrer nofollow';
  },
  true
);
