// Homepage and /tools/ directory: favourites, instant search, category filter.
// The /tools/ directory renders every tool card at build time (crawlable
// HTML). The homepage renders only its popular cards and ships a compact JSON
// index (#qp-search-data); search results and favourites are built from it.
// This script only enhances server-rendered HTML.
import {
  getFavorites,
  toggleFavorite,
  onFavoritesChange,
} from './favorites.js';

const $ = <T extends Element>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const $$ = <T extends Element>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const directory = $<HTMLElement>('#qp-directory');
const favSection = $<HTMLElement>('#qp-fav-section');
const favGrid = $<HTMLElement>('#qp-fav-grid');
const search = $<HTMLInputElement>('#qp-search');
const results = $<HTMLElement>('#qp-results');
const resultsGrid = $<HTMLElement>('#qp-results-grid');
const resultsCount = $<HTMLElement>('#qp-results-count');
const noResults = $<HTMLElement>('#qp-no-results');
const homeGroups = $<HTMLElement>('#qp-home-groups');

interface IndexEntry {
  id: string;
  u: string; // url
  n: string; // name
  i: string; // icon class
  s: string; // short description
  k: string; // extra keywords
}

/** Card markup is defined once (tool-card.html); clones are patched from data. */
const prototype = $<HTMLElement>('.qp-card');

function cardFromEntry(e: IndexEntry): HTMLElement | null {
  if (!prototype) return null;
  const card = prototype.cloneNode(true) as HTMLElement;
  card.className = 'qp-card';
  card.dataset.tool = e.id;
  card.dataset.kw = [e.n, e.s, e.k].join(' ').toLowerCase();
  const icon = card.querySelector('.qp-card-icon i');
  if (icon) icon.className = `ph ${e.i}`;
  const link = card.querySelector<HTMLAnchorElement>('.qp-card-name');
  if (link) {
    link.href = e.u;
    link.textContent = e.n;
  }
  const desc = card.querySelector('.qp-card-desc');
  if (desc) desc.textContent = e.s;
  const star = card.querySelector<HTMLButtonElement>('[data-fav]');
  if (star) star.dataset.fav = e.id;
  return card;
}

/** One canonical card per tool: the directory's cards, or the JSON index. */
const sourceCards = new Map<string, HTMLElement>();
if (directory) {
  for (const card of $$<HTMLElement>('.qp-card', directory)) {
    const id = card.dataset.tool;
    if (id && !sourceCards.has(id)) sourceCards.set(id, card);
  }
} else {
  try {
    const raw = $<HTMLScriptElement>('#qp-search-data')?.textContent ?? '[]';
    for (const e of JSON.parse(raw) as IndexEntry[]) {
      const card = cardFromEntry(e);
      if (card && !sourceCards.has(e.id)) sourceCards.set(e.id, card);
    }
  } catch {
    /* No index: search stays empty; the tool directory is still linked. */
  }
}

function cloneCard(id: string): HTMLElement | null {
  const src = sourceCards.get(id);
  if (!src) return null;
  const card = src.cloneNode(true) as HTMLElement;
  card.classList.remove('is-fav', 'is-default-fav');
  return card;
}

function syncStars(): void {
  const favs = new Set(getFavorites());
  for (const btn of $$<HTMLButtonElement>('[data-fav]')) {
    const id = btn.dataset.fav!;
    const on = favs.has(id);
    btn.setAttribute('aria-pressed', String(on));
    const name = btn
      .closest('.qp-card')
      ?.querySelector('.qp-card-name')?.textContent?.trim();
    btn.setAttribute(
      'aria-label',
      `${on ? 'Remove' : 'Add'} ${name ?? 'tool'} ${on ? 'from' : 'to'} favourites`
    );
    btn.closest('.qp-card')?.classList.toggle('is-fav', on);
  }
}

function renderFavorites(): void {
  if (!favGrid) return;
  favGrid.replaceChildren();
  const ids = getFavorites().filter((id) => sourceCards.has(id));
  for (const id of ids) {
    const card = cloneCard(id);
    if (!card) continue;
    if (id === 'compress-pdf') {
      card.classList.add('is-default-fav');
      card.title = 'Compress PDF is a favourite by default. Select the star to remove it.';
    }
    favGrid.append(card);
  }
  // No empty favourites block: the section appears once a tool is saved.
  if (favSection) favSection.hidden = favGrid.childElementCount === 0;
  syncStars();
}

// Star buttons (event delegation covers cloned cards too).
document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>('[data-fav]');
  if (!btn) return;
  e.preventDefault();
  toggleFavorite(btn.dataset.fav!);
  btn.classList.remove('qp-pop');
  void btn.offsetWidth;
  btn.classList.add('qp-pop');
});
onFavoritesChange(() => renderFavorites());

// ── Search ──────────────────────────────────────────────────────────────
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .trim();

function score(card: HTMLElement, terms: string[]): number {
  const name = norm(card.querySelector('.qp-card-name')?.textContent ?? '');
  const kw = norm(card.dataset.kw ?? '');
  let total = 0;
  for (const t of terms) {
    if (name.startsWith(t)) total += 6;
    else if (name.split(' ').some((w) => w.startsWith(t))) total += 4;
    else if (kw.split(' ').some((w) => w.startsWith(t))) total += 2;
    else if (kw.includes(t)) total += 1;
    else return 0; // every term must match
  }
  return total;
}

function runSearch(): void {
  if (!search || !results || !resultsGrid) return;
  const q = norm(search.value);
  if (!q) {
    results.hidden = true;
    if (homeGroups) homeGroups.hidden = false;
    return;
  }
  const terms = q.split(/\s+/).filter(Boolean);
  const ranked = [...sourceCards.entries()]
    .map(([id, card]) => ({ id, s: score(card, terms) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);
  resultsGrid.replaceChildren(
    ...ranked.map((r) => cloneCard(r.id)).filter((c): c is HTMLElement => !!c)
  );
  syncStars();
  results.hidden = false;
  if (homeGroups) homeGroups.hidden = true;
  if (noResults) noResults.hidden = ranked.length > 0;
  if (resultsCount) {
    resultsCount.textContent =
      ranked.length === 1 ? '1 tool' : `${ranked.length} tools`;
  }
}

if (search) {
  search.addEventListener('input', runSearch);
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = resultsGrid?.querySelector<HTMLAnchorElement>('.qp-card-name');
      if (first) window.location.href = first.href;
    } else if (e.key === 'Escape') {
      search.value = '';
      runSearch();
    }
  });
  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (
      e.key === '/' &&
      !e.metaKey &&
      !e.ctrlKey &&
      !(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t.isContentEditable)
    ) {
      e.preventDefault();
      search.focus();
    }
  });
  // Support ?q= deep links (e.g. from the 404 page).
  const q = new URLSearchParams(location.search).get('q');
  if (q) {
    search.value = q.slice(0, 80);
    runSearch();
  }
}

// ── Category chips ──────────────────────────────────────────────────────
const chips = $$<HTMLButtonElement>('.qp-chip[data-cat]');
for (const chip of chips) {
  chip.addEventListener('click', () => {
    const cat = chip.dataset.cat!;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    for (const section of $$<HTMLElement>('.qp-cat', directory ?? document)) {
      section.hidden = cat !== 'all' && section.dataset.cat !== cat;
    }
  });
}

renderFavorites();
