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

  it('reports an unchanged size neutrally', async () => {
    const m = await load();
    m.showCompressResult(view(1000, 1000), () => {});
    const box = document.getElementById('qp-compress-result')!;
    expect(box.textContent).toContain('Your PDF is already optimized.');
    expect(box.textContent).not.toMatch(/smaller/);
    expect(box.querySelector('.qp-ring-num')!.textContent).toBe('0%');
  });

  it('never claims a larger output is smaller', async () => {
    const m = await load();
    m.showCompressResult(view(1000, 1100), () => {});
    const box = document.getElementById('qp-compress-result')!;
    expect(box.textContent).toContain('10% larger');
    expect(box.textContent).not.toMatch(/smaller!/);
  });

  it('does not download on failure (nothing is rendered)', async () => {
    await load();
    expect(downloadFile).not.toHaveBeenCalled();
  });
});
