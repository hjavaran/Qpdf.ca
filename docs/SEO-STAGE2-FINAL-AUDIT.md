# Stage 2, Step 10 — Final production audit

**Date:** 2026-11-06 · **Audited production commit:** `f573ab6` (`main`) ·
**Fix branch:** `claude/loving-thompson-9obh1o` · **Inputs:** Phase A report
(`SEO-STAGE2-PHASE-A-REPORT.md`), immigration publishing report
(`SEO-STAGE2-IMMIGRATION-PUBLISHING-REPORT.md`), legal publishing report
(`SEO-STAGE2-LEGAL-PUBLISHING-REPORT.md`).

All tests used synthetic files from `tests/fixtures/make_fixtures.py`. No real
or confidential document was used. No paid service or infrastructure setting
was changed. Nothing was merged or deployed.

## 1. Executive summary

- **Production is the Stage 2 work.** `https://qpdf.ca` serves the build of
  `main` at `f573ab6` (merge of the six legal/privacy guides). All three
  Stage 2 pull requests are merged. This was checked on the live site, not
  taken from earlier reports (§2).
- **Technical SEO is sound.** The sitemap has the expected **148** URLs, every
  one returns 200 and is self-canonical, indexable and has one static H1 and
  unique title and description. Structured data is valid and has no ratings.
  There are no orphan pages, no broken internal links and no draft exposure
  (§4).
- **All 11 Stage 2 guides are live** and correctly indexed, dated, linked and
  listed. Two contained internal project jargon ("Stage 2, Phase A"), and one
  stated as tested something that was only checked in code. Both are fixed on
  the branch (§5).
- **Privacy claim holds in production.** The full E2E suite (40 cases) was run
  **against https://qpdf.ca** with synthetic PDFs. The only cross-origin
  requests were Cloudflare Web Analytics page-view beacons (≤ 829 bytes, URL
  and timings only), and analytics does not load with Do Not Track or Global
  Privacy Control (§7).
- **Redaction behaves as disclosed** in production. Area marks remove in-area
  content and do not scrub copies elsewhere; text marks clean exact phrases.
  The site says so (§7).
- **Two measured problems found and fixed on the branch:**
  - layout shift on phones: CLS 0.13–0.29 on tool pages in production, caused
    by the toolbar wrapping while offline files download;
  - accessibility: tool pages scored 92 (unlabelled upload input, text
    contrast 4.42:1).
  After the fix: CLS ≈ 0.005 and accessibility 100 in the same tests (§8, §9).
- **Withheld drafts stay drafts.**
  - RCIC: the regulatory question is now largely answered from primary
    sources, and the draft is corrected, but it still needs professional
    review.
  - BC PD-72: the official PDF is still unreachable from this environment. The
    BC Ministry's April 2026 CSO guide supports the draft's must/should table
    and shows one scope gap (§6).
- **Main open item:** a person must still confirm the Guide 0192 refugee-claim
  figures (9.6 MB / 2 MB) in the live IRCC upload-limits guide. `canada.ca`
  refuses automated clients, so neither Step 6 nor this audit could check it
  (§13).

**Conclusion:** Stage 2 is complete and production is technically sound and
ready for indexing. The branch adds focused fixes (CLS, accessibility, copy,
links) that should be merged. See §15.

## 2. Production deployment verification

