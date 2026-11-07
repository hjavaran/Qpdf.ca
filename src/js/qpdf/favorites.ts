// Favourite tools, stored only in this browser (localStorage).
//
// Rules (product requirement):
//  - Nothing is saved automatically: a visitor with no stored list has no
//    favourites, and the homepage shows no Favourites section until they
//    explicitly save a tool.
//  - Lists already stored in a browser are kept exactly as they are.
//  - Nothing about favourites is ever sent to a server.
//  - If storage is unavailable (private mode, blocked), favourites still
//    work for the current page view and are simply not remembered.

export const FAVORITES_KEY = 'qpdf.favorites.v1';

type Listener = (ids: string[]) => void;

function readStorage(): string[] | null {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (v): v is string => typeof v === 'string' && /^[a-z0-9-]{1,64}$/.test(v)
      );
    }
  } catch {
    /* unavailable or corrupt */
  }
  return null;
}

function writeStorage(ids: string[]): boolean {
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    return true;
  } catch {
    return false;
  }
}

let current: string[] | null = null;
const listeners = new Set<Listener>();

export function getFavorites(): string[] {
  if (current) return current;
  // No stored list means no favourites. Reading never writes to storage.
  current = readStorage() ?? [];
  return current;
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function setFavorite(id: string, on: boolean): string[] {
  const list = getFavorites().filter((x) => x !== id);
  if (on) list.push(id);
  current = list;
  writeStorage(list);
  listeners.forEach((fn) => fn(list));
  return list;
}

export function toggleFavorite(id: string): boolean {
  const on = !isFavorite(id);
  setFavorite(id, on);
  return on;
}

export function onFavoritesChange(fn: Listener): void {
  listeners.add(fn);
}

// Keep several open tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== FAVORITES_KEY) return;
    current = null;
    const ids = getFavorites();
    listeners.forEach((fn) => fn(ids));
  });
}
