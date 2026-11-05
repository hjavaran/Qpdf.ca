// Compress PDF interface: segmented level control, inline busy state, and the
// animated results view. Presentation only — compression itself stays in
// logic/compress-pdf-page.ts and runs entirely in the browser.
import { downloadFile } from '../utils/helpers.js';

const $ = (id: string) => document.getElementById(id);

const LEVELS: Record<string, { name: string; tag: string; desc: string }> = {
  low: { name: 'Low', tag: 'Best Quality', desc: 'Light compression that keeps images sharp.' },
  medium: { name: 'Medium', tag: 'Recommended', desc: 'A good balance of size and quality for most files.' },
  high: { name: 'High', tag: 'Smallest Files', desc: 'Maximum size reduction. Images may look softer.' },
  lossless: { name: 'Lossless', tag: 'No Quality Loss', desc: 'Removes wasted space without touching image quality.' },
  custom: { name: 'Custom', tag: '', desc: 'Choose every compression setting yourself.' },
};

/** Visible label, e.g. "Medium (Recommended)". */
export function levelLabel(v: string): string {
  const l = LEVELS[v];
  if (!l) return v;
  return l.tag ? `${l.name} (${l.tag})` : l.name;
}

// ── Compression-level cards (radio group that drives the hidden <select>) ────
export function initLevelControl(): void {
  const select = $('compression-level') as HTMLSelectElement | null;
  const group = $('qp-level-group');
  if (!select || !group) return;

  const values = [...select.options].map((o) => o.value);
  const buttons = values.map((v) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'qp-seg-btn qp-lvl';
    b.setAttribute('role', 'radio');
    b.dataset.value = v;
    const l = LEVELS[v];
    const dot = el('span', 'qp-lvl-dot');
    dot.setAttribute('aria-hidden', 'true');
    const body = el('span', 'qp-lvl-body');
    const title = el('span', 'qp-lvl-title', l?.name ?? v);
    if (l?.tag) title.append(' ', el('span', 'qp-lvl-tag', `(${l.tag})`));
    body.append(title);
    if (l?.desc) body.append(el('span', 'qp-lvl-desc', l.desc));
    b.append(dot, body);
    b.addEventListener('click', () => choose(v));
    group.append(b);
    return b;
  });

  function paint(): void {
    const cur = select!.value;
    buttons.forEach((b) => {
      const on = b.dataset.value === cur;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
  }
  function choose(v: string): void {
    if (select!.value === v) return;
    select!.value = v;
    select!.dispatchEvent(new Event('change', { bubbles: true }));
    paint();
  }

  group.addEventListener('keydown', (e) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const i = values.indexOf(select.value);
    const n = values.length;
    const next =
      e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : n - 1)) % n;
    choose(values[next]);
    buttons[next].focus();
  });

  // The page logic changes the level programmatically (e.g. to "custom").
  select.addEventListener('qp-sync', paint);
  select.addEventListener('change', paint);
  select.hidden = true;
  group.hidden = false;
  paint();
}

// ── Settings panel is visible but inert until a file is chosen ───────────────
export function initSideState(): void {
  const options = $('compress-options');
  if (!options) return;
  const sync = () => {
    const idle = options.classList.contains('hidden');
    options.toggleAttribute('inert', idle);
    options.dataset.idle = String(idle);
  };
  new MutationObserver(sync).observe(options, { attributes: true, attributeFilter: ['class'] });
  sync();
}

// ── Inline busy state (replaces the full-screen loader) ──────────────────────
export function setCompressBusy(on: boolean, text = ''): void {
  const btn = $('process-btn') as HTMLButtonElement | null;
  const label = $('process-btn-label');
  const status = $('qp-cmp-status');
  if (btn) {
    btn.disabled = on;
    btn.setAttribute('aria-busy', String(on));
  }
  if (label) label.textContent = on ? 'Compressing…' : 'Compress PDF';
  if (status) status.textContent = on ? text || 'Working on your device…' : '';
}

