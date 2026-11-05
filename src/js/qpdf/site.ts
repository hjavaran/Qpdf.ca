// Site-wide behaviour for every QPDF page: navigation state, mobile menu and
// offline service worker registration.
import { registerServiceWorker } from './sw.js';

const path = location.pathname.replace(/index\.html$/, '');
for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-nav]')) {
  const href = a.getAttribute('href') || '';
  if (href !== '/' && path.startsWith(href)) a.setAttribute('aria-current', 'page');
}

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
