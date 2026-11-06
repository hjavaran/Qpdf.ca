# Stage 2, Step 9 — Legal and PDF-privacy articles: publishing report

**Date:** 2026-11-06 · **Branch:** `claude/sweet-turing-42knf9` (from `main` at
`f0d1fca`) · **Input:** `QPDF_Stage2_08_Legal_Privacy_Articles.zip` (seven
drafts + editorial notes; the notes are not a public page).

**Status: not live.** The changes are on a branch / pull request. They reach
production only after you merge to `main` and the Cloudflare Pages deploy
succeeds. No production URL below has been verified.

## 1. Articles and status

| # | Article | URL (after deploy) | Status |
| --- | --- | --- | --- |
| 1 | How to Permanently Redact a PDF (Not Just Draw Black Boxes) | `/guides/permanent-pdf-redaction/` | **Ready – public after merge** |
| 2 | Bates Numbering PDFs Without Adobe Acrobat Pro | `/guides/bates-numbering-without-adobe/` | **Ready – public after merge** |
| 3 | PDF Metadata, Comments and Hidden Information: Disclosure Checklist | `/guides/pdf-metadata-disclosure-checklist/` | **Ready – public after merge** |
| 4 | BC Supreme Court Electronic Application Records: PD-72 PDF Checklist | *(not built)* | **Withheld as `draft: true`** (§4) |
| 5 | Federal Court E-Filing PDF Requirements: Size, Bookmarks and Confidential Files | `/guides/federal-court-pdf-efiling/` | **Ready – public after merge** |
| 6 | Ontario Court of Appeal PDF Filing: 512 MiB, 500 Pages and Navigation | `/guides/ontario-court-of-appeal-pdf/` | **Ready – public after merge** |
| 7 | Preparing PDF Exhibits and Application Records: A Practical Checklist | `/guides/prepare-pdf-exhibits/` | **Ready – public after merge** |

Categories: articles 1 and 3 are `privacy-security`; 2, 5, 6, 7 (and the draft 4)
are `legal`. No slug collides with an existing page or guide. No tools were
added or changed in behaviour.

## 2. Dates

`published` = `reviewed` = **2026-11-06** on the six published guides (the day
of integration; the parser needs `reviewed ≥ published`). `draft: true` was
removed from these six only. `sources[].accessed` values were left at
2026-11-06: on that date I re-read the Federal Court e-filing page, the
Federal practice guidelines PDF, the Ontario Court of Appeal practice direction
and Appendix B in full, and confirmed that the OPC, Law Society of BC and both
Adobe pages still load (HTTP 200). I did **not** re-read the content of the OPC,
LSBC and Adobe pages; their `accessed` date rests on the editorial package's
check of the same day. The PD-72 draft keeps its placeholder dates (it is not
built).

If the PR merges on a later day, `published` will still say 2026-11-06. Re-date
if you care about the exact deploy date.

## 3. Source verification

**Federal Court** (verified against the live pages/PDF, 2026-11-06)

| Claim | Result |
| --- | --- |
| Federal Court vs Federal Court of Appeal | **Confirmed**: “Documents for the Federal Court of Appeal will not be accepted for filing through this System.” |
| 100 MB limit, “approximately 500 pages” | **Confirmed**, and the article already treats 500 pages as an approximation; fewest possible volumes if over |
| Typed text must be searchable; no password-protected PDFs; bookmarks “anywhere you would include a physical tab” | **Confirmed** |
| Guidelines ¶19(d) page numbers, (e) bookmarks, (f) hyperlinks, (g) OCR; email filing not accepted from 23 June 2025 except four listed cases | **Confirmed** |
| Confidential material: do not use E-Filing; email attachments smaller than 18 MB; password or access instructions sent separately | **Confirmed** (e-filing page; ¶19(c) says “not exceeding 18 MB”) |
| Guideline 35: proof of service “should” be attached in a single PDF and “should” be bookmarked | **Confirmed** (PDF page 12). The article keeps “should” and separates it from the underlying service duty |

**Ontario Court of Appeal** (practice direction revised through 2026-06-11 and Appendix B, read in full)

| Claim | Result |
| --- | --- |
| ¶10, ¶59, ¶67: 512 MiB **and** 500 pages per non-video file; multiple volumes if either exceeded | **Confirmed** |
| ¶8: text-searchable “should”; scanned PDFs “must” use OCR, software “at least 300 dpi”, “not … grayscale” | **Confirmed** |
| ¶11 no hyperlinks between filed materials; ¶19 factum links to cases “should” | **Confirmed** |
| ¶26, 27, 33, 34, 35: bookmarks + internal-link index for authorities books, appeal books/compendiums/exhibit books, panel motion records, single-judge records ≥ 100 pages; not necessary under 100 pages | **Confirmed** |
| ¶9/57 and Appendix B (type code + file number + extension; `Vol1` after the code; `SLD` for sealed; examples `FAP…`, `ABCO.Vol1…`) | **Confirmed** |
| ¶56, 61: Public Portal; old filing email decommissioned | **Confirmed** |
| ¶62–69 sealed material: placeholder + link, no password in placeholder, OneDrive/Google Drive/Dropbox/EATS, WeTransfer inaccessible, label sealed, password by telephone to Intake Office, limits still apply; informer privilege / national security / child sexual abuse material → contact Deputy Registrar | **Confirmed** |
| Not Superior Court / Case Center | The direction is the Court of Appeal's own; the Case Center comparison is the article's contrast, not a quoted statement |