// ── Results ──────────────────────────────────────────────────────────────────
export interface CompressResultView {
  title: string;
  /** Extra notes (target missed, signatures removed, …). May be empty. */
  notes: string;
  originalSize: number;
  compressedSize: number;
  blob: Blob;
  filename: string;
  /** Number of PDFs when a batch (ZIP) was produced. */
  count?: number;
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(2)} MB`;
  return `${(bytes / 1073741824).toFixed(2)} GB`;
}
/** Sensible rounding for a percentage: 26%, 4.3%, never "0%" for real savings. */
export function formatPercent(p: number): string {
  const a = Math.abs(p);
  if (a >= 10) return `${Math.round(a)}%`;
  if (a >= 0.1) return `${(Math.round(a * 10) / 10).toString()}%`;
  return a === 0 ? '0%' : '<0.1%';
}

/** Below this saving (in %) the PDF counts as already optimized: nothing is downloaded. */
export const MIN_SAVING_PCT = 1;

const RING_R = 42;
const RING_C = 2 * Math.PI * RING_R;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

let downloadedFor: Blob | null = null;

/** Triggers the download once per result (guards against re-renders and double clicks). */
function autoDownload(view: CompressResultView): void {
  if (downloadedFor === view.blob) return;
  downloadedFor = view.blob;
  try {
    downloadFile(view.blob, view.filename);
  } catch (err) {
    console.warn('[Qpdf.ca] Automatic download was blocked:', err);
  }
}

export function showCompressResult(view: CompressResultView, onReset: () => void): void {
  const box = $('qp-compress-result');
  if (!box) return;
  const saved = view.originalSize - view.compressedSize;
  const pct = view.originalSize > 0 ? (saved / view.originalSize) * 100 : 0;
  // Savings under 1% are not worth a second copy of the file.
  const smaller = saved > 0 && pct >= MIN_SAVING_PCT;
  const larger = saved < 0;
  const tiny = saved > 0 && !smaller;
  const many = (view.count ?? 1) > 1;

  const headline = smaller
    ? many
      ? `Your ${view.count} PDFs are now ${formatPercent(pct)} smaller!`
      : `Your PDF is now ${formatPercent(pct)} smaller!`
    : 'No compression needed';

  box.replaceChildren();
  box.className = 'qp-res';
  box.setAttribute('role', 'status');

  const top = el('div', 'qp-res-top');
  // Ring: shows the amount saved (not processing progress).
  const ring = el('div', 'qp-ring');
  ring.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle class="qp-ring-track" cx="50" cy="50" r="${RING_R}"/><circle class="qp-ring-bar" cx="50" cy="50" r="${RING_R}" stroke-dasharray="${RING_C.toFixed(2)}" stroke-dashoffset="${RING_C.toFixed(2)}" transform="rotate(-90 50 50)"/></svg>`;
  const centre = el('div', 'qp-ring-centre');
  const num = el('span', 'qp-ring-num', '0%');
  centre.append(num, el('span', 'qp-ring-cap', 'SAVED'));
  ring.append(centre);
  const sr = el('span', 'sr-only', smaller ? `Saved ${formatPercent(pct)}` : 'No size reduction');
  ring.append(sr);

  const text = el('div', 'qp-res-text');
  const h = el('h2', 'qp-res-title', headline);
  const sizes = el('p', 'qp-res-sizes');
  if (smaller) {
    sizes.append(
      el('span', 'qp-res-old', formatSize(view.originalSize)),
      el('span', 'qp-res-arrow', '→'),
      el('span', 'qp-res-new', formatSize(view.compressedSize))
    );
    sizes.setAttribute('aria-label', `From ${formatSize(view.originalSize)} to ${formatSize(view.compressedSize)}`);
  } else {
    sizes.append(el('span', 'qp-res-old', `${formatSize(view.originalSize)} · already optimized`));
  }
  text.append(h, sizes);
  if (smaller) top.append(ring, text);
  else {
    const badge = el('div', 'qp-res-badge');
    badge.setAttribute('aria-hidden', 'true');
    badge.append(el('i', 'ph ph-seal-check'));
    top.append(badge, text);
  }
  box.append(top);

  if (!smaller) {
    box.append(
      el(
        'p',
        'qp-res-note',
        `${many ? 'These PDFs are' : 'This PDF is'} already optimized${larger ? ' — compressing would make it larger' : tiny ? ` — it could only shrink by ${formatPercent(pct)}` : ''}, so no new copy was downloaded. To try for a smaller file, choose High (Smallest Files), remove pages you do not need, or convert colour scans to greyscale.`
      )
    );
  }
  if (view.notes) box.append(el('p', 'qp-res-note', view.notes));

  const grid = box.closest('.qp-cmp-grid');
  const opts = $('compress-options');
  const close = () => {
    box.classList.add('hidden');
    box.replaceChildren();
    delete box.dataset.show;
    downloadedFor = null;
    opts?.removeAttribute('data-result');
    grid?.removeAttribute('data-result');
  };

  const actions = el('div', 'qp-res-actions');
  if (smaller) {
    const dl = el('button', 'qp-btn qp-btn-primary qp-res-dl') as HTMLButtonElement;
    dl.type = 'button';
    dl.id = 'qp-compress-download';
    dl.append(el('i', 'ph ph-download-simple'), document.createTextNode(many ? ' Download again (ZIP)' : ' Download again'));
    dl.addEventListener('click', () => downloadFile(view.blob, view.filename));
    actions.append(dl);
  } else {
    // Keep the same file(s) and go back to the settings to try another level.
    const retry = el('button', 'qp-btn qp-btn-primary', 'Try another level') as HTMLButtonElement;
    retry.type = 'button';
    retry.id = 'qp-compress-retry';
    retry.addEventListener('click', () => {
      close();
      opts?.classList.remove('hidden');
      opts?.querySelector<HTMLElement>('.qp-lvl[aria-checked="true"]')?.focus();
    });
    actions.append(retry);
  }
  const again = el('button', 'qp-btn', many ? 'Compress more files' : 'Compress another file') as HTMLButtonElement;
  again.type = 'button';
  again.id = 'qp-compress-again';
  again.addEventListener('click', () => {
    close();
    onReset();
    ($('drop-zone') ?? $('file-input'))?.scrollIntoView?.({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
  });
  actions.append(again);
  box.append(actions);
  const privacy = el('p', 'qp-res-fine');
  privacy.textContent = smaller
    ? `${many ? 'Your files were' : 'Your file was'} compressed on this device and saved as ${view.filename}. Nothing was uploaded.`
    : `${many ? 'Your files were' : 'Your file was'} checked on this device. Nothing was uploaded.`;
  box.append(privacy);

  opts?.setAttribute('data-result', '1');
  opts?.classList.add('hidden');
  grid?.setAttribute('data-result', smaller ? 'saved' : 'none');
  box.classList.toggle('qp-res-none', !smaller);
  box.classList.remove('hidden');
  box.dataset.show = '1';

  // Animate the ring and the number from 0 to the final value.
  if (smaller) {
    const bar = box.querySelector<SVGCircleElement>('.qp-ring-bar')!;
    const finalOffset = RING_C * (1 - Math.min(100, Math.max(0, pct)) / 100);
    if (reduced()) {
      bar.style.strokeDashoffset = String(finalOffset);
      num.textContent = formatPercent(pct);
    } else {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          bar.style.strokeDashoffset = String(finalOffset);
        })
      );
      const t0 = performance.now();
      const dur = 1000;
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        num.textContent = k < 1 ? `${Math.round(pct * eased)}%` : formatPercent(pct);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  // Only save a file when it is actually smaller than the original.
  if (smaller) autoDownload(view);
  (h as HTMLElement).tabIndex = -1;
  h.focus({ preventScroll: true });
  box.scrollIntoView?.({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' });
}

export function compressedName(original: string): string {
  const base = original.replace(/\.pdf$/i, '');
  return `${base}-compressed.pdf`;
}

export function initCompressUi(): void {
  initLevelControl();
  initSideState();
}
