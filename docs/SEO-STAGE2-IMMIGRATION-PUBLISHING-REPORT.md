# Stage 2, Step 6 — Immigration articles: publishing report

**Date:** 2026-11-06 · **Branch:** `claude/vigilant-tesla-csldnh` (from `main` at
`cb48dac`) · **Input:** `QPDF_Stage2_05_Immigration_Articles.zip`
(six drafts + editorial notes; the notes are kept internally in
[SEO-STAGE2-IMMIGRATION-EDITORIAL-NOTES.md](SEO-STAGE2-IMMIGRATION-EDITORIAL-NOTES.md)
and are not a public page).

**Status: not live.** The changes are on a branch / pull request. They reach
production only after merge to `main` and a successful Cloudflare Pages deploy.
The production URLs below have therefore **not** been verified.

## 1. Articles

| # | Article | URL (after deploy) | Status |
| --- | --- | --- | --- |
| 1 | IRCC PDF Upload Limits: 4 MB, 5 MB and Exceptions | `/guides/ircc-pdf-upload-limits/` | Published in this change (**see §3, Guide 0192 caveat**) |
| 2 | How to Compress Bank Statements and Supporting PDFs for IRCC | `/guides/compress-bank-statements-ircc/` | Published in this change |
| 3 | How to Merge Multiple Documents for One IRCC Upload Field | `/guides/merge-documents-ircc/` | Published in this change |
| 4 | IRCC PDF ‘Please Wait’ Error: Open the Form Correctly | `/guides/ircc-pdf-please-wait-error/` | Published in this change |
| 5 | IRCC PDF Validation and 2D Barcodes: What Not to Change | `/guides/ircc-pdf-validation-barcodes/` | Published in this change (IMM 0008 sentence not re-checked, §3) |
| 6 | RCIC Document Privacy Checklist for Client PDFs | *(not built)* | **Withheld as `draft: true`** — §4 |

## 2. Integration

- Files copied unchanged into `content/guides/` (slugs = file names), then the
  edits in §5. Front matter validated by the real parser (`npm run build`):
  categories (`immigration`), dates, `relatedTools`, `relatedGuides`, sources.
  Cross-references resolve; the draft guide is a valid target but nothing
  links to it. No duplicate tool pages were created.
- **Dates:** `published` = `reviewed` = **2026-11-06** (the day of integration)
  on the five published articles. The parser requires `reviewed ≥ published`,
  so these cannot differ. I re-read these on 2026-11-06 and each still says
  *Date modified 2026-11-03*: IRCC Help Centre `qnum=1123`, `1213`, `1160`,
  `140`, `1523`, `767`, and Justice Canada's CICC Code (§28, §37). `accessed`
  was updated to 2026-11-06 for those sources only. The Guide 0192 and IMM 0008
  sources keep `accessed: 2026-11-05` because they could not be re-read (§3).
- Added `metaTitle` to articles 2 and 3 (their default titles were 70 and 67
  characters).
- The RCIC draft keeps its 2026-11-05 dates (they describe the drafting stage);
  re-date it when it is published.
- Build output: 5 new guide pages, one H1 each, self-canonical on
  `https://qpdf.ca/guides/<slug>/`, `Article` + `BreadcrumbList` JSON-LD
  (headline, dates, no ratings), `lastmod` 2026-11-06 in `sitemap.xml`
  (142 URLs, was 137). Guides hub lists them under “Canadian immigration
  documents”; they also appear on `/site-index/`. `/guides/rcic-client-pdf-privacy/`
  returns 404 and is absent from the sitemap, hub and site index.

## 3. Factual verification

Verified directly against the live official pages on 2026-11-06:

| Claim | Result |
| --- | --- |
| General limits: IRCC secure account 4 MB; IRCC Portal 5 MB; online citizenship 4 MB; asylum portal 4 MB; Permanent Residence Portal 4 MB; IRCC Portal – New version 5 MB (`qnum=1123`) | **Confirmed**, identical to the article's table |
| One file per field; only the last upload is kept (`qnum=1160`) | **Confirmed** |
| 96 / 150 DPI as size-reduction suggestions; limit “can be as low as 2 MB” (`qnum=1213`) | **Confirmed**. I added the “as low as 2 MB” sentence to article 1 |
| Adobe Reader 10 or higher; mobile devices cannot be used for IRCC forms; Windows/Mac download steps (`qnum=140`) | **Confirmed** |
| Validate button; barcode page at the end; always validate online or by mail; online: do not print, do not use the signature-panel button, upload, then name + security question = e-signature; paper: print with barcode pages, sign in pen, barcode page on top (`qnum=1523`) | **Confirmed** |
| Why barcodes are missing: Reader outdated, mobile device, mandatory fields, YYYY-MM-DD / conflicting dates, special characters/spaces, JavaScript off (`qnum=767`) | **Confirmed** |
| CICC Code §28(1): confidentiality “indefinitely”; §37: office administration and records “in accordance with the by-laws made under the Act” (no number of years) | **Confirmed** (used only in the withheld draft) |

**Not verified by me (needs a human before or right after merge):**

1. **Guide 0192 (refugee-claim exception: 9.6 MB for Passport, Other travel
   documents and Basis of Claim; 2 MB for all other documents) and its
   2026-11-03 asylum-process notice.** `www.canada.ca` returns an empty reply
   to automated clients from this environment (the page is not blocked by the
   network allowlist; I did not try to get around the bot protection), and
   web search could not corroborate the figures. Other IRCC pages found by
   search mention 2 MB for some uploads. The numbers come from the Step 5
   research (“inspected 2026-11-05”) and are kept, with the article's existing
   “check your portal prompts” qualifications. **Please open Guide 0192 once
   and confirm the 9.6 MB / 2 MB wording and the notice. If it differs, edit
   the first paragraph and the “Refugee-claim exception” section of article 1.**
