# Stage 2 — Phase A report: technical SEO, safety and performance

**Date:** 2026-11-05 · **Branch:** `claude/happy-thompson-f6t5nh` (based on
`main` at `accefaa`, which is what production served at the time) ·
**Input:** `QPDF_Stage2_02_ChatGPT_SEO_Strategy.md` §4, §5, §7, §11–12.

No new tools, URLs, articles or frameworks were added. Every test used
synthetic files (`tests/fixtures/make_fixtures.py`).

## 1. Issues discovered

| # | Area | Finding | Severity |
| --- | --- | --- | --- |
| 1 | IRCC forms | `/fill-pdf-form/` said “Also supports XFA forms” and its blue note told users to fill XFA forms “properly” with this tool or Firefox. Nothing warned that IRCC forms needing Adobe Reader validation and 2D barcodes must not be filled, flattened, compressed or re-saved here. `/flatten-pdf/` had no such warning either. | High |
| 2 | Redaction claim | The page said Qpdf.ca “also scrubs matching text from bookmarks, annotations and metadata”. Tests show this only happens for **text** marks, and only for copies with **exactly** the marked wording. **Area (box) marks scrub no copies.** On-page removal itself is genuine (see §4). | High |
| 3 | Size targets | Targets are binary (4 MB = 4,194,304 bytes) and the presets were set exactly at the limit. A file Qpdf.ca reported as “fits 4 MB” could still be rejected by a portal that requires *less than* 4 MB and counts 1 MB as 1,000,000 bytes. | Medium |
| 4 | Privacy page | Said the CSP refuses connections “to any origin other than Qpdf.ca’s own” and that engines come from qpdf.ca. In production the CSP also allows `assets.qpdf.ca` (R2, LibreOffice engine), Cloudflare Web Analytics and Web3Forms. | Medium |
| 5 | Duplicate copy | `/compress-pdf-to-3mb/` and `/compress-pdf-to-4mb/` had word-for-word identical descriptions and intros apart from the number. | Low (SEO) |
| 6 | Layout shift | Throttled mobile CLS was 0.20–0.53 on tool pages (the offline/favourite toolbar was inserted above the H1 by JavaScript) and 0.22 on the homepage (hero heading re-wrapped when DM Sans loaded). | Medium (Core Web Vitals) |
| 7 | Bundle | Every tool page loaded Lucide’s entire icon set (~1,700 icons plus aliases, ~320 KB) because 120 upstream modules import `{ icons }` from `lucide`. | Medium |
| 8 | Guides | Unknown `relatedTools` / `relatedGuides` were dropped silently; dates and sources were not validated; Article JSON-LD had no `image`. | Low |
| 9 | Docs | `docs/DEPLOYMENT.md` said the site was not deployed and that `/merge` redirects (it never existed; it returns 404). The handoff listed 111 tool pages (it is 125). | Low |
| 10 | Tests | The E2E Bates test did not check continuity across files; the redaction test only covered one line of plain text. | Low |

Not problems (verified): see §3.

## 2. Code changes