| Check | Result |
| --- | --- |
| `main` head | `f573ab6` — *Merge pull request #3* (2026-11-06 16:21 UTC) |
| [hjavaran/Qpdf.ca#1](https://github.com/hjavaran/Qpdf.ca/pull/1) Phase A (`8406016`) | Merged 2026-11-06 00:00 UTC |
| [hjavaran/Qpdf.ca#2](https://github.com/hjavaran/Qpdf.ca/pull/2) immigration guides (`9a2233b`) | Merged 2026-11-06 05:45 UTC |
| [hjavaran/Qpdf.ca#3](https://github.com/hjavaran/Qpdf.ca/pull/3) legal/privacy guides (`54d2589`) | **Merged** 2026-11-06 16:21 UTC |
| Production build id | `2026-11-06-2ca4d0f2` (`/build-assets.json`) |
| Code identity | I built `f573ab6` locally with production's `VITE_LIBREOFFICE_ASSET_URL`. All **488 content-hashed asset names** in production's `/build-assets.json` match the local build exactly, and production `sitemap.xml` is **byte-identical** |
| HTML identity | All 148 production pages were downloaded and diffed against the local build. The only differences are the Cloudflare Web Analytics token `<meta>` and the contact-form "not configured" banner, both set by Cloudflare environment variables (which also explains the different build id) |
| Step 3 changes present | Yes: IRCC warnings above drop zones, 3.8 MB / 2.85 MB presets, Lucide subset (`main-*.js` ≈ 98 KB), corrected privacy text, guide validation |
| Step 6 changes present | Yes: 5 IRCC guides, tool → guide links, RCIC draft absent |
| Step 9 changes present | Yes: 6 legal/privacy guides, PD-72 draft absent |
| Preview vs production | Everything above was measured on the production custom domain `https://qpdf.ca` (Cloudflare zone, `server: cloudflare`). No `*.pages.dev` preview URL was used |

Cloudflare's deployment list was not read (no Cloudflare credentials). The
evidence above (identical hashes for every hashed file) is stronger than a
dashboard commit label for showing what code is live.

## 3. GitHub branch and commit information

- Audited commit: `f573ab6f4f62e0a261f2ad56cf4d90f45cd0a499` (`main`).
- Fix branch: `claude/loving-thompson-9obh1o`, based on `f573ab6`; one commit
  with the fixes in §12 plus this report; a pull request was opened for review
  (link in the PR list; **not merged, not deployed**).

## 4. Technical SEO audit (live site)

| Check | Result |
| --- | --- |
| `robots.txt` | 200 `text/plain`; `Allow: /`, disallows only `/wasm/` and `/vendor/` (engine binaries); declares the sitemap |
| `sitemap.xml` | 200 `application/xml`, **148 URLs** = home + 125 tools + 9 content pages + 13 guides (2 Stage 1 + 11 Stage 2). `<lastmod>` on the 13 guides |
| Canonicals | 148/148 self-canonical on `https://qpdf.ca/...` |
| Indexability | 148/148 `index, follow`; 404 page is `noindex, follow` and returns status 404 |
| Titles / descriptions | All unique; all descriptions present and ≤ 170 characters. One title was 69 characters (redaction guide), now shortened with `metaTitle` |
| Headings | Exactly one H1 in static HTML on all 148 pages. After JavaScript, `/markdown-to-pdf/` gains a second H1 from its sample-document preview (cosmetic; unchanged) |
| Structured data | Valid JSON-LD on every page: WebSite 1, WebApplication 125, BreadcrumbList 147, WebPage 8, AboutPage 1, Article 13. No `aggregateRating` or `review` anywhere |
| Internal links / orphans | Every sitemap URL has ≥ 3 inbound internal links; no internal link points outside the sitemap; `check:dist` reports no broken links or assets |
| Redirects | `www` → apex 301; `http` → `https` 301; `/merge-pdf` → `/merge-pdf/` 308; `/merge-pdf.html`, `/index.html`, upstream ids (`/extract-pages`) 301; `/compress-pdf-to-1mb/` → `/compress-pdf/` 301; `/timestamp-pdf/` → `/tools/` 301. **`/wasm-settings/` (trailing slash) returned 404**, not the 301 described in Phase A (only the no-slash form redirected); fixed on the branch. Never published or linked, so harmless |
| Drafts | `/guides/rcic-client-pdf-privacy/` and `/guides/bc-supreme-court-pd72-pdf/` (with or without slash, `.html`) return 404. Neither slug appears in any built HTML, XML, JSON or JS file. Source Markdown and `docs/` are not served (404) |
| Duplicates | No duplicate titles, descriptions or canonical targets. Compression presets remain distinct pages with distinct copy |
| JavaScript rendering | Titles, H1, intro, steps, notes, related links and article bodies are in static HTML. A Playwright crawl of all 148 pages at 390 px (iPhone 13) and 1280 px (296 loads) found status 200 everywhere, no page errors, no horizontal scroll, no broken images and no third-party requests other than analytics |
| Tool-page SEO | Unique landing copy, steps, notes and related tools on every tool page; IRCC wording is cautionary everywhere it appears (§7) |
| Guide navigation | Guides hub lists all 13 guides under four headings; site index lists all 13; breadcrumbs on each guide |

## 5. Status of the eleven published articles

Common to all 11, verified on production:
- HTTP 200, self-canonical, `index, follow`, one H1;
- `Article` + `BreadcrumbList` JSON-LD with `datePublished` = `dateModified` = 2026-11-06, author and publisher Qpdf.ca, an `image`, and no ratings;
- visible published and reviewed dates;
- sitemap `<lastmod>` 2026-11-06;
- listed in the guides hub and site index;
- displays correctly at 390 px and 1280 px.

| Guide | Title length | Internal links in / out | Notes |
| --- | --- | --- | --- |
| `/guides/ircc-pdf-upload-limits/` | 59 | linked from Compress PDF, Compress to 4 MB | IRCC Help Centre figures verified in Step 6 and links return 200. **Guide 0192 refugee figures still unverified** (§13 #1) |
| `/guides/compress-bank-statements-ircc/` | 63 | linked from Compress PDF | OK |
| `/guides/merge-documents-ircc/` | 51 | linked from Merge PDF | OK |
| `/guides/ircc-pdf-please-wait-error/` | 63 | linked from Fill PDF Form | OK; says the XFA explanation is not IRCC's wording |
| `/guides/ircc-pdf-validation-barcodes/` | 65 | linked from 4 guides; **now also from Fill PDF Form and Flatten PDF** | The IMM 0008 page (canada.ca) remains unverified from this environment |
| `/guides/permanent-pdf-redaction/` | 69 → **41** (metaTitle) | linked from Redact PDF | Said "QPDF.ca's own tests (Stage 2, Phase A)", an internal project label; reworded. Claims match the production redaction audit (§7) |
| `/guides/bates-numbering-without-adobe/` | 56 | linked from Bates Numbering | Bates continuity re-verified in production (000001–000005) |
| `/guides/pdf-metadata-disclosure-checklist/` | 55 | linked from Remove Metadata, Sanitize; **now Flatten PDF** | Said XMP, file IDs and PieceInfo removal was "checked in Stage 2 tests". Only author/title were tested before. **A new E2E test now verifies it** (§7); wording updated |
| `/guides/federal-court-pdf-efiling/` | 49 | linked from Compress, Edit Bookmarks | Practice-guidelines PDF link 301-redirected from `fct-cf.gc.ca` to `fct-cf.ca`; updated (also in 2 other guides) |
| `/guides/ontario-court-of-appeal-pdf/` | 50 | linked from Edit Bookmarks | Both ontariocourts.ca links 200 |
| `/guides/prepare-pdf-exhibits/` | 54 | linked from OCR, Edit Bookmarks | PD-72 bullet links to the official PDF, not the withheld guide |

**External links (29 unique across all guides):**
- **200:** Federal Court, Ontario Court of Appeal, OPC, LSBC, IRCC Help Centre, Adobe Reader download, MDN/Chrome DevTools docs.
- **Could not be checked from here** (they block or refuse automated clients; not evidence of a broken link): canada.ca (Guide 0192, IMM 0008), bccourts.ca, two helpx.adobe.com pages (403) and CanLII (403).

**Content review:**
- No internal tool names (Claude, ChatGPT) remain on public pages.
- No claims of IRCC approval, court approval, CICC certification, guaranteed compliance or universal irreversible redaction.
- No page recommends Qpdf.ca for barcode/validated forms; several say the opposite.
- Each legal guide says it is not legal advice.
- Low, cosmetic: guide bodies write "QPDF.ca" while the site brand is "Qpdf.ca".

## 6. Status of the two withheld drafts

Both remain `draft: true`; neither is built or linked.

### A. RCIC Document Privacy Checklist — retention question largely resolved; still needs professional review

Primary sources read on 2026-11-06:

| Source | What it says |
| --- | --- |
| College [By-Laws, Regulations and Policies](https://college-ic.ca/about-the-college/regulations-and-policies) | Still lists the **Client File Management Regulation** among current regulations (not as an archive). The By-laws page states that By-law 2021-2 (approved by the Council board 2021-11-17) "**remains in effect and applies to all College licensees**" and that references to the Council/ICCRC "are to be read as references to" the College |
| *College of Immigration and Citizenship Consultants Act*, s. 85(o) (laws-lois.justice.gc.ca, `C-33.6`) | "every by-law of the Council and every regulation made by the Council's board of directors **remains in effect**, to the extent that it is not inconsistent with this Act, until the day before the day on which a by-law made under section 80 comes into force" |
| Client File Management Regulation 2021-001 | §7.2: "A Client File shall be retained in a secure and accessible location for a **minimum of six (6) years after the File has been closed**." §7.1: a file may be closed only when fees/refunds are settled, client property returned and the client told in writing the retainer has ended. Approved 2021-11-17 |
| Code Interpretation Guide 2022-001 (College) | "retained for 6 years following the completion of immigration or citizenship consulting services" (a different trigger) |
| Code of Professional Conduct SOR/2022-128 | s. 28(1): confidentiality "indefinitely" (confirmed). s. 37: "keep and preserve records in accordance with the by-laws made under the Act" (no number of years) |
| SOR/2026-68 (College of Immigration and Citizenship Consultants Regulations, registered 2026-04-16) | Covers the compensation fund, capacity evaluation and related matters. **No client-file retention rule** |

**Finding:**
- The draft's label "historical" for the Regulation is **not supported**. On these sources the operative rule is the continued ICCRC Regulation: at least six years **after the file is closed** under §7.1.
- The Code guide's "after completion of services" is secondary wording, and the closing date can be later than the end of services.
- Confidentiality (indefinite) and retention (≥ 6 years after closure) are separate duties, as the draft already says.

**Edits made to the draft (still `draft: true`):**
- Rewrote the retention section with the quotations above and the s. 85(o) basis.
- Removed "historical".
- Added the College regulations page and the Act as sources.
- Re-dated `accessed` for the sources re-read today.

**Still needed before publication:**
1. A qualified regulatory reviewer confirms:
   - that no College by-law under s. 80 has come into force (the College's page says By-law 2021-2 remains in effect, but the page is dated 2022-03-17);
   - whether s. 85(o)'s reading rule ("a reference to the by-laws **in this Act**") also governs Code s. 37's "by-laws made under the Act".
2. The PIPEDA/provincial-law paragraphs and the two OPC sources are re-read (not done here).
3. Re-date `published`/`reviewed` and remove `draft: true` only after that review.

### B. BC Supreme Court PD-72 — not verifiable from here; keep withheld

The official PD-72 PDF could not be read:
- `www.bccourts.ca` fails TLS verification at this environment's egress proxy ("unable to get local issuer certificate");
- the web-fetch tool received HTTP 503;
- verification was not bypassed.

**Secondary official source read in full:** BC Ministry of Attorney General,
*Guide to Submitting Application Records Using CSO* (April 1, 2026,
`justice.gov.bc.ca/pdfs/cso/InstructionsForUsersForApplicationRecords.pdf`). It
paraphrases PD-72 and agrees with the draft on:

| Draft item | CSO guide wording |
| --- | --- |
| Searchable / OCR | "All documents submitted **must** be searchable"; scans "**must** be processed using OCR" |
| 50 MB | "**must** ensure the electronic application record is optimized and does not exceed 50 megabytes" (and > 20 MB uses CSO's Upload Large File first) |
| Cover page | "**should** create a cover page in form 30.001 or form F32.2 … included as the first item" |
| Bookmarks / initial view | "**should** be bookmarked"; "bookmark panel **should** be shown by default … setting the initial view" |
| Page numbers | "**should** be page numbered sequentially … at the top centre"; "Page searching in the PDF **must** match page numbering"; Page Labels if numbering starts after the index |
| Security | "**must** disable any security settings that might restrict … viewing, printing, saving, annotating, or searching"; "should not submit password protected documents" |
| DPI | No resolution figure (consistent with "no universal 300 DPI rule") |
| Rejection | Since 2025-09-08 records "are being checked" and non-compliant ones rejected by email; corrections within the Rules' deadline |

**Gap found:**
- The CSO guide says that for the **Virtual Chambers List** (from 2025-09-08, PD-73), an electronic application record **must** be submitted for all locations except Vancouver.
- The draft only describes PD-72 as *permitting* electronic records for the 30-minute associate-judge pilot.

**Recommended edits (not applied; they need the primary text):**
1. In "Does PD-72 apply", add: "If the application is on the Virtual Chambers List (PD-73), an electronic application record is required, not optional; check PD-73." Verify against PD-72/PD-73.
2. Confirm the paragraph numbers the draft cites (¶4–5 authorities/affidavits of service, ¶6 "will reject", ¶11 vetted draft order) against the PDF. The CSO guide supports the substance but not the numbering.
3. Add a `metaTitle` (default title is 70 characters), set real `published`/`reviewed`/`accessed` dates, then remove `draft: true`.
4. A BC practitioner confirms eligibility and document order (as Step 9 required).

## 7. PDF functionality and privacy testing

**Production run:** `QPDF_URL=https://qpdf.ca QPDF_ALLOW_ANALYTICS=1 node tests/e2e/run.mjs` — **40/40 passed**.

The strict audit allows only same-origin static GETs after a file is selected. The new opt-in mode adds exactly two exceptions, the Cloudflare beacon script GET and the `/cdn-cgi/rum` POST. Each is accepted only if:
- its body is ≤ 32 KB;
- the body has no `%PDF-`, `.pdf` or `.jpg`;
- every payload is saved for review.

| Area | Production result |
| --- | --- |
| Compression | Image-heavy 7.74 MB → 0.28 MB; scanned 5.51 → 1.66 MB; text + 3 links kept; 2 files → ZIP; signed PDF left untouched with explanation |
| Target sizes | 4 MB preset → **3,914,608 B** (< 4,000,000); 3 MB preset → 2,954,727 B; unreachable 100 KB target honestly reported (140 KB) |
| Merge / split / pages | Merge keeps 5 bookmarks; split by range; extract, delete, reorder, rotate, page numbers, watermark: pass |
| Bates | 2 files (3 + 2 pages) → continuous 000001–000005 |
| Redaction | Area mark: no in-area secret recoverable (text layer, invisible OCR text, text under a fake box, in-area comment, raw objects); scan pixels replaced; copies outside the box remain, as disclosed on the page and in the download notice. Text mark: removed from page, bookmark, comment, attachment, properties and raw bytes |
| Metadata | Author/title cleared (production). **New test (local build):** document properties, document XMP, PieceInfo and file ID all removed; page-level XMP remains, exactly as the page and guide disclose |
| Sanitize / flatten / forms | Flatten leaves no interactive fields; sanitize defaults unchanged (described accurately on its page) |
| OCR | English scan → searchable ("quick brown fox"), 16 s |
| PDF/A, JPG↔PDF, protect, unlock | Pass |
| Offline | After "Ready to work offline", network off: compress, merge, split, delete pages, JPG→PDF, password protect: pass |
| Downloads | Every case produced and saved a download (or, for the compress controls, correctly did not) |

**Network findings (production):**
- 78 analytics requests in 39 page loads: 39 beacon-script GETs and 39 RUM POSTs (largest 829 B).
- Payload fields: `location` (page URL), `pageloadId`, browser engine and version, memory figures, paint and navigation timings, `siteToken`. No file names, no file content, no data derived from documents.
- With **Global Privacy Control** or **Do Not Track** set, 0 analytics requests (4 without), which matches the privacy policy.
- No request to any other third party on any of the 148 pages.
- OCR fonts load from `/vendor/ocr-fonts/` (same origin). The third-party font and CDN URLs that `check:dist` flags inside engine bundles are not used at runtime, and the CSP's `connect-src` would block them anyway.

**IRCC forms:**
- Fill PDF Form's meta description says "Not for IRCC forms that must be validated in Adobe Reader".
- Compress, Compress to 4 MB, Merge, Flatten and Sanitize carry "do not … IRCC forms with a Validate button or 2D barcode" notes, above the drop zone where relevant.
- No page promotes IRCC form compatibility.
- Fill PDF Form and Flatten PDF now also link to the validation/barcode guide.

**Privacy policy:** no material inaccuracy found. Its statements on browser-local processing, Cloudflare hosting and R2, analytics fields, DNT/GPC, Web3Forms (text only, no attachments), local storage, Cache Storage and IndexedDB all match observed behaviour.

## 8. Performance findings (production)

Lighthouse 12.6.1, mobile profile (simulated throttling), median of 3, against `https://qpdf.ca`:

| Page | Perf | A11y | LCP | TBT | CLS | Transfer |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 100 | 96 | 1.5 s | 0 ms | 0.000 | 124 KB |
| `/compress-pdf/` | 91 | 92 | 2.8 s | 0 ms | 0.000 | 561 KB |
| `/compress-pdf-to-4mb/` | 86 | 92 | 2.8 s | 0 ms | **0.146** | 559 KB |
| `/merge-pdf/` | 87 | 92 | 2.6 s | 0 ms | **0.143** | 555 KB |
| `/redact-pdf/` | 87 | 92 | 2.7 s | 0 ms | **0.132** | 559 KB |
| `/guides/ircc-pdf-upload-limits/` | 100 | 96 | 1.3 s | 0 ms | 0.000 | 116 KB |
| `/guides/permanent-pdf-redaction/` | 100 | 96 | 1.4 s | 0 ms | 0.000 | 116 KB |

SEO and Best Practices scored 100 on every page.

- **CLS on tool pages (fixed on branch).** In a throttled Pixel 7 trace (1.6 Mbps, 150 ms, 4× CPU) on production, the toolbar wrapped to two lines and pushed the page down ~38 px:
  - cause: "Preparing offline use… NN%" or the download-button state no longer fits beside "Add to favourites";
  - the toolbar then unwrapped at "Ready to work offline", giving two shifts and CLS up to **0.29**;
  - Phase A's local measurement missed this because offline preparation finishes almost instantly on localhost.

  **Fix:** the toolbar is now always one line. Each status has a short phone variant, the favourite button shows only its star on phones (its label stays accessible), and long desktop messages were shortened. Every state was checked at 360, 390, 412, 641, 768 and 1280 px: always one 30 px line, never truncated. The same trace on the fixed build gives **0.005** on Merge, Redact, Compress to 4 MB, PDF to Word (download-button state) and Word to PDF (LibreOffice state).
- **`/compress-pdf/` LCP (Phase A concern):** 2.8 s in production with CLS 0, so it is no longer a material problem.
- **Eager PDF.js:** tool pages transfer ~555 KB (Brotli). Lighthouse estimates ~143 KB of unused JavaScript, but TBT is 0 ms and LCP is static text, so splitting upstream PDF.js imports is not worth the risk now.
- **INP / field data:** none available here. The PageSpeed Insights API returned HTTP 429 (shared keyless quota) and there is no Search Console access. Use the Core Web Vitals report once Chrome traffic accrues (§10).
- **Caching:**
  - hashed `/assets/*`: `max-age=31536000, immutable`, Brotli, edge HIT;
  - HTML: `max-age=0, must-revalidate`;
  - `/wasm/*`: 7 days + SWR;
  - R2 LibreOffice engine: CORS limited to `https://qpdf.ca`.
  - **Cloudflare overrides `_headers` for `sw.js` and `robots.txt`.** The repo says `no-cache` for `sw.js`, but production sends `max-age=14400`, i.e. the zone's *Browser Cache TTL*. Impact is low (browsers bypass the HTTP cache when checking the service-worker script), but set *Caching → Configuration → Browser Cache TTL* to **Respect Existing Headers** (free setting). Not changed here.
- **Observation to re-check after deploy:** on the uncompressed local server, `/ocr-pdf/` painted briefly before its 241 KB stylesheet finished, giving a 0.6 shift. This is not caused by the branch and was not seen on production, where the stylesheet is Brotli-compressed.

## 9. Accessibility and mobile findings

| Finding | Severity | Status |
| --- | --- | --- |
| Upload `<input id="file-input">` on all 125 tool pages had no accessible name (Lighthouse `label`) | High (accessibility) | **Fixed:** `tool-page.ts` sets `aria-label` "Choose files"/"Choose a file" when no label exists |
| `--qp-faint` text (#75736d on #f8f7f4) at 4.42:1 (brand ".ca", footer, legal line, hints) | Medium | **Fixed:** token darkened to #6e6c66 (≥ 4.5:1 on all light surfaces); dark theme unchanged |
| Toolbar wrap / layout shift on phones | Medium (Core Web Vitals) | **Fixed** (§8) |
| Lighthouse accessibility after fixes (local build) | — | **100** on `/`, `/merge-pdf/`, `/compress-pdf-to-4mb/`, `/guides/ircc-pdf-upload-limits/` (was 92–96) |
| `/markdown-to-pdf/` second H1 from sample preview (after JS) | Low | Unchanged |
| Phone crawl, 148 pages at 390 px | — | No horizontal scroll, no errors |

## 10. Search Console readiness

**Technically ready:**
- the sitemap is valid and complete;
- robots allows all content and points to the sitemap;
- canonicals are self-referencing;
- no stray `noindex` and no exposed drafts;
- structured data is valid, with no invented ratings;
- every page has unique static content;
- every URL is internally linked.

I have **no Search Console access**, so nothing here claims that any page is indexed or ranking.

1. **Sitemap:** Search Console → *Indexing → Sitemaps*. Submit (or resubmit) `https://qpdf.ca/sitemap.xml` and confirm *Success* with **148** discovered URLs.
2. **Inspect URLs:** *URL Inspection* → paste each URL → *Test live URL* → check "URL is available to Google", user-declared canonical = Google-selected canonical, and that the screenshot shows the heading and text → *Request indexing*. Start with:
   - `/`, `/compress-pdf/`, `/compress-pdf-to-4mb/`, `/merge-pdf/`, `/redact-pdf/`, `/fill-pdf-form/`, `/guides/`;
   - the 11 Stage 2 guides.
3. **Coverage:** *Indexing → Pages*. Record indexed / not-indexed counts and reasons today as the baseline. "Discovered – currently not indexed" is normal for a new site; investigate "Duplicate, Google chose different canonical" or "Excluded by noindex" if they appear for sitemap URLs.
4. **Core Web Vitals:** *Experience → Core Web Vitals* (mobile and desktop). Data appears only after enough Chrome traffic. Check that LCP, INP and CLS are "Good" once the CLS fix is deployed. *HTTPS* report: all URLs should be HTTPS.
5. **Enhancements:** *Breadcrumbs* report should list the tool and guide pages without errors.
6. **Queries and pages:** *Performance → Search results* → date range *Last 28 days* (later *Last 3 months*) → tabs *Queries* and *Pages* → *Export* (Google Sheets/CSV). Save one export per month.
7. **Track impressions and clicks:** use the *Pages* tab filtered by `/guides/`, plus a filter on `/compress-pdf-to-4mb/`, to follow the IRCC and legal content separately. Compare *Impressions*, *Clicks*, *CTR* and *Average position* month over month. Check `/compress-pdf/` against the presets for cannibalisation before merging any.
8. Optionally import the property into **Bing Webmaster Tools**.

## 11. Tests performed and results

| Test | Command / method | Result |
| --- | --- | --- |
| Production build of `f573ab6` | `VITE_LIBREOFFICE_ASSET_URL=… npm run build` | Pass (1,487 files, largest 16.4 MiB) |
| Production build of branch | same | Pass, 148 sitemap URLs |
| Built-site checks | `npm run check:dist` | Pass on both: 149 pages, 148 sitemap URLs (5 existing third-party-URL warnings in engine bundles) |
| Unit tests | `npm run test:run` | **1,101 / 1,101** on both |
| E2E, local, `f573ab6` | `npm run test:e2e` | **40 / 40** |
| E2E, local, branch | `npm run test:e2e` | **41 / 41** (adds metadata XMP/PieceInfo/ID test) |
| E2E, **production** | `QPDF_URL=https://qpdf.ca QPDF_ALLOW_ANALYTICS=1 node tests/e2e/run.mjs` | **40 / 40**; 78 analytics requests, ≤ 829 B, no document data. The first attempt in strict mode failed every non-offline case on the Cloudflare beacon alone, which is why the opt-in mode exists |
| Live SEO parse | Script over all 148 production pages | §4 |
| Redirects / headers / 404s | `curl` on production | §4, §8 |
| External links | `curl` on 29 URLs | §5 |
| Desktop + phone crawl | Playwright, 148 pages × 2 viewports, production | 296/296 OK except the known markdown H1 |
| DNT / GPC | Playwright on production | 0 analytics requests with either |
| Lighthouse | 7 production pages × 3 runs; 4 pages on branch (accessibility) | §8, §9 |
| CLS traces | Playwright, throttled Pixel 7 | Production 0.13–0.29 → branch 0.005 |
| Toolbar states | 8 states × 6 widths, branch | Always 30 px, no truncation |
| Lint (changed files) | `eslint` | 0 errors; 2 pre-existing warnings in `run.mjs` |

**Setup required** (not code failures): `npm ci`, `pip install pymupdf pyhanko`, `python3 tests/fixtures/make_fixtures.py`, `npm run serve:dist` for local E2E.

**Not performed:**
- Safari, Firefox, real phones;
- `--large` 25–100 MB runs;
- LibreOffice converters end to end;
- French OCR;
- Cloudflare dashboard (no access);
- Search Console (no access);
- CrUX field data (API quota);
- real IRCC, court or client documents (deliberately);
- an independent security review.

## 12. Issues corrected (branch `claude/loving-thompson-9obh1o`)

| # | Change | Files |
| --- | --- | --- |
| 1 | Toolbar stays one line in every offline state; short phone messages; star-only favourite on phones; shorter desktop messages (CLS) | `src/js/qpdf/tool-page.ts`, `src/css/qpdf-theme.css` |
| 2 | Accessible name for every tool upload input | `src/js/qpdf/tool-page.ts` |
| 3 | `--qp-faint` contrast ≥ 4.5:1 | `src/css/qpdf-theme.css` |
| 4 | Removed "Stage 2" / "Phase A" jargon from two public guides; metadata claim now matches a real test | `content/guides/permanent-pdf-redaction.md`, `content/guides/pdf-metadata-disclosure-checklist.md` |
| 5 | `metaTitle` for the redaction guide (69 → 41 characters) | `content/guides/permanent-pdf-redaction.md` |
| 6 | Federal Court guidelines links updated to the final `fct-cf.ca` URL (was 301) | 3 guides |
| 7 | Fill PDF Form and Flatten PDF link to the IRCC validation guide; Flatten also links to the metadata checklist | `src/data/tools.mjs` |
| 8 | `/wasm-settings/` → `/tools/` 301 | `scripts/qpdf/postbuild.mjs` |
| 9 | Metadata-rich fixture + E2E test (properties, document XMP, PieceInfo, file ID) | `tests/fixtures/make_fixtures.py`, `tests/e2e/run.mjs` |
| 10 | Opt-in production audit mode `QPDF_ALLOW_ANALYTICS=1` (strict mode unchanged by default) | `tests/e2e/run.mjs` |
| 11 | RCIC draft: retention section corrected from primary sources (still `draft: true`) | `content/guides/rcic-client-pdf-privacy.md` |
| 12 | This report; test notes | `docs/SEO-STAGE2-FINAL-AUDIT.md`, `docs/TESTING.md` |

No new tools, pages, guides, dependencies or server-side processing.

## 13. Remaining issues ranked by severity

**Critical:** none found.

**High**
1. **Guide 0192 refugee-claim figures (9.6 MB / 2 MB) and the 2026-11-03 notice** in the live `/guides/ircc-pdf-upload-limits/` are still not independently verified.
   - Why: `canada.ca` refuses automated clients, and web search does not corroborate them.
   - Risk: the text is hedged ("check your portal prompts"), but it is specific regulatory information on a published page.
   - Action: open Guide 0192 in a browser and confirm or correct the first paragraph and the "Refugee-claim exception" section. If it can't be confirmed soon, consider removing the numbers.

**Medium**
2. Merge the branch to deploy the CLS and accessibility fixes. Until then, production tool pages keep CLS ≈ 0.13–0.29 on throttled phones and accessibility 92.
3. Cloudflare *Browser Cache TTL* overrides `_headers` (`sw.js`, `robots.txt`: 4 h). Set it to *Respect Existing Headers*.
4. IMM 0008 statement in `/guides/ircc-pdf-validation-barcodes/`: unverified (same canada.ca limitation).
5. Field Core Web Vitals and INP: unknown until Search Console has data.

**Low**
6. `/markdown-to-pdf/` second H1 after JavaScript (sample preview).
7. "QPDF.ca" vs "Qpdf.ca" spelling in guide bodies.
8. ~143 KB unused JS on tool pages (eager PDF.js); not material at TBT 0 ms.
9. Local-only `/ocr-pdf/` unstyled-paint shift (§8); re-check on production after deploy.
10. Footer "Developed by wealththeory.ca" link is follow, not `nofollow` (owner's choice).

**Held for professional judgement (not publication-ready):**
- RCIC draft: regulatory review per §6A.
- PD-72 draft: primary-text check, PD-73 scope and practitioner review per §6B.

## 14. Recommended next actions

1. Review and merge the branch PR; wait for the Cloudflare Pages deploy, then:
   - re-run `QPDF_URL=https://qpdf.ca QPDF_ALLOW_ANALYTICS=1 npm run test:e2e`;
   - spot-check `/merge-pdf/` on a phone.
2. Confirm Guide 0192 (and IMM 0008) by hand (§13 #1, #4).
3. In Cloudflare, set Browser Cache TTL to *Respect Existing Headers*.
4. Submit or resubmit the sitemap and do the URL inspections in §10; record the baseline.
5. Arrange the RCIC regulatory review and the PD-72 primary-text check before publishing either draft.
6. Review Search Console monthly (§10 items 6–7) before deciding on any new content.

## 15. Conclusion

**Stage 2 is complete.**
- All work from Steps 3, 6 and 9 is merged and live on `https://qpdf.ca` (commit `f573ab6`).
- Production is **technically sound and search-engine ready**: 148 indexable, canonical, internally linked URLs; valid structured data; no draft exposure; browser-local PDF processing confirmed with synthetic files; redaction and IRCC limits accurately disclosed.
- No critical issue was found.
- The branch PR fixes the measured phone layout shift and the tool-page accessibility gaps, and tidies copy and links. Merging it is recommended but does not block indexing.
- Two things still need a person: confirming the Guide 0192 figures, and professional review of the two withheld drafts, which stay unpublished.
