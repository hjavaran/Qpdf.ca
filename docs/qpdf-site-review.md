# Qpdf.ca site review

**Date:** 2026-11-10 · **Reviewed:** repo HEAD `afe57b0` and the live site (build `2026-11-07-a580bfcb`, which matches HEAD) · **Scope:** review only; no site code was changed.

Six reviewers worked in parallel from one shared brief (Appendix A): SEO, design, competition, outreach, usability, and technical trust. Every finding cites a file, live URL or external source. Where something could not be checked, it says so. Effort tags: **quick** (under an hour to a couple of hours), **half day**, **multi-day**.

---

## 1. Executive summary

**The privacy claim holds.** Across 17 tool runs on the live site with a marker string in the file name and content, no request carried file bytes, the file name or document text. The only non-GET request anywhere was the Cloudflare Web Analytics page-view beacon. Compress, merge, protect and redact also worked with the network cut. Redaction removes text from the content stream, and password protection is AES-256.

**The positioning needs one correction.** The site calls itself a general-purpose toolkit (`about.html`), and its 15 guides are split between Canadian court filing and IRCC immigration uploads. The audience is legal *and* immigration, both Canadian. The homepage names neither: its H1 is "Simple. Private." and it never says "Canada", "lawyer", "immigration", "free" or "offline" in the body text.

**What stands between the site and a lawyer's trust is not the engineering.** It is four things:

1. **Nobody is named.** The only operator shown is a link to wealththeory.ca. There is no legal entity, person, address or email. This blocks trust, CASL-compliant email, institutional listings and author credit on legal guides at once.
2. **Small defects in exactly the wrong places.** The Workflow Builder renders at 0px height. Sign PDF saves the user's signature in browser storage by default, which the privacy page says does not happen. The privacy page still describes a default favourite that was removed, and says the contact-form host is reachable only on the contact page when the CSP allows it everywhere.
3. **The proof is quieter than competitors' weaker claims.** At the drop zone, "Your files never leave your device" is the smallest text on the page. The offline test is a click away at the bottom of the homepage.
4. **Search can't find it yet.** No evidence of indexing was found (not proof: Search Console is needed), the brand query is owned by the qpdf library, and a full duplicate is live at `qpdf.pages.dev`.

**Where it can win.** No one else found pairs browser-local processing with Federal Court, ONCA, BC PD-72 and IRCC content. Qpdf.ca's CSP is tighter than upstream BentoPDF's, it has no ads, caps or accounts, and it refuses to show compliance badges it hasn't earned. "Compress PDF without uploading" and similar queries have weak search results with no major brand.

**Where it is behind.** Upstream BentoPDF is free, has the same tools, ships French, has testimonials and claims zero analytics. Qpdf.ca has no French at all, which is awkward for a Canadian product. It has no e-signature workflow, desktop app, SLA or certification, and first-run engine downloads are large (6 MB for compress, 61 to 77 MB for conversions).

**Recommended order:** fix the trust defects and name the operator first (days), then homepage and search basics (weeks 1 to 4), then audience pages and low-risk outreach (month 2), then French and build provenance (month 3). Do not post to Hacker News or email firms until the first group is done; those audiences will find the defects in minutes.

---

## 2. Top 10 actions, ranked by impact against effort

| # | Action | Why | Effort | Source |
|---|---|---|---|---|
| 1 | **Name the operator.** Legal entity, a named person and role, city or mailing address, direct email, on `/about/`, the footer and `/contact/`; add `Organization` JSON-LD. | Unblocks trust, CASL email, listings, guide authorship. Flagged independently by four reviewers. | half day (mostly a decision) | Design H2, Outreach, SEO H4/M1, Competition |
| 2 | **Make the privacy page true again.** Fix `privacy.html:110`; list `pdfjs.signature`, `ec.userDict` and workflow templates as stored items; correct the Web3Forms sentence. Untick "Save signature" by default in Sign PDF. | The page whose job is credibility has three inaccurate statements. On a shared firm PC the next user can stamp the previous user's signature. | quick to half day | Tech H1, M1, M2 |
| 3 | **Fix the Workflow Builder layout.** `src/pages/pdf-workflow.html:199-200` keeps `h-[100dvh] overflow-hidden` on `<body>`; `#workflow-app` measures 0px at 1280×800 (re-confirmed). | A visibly broken page undermines everything else. | quick | Design H1 |
| 4 | **Shrink the network surface on tool pages.** Don't load the analytics beacon on tool pages; allow `api.web3forms.com` in CSP only on `/contact/`; turn off Cloudflare NEL. | Then "no third-party code runs next to your document" becomes literally true and checkable. Keeps analytics on content pages for measurement. | half day | Tech H2, H3, M3 |
| 5 | **Rewrite the homepage hero and add links below it.** New H1, title, lede and trust row (text in §4.1 and §4.2); add category link blocks and "For court filing" / "For IRCC uploads" guide blocks under the search. | The strongest page targets no keyword or audience and links to 8 of 125 tools; 21 tool pages have no inbound links outside hubs. | half day | SEO H1, H2; Design H4 |
| 6 | **Get indexed and remove the duplicate.** Verify Search Console and Bing, submit the sitemap, request indexing for 20 URLs; redirect or noindex `qpdf.pages.dev`. | Nothing else in SEO matters until this is confirmed. | quick | SEO H4, H5 |
| 7 | **Put the promise where the file is dropped, and confirm it at the result.** Larger "Processed on this device. Nothing is uploaded. Verify offline →" line in every drop zone; reuse Compress's "Nothing was uploaded" note on every result; add `-redacted`, `-protected` suffixes to output names. | The claim is the product; it is 12px grey at the decisive moment. Same-name outputs invite sending the unredacted file. | half day | Design H3, H5; Tech M5 |
| 8 | **Retitle top tool pages for "without uploading" and deepen 15 money pages.** | "Privately" is not what people type; the "without uploading" results have no major brand. Median landing copy is 132 words, 55 of them shared. | quick (titles) + multi-day (copy) | SEO H6, H3 |
| 9 | **Publish `/for-firms/` (security summary for IT reviewers) plus `/for/lawyers/`, `/for/immigration-consultants/` and `/library/`.** | Gives outreach somewhere to land, gives each channel a measurable path (UTMs are invisible to Cloudflare Web Analytics), and targets audience keywords. | half day each | Outreach, SEO, Competition |
| 10 | **Make the build verifiable.** Stamp the Git commit into `sw.js` and the footer, publish a SHA-256 manifest of `dist/`, add `/.well-known/security.txt`. | A sceptical reviewer currently cannot tie the live JavaScript to the public source. | half day | Tech H4, M8 |

Next in line, not in the top 10: staged French (five tool pages and three IRCC guides), the first outreach wave (AlternativeTo, Courthouse Libraries BC, public libraries), and a licence review of upstream's producer-line expectation.

### Conflicts between reviewers, and the recommended side