| File | Change |
| --- | --- |
| `src/pages/form-filler.html`, `src/pages/flatten-pdf.html`, `src/pages/compress-pdf-to-4mb.html` | IRCC/validated-form warnings **above the drop zone** (visible before upload). Removed the “fill XFA forms properly here” advice. |
| `src/pages/redact-pdf.html`, `src/js/logic/edit-pdf-page.ts` | Accurate hero text. New notice before downloading after **area** redactions: copies elsewhere are not searched; suggests text marks or Sanitize PDF. Helper `hasAppliedAreaRedactions()` + unit tests. Also applies to `/edit-pdf/` (same editor). |
| `src/pages/compress-pdf-to-{4mb,3mb,2mb,500kb,200kb,100kb}.html`, `src/partials/compress-options.html` | Presets now 3.8 MB, 2.85 MB, 1.9 MB, 480 KB, 190 KB, 95 KB — each below the decimal limit too — with a one-line explanation under the field. |
| `src/data/tools.mjs` | Copy for the 12 priority tools plus page numbers / page labels / 3 MB / 2 MB / KB presets (see §3 and §4). |
| `privacy.html`, `privacy-policy.html`, `scripts/qpdf/context.mjs` | `assets.qpdf.ca`, analytics and Web3Forms named in the CSP/engine text; per-tool note reworded (“processes your file in your browser … not uploaded to Qpdf.ca or to any PDF-processing server”; offline only after “Ready to work offline”). |
| `scripts/qpdf/lucide-subset.mjs` (new), `vite.config.ts` | Vite plugin: the bare `lucide` import resolves to a virtual module exporting `createIcons` and only the icons named in the source (231). `QPDF_FULL_LUCIDE=1` turns it off. |
| `src/css/qpdf-theme.css`, `src/js/qpdf/tool-page.ts` | Space for the tool toolbar is reserved before scripts run; initial status text shortened to “Checking offline…” so it fits beside the favourite button on phones. |
| `scripts/qpdf/postbuild.mjs` | Homepage preloads DM Sans 400/700 (2 × 14 KB). |
| `scripts/qpdf/guides.mjs`, `scripts/qpdf/context.mjs` | Guide validation (dates, lists, sources, unknown related tools/guides, duplicate slugs, reviewed ≥ published); Article JSON-LD `image`. |
| `scripts/qpdf/check-dist.mjs` | Guides must have Article JSON-LD with headline/dates/`mainEntityOfPage`, no ratings/reviews, and a sitemap `<lastmod>`. |
| `tests/fixtures/make_fixtures.py`, `tests/e2e/redaction_audit.py` (new), `tests/e2e/run.mjs` | Redaction leak fixture and inspector; two redaction audit tests; Bates continuity check; preset tests assert the result is below *n*,000,000 bytes. |
| Docs | `DEPLOYMENT.md`, `STAGE-2-HANDOFF.md`, `TESTING.md`, `content/guides/README.md`, this report. |

## 3. Technical SEO

Checked against production (`curl` through this environment) and the local build.

| Check | Result |
| --- | --- |
| `https://qpdf.ca/robots.txt` | **200**, `text/plain`. Allows everything except `/wasm/` and `/vendor/` (engine binaries); points to the sitemap. Served from Cloudflare’s zone cache (4 h TTL) with an older CSP header — content identical, harmless. |
| `https://qpdf.ca/sitemap.xml` | **200**, `application/xml`, valid, **137 URLs** = home + 125 tools + 9 content pages + 2 guides. **Identical** to the local build of `main`. The earlier research tool’s failure to fetch it was a tool limitation, not a site fault. |
| Catalogue | 125 published tools = 112 browser tools + 13 LibreOffice converters (enabled because `VITE_LIBREOFFICE_ASSET_URL` is set). Same set in registry, sitemap, `/tools/`, `/site-index/` and homepage. Two upstream pages are deliberately unpublished (`timestamp-pdf`, which needs a third-party server, and `wasm-settings`); both 301 to `/tools/`. |
| Canonicals / indexing | Every page: self-canonical on `https://qpdf.ca`, `index, follow` (404 is `noindex`), unique title and description, exactly one H1 in static HTML, valid JSON-LD (`WebSite`, `WebApplication`, `BreadcrumbList`, `WebPage`/`AboutPage`, `Article`). No invented ratings. |
| Redirects (live) | `www` → apex 301; `/merge-pdf` → `/merge-pdf/` 308; `/merge-pdf.html` 301; upstream ids (`/extract-pages`) 301; `/compress-pdf-to-1mb/` 301 → `/compress-pdf/`; unknown URL → 404 status. |
| Links | `check:dist`: no broken internal links or assets in 138 pages; external links get `noopener noreferrer` (+ `nofollow`). |
| Static rendering | Titles, H1, landing copy, steps, notes, related tools and breadcrumbs are in the static HTML; only the tool UI is rendered by JavaScript. |
| Accessibility / mobile | All 137 sitemap pages loaded at 390 px (iPhone 13) and 1280 px: no horizontal scrolling, no missing icons, no page errors. Warnings use `role="note"`. One pre-existing oddity: `/markdown-to-pdf/` gains a second `<h1>` from its sample-Markdown preview after JavaScript runs. |
| Compression presets | 7 presets (100/200/500 KB, 2/3/4 MB, email) + `/compress-pdf/`. Each targets a distinct size query and has its own canonical, so none were redirected. The 3 MB/4 MB duplicate copy was rewritten; 4 MB is now the immigration-oriented page. Watch Search Console for `/compress-pdf/` vs preset cannibalisation before merging any. |
| Caching | HTML `max-age=0, must-revalidate`; hashed `/assets/*` `immutable` + Brotli; R2 engine returns `access-control-allow-origin: https://qpdf.ca`. |

