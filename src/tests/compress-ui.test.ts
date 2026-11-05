import { describe, it, expect, vi, beforeEach } from 'vitest';

const downloadFile = vi.fn();
vi.mock('../js/utils/helpers.js', () => ({ downloadFile }));

async function load() {
  vi.resetModules();
  return import('../js/qpdf/compress-ui');
}
const view = (o: number, c: number, extra = {}) => ({
  title: 't', notes: '', originalSize: o, compressedSize: c,
  blob: new Blob(['x']), filename: 'a-compressed.pdf', ...extra,
});

beforeEach(() => {
  downloadFile.mockClear();
  document.body.innerHTML = '<div id="compress-options"></div><div id="qp-compress-result" class="hidden"></div>';
  window.matchMedia = ((q: string) => ({ matches: /reduce/.test(q), addEventListener() {}, removeEventListener() {} })) as never;
});

describe('compress results', () => {
  it('formats sizes and percentages sensibly', async () => {
    const m = await load();
    expect(m.formatSize(539.1 * 1024)).toBe('539.10 KB');
    expect(m.formatPercent(26.2)).toBe('26%');
    expect(m.formatPercent(4.26)).toBe('4.3%');
    expect(m.formatPercent(0.04)).toBe('<0.1%');
    expect(m.compressedName('My File.PDF')).toBe('My File-compressed.pdf');
  });

  it('shows the real saving and downloads exactly once', async () => {
    const m = await load();
    const v = view(552_038, 413_200);
    m.showCompressResult(v, () => {});
    m.showCompressResult(v, () => {}); // re-render must not download again
    const box = document.getElementById('qp-compress-result')!;
    expect(box.textContent).toContain('Your PDF is now 25% smaller!');
    expect(box.querySelector('.qp-ring-num')!.textContent).toBe('25%');
    expect(downloadFile).toHaveBeenCalledTimes(1);
    expect(downloadFile).toHaveBeenCalledWith(v.blob, 'a-compressed.pdf');
  });

  it('does not download when the PDF is already optimized', async () => {
    const m = await load();
    m.showCompressResult(view(1000, 1000), () => {});
    const box = document.getElementById('qp-compress-result')!;
    expect(box.textContent).toContain('No compression needed');
    expect(box.textContent).toContain('already optimized');
    expect(box.textContent).not.toMatch(/smaller!/);
    expect(box.querySelector('#qp-compress-download')).toBeNull();
    expect(box.querySelector('#qp-compress-retry')).not.toBeNull();
    expect(downloadFile).not.toHaveBeenCalled();
  });

  it('treats a saving under 1% as already optimized', async () => {
    const m = await load();
    m.showCompressResult(view(100_000, 99_700), () => {});
    const box = document.getElementById('qp-compress-result')!;
    expect(box.textContent).toContain('No compression needed');
    expect(box.textContent).toContain('0.3%');
    expect(downloadFile).not.toHaveBeenCalled();
  });

  it('never downloads or claims savings for a larger output', async () => {
    const m = await load();
    m.showCompressResult(view(1000, 1100), () => {});
    const box = document.getElementById('qp-compress-result')!;
    expect(box.textContent).toContain('No compression needed');
    expect(box.textContent).not.toMatch(/smaller!/);
    expect(downloadFile).not.toHaveBeenCalled();
  });

  it('hides the upload column after a result and restores it on reset', async () => {
    document.body.innerHTML =
      '<div class="qp-cmp-grid"><div class="qp-cmp-main"></div><div class="qp-cmp-side"><div id="compress-options"></div><div id="qp-compress-result" class="hidden"></div></div></div>';
    const m = await load();
    const onReset = vi.fn();
    m.showCompressResult(view(2000, 1000), onReset);
    const grid = document.querySelector('.qp-cmp-grid')!;
    expect(grid.getAttribute('data-result')).toBe('saved');
    (document.getElementById('qp-compress-again') as HTMLButtonElement).click();
    expect(grid.hasAttribute('data-result')).toBe(false);
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(document.getElementById('qp-compress-result')!.classList.contains('hidden')).toBe(true);
  });

  it('"Try another level" keeps the file and reopens the settings', async () => {
    document.body.innerHTML =
      '<div class="qp-cmp-grid"><div id="compress-options"></div><div id="qp-compress-result" class="hidden"></div></div>';
    const m = await load();
    const onReset = vi.fn();
    m.showCompressResult(view(1000, 1000), onReset);
    (document.getElementById('qp-compress-retry') as HTMLButtonElement).click();
    const opts = document.getElementById('compress-options')!;
    expect(opts.classList.contains('hidden')).toBe(false);
    expect(opts.hasAttribute('data-result')).toBe(false);
    expect(onReset).not.toHaveBeenCalled();
  });

  it('labels the levels like BentoPDF', async () => {
    const m = await load();
    expect(m.levelLabel('low')).toBe('Low (Best Quality)');
    expect(m.levelLabel('medium')).toBe('Medium (Recommended)');
    expect(m.levelLabel('high')).toBe('High (Smallest Files)');
    expect(m.levelLabel('lossless')).toBe('Lossless (No Quality Loss)');
    expect(m.levelLabel('custom')).toBe('Custom');
  });

  it('does not download on failure (nothing is rendered)', async () => {
    await load();
    expect(downloadFile).not.toHaveBeenCalled();
  });
});