| Conflict | Positions | Recommendation |
|---|---|---|
| **Analytics** | Competition: drop it or make it opt-in to match BentoPDF's "no analytics". Tech: remove it from tool pages. Outreach: it is the only measurement there is. | **Remove from tool pages only.** Keep it on home, guides and landing pages. This makes the tool-page claim clean and keeps channel measurement. |
| **Homepage H1** | SEO: "Private PDF tools that never upload your files", with "Simple. Private." as an eyebrow. Design: use the OG image line, "Private PDF tools. Simple by design." The owner simplified the hero three days ago (commit `7a10a97`). | **SEO's version.** It carries the "never upload" phrase that the weak search results reward, and keeps the owner's line as the eyebrow. Then update the OG image to match. |
| **Simple homepage vs more links** | The recent simplification cut the homepage to 8 tools. SEO wants category and guide links. | **Keep the hero and search as they are; add plain text link blocks below "Popular tools".** The first screen stays simple. |
| **French scope** | Competition: restore the full upstream French UI (High). SEO: start with five tool pages and three guides. | **Staged.** Use upstream's French strings for those five tools so pages are not half-translated. A full 125-tool French site is a maintenance load for one person. |
| **"Qpdf.ca vs BentoPDF" page** | Competition: publish it (High). | **Publish the upload-tool comparison first** (iLovePDF, Smallpdf). Handle BentoPDF in an FAQ entry and on `/about/`. A dedicated page mostly advertises a free upstream that has French and testimonials. |
| **Sitemap `lastmod`** | `docs/STAGE-2-HANDOFF.md` omits it for tools rather than fake dates. SEO: derive from `git log`. | **Derive from Git.** It is honest and covers all 150 URLs. |
| **Thin Office-format pages** | Noindex ODG/ODP/ODS/WPS/PUB/VSD now, or leave. | **Leave** until Search Console shows "Crawled, currently not indexed". |
| **Show HN and cold email timing** | Outreach rates Show HN High. The user asked for cold email. | **Both wait for actions 1 to 4.** Cold email also needs a name and mailing address under CASL. |
| **Workflow page** | Design: noindex or unlink until fixed. | **Just fix it;** it is a two-line CSS change. |

One reviewer flag was checked and closed: SEO noted that `docs/STAGE-2-HANDOFF.md` and `docs/SEO-STAGE2-FINAL-AUDIT.md` say the RCIC and BC PD-72 guides are withheld, yet both are live. Commit `5bfac80` and `docs/QPDF_Stage2_Held_Articles_Final_Verification_Report.md` record owner approval on 2026-11-07. Only the two older docs are stale.

---

## 3. Quick wins (under an hour each)

**Trust and accuracy**
- [ ] `privacy.html:110`: delete "(Compress PDF by default)".
- [ ] `privacy.html:108-114`: add the saved signature, the Edit PDF Text user dictionary and saved workflow templates to "What Qpdf.ca stores in your browser".
- [ ] `privacy.html` (~line 66): say the CSP allows the form host on every page until the per-page CSP ships.
- [ ] `src/pages/pdf-workflow.html:199-200`: remove `h-[100dvh] overflow-hidden` from `<body>`; give `#workflow-app` `h-[calc(100dvh-140px)] min-h-[560px] flex-none`.
- [ ] `src/pages/compress-pdf.html:141`: delete or replace "Smaller PDFs. Superior quality. Complete privacy." (also has a stray space before a period).
- [ ] `src/data/tools.mjs:98`: make the compress steps match the UI labels (Low / Medium / High / Lossless).
- [ ] `docs/LICENSING.md:23`: the repo is public now; update. Update the two stale "withheld guides" notes.
- [ ] Cloudflare dashboard: turn off Network Error Logging.
- [ ] Add `/.well-known/security.txt` with a contact address.

**Search**
- [ ] Verify Google Search Console and Bing Webmaster Tools; submit `sitemap.xml`.
- [ ] Redirect `qpdf.pages.dev/*` to `https://qpdf.ca/$1` (first confirm that Pages project is yours).
- [ ] `src/data/site.mjs:32`: title → "Free Private PDF Tools — No Upload, Works Offline | Qpdf.ca".
- [ ] `src/data/site.mjs:92`: "PDF Guides — Qpdf.ca" → "PDF Guides for Canadian Court Filing and IRCC Uploads | Qpdf.ca".
- [ ] `src/data/site.mjs:38`: "All PDF Tools — Qpdf.ca" → "125 Free PDF Tools That Run in Your Browser | Qpdf.ca".
- [ ] Retitle `/compress-pdf/`, `/merge-pdf/`, `/redact-pdf/` with "Without Uploading" (exact titles in §4.1 H6).
- [ ] `src/data/tools.mjs:1699`: lengthen the `/pdf-to-word/` description (text in §4.1 M4).
- [ ] Replace 26 "QPDF.ca" spellings in `content/guides/*.md` with "Qpdf.ca"; upper case is the library's name.
- [ ] `guides/index.html:19`: rename the second "PDF guides" heading to "General".

**Design**
- [ ] `src/js/qpdf/compress-ui.ts:314`: add `scroll-margin-top: 84px` to the result box so the headline isn't under the sticky header.
- [ ] `qpdf-theme.css:727`: `.qp-fav` `#b7b4ac` (2.07:1) → `#8f8c84`.
- [ ] `qpdf-theme.css:1522`: neutral disabled style for `#process-btn` instead of pink at 55% opacity.
- [ ] `qpdf-theme.css:1096`: `.qp-prose { max-width: 68ch }` (privacy and about run 104 to 114 characters per line).
- [ ] `public/theme-init.js:5`: fall back to `prefers-color-scheme` when nothing is saved.
- [ ] `qpdf-theme.css:1367`: dark-mode hero accent `#c82434` (3.26:1) → `#ff7d89`.
- [ ] Offline badge: "Preparing offline use… 53%" → "Ready to use · saving for offline 53%".
- [ ] `.qp-hero { overflow: hidden }` and hide the maple leaf below 768px.
- [ ] Mobile: `padding-block: .5rem` on `.qp-footer a` and `.qp-crumbs a`.

**Quality**
- [ ] `src/js/logic/protect-pdf-page.ts:109`: warn on very short passwords (a one-character password is accepted silently).
- [ ] Output names: add `-redacted`, `-protected`, `-sanitized`, `-no-metadata`.

**Outreach (no code)**
- [ ] Submit to AlternativeTo as an alternative to iLovePDF, Smallpdf and Acrobat.
- [ ] Record four weeks of baseline direct traffic and BC/Canada share before any campaign.

---

## 4. Full findings by reviewer

### 4.1 SEO and keywords

Method: all 150 sitemap URLs fetched and parsed; 5 pages loaded in Chromium; 12 web searches. **Volumes and difficulty are unverified** (no keyword tool). "Who ranks" comes from a non-Google search API on 2026-11-10.

**Already sound, don't redo:** 150/150 pages return 200 with a self-canonical, `index, follow`, one static H1, unique title and description, valid JSON-LD. Redirects work (www, http, no-slash, upstream slugs). Home transfers about 106 KB, a tool page about 535 KB.

#### High

**H1. Homepage targets no keyword, audience or country (quick).** `index.html:17` H1 is `Simple. <em>Private.</em>`; `src/data/site.mjs:32` title is "Qpdf.ca — PDF Tools Built for Privacy". About 260 words, none of them "free", "Canada", "lawyer", "immigration" or "offline".
- H1 → "Private PDF tools that never upload your files", with "Simple. Private." as an eyebrow above it.
- Title → "Free Private PDF Tools — No Upload, Works Offline | Qpdf.ca".
- Lede (`index.html:18`) → "Compress, merge, redact and convert PDFs in your browser. Files stay on your device. Free, no account, made in Canada."