2. **IMM 0008 page** (digital version in the Permanent Residence Portal vs PDF
   for paper) cited in article 5 — same access problem.
3. **XFA / “Please wait” explanation** (article 4). The IRCC Help Centre page
   does not mention XFA or “Please wait”; the article now says so. It is a
   widely known explanation, not an IRCC statement.

**QPDF behaviour statements** (checked against the code and the Phase A tests,
re-run today): the 4 MB preset targets 3.8 MB and is a goal, not a guarantee
(E2E: 3,914,607 B < 4,000,000 B; unreachable targets are reported); signed PDFs
are left untouched; merging runs in the browser with Qpdf's network audit
passing in all 40 E2E runs; redaction/sanitize/metadata descriptions match
`docs/SEO-STAGE2-PHASE-A-REPORT.md` §4 and the redaction audit tests
(area marks remove in-area content but do not scrub outside copies; text marks
clean exact phrases only). No article claims IRCC approval, CICC certification,
an independent security audit or guaranteed compliance, and none recommends
QPDF for barcode forms; articles 1–5 say the opposite.

## 4. Withheld: RCIC privacy article

`content/guides/rcic-client-pdf-privacy.md` is `draft: true`. Reasons:

- The article calls the ICCRC **Client File Management Regulation 2021-001**
  (§7.2: file kept “a minimum of six (6) years after the File has been closed”)
  “historical”. That label is **not established**. I confirmed §7.2 says that,
  and a **College news item dated 2024-09-27** still tells licensees files
  “must be kept for a minimum of 6 years after the file is closed”, pointing
  to the same Regulation. A December 2024 Board package says the By-laws were
  being updated. I could not find the by-law currently in force, so I cannot
  say which instrument governs in November 2026, or from what event the period
  runs (closure vs completion of services).
- The editorial notes themselves require a qualified regulatory reviewer to
  approve this paragraph and the PIPEDA/provincial-law framing before
  publication. I did not re-verify the OPC pages cited there.

Nothing else in the article depends on that question; once reviewed, remove
`draft: true`, correct the “historical” wording to whatever is accurate,
re-date it and re-check the sources. The other five articles do not link to it.

## 5. Editorial corrections made

- Article 1: added IRCC's “limit can be as low as 2 MB” sentence (verified).
- Article 4: stated that IRCC's page does not use the term XFA.
- Dates and `accessed` values (§2); `metaTitle` for two articles.
- No other rewrites.

## 6. Internal links added (tool pages → guides)

New optional `guides` field on tools (`src/data/tools.mjs`, rendered by
`src/partials/tool-landing.html` with existing `.qp-block` styles; drafts and
unknown slugs are skipped).

| Tool page | Guide(s) |
| --- | --- |
| `/compress-pdf/` | IRCC upload limits; bank-statement compression |
| `/compress-pdf-to-4mb/` | IRCC upload limits |
| `/merge-pdf/` | Merge documents for one IRCC field |
| `/fill-pdf-form/` | “Please Wait” guide, with a caution line: this tool will not fix it and IRCC forms with a Validate button or 2D barcode must not be filled here |

No privacy-page link to the RCIC guide (withheld). Guides link to the tools
through their `relatedTools` cards.

## 7. Tests

| Check | Result |
| --- | --- |
| `npm run build` (with `VITE_LIBREOFFICE_ASSET_URL` as in production) | Pass; 1,481 files, largest 16.4 MiB (limit 25 MiB) |
| `npm run check:dist` | Pass: 143 pages, 142 sitemap URLs (only the existing third-party-URL warnings in engine bundles) |
| `npm run test:run` | 1,101 / 1,101 pass (73 files) |
| `npm run test:e2e` (incl. per-run network-privacy audit) | 40 / 40 pass |
| Desktop 1280 px + phone 390 px, 5 guides + hub + 4 changed tool pages + site index | HTTP 200, no horizontal scroll, one H1, no page errors; draft URL is 404 |
| Unique guide URLs / titles; related-guide links | Verified in the built HTML; `check:dist` found no broken internal links |

No PDFs are uploaded anywhere by this change (content and static links only;
the E2E network audit shows same-origin static GETs only). Not tested: Safari,
Firefox, real phones, Lighthouse on production, the live Cloudflare deploy.

## 8. Git, PR, deployment

- Branch: `claude/vigilant-tesla-csldnh`. Commit hash and PR link: see the
  pull request (they cannot be written inside the commit itself).
- Merge to `main` was **not** done by this session; review the PR, then merge.
- Cloudflare: **not deployed yet.** No infrastructure or paid settings were
  changed.

## 9. Manual actions for you

1. Confirm Guide 0192's file-size wording and notice (and IMM 0008) — §3.
2. Arrange regulatory review of the RCIC article — §4.
3. Review and merge the PR; wait for the Cloudflare Pages deploy.
4. After deploy, open each of the five guide URLs and the four changed tool
   pages, check `https://qpdf.ca/sitemap.xml` has 142 URLs, and resubmit the
   sitemap in Search Console.
5. Environment note: to make these checks I switched this session to your
   saved environment `qpdf-production-checks` and added `ircc.canada.ca`,
   `www.canada.ca`, `laws-lois.justice.gc.ca`, `college-ic.ca` and
   `www.priv.gc.ca` to its allowlist (you approved both). Remove them in
   Settings if you do not want them kept.