### Google Search Console — checks for you (no access from here)

1. **Settings → Ownership**: confirm `qpdf.ca` is verified as a *Domain* property.
2. **Sitemaps**: submit `https://qpdf.ca/sitemap.xml`; it should read *Success* with 137 discovered URLs.
3. **Pages (Indexing)**: record indexed / not-indexed counts and reasons as the baseline. Expect “Discovered – currently not indexed” for many tool pages while the site is new.
4. **URL Inspection → Test live URL** for `/`, `/compress-pdf-to-4mb/`, `/redact-pdf/`, `/fill-pdf-form/`, `/guides/make-a-pdf-smaller/`: check *Page is indexable*, user-declared = Google-selected canonical, and that the rendered screenshot shows the heading and landing text. Request indexing for these.
5. **Core Web Vitals** and **HTTPS**: note the status (field data appears only after enough Chrome traffic).
6. **Performance → Search results**: export queries/pages (last 28 days) as the baseline for Phase B.
7. Optionally do the same in Bing Webmaster Tools (it can import from Search Console).

## 4. PDF functionality and safety findings

### Redaction (`/redact-pdf/`, same engine as `/edit-pdf/`)

Fixture `redaction-audit.pdf` (one page) contains, inside a band later marked
for redaction: searchable text `SECRET-TEXT-111`, a JPEG scan whose pixels read
`SECRET-IMG-222`, an invisible OCR text layer `SECRET-OCR-333`, text
`SECRET-UNDER-BOX-777` already covered by a drawn black rectangle, an
overlapping vector shape and a FreeText comment `ANNOT-IN-AREA-555`. Outside
the band: control text, a sticky note, a bookmark, an attachment and document
properties repeating `SECRET-TEXT-111`/`SECRET-OCR-333`, plus an unrelated
attachment `ATTACH-OTHER-666`. `tests/e2e/redaction_audit.py` (PyMuPDF)
searches the text layer, comments, bookmarks, attachments, metadata, every
decompressed object and stream, and the image pixels.

| Test | Result |
| --- | --- |
| Area mark over the band | **All in-area secrets gone**: searchable text, invisible OCR text, text under the fake black box and the in-area comment are absent from the text layer and from every raw object/stream; the scan’s pixels under the box were replaced (no text-like pixels remain). Control text kept. **Copies outside the box were not touched**: bookmark, sticky note, attachment and properties still contain `SECRET-TEXT-111`/`SECRET-OCR-333`. Now disclosed on the page and in a download notice. |
| Text mark on exactly `SECRET-TEXT-111` | Removed from the page **and** from the bookmark, sticky note (deleted), attachment (deleted), properties and all raw bytes. |
| Text mark on the whole line `Account: SECRET-TEXT-111` (exploratory) | Page text removed; copies such as “Section about SECRET-TEXT-111” **remained**, because the cleanup matches the marked phrase exactly. Page now tells users to mark the identifier itself. |
| Unrelated hidden content (`ATTACH-OTHER-666`) | Kept, as expected. Page says to use Sanitize PDF / Remove PDF Metadata too. |
| Original single-line test (`redaction.pdf`) | Pass (removed from text layer and bytes). |

Conclusion: on-page redaction removes content rather than covering it, for
every content type tested. The copy-cleanup is narrower than the old page
claimed; the claim was corrected rather than the engine rewritten. Not
tested: redaction across page boundaries, rotated pages, Type 3 fonts,
form-field values under a box, encrypted inputs (the code already warns),
and real-world documents. This is not an independent security assessment.

### IRCC and validated forms