**H2. Homepage links to 8 of 125 tools, no guides, no audience pages (half day).** 46 tool pages have at most one inbound link outside the three hubs; 21 have none, including `/word-to-pdf/`, `/excel-to-pdf/`, `/powerpoint-to-pdf/`, `/compare-pdfs/`, `/email-to-pdf/`, `/pdf-workflow/`. This disagrees with `docs/SEO-STAGE2-FINAL-AUDIT.md` §4 ("no orphan pages"): true by count, but hub-only. Add the 8 category headings with 4 to 6 text links each, plus "For court filing" and "For IRCC uploads" blocks with 3 guide links each. Add Word/Excel/PowerPoint to `related` for pdf-to-word, jpg-to-pdf and merge-pdf.

**H3. Thin, templated copy on most tool pages (multi-day, staged).** Median landing copy is 132 words, about 55 of them the shared privacy paragraph. The 13 Office pages are one template (`src/data/tools.mjs:1522-1523`); `/ods-to-pdf/` and `/odp-to-pdf/` are identical except the format token. Compress presets are 63 to 70% similar.
1. Write 250 to 400 unique words and 3 to 5 visible Q&As for 15 pages: compress, merge, split, redact, bates, ocr, sign, word/excel/ppt-to-pdf, pdf-to-word, jpg-to-pdf, remove-pdf-metadata, password-protect, flatten.
2. Give each size preset one concrete use case (the 4 MB page already does).
3. Leave the minor Office formats alone unless Search Console shows them unindexed.

**H4. No sign of indexing; the brand query belongs to the qpdf library (half day plus ongoing).** Searches for `qpdf.ca` and the homepage title returned only qpdf.sourceforge.io, Wikipedia, Debian and readthedocs. Not proof of non-indexing. Actions: Search Console and Bing; `Organization` JSON-LD with `alternateName`, logo, `sameAs` GitHub (`scripts/qpdf/context.mjs:329` emits a bare `WebSite`); always pair the brand with a descriptor; fix the "QPDF.ca" spellings; earn first links. Don't try to rank for bare "qpdf".

**H5. `https://qpdf.pages.dev/` serves a full indexable copy (quick).** Same build id, `index, follow`, canonical to qpdf.ca. Redirect it or send `X-Robots-Tag: noindex` on that host. Ownership of that Pages project is inferred, not confirmed.

**H6. Target "no upload" modifiers (quick).** The results for "compress PDF without uploading" are dev.to posts, Product Hunt and hobby sites.
- `/compress-pdf/` → "Compress PDF Without Uploading — Free, In-Browser | Qpdf.ca"
- `/merge-pdf/` → "Merge PDF Without Uploading — Combine Files Offline | Qpdf.ca"
- `/redact-pdf/` → "Redact PDF Without Uploading — Permanent Redaction | Qpdf.ca"

#### Medium

- **M1. No author or reviewer on legal and immigration guides (half day).** Article JSON-LD has `author: Organization` (`scripts/qpdf/context.mjs:391`). Add a named person, bio page and `Person` author.
- **M2. Docs contradict the live site on two guides.** Resolved: owner approval is recorded in commit `5bfac80`. Update the stale docs.
- **M3. Generic hub titles (quick).** See quick wins.
- **M4. Weak titles and descriptions on about 25 converter pages (half day).** Example: "BMP to PDF Converter | Qpdf.ca" is 30 characters with a 61-character description. `/pdf-to-word/` description → "Convert PDF to an editable Word DOCX in your browser — free, no upload, no account. Scanned PDFs: run OCR first."
- **M5. Leftover upstream marketing and mismatched steps (quick).** `src/pages/compress-pdf.html:141`; `src/data/tools.mjs:98`.
- **M6. `lastmod` on only 15 of 150 URLs (half day).** `scripts/qpdf/postbuild.mjs:139-144`. Derive from `git log -1`; drop `<priority>`.
- **M7. French: nothing exists (multi-day).** `/fr/` is 404, no hreflang. The French IRCC results are weak. Start with five tool pages and three IRCC guides.
- **M8. Structured data.** `WebApplication` + `BreadcrumbList` is valid and enough. Add visible FAQ content, but don't expect FAQ or HowTo rich results. Keep avoiding `aggregateRating` without real reviews.

#### Low

- Two guides use sentence-case titles, 13 use title case.
- One shared `og:image` for all 150 pages.
- Tool pages load 15 small module scripts and 58 KB of render-blocking CSS; fine unless field data complains.
- `/compress-pdf-to-1mb/` redirects to `/compress-pdf/`; `/combine-pdf/` and `/pdf-compressor/` are 404. Restore a 1 MB preset; add "combine" to the merge copy.

#### Keyword targets

| Keyword | Intent | Who ranks now | Qpdf page | Difficulty (estimate) |
|---|---|---|---|---|
| compress pdf without uploading | tool | dev.to, Product Hunt, hobby sites | /compress-pdf/ | Low |
| merge pdf without uploading / offline | tool | dev.to, a Chrome extension | /merge-pdf/ | Low |
| ircc pdf upload limit 4 mb | info | ircc.canada.ca, moving2canada, visafalcon | /guides/ircc-pdf-upload-limits/ | Medium |
| compress pdf to 4mb for ircc | tool | visafalcon, a pages.dev site | /compress-pdf-to-4mb/ | Low to medium |
| ircc pdf "please wait" error | info | IRCC help, Adobe community | existing guide | Medium |
| bates numbering without acrobat / free | tool | wildandfreetools, SysTools, Aryson | /bates-numbering/ + guide | Medium |
| federal court e-filing pdf requirements | info | fct-cf.ca only | existing guide | Low (aim for positions 2 to 5) |
| ontario court of appeal pdf bookmarks | info | ontariocourts.ca | existing guide | Low |
| redact pdf permanently free offline | tool | PDFgear, UPDF, Adolix | /redact-pdf/ | Medium |
| private pdf tools canada / for lawyers | commercial | Capterra listings, pdfcanada.ca | new /for/lawyers/ | Medium |
| compresser pdf 4 mo ircc | tool (FR) | pdnob, app stores | new /fr/ page | Low |
| remove metadata from pdf before sending | info | not sampled | metadata guide | Unverified |

Avoid chasing "compress pdf", "merge pdf", "pdf to word", "pdf editor".

#### Proposed pages

| Slug | Target keyword | Type | Links to |
|---|---|---|---|
| /for/lawyers/ | private PDF tools for lawyers (Canada) | audience | bates-numbering, redact-pdf, remove-pdf-metadata |
| /for/immigration-consultants/ | PDF tools for RCICs | audience | compress-pdf-to-4mb, merge-pdf, RCIC guide |
| /for/accountants/ | compress and password-protect client tax PDFs | audience | password-protect-pdf, compress-pdf-for-email |
| /compress-pdf-for-ircc/ | compress PDF for IRCC | tool preset | compress-pdf-to-4mb, limits guide |
| /compress-pdf-to-1mb/ (restore) | compress pdf to 1mb | tool preset | compress-pdf |
| /guides/qpdf-ca-vs-ilovepdf-smallpdf-privacy/ | does iLovePDF upload your files | comparison | compress-pdf, /privacy/ |
| /guides/is-it-safe-to-upload-pdf-online/ | is it safe to use online PDF tools | guide | /privacy/ |
| /guides/express-entry-document-pdf-checklist/ | Express Entry documents PDF size | guide | merge-pdf, compress-pdf-to-4mb |
| /guides/bc-cso-efiling-pdf-requirements/ | Court Services Online PDF requirements | guide | pdf-to-pdfa, ocr-pdf |
| /guides/ontario-caselines-pdf-bookmarks/ | Case Center / CaseLines bookmarks PDF | guide | edit-pdf-bookmarks |
| /guides/cra-my-account-pdf-upload-size/ | CRA submit documents file size | guide | compress-pdf (verify the limit first) |
| /faq/ | is Qpdf.ca the same as qpdf | FAQ | /about/, top 5 tools |
| /fr/compresser-pdf/ | compresser PDF sans téléverser | FR tool | compress-pdf |
| /fr/guides/limite-taille-pdf-ircc/ | taille maximale fichier IRCC | FR guide | /fr/compresser-pdf/ |

