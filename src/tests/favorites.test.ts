import { describe, it, expect, beforeEach, vi } from 'vitest';

const KEY = 'qpdf.favorites.v1';

// favorites.ts caches its list at module level, so load a fresh copy per test.
async function load() {
  vi.resetModules();
  return import('../js/qpdf/favorites');
}

describe('favourites (browser-local)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts empty for a new visitor and never seeds storage', async () => {
    const fav = await load();
    expect(fav.getFavorites()).toEqual([]);
    expect(fav.isFavorite('compress-pdf')).toBe(false);
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  it('saves only what the visitor explicitly adds, and persists it', async () => {
    const fav = await load();
    fav.setFavorite('merge-pdf', true);
    expect(fav.getFavorites()).toEqual(['merge-pdf']);
    expect(JSON.parse(window.localStorage.getItem(KEY)!)).toEqual(['merge-pdf']);

    const reloaded = await load();
    expect(reloaded.getFavorites()).toEqual(['merge-pdf']);
  });

  it('keeps lists that are already stored, unchanged', async () => {
    window.localStorage.setItem(KEY, JSON.stringify(['compress-pdf', 'split-pdf']));
    const fav = await load();
    expect(fav.getFavorites()).toEqual(['compress-pdf', 'split-pdf']);
    expect(JSON.parse(window.localStorage.getItem(KEY)!)).toEqual([
      'compress-pdf',
      'split-pdf',
    ]);
  });

  it('toggles favourites and notifies listeners', async () => {
    const fav = await load();
    const seen: string[][] = [];
    fav.onFavoritesChange((ids) => seen.push([...ids]));
    expect(fav.toggleFavorite('sign-pdf')).toBe(true);
    expect(fav.toggleFavorite('sign-pdf')).toBe(false);
    expect(seen).toEqual([['sign-pdf'], []]);
    expect(fav.getFavorites()).toEqual([]);
  });

  it('stays empty after the last favourite is removed (no re-seeding)', async () => {
    const fav = await load();
    fav.setFavorite('compress-pdf', true);
    fav.setFavorite('compress-pdf', false);
    const reloaded = await load();
    expect(reloaded.getFavorites()).toEqual([]);
    expect(JSON.parse(window.localStorage.getItem(KEY)!)).toEqual([]);
  });

  it('ignores corrupt or invalid stored values', async () => {
    window.localStorage.setItem(KEY, '{not json');
    expect((await load()).getFavorites()).toEqual([]);
    window.localStorage.setItem(KEY, JSON.stringify(['ok-id', 42, '../x', 'A B']));
    expect((await load()).getFavorites()).toEqual(['ok-id']);
  });
});