Qpdf.ca was **not** tested with real IRCC forms; that would prove nothing
about IRCC’s validation and is the wrong use of the tool. Instead, the pages
now tell users, before upload, not to fill, flatten, compress, merge or
re-save forms with a Validate button or 2D barcode and to use Adobe Acrobat
Reader as the department instructs. Supporting documents (scans, statements,
letters) are named as the intended use of compression and merging. Sanitize
PDF (which flattens forms by default) carries the same warning.

### Compression

- Targets are goals: the page and notes say so; an unreachable target is
  reported (existing test “unreachable target is reported, not faked” passes).
- 4 MB preset now 3.8 MB → test output **3,914,608 bytes**, below both
  4,000,000 and 4,194,304. 3 MB preset → 2,954,727 bytes. All 4 pages kept.
- Signed PDFs are left untouched with an explanation (re-tested with a
  freshly generated signed fixture).

### Metadata, sanitising, Bates, numbering, labels, flattening

The pages now distinguish, in one or two sentences each:

| Tool | What it changes | What it does not |
| --- | --- | --- |
| Remove PDF Metadata | Document properties, document-level XMP, file IDs, PieceInfo (checked in code; E2E: author/title cleared) | Page content, comments, attachments, form data, bookmarks; XMP attached to individual images/pages may remain |
| Sanitize PDF | By default: flattens forms, removes metadata, comments, JavaScript, attachments, layers, links, structure tree (accessibility tags) | Anything visible on the page |
| Redact PDF | Content under marks; exact copies of selected text elsewhere | Copies for box marks; other hidden data |
| Flatten PDF | Turns fields/comments into page content | Not redaction: hidden text stays |
| Bates Numbering | Prints one continuous ID sequence across files — **verified**: 2 files, 3 + 2 pages → 000001–000005 | No court-rule checking |
| Add Page Numbers | Prints per-document numbers | — |
| Add Page Labels | Changes numbers shown in the reader’s page box; nothing printed | — |

Each page gives a short output-verification step. No page claims regulatory
certification, court approval or guaranteed compliance.

## 5. Performance

Lab measurements: production build served locally with the production
headers (`serve:dist`, no compression), headless Chromium, Pixel 7 emulation,
1.6 Mbps / 150 ms, 4× CPU slowdown, median of 3. Field data must come from
Search Console / PageSpeed Insights on the live site.

| Page | LCP before → after | CLS before → after | Transferred before → after |
| --- | --- | --- | --- |
| `/` | 1.94 s → 2.02 s | **0.220 → 0.000** | 467 → 468 KB |
| `/merge-pdf/` | 5.22 s → **4.64 s** | 0.213 → **0.005** | 1,598 → **1,282 KB** |
| `/redact-pdf/` | 5.38 s → **4.86 s** | 0.205 → **0.005** | 1,603 → **1,287 KB** |
| `/fill-pdf-form/` | 5.14 s → **4.71 s** | 0.203 → **0.005** | 1,585 → **1,268 KB** |
| `/compress-pdf-to-4mb/` | 5.33 s → **4.81 s** | 0.527 → **0.005** | 1,605 → **1,289 KB** |
| `/compress-pdf/` | 5.34 s → 7.15 s* | 0.348 → **0.077** | 1,610 → **1,293 KB** |
| `/privacy/` | 1.17 s → 1.19 s | 0 → 0 | 199 → 200 KB |
| `/guides/make-a-pdf-smaller/` | 1.18 s → 1.18 s | 0.004 → 0.007 | 215 → 216 KB |

Tool-page load event: ~8.9 s → ~7.2 s. Static JS/CSS per tool page:
1,351 KB → 1,034 KB raw (378 → 309 KB gzip); the shared `main-*.js` chunk went
from 412 KB to 95 KB.

\* `/compress-pdf/`: the heading still paints at ~4.8 s. Before, the LCP
element was a static hint paragraph (5.4 s); with the toolbar space reserved,
that paragraph sits lower in the phone viewport, so the largest element is now
the compression-level card that JavaScript renders at ~7.1 s. Nothing loads
later than before; the metric picks a different element. Rendering the level
cards in static HTML would fix it; left for a later change.

Not changed (measured, judged higher risk): PDF.js (`ui-*.js`, ~480 KB) is
imported eagerly by upstream `ui.ts`/`main.ts`; `main-*.css` (235 KB) includes
the full Phosphor icon CSS. Both would need edits across upstream tool code.
WebAssembly engines, COOP/COEP, the R2 origin, the offline manifest and
caching are unchanged; offline tests pass.