#### Could not verify (SEO)

Google and Bing index status; search volumes; ownership of `qpdf.pages.dev`; field Core Web Vitals; Google Rich Results Test output; CRA and BC CSO limits for the proposed guides.

---

### 4.2 Design

Screenshots were taken of 16 pages and 7 loaded tools at 1280 and 390 wide, light and dark.

**Verdict on trust: not yet.** The craft is good enough: Qpdf's own pages are calm and consistent, nothing looks scammy, there are no ads, and `/privacy/` is unusually honest ("not independently audited"). What stops a lawyer is identity and placement. Smallpdf puts "made in Switzerland" and a user count beside its drop zone; Qpdf has the stronger claim and presents it more quietly.

#### High

**H1. Workflow Builder is visually broken (quick).** `#workflow-app` renders 0px tall at 1280×800, 1440×900 and 390×844; the "About" cards sit on the toolbar. Cause: `src/pages/pdf-workflow.html:199-200` keeps upstream's `h-[100dvh] flex flex-col overflow-hidden` on `<body>`, then line 335 adds the landing section and footer inside it. Re-confirmed independently at 1280×800.

**H2. No identifiable operator (half day, mostly copy).** `about.html:52-56` and `src/partials/footer.html:19` say only "Developed by wealththeory.ca / Made in Vancouver, BC"; that site's title is "Wealth Theory - Business Plans & Strategy". Replace with "Who runs Qpdf.ca": legal entity, named person and role, address, direct email, governing privacy law. Footer → "Operated by <Legal Name>, Vancouver, BC · hello@qpdf.ca".

**H3. The promise is weakest where the file is dropped (half day).** `src/pages/compress-pdf.html:60` (same on every tool): "Your files never leave your device." is 12px `#6c6a64`. The strong privacy card is below the fold on desktop and about three screens down on phones. Proposed: a 14px line with a green shield icon, "Processed on this device. Nothing is uploaded. **Verify offline →**", linked to `/privacy/#test-it-yourself`. On phones, move `.qp-block-privacy` first (`order: -1` at ≤767px).

**H4. Homepage undersells the proof (quick).** `index.html:28-31`: the trust row is two 13.76px grey items, one of them "Free to use". Proposed items: "Files never leave your device", "Works offline: test it" (link), "Open source (AGPL)" (link), "No account, no ads". The "How local processing works / Test it offline" links at `index.html:80-83` are the best trust asset and sit at the very bottom; move them into the hero.

**H5. Compress result headline hides behind the sticky header (quick).** `src/js/qpdf/compress-ui.ts:314` uses `scrollIntoView({block:'nearest'})` with no `scroll-margin-top`. The note "…saved as test-compressed.pdf. Nothing was uploaded." is excellent but tiny; enlarge it and reuse it on every tool.

#### Medium

- **M1. Upstream marketing block reads as templated (quick).** `src/pages/compress-pdf.html:141`.
- **M2. Embedded editors are not re-themed (multi-day).** Redact/Edit use an indigo accent; Sign uses the stock PDF.js grey toolbar, breaks out of the card, and its CTA spans 1250px. Minimum: map the accent to `--qp-accent`, wrap in the card radius, cap CTAs near 480px.
- **M3. The drop zone stays full-size after a file loads (half day).** It pushes the work down about 440px on desktop and a full screen on phones. Collapse it to an "Add another file" row.
- **M4. Tool card widths vary (half day).** Compress about 1060px, Bates about 670px, editors about 1250px, wider than the 1132px page wrap. Standardise on two widths.
- **M5. Inconsistent form controls and label case (half day).** Upstream inputs are filled `#eceae5` and look disabled; labels are Title Case ("Bates Starts From", "Clear All") against Qpdf's sentence case. One input rule in `qpdf-theme.css` plus a sentence-case pass over the locale strings.
- **M6. Dark mode ignores the OS preference; one contrast miss (quick).** `public/theme-init.js:5`; `qpdf-theme.css:1367`.
- **M7. Favourite stars too faint (quick).** 2.07:1 at `qpdf-theme.css:727`.
- **M8. Disabled primary button looks like a washed-out error (quick).** About 2.8:1 at `qpdf-theme.css:1522`. Add helper text "Select a PDF to start".
- **M9. Long-form lines too wide (quick).** 104 to 114 characters on `/privacy/` and `/about/`.
- **M10. Guides have no author (half day).** Add "Written by <name>, <role>", a one-line "not legal advice" note, and human date formats.

#### Low

- Mobile tap targets: footer links 18px tall, breadcrumbs 17px, tool favourite button 36×25. No horizontal overflow anywhere at 390px; the mobile nav works.
- Maple leaf is cropped at the right edge with the stem hanging into "Popular tools".
- OG image says "Private PDF tools. Simple by design."; the live H1 says "Simple. Private.". Align them.
- At 32px the logo's Q reads as a search icon; thicken the stroke for the favicon only.
- Offline badge wording can read as "not ready".
- Contact page has a blank column; put the direct email and response time there.

**Already fine (measured):** body text 12.67:1, muted 5.44:1, links 6.97:1, dark body 12.06:1. DM Sans hierarchy is consistent on Qpdf-authored pages. The 404 page is useful.

#### Could not verify (design)

Favicon and OG card in real apps; result states for tools other than Compress; dark mode on inherited tools beyond Compress; real-device iOS Safari behaviour; who wealththeory.ca is beyond its page title.

---

### 4.3 Competition

All pages seen 2026-11-10. Prices are quoted only where the pricing page loaded.

#### Per competitor

**BentoPDF (upstream, most direct rival)** — bentopdf.com
- Near-identical tools. Only Timestamp PDF is missing from Qpdf, disabled because it needs a third-party proxy (`src/data/tools.mjs:2035-2038`).
- "$0 Forever Free"; commercial licence "$79 one-time".
- **Ahead of Qpdf:** 24 UI languages including French; homepage testimonials including a legal user; claims no cookies or analytics; Docker self-hosting.
- **Weaker than Qpdf:** its live CSP permits `cdn.jsdelivr.net`, Google Fonts, `api.github.com`, `rawcdn.githack.com` and a CORS proxy, where Qpdf allows only itself, `assets.qpdf.ca`, Cloudflare Insights and Web3Forms. It has "Sponsored / Advertise here" slots and shows "GDPR / CCPA / HIPAA compliance" blocks. No Canadian content.

**iLovePDF.** Premium "5 US$ / month" billed annually, 9 monthly. Server upload; "deleted within two hours"; ISO 27001; Europe-based. Ads on free; no Bates tool seen.

**Smallpdf.** Prices not readable (rendered client-side). Free tier has a daily download limit; Edit Text, OCR and strong compression are Pro. Upload; files deleted "within one hour unless you save them"; discloses Facebook Pixel. Has an e-signature flow with certificate of completion, and French.

**Adobe Acrobat.** adobe.com returned 403; no verified price or limits. The legal default for Bates, redaction, PDF/A and e-sign.

