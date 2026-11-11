# Qpdf — private PDF tools that run in your browser

**Production:** https://qpdf.ca · **Licence:** GNU AGPL-3.0 · **Based on:** [BentoPDF](https://github.com/alam00000/bentopdf) v2.8.11

Qpdf is a free, privacy-first PDF toolkit. Every tool processes documents
**inside the visitor's browser** with JavaScript and WebAssembly; documents are
never uploaded. It is a static site designed for Cloudflare Pages.

- 112 working tools (compress, merge, split, organize, edit, redact, sign,
  protect/unlock, OCR, PDF/A, conversions…), plus 13 LibreOffice-based Office
  converters (enabled in production, served from `assets.qpdf.ca` on R2).
- Light, minimal design; animated maple-leaf background; favourites stored
  locally (nothing is saved until you star a tool).
- Offline support with a per-tool **“Ready to work offline”** indicator.
- Every processing engine is self-hosted — no third-party CDN requests.
- Technical SEO: one landing page per tool, canonical URLs on `https://qpdf.ca`,
  sitemap, robots.txt, site index, structured data, guides content system.

Further reading: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) ·
[docs/cloudflare-r2.md](docs/cloudflare-r2.md) ·
[docs/LICENSING.md](docs/LICENSING.md) · [docs/TESTING.md](docs/TESTING.md) ·
[docs/MOTION-GRAPHICS.md](docs/MOTION-GRAPHICS.md) ·
[docs/STAGE-2-HANDOFF.md](docs/STAGE-2-HANDOFF.md)

## Quick start

Requirements: Node.js 22 (see `.nvmrc`), npm.

```bash
npm ci
```

```bash
npm run dev          # http://localhost:5173 (copies engines, generates guide pages)
```

```bash
npm run build        # production build into dist/
```

```bash
npm run serve:dist   # serve dist/ like Cloudflare Pages: http://localhost:4173
```

```bash
npm run check:dist   # titles, canonicals, links, sitemap, 25 MiB limit
```

```bash
npm run test:run     # unit tests (Vitest)
```

End-to-end tests (Playwright + Chromium and poppler-utils required):

```bash
python3 tests/fixtures/make_fixtures.py --large
```

```bash
npm run test:e2e
```

## Technologies

- **Vite** multi-page build, **Tailwind CSS v4**, **TypeScript**, Handlebars partials
- PDF engines: **pdf-lib**, **PDF.js**, **qpdf** (WASM), **PDFium** (BentoPDF
  editcore / EmbedPDF viewer), **Hyper Compress**, **CoherentPDF**,
  **PyMuPDF on Pyodide**, **Ghostscript**, **Tesseract.js**, **wasm-vips**,
  **LibreOffice WASM** (engine files on R2)
