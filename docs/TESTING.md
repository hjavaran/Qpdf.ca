# Test report — Stage 1 (2026-11-04)

All tests ran against the production build (`npm run build`) served locally by
`scripts/qpdf/serve-dist.mjs`, which applies the same `_headers` (CSP,
COOP/COEP) and `_redirects` as Cloudflare Pages. Browser: headless Chromium
(Playwright 1.63) on Linux. Test documents are synthetic
(`tests/fixtures/make_fixtures.py`); no real or confidential files were used.
**Not tested:** the live Cloudflare deployment (no credentials), Safari,
Firefox and real mobile devices.

## Automated checks

| Check | Command | Result |
| --- | --- | --- |
| Type check | `tsc` (part of build) | Pass |
| Unit tests | `npm run test:run` | 1,087 / 1,087 pass (71 files) |
| Lint | `npm run lint` | 0 errors (544 pre-existing upstream warnings) |
| Production dependency audit | `npm run security:audit` | 0 vulnerabilities (after upgrading node-forge to 1.4.3, removing unused archiver) |
| Built-site checks | `npm run check:dist` | Pass: 123 pages, unique titles/descriptions, canonicals, one H1 each, valid JSON-LD, no broken internal links, sitemap valid (122 URLs) |
| Cloudflare limits | `postbuild` | 1,445 files; largest 16.4 MiB (limit 25 MiB) |

## End-to-end results (`npm run test:e2e`): 33 / 33 passed

Every run also audits all network requests made by the page, its workers and
the service worker after the document is selected: no request may be anything
other than a same-origin `GET` for a static file. **All runs passed this audit.**

| Tool | Input | Result |
| --- | --- | --- |
| Compress | image-heavy, 7.74 MB | 0.28 MB (−96.4%), result card shows sizes and reduction |
| Compress | scanned, 5.51 MB | 1.66 MB (−69.9%) |
| Compress | text with 3 links | 4.6 KB → 2.6 KB; text and all 3 links preserved |
| Compress | digitally signed | Left untouched with an explanation (signature preserved) |
| Compress | 2 files | ZIP with 2 PDFs, 13.2 MB → 1.9 MB |
| Compress to 2 MB | image-heavy | 0.28 MB ≤ 2 MB target |
| Merge | 3 + 2 pages, with bookmarks | 5 pages, 5 bookmarks kept |
| Split | 40 pages, range `1-3,5` | 4 pages |
| Extract pages | page 2 | Output produced |
| Delete pages | page 1 of 3 | 2 pages |
| Reorder pages | `3,2,1` | Order applied |
| Rotate | all pages | 90° on every page |
| Page numbers | 3 pages | Numbers present in text layer |
| Watermark | “CONFIDENTIAL” | Applied (as a rotated image overlay) |
| JPG → PDF | 3 photos | 3 pages (pdf-lib; no large engine download) |
| PDF → JPG | 3 pages | ZIP of 3 JPGs |
| Password protect | AES | Encrypted; opens with the password |
| Unlock | encrypted (AES-256) | Decrypted, 3 pages |
| Flatten | form with 4 fields | No interactive fields remain |
| Remove metadata | author/title set | Author and title cleared |
| Bates numbering | 2 files | Numbered files produced |
| OCR (English) | 3 scanned pages | Searchable text (“quick brown fox”) in 16 s |
| PDF → PDF/A | text | PDF/A identification present |
| Redact | “SECRET-12345” | Removed from the text layer **and** the file bytes; other text kept |
| Favourites | first visit | Compress PDF is the only favourite; removing it persists across reloads |
| Search | “password” | Password Protect, Unlock, Remove Restrictions |
| Homepage | — | Only same-origin GET requests |

### Offline (Wi-Fi demonstration, automated)

The test waits for **Ready to work offline**, switches the browser context
offline, then selects, processes and downloads the file.

| Tool | Offline result |
| --- | --- |
| Compress PDF | Pass |
| Merge PDF | Pass |
| Split PDF | Pass |
| Delete PDF Pages | Pass |
| JPG to PDF | Pass |
| Password Protect PDF | Pass |

Tools that use PyMuPDF, Ghostscript or Tesseract show “Works offline after a
one-time download” with a button. OCR and PDF/A were verified online only.

### Large files (compress)

| Input | Output | Time |
| --- | --- | --- |
| 33.7 MB, 8 pages | 1.4 MB | 9 s |
| 63.1 MB, 15 pages | 2.6 MB | 17 s |
| 126.2 MB, 30 pages | 5.1 MB | 32 s |

Synthetic random-noise images, desktop-class machine; real documents and
devices with less memory will differ. No size limit is imposed by QPDF.

### LibreOffice path (simulated R2)

With the two LibreOffice blobs served from a separate local origin with CORS
(as R2 would), DOCX → PDF (17 s) and RTF → PDF (6 s) converted correctly under
the production CSP and COEP headers, with no unexpected requests.

### Manual / visual checks

Homepage (desktop and 390 px mobile), tool pages, Edit PDF, Edit PDF Text,
Redact, Sign PDF, Fill Form and content pages were inspected in screenshots:
no console errors, readable contrast, light theme applied.

## Performance (local server, no compression)

Cloudflare will additionally Brotli-compress HTML/CSS/JS, so real transfer
sizes are smaller than shown.

| Page | Desktop LCP / CLS | Throttled mobile* LCP / CLS | Transferred (uncompressed) |
| --- | --- | --- | --- |
| `/` | 235 ms / 0.001 | 1.7 s / 0.001 | 416 KB |
| `/privacy/` | 164 ms / 0.003 | 1.1 s / 0.000 | 175 KB |
| `/compress-pdf/` | 244 ms / 0.017 | 5.1 s / 0.051 | 1.6 MB |

\*Pixel 7 emulation, 1.6 Mbps / 150 ms latency, 4× CPU slowdown. Tool pages
carry the upstream application bundle (PDF.js, icon sets); trimming it is a
recommended follow-up.

## Reproducing

```bash
python3 tests/fixtures/make_fixtures.py --large
```

```bash
npm run build && npm run serve:dist
```

```bash
npm run test:e2e -- --large
```