**PDF24.** Free with ads; web tools upload to EU servers, deleted within one hour. PDF24 Creator is free, offline, Windows-only: the strongest free offline rival for Windows firms.

**Sejda.** "Week Pass $5", "Monthly $7.50", "Desktop+Web Annual $63". Free: 200 pages or 50 MB and 3 tasks per hour. Has Bates numbering and a strong text editor.

**Stirling-PDF.** Free self-hosted, 60+ tools; "Team $99/month"; Enterprise with air-gapped deployment, audit logs and SLAs. The private choice for firms with IT.

**Other local-first tools.** LocalPDF: browser-local, 3 downloads a day free, "Pro Lifetime $19", already has "For lawyers" and comparison pages. pdfux: free, in-browser, about 45 tools including Bates and Redact. PDFgear: free apps on all platforms, closed source.

**Legal incumbents.** Foxit ("$159.99 per user per year" by its own claim), Tungsten Power PDF (no price found), Nitro (no amounts loaded), Bundledocs ("from £34/mo", Canadian Azure region, builds indexed court bundles), CaseLines (court-side platform, not a prep tool).

#### Comparison table

| Tool | Processing | Price | Account | Limits | Ads | Open source | Offline | Bates / true redaction / PDF/A | Canadian / French |
|---|---|---|---|---|---|---|---|---|---|
| **Qpdf.ca** | Browser-local | Free | No | Device memory | No | AGPL | Yes | Yes / yes / yes (best effort) | Canadian content; English only |
| BentoPDF | Browser-local (CDN engines permitted) | Free; $79 commercial | No | None | Sponsor slots | AGPL | Yes | Yes / yes / yes | No / French UI |
| iLovePDF | Upload, deleted in 2 h | US$5 to 9/mo | Premium | Unpublished | Free tier | No | Desktop app | No Bates seen / redact / yes | No / French UI |
| Smallpdf | Upload, deleted in 1 h | Not verified | Some features | Daily cap | Not checked | No | Not checked | No Bates seen / redact / listed | No / French UI |
| Adobe | Cloud and desktop | Not verified | Yes | Not verified | No | No | Desktop | Yes (Pro, general knowledge) | French UI |
| PDF24 | Upload 1 h EU; Creator local | Free | No | None | Yes (web) | No | Creator | No Bates seen | No / French UI |
| Sejda | Upload 2 h; desktop local | $5/wk, $7.50/mo, $63/yr | No | 3 tasks/h, 50 MB | Not checked | No | Desktop | Bates yes | No |
| Stirling-PDF | Self-host, desktop, hosted | Free; $99/mo team | Hosted | Credits | No | Yes (per its site) | Yes | Redact yes | No |
| LocalPDF | Browser-local | Free; $19 lifetime | No | 3 downloads/day | No | Not seen | Yes | Not checked | No |
| pdfux | Browser-local | Free | No | None seen | No | Not verified | Not verified | Bates yes / redact yes / no PDF/A | No |
| Foxit, Power PDF | Desktop | $160/yr (Foxit) | Yes | n/a | No | No | Yes | Yes | Not checked |
| Bundledocs | Cloud, Canada region | From £34/mo | Yes | n/a | No | No | No | Bundle pagination | Canadian data option |

#### Where Qpdf.ca can differentiate

1. **Checkable privacy:** no third-party script hosts for engines, the offline test, and no unearned badges. No rival pairs "verify it yourself" with "we are not audited".
2. **Canadian legal and immigration content:** nobody else has Federal Court, ONCA, BC PD-72 or IRCC guides.
3. **No caps, ads or account.**
4. **The legal bundle, free and local:** Bates (`tools.mjs:793`), redaction (`:2002`), sanitize and metadata removal (`:1979`), PDF/A (`:255`), compare, WordPerfect to PDF.
5. **Regulatory framing without overclaiming.** None of these rules bans upload tools:
   - LSO Rule 3.1-2 commentary [4A]: a lawyer "should understand the benefits and risks associated with relevant technology".
   - PIPEDA Sch. 1 cl. 4.1.3: an organization remains responsible for information "transferred to a third party for processing".
   - Quebec P-39.1 s. 17: a privacy impact assessment before communicating personal information outside Quebec.
   - Honest line: with local processing there is no transfer to a processor, so those assessments are not triggered for the PDF step. Never say "PIPEDA compliant" or "law society approved".

#### Where Qpdf.ca is behind

- **French UI.** Upstream ships it; Qpdf removed it (`docs/STAGE-2-HANDOFF.md:108-110`).
- **E-signature workflows:** self-sign and certificate signing only; no requests or audit trail.
- **PDF to Word and OCR quality:** the registry admits "Complex layouts may not convert perfectly"; OCR is Tesseract, English and French.
- **Large files and first-run downloads.**
- **No apps, SSO, SLA, DPA or certifications.**
- **Brand trust:** no testimonials or named people.
- **No bundle builder** (index, tabs, hyperlinked contents in one flow), though the parts exist.

#### Is the fork a risk or an asset?

Both. It supplies a 125-tool engine and a public-source lineage. But on features alone Qpdf loses to a free upstream with French. Edit and Redact depend on upstream prebuilt artefacts (`SOURCE-NOTICE.md`). Upstream's licensing page says AGPL users "should… retain the producer line in all PDFs"; whether Qpdf's output complies was not checked, and Remove Metadata blanks Producer (`src/js/logic/remove-metadata-page.ts:34`). **Get a licence review.**

Positioning: don't compete on tools. "BentoPDF's engine, hardened and documented for Canadian legal and immigration work."

#### Comparison pages worth publishing

1. Qpdf.ca vs iLovePDF / Smallpdf (upload vs local, quoting their own retention pages with dates).
2. Qpdf.ca vs Adobe Acrobat Pro for Bates and redaction (say what Acrobat does better).
3. Qpdf.ca vs PDF24 Creator / Sejda Desktop (install vs no install; concede large files).
4. Browser-local tools compared, framed as "how to verify each".
5. Qpdf.ca vs BentoPDF (see the conflict table: an FAQ entry is recommended instead).

Cautions: names in plain text only, no logos, "not affiliated", date and link every claim, never call rivals "unsafe", never publish a price not seen that day.

#### Recommendations (competition)

- **High:** French (multi-day); homepage around the verifiable differentiators (half day); upload-tool comparison page (half day); remove upstream marketing blocks (half day); licence review (half day).
- **Medium:** a "court bundle / exhibit book" guided workflow preset (multi-day); "For law firms" page with the citations above (half day); named maintainer, changelog, security contact, testimonials (half day).
- **Low:** installable-PWA messaging as the "desktop app" answer (quick); honest PDF-to-Word and OCR benchmarks (multi-day); Docker or self-host instructions (half day); timestamping via a Qpdf-owned proxy (multi-day).

#### Could not verify (competition)

Adobe pricing, limits and retention first-hand; Smallpdf prices; Nitro, Tungsten and Clio prices; whether BentoPDF actually fetches from jsDelivr at runtime (only that its CSP permits it); LocalPDF and pdfux licences; whether competitors without a visible Bates tool have one elsewhere.

---

### 4.4 Offline and outreach growth

Nothing was sent or posted. Payoff figures are guesses.

#### What limits everything else

- **UTM tags are invisible.** Cloudflare Web Analytics does not log query strings. Data is unsampled for 7 days only.
- **The beacon skips visitors** sending Do Not Track or Global Privacy Control (`src/js/qpdf/site.ts`). Privacy-minded audiences will be undercounted.
- **Email clicks and QR scans send no referrer**; they appear as direct traffic unless they land on a dedicated path.
- **The site has no named human.** CASL needs a name and mailing address; institutions won't list an anonymous tool.