Cloudflare limits: 1,476 files (limit 20,000); largest file 16.4 MiB (limit
25 MiB); `postbuild` and `check:dist` both enforce this.

## 6. Tests

| Test | Command | Result |
| --- | --- | --- |
| Type check + production build (LibreOffice enabled as in production) | `VITE_LIBREOFFICE_ASSET_URL=… npm run build` | Pass |
| Built-site checks | `npm run check:dist` | Pass: 138 pages, 137 sitemap URLs, 1,476 files |
| Unit tests | `npm run test:run` | **1,101 / 1,101** pass (73 files) |
| E2E (Playwright, network-privacy audit on every run) | `npm run test:e2e` | **40 / 40**: 37 in the full run; the 3 failures were the two preset tests still asserting the old 3/4 MB values (updated) and the signed-PDF test (fixture needed `pyhanko`; installed, regenerated). All 3 re-run and pass. Bates continuity re-run and passes. |
| Offline (network switched off after “Ready to work offline”) | in E2E | Compress, Merge, Split, Delete pages, JPG→PDF, Password protect: pass |
| Favourites, search, homepage network | in E2E | Pass (homepage makes only same-origin GET requests) |
| Redirects, sitemap, robots, R2 CORS | `curl` against production | Pass (see §3) |
| All-page crawl, desktop + phone | Playwright script | 137 / 137 load with status 200, no missing icons, no page errors, no horizontal scroll |
| Lint (changed files) | `eslint` | No new errors (one pre-existing `no-useless-assignment` in `check-dist.mjs`) |

**Not performed:** Safari, Firefox and real phones; Lighthouse/PageSpeed on
production (lab numbers above are local); the deployed version of *these*
changes (they reach production only after merging to `main`); French OCR;
the 25–100 MB large-file runs (`--large`, unchanged code path); real IRCC or
court documents (deliberately).

## 7. Unresolved / follow-ups

1. Area-redaction copy cleanup is not implemented (disclosed instead). A safe
   implementation would read the text under each box before applying it.
2. Text-mark cleanup is exact-phrase only (disclosed).
3. `/compress-pdf/` LCP element (see §5) and the eager PDF.js chunk.
4. Remove PDF Metadata leaves XMP attached to individual images/pages
   (disclosed; not separately tested).
5. `/markdown-to-pdf/` shows a second `<h1>` from its preview after scripts run.
6. No independent security review; automated tests are not one.
7. `npm ci` needs `cdn.sheetjs.com` (the `xlsx` package is pinned to SheetJS’s
   CDN in `package-lock.json`). Cloudflare Pages reaches it; restricted build
   environments may not.

## 8. Markdown front matter for Stage 2 guides

Drop a file into `content/guides/<slug>.md`. The URL is `/guides/<slug>/`.
Body starts at `##` (the title is the H1). Full reference:
`content/guides/README.md`.

```yaml
---
title: "IRCC PDF Upload Limits: 4 MB, 5 MB and Exceptions"
description: "One or two sentences, ideally 160 characters or fewer."
category: immigration          # pdf-basics | privacy-security | immigration | legal | comparisons
published: 2026-11-12          # YYYY-MM-DD
reviewed: 2026-11-12           # YYYY-MM-DD, "requirements last checked"; shown on the page and used as sitemap lastmod
relatedTools: [compress-pdf-to-4mb, merge-pdf]   # tool ids or slugs; unknown ones fail the build
relatedGuides: [make-a-pdf-smaller]              # published or draft guide slugs
sources:
  - title: "Document upload size limits"
    url: https://www.canada.ca/...                # must start with https://
    publisher: Immigration, Refugees and Citizenship Canada
    accessed: 2026-11-12
---
```

Optional: `slug`, `metaTitle` (≤ ~65 characters), `author`, `lang: fr-CA`,
`toc: false`, `draft: true` (never built). Raw HTML in Markdown is disabled;
link tools by URL, e.g. `[Compress PDF to 4 MB](/compress-pdf-to-4mb/)`.