- Service worker for offline use; no backend, database or accounts

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html`, `about.html`, `privacy.html`, `privacy-policy.html`, `terms.html`, `tools.html`, `site-index.html`, `licenses.html`, `404.html` | Qpdf's own pages |
| `src/pages/<id>.html` | Tool pages (from BentoPDF; head/landing content via partials) |
| `src/data/tools.mjs` | **Tool registry**: slugs, names, categories, SEO title/description, landing copy, engines |
| `src/data/site.mjs` | Site constants, static page metadata, navigation |
| `src/partials/` | `head`, `navbar`, `footer`, `tool-landing`, `tool-card`, `maple-leaf`… |
| `src/css/qpdf-theme.css` | Design tokens and the light-theme remap of upstream utilities |
| `src/js/qpdf/` | Homepage search/favourites, offline indicator, service-worker registration |
| `src/js/logic/`, `src/js/utils/` | Tool logic (BentoPDF) |
| `content/guides/*.md` | Guides (Markdown + YAML front matter) |
| `scripts/qpdf/` | Build pipeline: `copy-engines`, `prebuild`, `context`, `postbuild`, `check-dist`, `serve-dist` |
| `public/sw.js` | Service worker (caches Qpdf's own software only) |
| `cloudflare/` | R2 upload script and CORS policy for the LibreOffice engine |
| `tests/` | Synthetic fixtures generator and the E2E harness |

## How the build works

`npm run build` runs:

1. `scripts/qpdf/copy-engines.mjs` — copies pinned engine packages from
   `node_modules` into `public/wasm` and `public/vendor` (gitignored).
2. `scripts/qpdf/prebuild.mjs` — writes one HTML entry per guide.
3. `tsc` — type check.
4. `vite build` — Handlebars renders every page with the context from
   `scripts/qpdf/context.mjs` (metadata, breadcrumbs, JSON-LD, tool registry).
5. `scripts/qpdf/postbuild.mjs` — moves pages to clean URLs (`/merge-pdf/`),
   writes `sitemap.xml`, `robots.txt`, `_headers` (CSP, COOP/COEP, caching),
   `_redirects`, the offline manifest, and **fails the build if any file
   exceeds 25 MiB**.

## PDF engine architecture and the 25 MiB limit

Cloudflare Pages rejects files larger than 25 MiB. The audit of the BentoPDF
build found exactly two: `soffice.wasm.gz` (46.5 MiB) and `soffice.data.gz`
(27.3 MiB), used only by the LibreOffice converters. Everything else is under
16.4 MiB, including the self-hosted PyMuPDF, Ghostscript, CoherentPDF and
Tesseract files.

- The two LibreOffice files are **not committed and not deployed to Pages**.
  They are served from a Cloudflare R2 bucket when
  `VITE_LIBREOFFICE_ASSET_URL` is set (see [docs/cloudflare-r2.md](docs/cloudflare-r2.md)).
  Without it, those 13 tools are excluded from the build (no pages, no links,
  301 to `/tools/`).
- The cross-origin path was tested with a simulated R2 host: Word→PDF and
  RTF→PDF converted locally under the production COEP/CSP headers.

## Privacy architecture

- Files are read with the File API and processed in memory, in the page or
  Web Workers. Results are saved through temporary `blob:` URLs.
- Dark mode (saved locally) and a contact form (Web3Forms; off until `WEB3FORMS_ACCESS_KEY` is set).
- No ads, cookies or tracking. Optional cookieless Cloudflare Web Analytics (off unless `CF_ANALYTICS_TOKEN` is set; respects DNT/GPC). The CSP restricts
  `connect-src` to the site itself (plus the R2 asset origin when enabled).
- Removed upstream network calls: GitHub star counter, ads hook, BentoPDF's
  CORS proxy fallback, jsDelivr/GitHack CDN defaults. RFC 3161 timestamping
  (which needs a third-party server) is disabled.
- The PDF.js viewers no longer persist per-document view history.
- Browser storage holds only favourites, UI preferences, cached app files and
  cached fonts. See `/privacy/`.

## Offline support

`public/sw.js` caches Qpdf's own files: hashed `/assets/*`, version-pinned
engines (`/wasm/*`, `/vendor/*`) and per-build static files. The build lists
each tool's full dependency set in `/offline-manifest.json`; the tool page
downloads it (automatically for tools under 40 MiB, on request for the larger
PyMuPDF/Ghostscript/Tesseract engines) and only then shows **Ready to work
offline**. Offline processing was verified for Compress, Merge, Split,
Delete pages, JPG→PDF and Password Protect.

## Adding a PDF tool

1. Add the tool page in `src/pages/<id>.html` (copy a similar page; keep
   `{{> head }}`, `{{> navbar }}`, `{{> tool-landing }}`, `{{> footer }}`).
2. Add the logic in `src/js/logic/<id>-page.ts` and reference it from the page.
3. Add a registry entry in `src/data/tools.mjs` (id, slug, name, category, icon,
   short, title, desc, intro, steps, notes, related, engine). The build picks
   it up for the homepage, `/tools/`, the site index, the sitemap and offline.
4. If the tool uses a new external engine, add it to
   `scripts/qpdf/copy-engines.mjs` and `ENGINE_FILES` in `postbuild.mjs`.
5. `npm run build && npm run check:dist`, then add an E2E case in `tests/e2e/run.mjs`.

## Adding a guide (Stage 2)

Create `content/guides/<slug>.md` with front matter — see
[content/guides/README.md](content/guides/README.md). It is published at
`/guides/<slug>/` and added to the hub, site index and sitemap automatically.

## Licensing

Qpdf is a modified version of BentoPDF and is licensed under **AGPL-3.0-only**.
Because the site is offered over a network, its complete source must be
available to users (footer “Source code” link → `SOURCE_URL`, default
`https://github.com/hjavaran/Qpdf.ca`). **The repository must be public before
qpdf.ca is launched.** Details and third-party licences:
[docs/LICENSING.md](docs/LICENSING.md) and `/licenses/`.

Qpdf is not affiliated with the [qpdf](https://qpdf.sourceforge.io/) library,
BentoPDF, Adobe or any government.