#### High

| # | Idea | Target | Pitch | Measure | Effort | Payoff (guess) |
|---|---|---|---|---|---|---|
| H1 | Outreach prerequisites (list below) | n/a | n/a | n/a | multi-day | Unlocks the rest |
| H2 | Show HN | news.ycombinator.com/showhn.html | "Check it yourself"; link the verify guide and repo. Disclose the BentoPDF fork up front | Referrer; GitHub stars | half day + a day of replies | A few thousand visits in a day, or near zero. Expect criticism of `unsafe-eval` and the fork |
| H3 | AlternativeTo | "Suggest new application", then as an alternative on iLovePDF, Smallpdf, Acrobat | Open source, no upload, offline | Referrer | quick | Slow trickle; durable link |
| H4 | Courthouse Libraries BC | librarian@courthouselibrary.ca (published on its contact page) | PD-72 and exhibits guides for self-represented litigants; offer a short webinar | Referrer; guide views | half day | One listing reaches BC public libraries. Maybe 20% reply odds |
| H5 | Public libraries and settlement agencies | Digital-literacy or newcomer staff (no contacts verified) | The three IRCC guides plus a printable handout with QR | QR to `/library/` | half day for 10 emails | Best fit for a free tool; tens of visits a week per adopting library |
| H6 | Slaw | slaw.ca contact form | A non-promotional tip, "Black boxes are not redaction" | Referrer | half day | Small traffic, large credibility; low odds for an unnamed author |

#### Medium

| # | Idea | Target | Pitch | Effort | Payoff (guess) |
|---|---|---|---|---|---|
| M1 | Cold email to small firms | 20 to 30 hand-picked BC firms whose own site publishes an address | Bates and PD-72 guides for litigators; RCIC checklist for RCICs; metadata checklist for accountants | half day per batch | 2 to 5% reply rate. Replies are the cheapest user research available |
| M2 | Paralegal programs | Capilano University School of Legal Studies; VCC legal administrative assistant certificate (no coordinator names found) | `prepare-pdf-exhibits` as a free lab exercise; students can't afford Acrobat Pro | half day | One instructor yields a cohort a year |
| M3 | awesome-privacy | Pull request to `awesome-privacy.yml` | File Converters or Metadata Removal | quick | Requires a stable release older than 4 months; warns under 100 stars |
| M4 | CAPIC | membership@capic.ca | RCIC checklist as a member resource | half day | Low odds without a member champion |
| M5 | Vancouver Legal Hackers | Meetup group (2026 activity unconfirmed) | "Watch the Network tab while I redact" | half day | A route to a lawyer willing to vouch |
| M6 | LinkedIn posts from a named founder | Own profile | Teach first, link second | quick each | Depends on network |
| M7 | Product Hunt | Standard launch | As Show HN | half day | Poor audience fit; do once for the link |

#### Low

- **Law societies.** LSBC states it "does not approve specific technology products". Don't pitch for a listing.
- **Privacy Guides.** Needs a threat model and security whitepaper; use the forum for critique.
- **Reddit and Canadavisa.** Rules could not be read, so none is recommended yet. Answer IRCC size questions without a link first.
- **CBA sections, CLE providers, CPA bodies, notary societies.** Sponsorship-driven; no route verified.
- **Conference tables, posters, app stores.** Cost or engineering with unclear return.
- **University IT and privacy offices.** They will ask for the security summary, and often French.

#### CASL: what a compliant cold email needs (not legal advice)

The CRTC pages blocked direct fetch; these points come from search summaries. **Read the originals before sending** (CRTC FAQ and implied-consent guidance; the Act, s. 6(2)).

- Assume a free tool's promotional email is a "commercial electronic message" (not confirmed).
- **Consent without a prior relationship** rests on conspicuous publication, and all three must hold: the recipient or firm published the address themselves; no "no unsolicited email" notice beside it; the message is relevant to their business role.
- **Identification:** sender's name, business name, mailing address, and a phone, email or web contact, valid for 60 days.
- **Unsubscribe:** simple, free, honoured within 10 business days.
- **Burden of proof is on the sender.** Log per recipient: source URL, date, screenshot, relevance.
- Don't harvest from law-society directories; use the firm's own site.

A privacy tool that sends bulk mail contradicts its pitch. Hand-written, one-to-one, from a real qpdf.ca mailbox, no tracking pixels, no follow-up sequence, at most 10 a day.

#### Sample emails (148 words each, including subject and footer)

**1. Small law firm**

> Subject: Free Bates numbering and redaction tool that doesn't upload client files
>
> Hello [First name],
>
> I'm a developer in Vancouver. I built Qpdf.ca, a free PDF toolkit that runs entirely in the browser, so client documents are never uploaded to a server. No account, no advertising.
>
> I'm writing because [firm] lists [litigation / immigration] work, and two guides may save your staff time:
>
> - Bates numbering without Acrobat Pro: qpdf.ca/guides/bates-numbering-without-adobe/
> - BC Supreme Court PD-72 electronic record checklist: qpdf.ca/guides/bc-supreme-court-pd72-pdf/
>
> You can verify the no-upload claim yourself: load a tool, switch off Wi-Fi, and it still works. The source code is public.
>
> One ask: if you try it, would you reply with one thing that is missing or wrong?
>
> [Full name], [business name]
> [Mailing address] | [email] | [phone or web]
> This is a one-time message. Reply "unsubscribe" or use [unsubscribe link] and I will not contact you again.

**2. Public library**

> Subject: A free PDF tool for patrons compressing files for IRCC on library computers
>
> Hello [Name or "Digital Services team"],
>
> I'm a developer in Vancouver. Patrons applying to IRCC often need to shrink or merge PDFs to fit the upload limit, and on shared computers they usually end up uploading passports and bank statements to an unknown website.
>
> Qpdf.ca is a free alternative I built. It runs in the browser, uploads nothing, installs nothing, and needs no account. Open source, no advertising.
>
> This guide explains the IRCC limits and how to meet them: qpdf.ca/guides/ircc-pdf-upload-limits/
>
> One ask: would you consider adding that guide to your newcomer or technology-help resource list? I can send a printable one-page handout if useful.
>
> [Full name], [business name]
> [Mailing address] | [email] | [phone or web]
> This is a one-time message. Reply "unsubscribe" or use [unsubscribe link] and I will not contact you again.

Note for the library email: fix the Sign PDF saved-signature default (§4.6 H1) before pitching shared computers.

#### What the site lacks for outreach

1. Named human and business identity on About (quick).
2. `/for-firms/` or `/security/` for IT reviewers: data flow, CSP, third parties, the offline test, known limits, the fork's provenance (half day).
3. A one-page security summary PDF (half day).
4. A printable "Why not to upload client PDFs" handout with QR (half day).
5. `/educators/` and `/library/` landing pages (half day each).
6. A press kit: logo, screenshots, 50- and 100-word descriptions (quick).
7. Known trust dents fixed before any technical audience sees it.
8. A homepage that names the audiences.
9. French, before federal bodies, Quebec or many settlement agencies.
10. A tagged stable GitHub release and README screenshots.

#### Measurement plan

