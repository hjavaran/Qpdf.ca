import { describe, it, expect, vi, beforeEach } from 'vitest';

// QPDF self-hosts every engine on its own origin and ignores engine URLs
// stored in the browser (e.g. by older BentoPDF-based builds), so no
// third-party host can ever be configured from the client.
const STORAGE_KEY = 'bentopdf:wasm-providers';

async function loadProvider(stored?: Record<string, string>) {
  localStorage.clear();
  if (stored) localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  vi.resetModules();
  return (await import('../js/utils/wasm-provider')).WasmProvider;
}

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('WasmProvider (QPDF self-hosted engines)', () => {
  it('serves every engine from the site origin', async () => {
    const provider = await loadProvider();
    const origin = window.location.origin;
    expect(provider.getUrl('pymupdf')).toBe(`${origin}/wasm/pymupdf/`);
    expect(provider.getUrl('ghostscript')).toBe(`${origin}/wasm/gs/`);
    expect(provider.getUrl('cpdf')).toBe(`${origin}/wasm/cpdf/`);
    expect(provider.isConfigured('pymupdf')).toBe(true);
  });

  it('ignores engine URLs saved in the browser', async () => {
    const provider = await loadProvider({
      pymupdf: 'https://cdn.jsdelivr.net/npm/@bentopdf/pymupdf-wasm@0.11.14/',
      ghostscript: 'https://evil.example/gs/',
      cpdf: `${window.location.origin}/other/`,
    });
    const origin = window.location.origin;
    expect(provider.getUrl('pymupdf')).toBe(`${origin}/wasm/pymupdf/`);
    expect(provider.getUrl('ghostscript')).toBe(`${origin}/wasm/gs/`);
    expect(provider.getUrl('cpdf')).toBe(`${origin}/wasm/cpdf/`);
  });
});
