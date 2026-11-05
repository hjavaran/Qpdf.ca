// Registers the offline service worker (public/sw.js). It caches Qpdf's own
// application files only; documents are never fetched, cached or uploaded.
let registration: Promise<ServiceWorkerRegistration | null> | null = null;

export function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (registration) return registration;
  if (!('serviceWorker' in navigator) || import.meta.env.DEV || !window.isSecureContext) {
    registration = Promise.resolve(null);
    return registration;
  }
  registration = navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .catch((err: unknown): null => {
      console.warn('[Qpdf] Service worker registration failed:', err);
      return null;
    });
  return registration;
}

/** Resolves once a service worker controls this page (or never, if unsupported). */
export function whenControlled(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return Promise.resolve(false);
  if (navigator.serviceWorker.controller) return Promise.resolve(true);
  return new Promise((resolve) => {
    navigator.serviceWorker.addEventListener('controllerchange', () => resolve(true), {
      once: true,
    });
  });
}