- **Per-channel landing paths, not UTMs.** A redirect won't register; the beacon needs a rendered page.
- **Referrer report** for web sources; screenshot within 7 days of each push.
- **A different guide per audience,** so a rise in that guide's views is a rough signal.
- **Four-week baseline** of direct visits and BC/Canada share first.
- **A spreadsheet** for replies, contact-form messages, GitHub stars, listings obtained, Search Console branded queries.
- **Not measurable:** who a visitor is, returns, which email was clicked, whether a tool was used.

#### Could not verify (outreach)

Any subreddit's or Canadavisa's rules; CRTC pages directly; whether a no-revenue tool's email is a commercial electronic message; submission routes at LSO, CBA, CICC, CPA bodies, notary societies; named coordinators at Capilano or VCC; Product Hunt's current rules; Vancouver Legal Hackers activity in 2026; the repo's age and stars against awesome-privacy's thresholds.

---

### 4.5 Usability

_Pending: the usability review was interrupted and is being re-run. This section will be filled in by a follow-up commit._

---

### 4.6 Technical trust and quality

**Verdict: the core claim holds.** Across 17 tool runs on the live site, no request URL or body contained file bytes, the file name or document text. The static audit found no reachable code path that transmits document data: the timestamp tool, CORS proxy and CDN defaults are disabled or neutralised. The weaknesses are around the claim, not in it.

#### Request log (live site, Chromium, marker string in file name and content)

| Tool (engine) | Result | Requests | Other origins | Non-GET | Marker in URL/body |
|---|---|---|---|---|---|
| compress-pdf (Hyper Compress) | ok | 199 | CF analytics ×2 | 1 beacon, 814 B | none |
| merge-pdf (CoherentPDF) | ok | 201 | same | 1 beacon | none |
| password-protect-pdf (qpdf) | ok | 178 | same | 1 beacon | none |
| remove-pdf-metadata | ok | 199 | same | 1 beacon | none |
| sanitize-pdf | ok | 205 | same | 1 beacon | none |
| pdf-to-pdfa (Ghostscript) | ok | 52 | same | 1 beacon | none |
| pdf-to-markdown / -word / -text (PyMuPDF) | ok | 70 / 74 / 69 | same | 1 beacon each | none |
| ocr-pdf (Tesseract) | ok | 233 | same | 1 beacon | none |
| redact-pdf / edit-pdf (PDFium) | ok | 258 / 251 | same | 1 beacon each | none |
| sign-pdf (PDF.js viewer) | ok | 451 | same | 1 beacon | none |
| digital-signature-pdf (cert with AIA/OCSP/CRL URLs) | ok | 205 | same; no chain or OCSP fetch attempted | 1 beacon | none |
| validate-pdf-signature | ok | 179 | same | 1 beacon | none |
| email-to-pdf (EML with remote images/CSS) | ok | 65 | same; zero remote attempts | 1 beacon | none |
| markdown-to-pdf (remote images, iframe) | preview only | 310 | attempts to remote hosts, all CSP-blocked | 0 | only in blocked URLs |
| word-to-pdf (LibreOffice) | ok in 6 s on retry; first run hung | 46 | + `assets.qpdf.ca` ×4 GET (48.8 + 28.6 MB) | 1 beacon | none |
| Offline after "Ready": compress, merge, protect, redact | all ok | 1 to 7, all from cache | none | 0 | none |

High request counts are the service worker pre-caching each tool. Beacon bodies were inspected: page URL, timings, browser engine, heap figures, site token. With Global Privacy Control set there were zero third-party requests.

Finding classes: (a) transmission of document data, (b) metadata or IP leak, (c) theoretical weakness, (d) inaccurate claim. **No class (a) finding.**

#### High

**H1. Sign PDF stores the signature in `localStorage` by default (d; quick).** The vendored PDF.js "Save signature" box is pre-ticked (`public/pdfjs-viewer/viewer.mjs:15390`) and writes to `pdfjs.signature` (`viewer.mjs:3222`). Reproduced live: the typed signature's description and outline survived a reload. `privacy.html:108` says Qpdf.ca "never stores your documents, their file names or text extracted from them" and the list omits this. On a shared workstation the next user can stamp the previous user's signature. Untick or disable saving, or clear the key on unload; disclose it either way.

**H2. The CSP is not an exfiltration barrier, and the privacy page overstates it (c, d; half day).** `connect-src` on every page includes `https://cloudflareinsights.com` and `https://api.web3forms.com` (`scripts/qpdf/postbuild.mjs:191`). `privacy.html` implies Web3Forms is reachable only on the contact page.
- Compromised first-party or dependency code **could** POST document text to `api.web3forms.com` with its own key (the CSP does not block this from `/compress-pdf/`; end-to-end delivery unverified), POST to the analytics endpoint, or navigate the tab to an attacker URL.
- It **could not** (tested) use `fetch`, `sendBeacon`, WebSocket or image requests to arbitrary hosts, or inject inline script.
- `'unsafe-eval'` is required by the engines and matters little while inline and remote scripts are blocked.
- Fix: per-path headers so Web3Forms is allowed only on `/contact/`; drop analytics origins from tool pages; reword the privacy page.

**H3. A third-party script runs inside every tool page (c; quick).** `src/js/qpdf/site.ts:64-69` injects `beacon.min.js` from `static.cloudflareinsights.com`, unversioned, so SRI is impossible. It runs in the same origin as the open document. Today's payload is harmless (verified). Don't load it on tool pages.

**H4. Nothing ties the live build to source (c; half day, or multi-day for reproducible builds).** `BUILD_ID` is a date plus a hash of asset names (`postbuild.mjs:343-348`), not a commit. No SRI, no CI config. Stamp the commit SHA into `sw.js` and the footer; publish a SHA-256 manifest of `dist/` per release.

#### Medium

- **M1. `privacy.html:110` is stale (d; quick).** Confirmed live.
- **M2. "What is stored" is incomplete (d; quick).** Missing: `pdfjs.signature`; `ec.userDict`, the Edit PDF Text spell-check dictionary, which is document-derived (`src/js/editcore/app.js:8486-8499`); saved workflow templates (passwords are correctly stripped, `src/js/workflow/serialization.ts:22`).
- **M3. Cloudflare Network Error Logging is on (b; quick).** Every response carries `nel:` and `report-to: …a.nel.cloudflare.com`. Chromium reports failed requests to that undisclosed host, outside CSP and invisible in DevTools, most likely right after the offline test the site recommends.
- **M4. LibreOffice engine: no integrity check, no cache header, one hang (c; half day).** `src/js/utils/libreoffice-loader.ts:39` fetches 77 MB of executable WASM cross-origin with no hash. `assets.qpdf.ca` sends no `Cache-Control`. One of two word-to-pdf runs sat on "Processing…" for 15 minutes with no error (seen once, sandbox under load). Pin SHA-256, set `immutable`, add a watchdog message.
- **M5. Outputs reuse the input file name (quick).** Redact, protect, sanitize, remove-metadata, edit and digital-sign.
- **M6. Redaction works; one disclosed gap (quick copy change).** An area mark removed the text from the content stream, raw and inflated bytes, and `pdftotext` output. A marker survived only in the document Title, which the "Check for other copies" dialog discloses. Consider offering "also clear document properties".
- **M7. No size guard and no unsupported-browser message (half day).** Desktop Chromium was fine: 101 MB protect in 9 s, 101 + 36 MB merge in 114 s. Phones will fail without explanation.
- **M8. No `security.txt` (quick).** Both paths are 404.
- **M9. Password protect is AES-256 but accepts a one-character password silently (quick).** `src/js/logic/protect-pdf-page.ts:109`.