**BC Supreme Court PD-72 — NOT fully verified (reason for withholding, §4)**
From this environment `www.bccourts.ca` fails TLS verification ("unable to get
local issuer certificate"; the web-fetch agent got a DNS error). I did not
disable verification. Web search returned the PD-72 PDF's indexed text and the
Court's pages, which corroborate: effective March 31, 2026; electronic
application records for chambers applications of 30 minutes or less before an
associate judge; replaces PD-68; 50 MB maximum; all documents searchable and
scans OCR'd; documents/exhibits “should” be bookmarked; Court Services Online;
the Registry “will reject” non-compliant records; the cumulative index (current
to 2026-09-22) lists it. I could **not** confirm: page-number position (top
centre) and the “must match” sentence, the security-settings wording, the
cover-form numbers (30.001 / F32.2), the Initial View / bookmark-panel wording,
¶4–5 and ¶11 details, and that there is no DPI figure. Those are exactly the
must-versus-should details you asked to be exact.

**QPDF behaviour statements** checked against the repo: the Bates page offers a
style preset, a custom template (`[BATES] [PAGE] [FILE] [FILENAME]`), digit
count, six header/footer positions, a start number and a file-counter start; the
Sanitize defaults (flatten forms, metadata, comments, JavaScript, attachments,
layers, links, structure tree, mark info) match the articles; redaction and
metadata statements match `docs/SEO-STAGE2-PHASE-A-REPORT.md` §4 and the passing
e2e redaction audits. None of the published articles claims that QPDF alone
builds hyperlinked index pages, sets Initial View, guarantees Ontario's OCR
resolution/colour settings, preserves signatures, or certifies compliance.

## 4. Withheld: BC Supreme Court PD-72 guide

`content/guides/bc-supreme-court-pd72-pdf.md` stays `draft: true`, unchanged
from the supplied file (it is not built, not in the sitemap, hub or site index,
and no page links to it).

**Why:** I could not read the official PD-72 text, and the article's value
depends on the exact must/should wording (§3). The article is otherwise
consistent with everything I could corroborate.

**To publish it** (≈10 minutes with the PDF open): read PD-72 and Appendix A,
confirm the table in the article, edit `published`/`reviewed`/`accessed` to the
real date, delete `draft: true`, then optionally (a) re-link the PD-72 bullet in
`prepare-pdf-exhibits.md` to `/guides/bc-supreme-court-pd72-pdf/`, (b) add
`bc-supreme-court-pd72-pdf` to that guide's `relatedGuides`, (c) add a
`metaTitle` (default title is 70 characters), and (d) add it to Edit PDF
Bookmarks/Compress PDF tool guide lists if wanted. The editorial notes also ask
a BC practitioner to confirm eligibility and document order.

## 5. Corrections and edits made during integration

| Article | Change |
| --- | --- |
| Redaction | “Claude Code's Phase A tests” → “QPDF.ca's own tests (Stage 2, Phase A)” (no internal tool names on a public page); “bookmarks' destinations” → “clickable index links” (Sanitize removes links, not bookmarks, per the Phase A table); linked the existing *check whether a PDF tool uploads files* guide from the privacy paragraph |
| Bates | “Claude Code's synthetic test” → “A QPDF.ca synthetic test”; step 4 rewritten to match the real controls (style/custom template, digits, start number, six positions) and to say apply Bates after redaction |
| Metadata checklist | Two “Claude Code” references reworded; link to IRCC barcode guide in the Flatten paragraph |
| Federal | “should be independently locatable” → “must be separately bookmarked” (¶19(e) says “shall”); added a not-legal-advice / practitioner-review sentence. Guideline 35 wording left as “should” |
| Ontario | “the supplied Claude technical report does not establish…” → “QPDF.ca has not verified that its OCR tool exposes or guarantees 300 dpi, non-grayscale”; practitioner-review sentence |
| Exhibits | PD-72 bullet now links to the official PD-72 PDF instead of the withheld guide; `relatedGuides` adjusted; links to `make-a-pdf-smaller` and `ircc-pdf-validation-barcodes`; practitioner-review sentence |
| Four guides | Added `metaTitle` (≤55 characters) for Federal, Ontario, Exhibits and Metadata; their default titles were 67–79 characters |

All other text, tables, warnings and source attribution are as supplied.

## 6. Internal links added

**Tool pages → guides** (existing `guides` field in `src/data/tools.mjs`):

| Tool page | Guide(s) |
| --- | --- |
| `/redact-pdf/` | Permanent PDF redaction |
| `/bates-numbering/` | Bates numbering without Adobe |
| `/remove-pdf-metadata/` | PDF metadata disclosure checklist |
| `/sanitize-pdf/` | PDF metadata disclosure checklist, with a caution line (does not redact; removes links and accessibility tags) |
| `/ocr-pdf/` | Preparing PDF exhibits |
| `/edit-pdf-bookmarks/` | Preparing PDF exhibits; Federal Court e-filing; Ontario Court of Appeal |
| `/compress-pdf/` | existing two IRCC guides **plus** Federal Court e-filing |

**Guide → guide additions** (all slugs exist and are published):
redaction → `check-if-pdf-tool-uploads-files`; metadata checklist →
`ircc-pdf-validation-barcodes`; exhibits → `make-a-pdf-smaller`,
`ircc-pdf-validation-barcodes`. The supplied cross-links among the six guides
are unchanged. I added no IRCC links to the Federal Court guide: the IRCC guides
are about IRCC portal uploads, which is not what a Federal Court filing is.
No new links to the withheld guide anywhere.

## 7. Tests

| Check | Result |
| --- | --- |
| `npm run build` (`VITE_LIBREOFFICE_ASSET_URL` as in production) | Pass. 1,487 files (was 1,481), 205.4 MiB, largest 16.4 MiB (limit 25 MiB) |
| `npm run check:dist` | Pass: 149 pages, 148 sitemap URLs; only the five existing third-party-URL warnings in engine bundles |
| `npm run test:run` | 1,101 / 1,101 pass (73 files) |
| `npm run test:e2e` | 40 / 40 pass, including the per-run network-privacy audit and both redaction audits. *Setup note:* a fresh checkout needs `python3 tests/fixtures/make_fixtures.py`, `pip install pymupdf pyhanko` and `npm run serve:dist` first; my first two runs failed (0/38, 37/40, then 39/40) only because those were missing, not because of the change |
| Built-page checks (script) | For all six: self-canonical `https://qpdf.ca/guides/<slug>/`, one H1, `Article` JSON-LD with datePublished/dateModified 2026-11-06 and no rating/review, sitemap entry with `<lastmod>` 2026-11-06, present in the guides hub and the site index; tables render (2 / 1 / 1 in Bates / Metadata / Exhibits) |
| PD-72 draft | No page directory, not in sitemap, hub or site index; no built page links to it |
| Tool pages | The seven tool pages above show the new guide links; no tool code changed |
| Layout | Playwright, 390 px phone and 1280 px desktop: the six guides, hub, site index and four tool pages return 200, no horizontal scroll, one H1, no page errors |
| External links | Federal e-filing page, guidelines PDF, Ontario direction and Appendix B, OPC, LSBC, both Adobe pages and qpdf.ca/bates-numbering: HTTP 200. CanLII returns 403 to automated clients (not checked). The PD-72 PDF URL (used in the exhibits guide) could not be fetched from here (TLS, §3), but it is the exact URL the search index returns |
| Not run / limits | No Safari, Firefox or real-phone testing; no Lighthouse; no production deploy |

No PDFs are uploaded anywhere by this change (content and static links only; the
e2e network audit shows same-origin static requests only).

## 8. Sitemap

Actual baseline (`main` build before this change, per the Step 6 report):
142 URLs. After this change: **148 = 142 + 6**. The brief's 149 would need
PD-72 as well.

## 9. Git

Branch `claude/sweet-turing-42knf9` → PR against `main`. Commit hash and PR URL
are in the PR itself and in the separate download copy of this report. Cloudflare
Pages deployment: **not deployed; waits for your merge.**

## 10. Remaining risks and actions for you

1. **Decide on PD-72.** Read the official PD-72 and Appendix A and either approve
   publishing it (steps in §4) or leave it withheld. A BC practitioner should
   check eligibility and rule-specific deadlines/order.
2. **Court-specific review.** Federal, Ontario and Exhibits articles say they are
   not legal advice and name specific paragraphs. Please have a qualified
   practitioner skim them; I did a source check, not a legal review. The Federal
   page warns delays up to four weeks for immigration filings; the article does
   not mention this.
3. **OPC, LSBC and Adobe sources:** content not re-read by me on 2026-11-06
   (§2); the editorial package did.
4. **Unproven QPDF capabilities** are stated as limits in the articles (index
   hyperlinks, Initial View, 300 dpi / non-grayscale OCR). If you later test and
   confirm any of them, the wording can be tightened.
5. `published` is 2026-11-06 regardless of the merge day (§2).
6. The Federal article was written from the 2025-06-20 guidelines; the Court's
   page references them as “latest”, but re-check at deploy time.
7. After merge, verify the six production URLs, the sitemap (148) and Search
   Console; I have not done and cannot claim that.