#### Low

- **Markdown preview relies only on CSP to stop remote loads (b, latent).** DOMPurify keeps `<img src="https://…">` (`src/js/utils/markdown-editor.ts:78-82`). Blocked live; self-hosters without the headers would leak.
- **Dead upstream network code still ships (c).** TSA presets, the CORS-proxy shim (`src/js/logic/digital-sign-pdf.ts:235`), 28 `rawcdn.githack.com` font URLs (`src/js/config/font-mappings.ts:163-215`), jsDelivr defaults in `.env.example`. Unreachable or blocked, but it enlarges the audit surface.
- **File names are logged to the console** (local only); 92 `console.log` calls.
- **`access-control-allow-origin: *`** on all responses: harmless for public static files, offset by CORP `same-origin`.
- **Supply chain.** `xlsx` comes from the SheetJS CDN tarball (hash-pinned, but outside npm advisories); `heic2any` 0.0.4 looks stale; three vendored engine tarballs aren't reproducible. `npm audit --package-lock-only`: 0 production vulnerabilities, 16 low/moderate in dev tooling.
- **Licensing.** Source links present, repo public. `docs/LICENSING.md` still says private. The CoherentPDF non-commercial concern is refuted: the deployed licence is AGPL-3.0-or-later.
- **Performance.** Home: 14 requests, 130 KB. Tool shell: 29 requests, about 575 KB. First compress pulls about 6 MB (roughly 30 s at 1.6 Mbps). OCR 11 MB; PyMuPDF and Ghostscript tools about 61 MB; LibreOffice 77 MB (5 to 7 minutes on slow 4G). 89 of 112 tools auto-cache for offline; 23 need a manual download.
- **Analytics description is accurate;** email-to-PDF made no remote requests at all.

#### Verifiability: what exists and what is missing

Exists: `/privacy/#test-it-yourself`; `/guides/check-if-pdf-tool-uploads-files/` with DevTools steps; the per-tool offline badge; manifest and service worker; public source.

Missing, in suggested order:
1. Analytics-free tool pages and a per-page CSP.
2. Commit SHA and a published hash manifest.
3. `security.txt`.
4. An on-page "0 uploads this session" indicator fed by `PerformanceObserver` and CSP-violation events.
5. A downloadable self-host zip per release.
6. A third-party audit.

#### Could not verify (technical)

Safari, iOS and Firefox (Chromium only); PWA install; mobile memory limits; files over about 137 MB; end-to-end Web3Forms delivery from a tool page; the analytics beacon sent on page hide; whether NEL reports are actually emitted; that the deployed bundle is byte-identical to a build of `afe57b0`; the full `redaction_audit.py` matrix.

---

## 5. Suggested 30 / 60 / 90 day plan

### Days 1 to 30: make it trustworthy and findable

**Week 1: defects and identity**
- Decide and publish who operates Qpdf.ca (action 1).
- Privacy page corrections; Sign PDF signature default (action 2).
- Workflow Builder fix (action 3).
- All quick wins in §3.
- Search Console, Bing, sitemap, `qpdf.pages.dev` redirect (action 6).
- Start the four-week traffic baseline.

**Weeks 2 to 3: the claim, front and centre**
- Homepage hero, trust row and link blocks (action 5).
- Drop-zone promise, result-state note on every tool, output name suffixes (action 7).
- Analytics off tool pages, per-path CSP, NEL off (action 4).
- "Without uploading" titles; `Organization` JSON-LD; named guide author.

**Week 4**
- Commit SHA, hash manifest, `security.txt` (action 10).
- Licence review of the producer-line expectation.
- AlternativeTo listing.

*Check at day 30:* Search Console shows pages indexed; `/privacy/` has no inaccurate statement; a tool page makes zero third-party requests.

### Days 31 to 60: audience pages and first outreach

- `/for-firms/` with a one-page security summary PDF; `/for/lawyers/`, `/for/immigration-consultants/`, `/library/` (action 9).
- Deepen copy on the first 8 of the 15 priority tool pages (action 8).
- Publish the upload-tool comparison guide and `/faq/` (including "is Qpdf.ca the same as qpdf?" and the BentoPDF relationship).
- Printable handout with QR; press kit; tagged GitHub release.
- Outreach wave 1: Courthouse Libraries BC, 10 public libraries and settlement agencies, one Slaw tip.
- First batch of 20 to 30 hand-written firm emails, after reading the CRTC guidance first-hand.
- Design consistency: form controls, sentence-case labels, card widths, collapsing drop zone.
- Size guard and unsupported-browser message.

*Check at day 60:* at least one institutional listing or reply; views on `/library/` and `/for-firms/`; branded queries appearing in Search Console.

### Days 61 to 90: reach and depth

- Show HN, once the items above are done. Disclose the fork up front.
- French, staged: five tool pages and three IRCC guides under `/fr/` with hreflang.
- Remaining 7 priority tool pages; `/compress-pdf-for-ircc/`; restore `/compress-pdf-to-1mb/`; two new guides (Express Entry checklist, CaseLines bookmarks).
- Re-theme the embedded Sign and Redact editors.
- Paralegal program outreach (Capilano, VCC) with `/educators/`.
- LibreOffice engine integrity pin and watchdog.
- Decide on a "court bundle" workflow preset, using what users said in email replies.
- Scope a third-party security review.

*Check at day 90:* which channel produced replies or returning traffic decides where month four goes. Search volumes were never verified in this review, so let Search Console query data, not this report's estimates, pick the next pages.

---

## Appendix A: shared brief given to every reviewer

**What it is.** Qpdf.ca is a free, no-account PDF toolkit: 125 tool pages (112 browser tools plus 13 LibreOffice-WASM Office converters) at `https://qpdf.ca/<slug>/`. It is an AGPL-3.0 fork of BentoPDF 2.8.11 with its own design, copy and privacy hardening. Static Vite multi-page build (TypeScript, Tailwind v4, Handlebars partials) on Cloudflare Pages; big engines on `assets.qpdf.ca` (R2). All processing is in-browser via pdf-lib, PDF.js, qpdf-wasm, PDFium, PyMuPDF/Pyodide, Ghostscript, Tesseract. A service worker gives offline use and a per-tool "Ready to work offline" badge. Source is public. Built by wealththeory.ca, Vancouver.

**Who it's for.** The site calls itself general-purpose, "especially useful" for lawyers, paralegals, immigration consultants, accountants, notaries. The 15 guides are split between Canadian court filing and IRCC immigration uploads. So: legal and immigration, Canada-specific. The homepage names neither audience.

**Selling point.** Files never leave the device, and the claim is checkable: strict CSP, self-hosted engines, offline test, open source.

**Live vs repo.** Live matches HEAD. 150 sitemap URLs, canonicals, JSON-LD and redirects work. The contact form is configured. Only third-party request on load: Cloudflare Web Analytics.

**Leads handed to reviewers, and how they turned out.**

| Lead | Outcome |
|---|---|
| Homepage H1 names no keyword, audience or country | Confirmed (SEO H1, Design H4) |
| `privacy.html:110` stale default favourite | Confirmed live |
| English only | Confirmed; `/fr/` is 404 |
| CSP allows `'unsafe-eval'`; `access-control-allow-origin: *` | Both real, both low risk; the real CSP issue is Web3Forms and analytics on every page |
| Upstream marketing blocks on tool pages | Confirmed (`compress-pdf.html:141`) |
| No named author or company identity | Confirmed; the top finding |
