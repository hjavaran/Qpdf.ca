# QPDF.ca — Final verification of the two withheld Stage 2 articles

**Verification date:** November 7, 2026 (all sources below were fetched and read on this date unless stated otherwise)
**Branch:** `claude/trusting-brown-b1fjfd`, started from `main` at `9f4a89a` (merge of PR #4)
**Status:** Both articles were approved for publication by the owner on 2026-11-07 and `draft: true` has been removed from both. The pull request is **open for review; nothing is merged or deployed**, so the pages are not live until it is merged and Cloudflare deploys.

This is an evidence-based source review. It is not a lawyer's, RCIC's or court's opinion, and it does not mean the College of Immigration and Citizenship Consultants (CICC), the BC Supreme Court or any other body has approved the articles or QPDF.ca.

## 0. Summary and decision

| Article | Decision |
| --- | --- |
| RCIC Document Privacy Checklist for Client PDFs | **READY WITH QUALIFICATIONS** |
| BC Supreme Court PD-72 PDF Checklist | **READY FOR OWNER APPROVAL** |

Each can be approved on its own. Approving one does not require approving the other.

**Needed from you:** review and merge the pull request when you are satisfied (§10).

## 1. Repository starting point

- PR #4 (Stage 2 final audit) is **merged** (`9f4a89a`, 2026-11-07 07:36 UTC). I did not merge anything. My branch starts from that commit, so nothing in PR #4 is overwritten.
- The two supplied drafts were diffed against the repository versions. They differ in only a few places (PIPA ss. 34–35 source and sentence, ss. 7.3/7.4/10.1, the PD-73 hedge, the serve-then-file warning, the PD-72 access date). I applied those ideas but re-checked each against the primary text, and several needed correction (§4).
- Existing front-matter schema, filenames, URLs, internal tool links, warnings and caveats are unchanged.

## 2. RCIC regulatory findings (primary sources)

| # | Question | Finding | Source |
| --- | --- | --- | --- |
| 1 | Is Client File Management Regulation 2021-001 still operative? | The College's regulations page lists it and says By-law 2021-2 "remains in effect and applies to all College licensees". Regulation version 2021-001, approved by the Council board on Nov 17, 2021. | college-ic.ca regulations page; Regulation PDF |
| 2 | Does a later College by-law or regulation supersede it? | **None found.** The By-Laws tab lists only By-law 2021-2. The College Act s. 85(7)(o) continues Council by-laws and board regulations "until the day before the day on which a by-law made under section 80 comes into force". I also read the new government **College of Immigration and Citizenship Consultants Regulations (SOR/2026-68, made Apr 16, 2026, in force 90 days after registration)**. They deal with the compensation fund, committees, the Registrar, disclosure of personal information and by-law-making powers. They contain **nothing on client files, retention or destruction**. This instrument was not in the supplied memo. | Act (current to 2026-10-19); Canada Gazette Part II, May 6, 2026 |
| 3 | Does s. 7.2 still require at least six years after closing? | **Yes.** "A Client File shall be retained in a secure and accessible location for a minimum of six (6) years after the File has been closed." The article does not call this historical. | Regulation s. 7.2 |
| 4 | ss. 7.1, 7.3, 7.4, 10.1 | 7.1: file closes only when fees/refunds are settled, client property is returned, and the client is notified in writing that the retainer is terminated. 7.3: keep a list of closed files with closing dates. 7.4: on closing, set a Projected File Destruction Date and record it in the file. 10.1: keep a record of destroyed files with at least client name and address, brief description of service, file closing date and actual destruction date. 10.2: maintain confidentiality when destroying a file. All now stated in the article. | Regulation |
| 5 | Confidentiality vs retention | Correct. Code s. 28(1): keep information confidential and take the necessary measures to maintain it "indefinitely"; s. 28(2) lists exceptions. Code s. 37: "keep and preserve records in accordance with the by-laws made under the Act" (no number of years). The article keeps these separate and says "Indefinite confidentiality is not indefinite retention." | Code SOR/2022-128 (current to 2026-10-19) |
| 6 | PIPEDA vs provincial law | Substantially correct, but the OPC's wording is: provincial law generally replaces PIPEDA for collection, use or disclosure **within** the province; PIPEDA still applies to "transactions involving personal information transferred across borders" and to federal works, undertakings or businesses. The article said "interprovincial or international transfers", which went beyond the OPC page; it now uses the OPC's words. The OPC page itself is dated 2020-05-11. | OPC provincial-laws page; OPC fair-information-principles page (modified 2025-05-29) |
| 7 | BC PIPA | s. 34 (reasonable security arrangements) and s. 35 (retention/destruction) exist as described. The supplied sentence was tightened to match: s. 35(2) requires destruction or de-identification as soon as it is reasonable to assume the purpose is no longer served **and** retention is no longer necessary for legal or business purposes. Act current to Nov 3, 2026. | BC Laws PIPA |
| 8 | QPDF capability descriptions | Checked against the code. Remove Metadata deletes the trailer file ID, PieceInfo and XMP (`remove-metadata-page.ts`); Sanitize offers comments, embedded files, JavaScript, links, layers, metadata and form flattening, **all checked by default** (`sanitize-pdf.html`); redaction behaviour matches the Stage 2 audit's synthetic tests. Claims of "no PDF upload" are worded as browser-local processing, not as a certification. No claim of CICC approval or automatic compliance. | Repository code and tests |

### Unresolved interpretation question (RCIC)

Paragraph 85(7)(o) keeps Council by-laws and board regulations in effect only "until the day before the day on which **a** by-law made under section 80 comes into force". It could be read as ending when the **first** College by-law takes effect. The College nevertheless publishes By-law 2021-2 and the Regulation as in effect for all licensees. Also, Code s. 37 refers to "by-laws made under the Act", while the Regulation was made by the former Council. I found no single provision that settles how these fit together. The College's published position is that the Regulation applies, and the article follows that position and says that the interpretation is not resolved. Section 80(1)(u) authorizes College by-laws on record keeping, so a future by-law could replace the Regulation. **A practising RCIC or the College should confirm this if a firm relies on it.**

## 3. PD-72 verification

I retrieved the official PD-72 PDF (5 pages, effective March 31, 2026, PDF created 2026-03-31) and read every page, including Appendix A.

| Item | Result |
| --- | --- |
| Eligibility / scope | ¶2: electronic records "may be submitted" for applications of 30 minutes or less before an associate judge in chambers. ¶1 rescinds PD-68. **Confirmed.** |
| Record contents | ¶4: must comply with Civil Rules 8-1(15) and (16) or Family Rule 10-6(14), except that copies of authorities relied on **must** be included. ¶5 disapplies binder and the "no affidavits of service/authorities/other documents" rules. **Confirmed.** |
| Rejection | ¶6: registry "will reject" records that do not comply with Appendix A. ¶8: may resubmit within rule timelines. **Confirmed.** |
| Submission | ¶7: through Court Services Online. ¶9: no paper copy. ¶10: adjourned to a date, record stays; adjourned generally, resubmit. **Confirmed.** |
| Single organised PDF | App. A intro: one organised, bookmarked, hyperlinked PDF (**must**). **Confirmed.** |
| True copies / searchable / OCR | **must** (scans must be OCR'd). **Confirmed.** |
| Cover / index | **should**; cover first (Form 30.001 or F32.2), numbered hyperlinked index second. **Confirmed.** Note the rule itself (Civil Rule 8-1(15)(b)(i)–(ii)) says the record **must** contain a cover page in Form 30.001 and an index, in that order. Added to the article. |
| Bookmarks / initial view | **should**; bookmark panel shown by default via initial view. **Confirmed.** |
| Page numbers | **should** be sequential, top centre; may start after the index; page search **must** match numbering (Page Labels). **Confirmed.** |
| Security | **must** disable restrictions on viewing, printing, saving, annotating, searching; no password-protected files. **Confirmed.** |
| Size | **must** be optimised and not exceed 50 MB. **Confirmed.** |
| 300 DPI | **Not present.** The article correctly says there is no universal 300 DPI rule. |
| Vetted orders | ¶11: for parties with leave to attend remotely. **Confirmed.** |

PD-72 does not itself list registries. The BC government's **Court Services Online guide (April 2026)** lists the court locations for the pilot and does not list Vancouver. It also says "all locations except Prince Rupert, Williams Lake, Revelstoke, and Golden". Those two statements are not fully consistent, so the article tells readers to confirm their registry rather than listing locations.

## 4. PD-73 (updated October 1, 2026) findings

### Is the retrieved PDF the amended edition?

**Yes.** The document header reads "Effective Date: March 31, 2026 / Updated Date: October 1, 2026". It has **9 pages** with Appendices A–D, the PDF was created Sept 29, 2026, and the server's `Last-Modified` was Sept 29, 2026. The court's practice-direction index lists it, and the court's October 1, 2026 notice says PD-73 was amended. The supplied memo could not confirm this; it can now be.

### What PD-73 says

| Topic | PD-73 (Oct 1, 2026 edition) |
| --- | --- |
| Matters covered | ¶1: a party may schedule an associate-judge application of 30 minutes or less in virtual chambers, **except in proceedings filed in the Vancouver registry**. Videoconference by default. |
| Electronic record mandatory? | **Yes.** ¶2: an electronic application record submitted in accordance with PD-72 "is required" for an application scheduled in virtual chambers. |
| PD-72 format incorporated? | Yes, by ¶2 and by the references in ¶15. |
| New process (changed Oct 1) | ¶¶4–8: serve a notice of intention to appear in virtual chambers (Appendix A) at least 3 clear business days before filing the notice of hearing; recipients may object within 3 business days; if no objection, file the Appendix B notice of hearing (Form 33.01 / F31.1); a respondent who wants to participate must say so and serve and file a response. |
| Orders signed on the bench | ¶15: vetted order goes into the record **and** must also be submitted at the same time through regular CSO eFiling (not the Application Record service), specifying the hearing date. This differs from PD-72 ¶11. |
| Adjourning / resetting | ¶¶16–17, Appendix C requisition. |

The court's October 1 notice confirms the PD-73 change: "a new form for serving notice of an intention to bring an application in virtual chambers, a new process for objecting to a virtual hearing, and a modified notice of hearing of application."

### Effect of the October 1 serve-then-file change

The same notice says Civil Rule 8-1 and Family Rule 10-6 were amended and "parties are now required to exchange materials before setting an application for hearing and before filing materials". I read the order (OIC 264/2026) and the BC Laws consolidations (both current to **November 3, 2026**):

- Civil Rule 8-1(15)(e) and Family Rule 10-6(14)(e): the application record must be provided to the registry **no earlier than 9 a.m. on the business day 5 business days before the hearing and no later than 4 p.m. on the business day 2 business days before the hearing**, or by an earlier date fixed by a registrar. The amendment changed "three full business days" to "5 business days" and "one full business day" to "2 business days".
- Civil Rule 8-1(15.2)–(15.4): a late application record leads to removal from the hearing list unless the court orders otherwise; leave to file late may be sought.
- PD-72's references to Rules 8-1(15)(a), (b), (d), 8-1(16) and 10-6(14) still point to existing subrules; (15) was amended but not renumbered.
- **The BC government's April 2026 CSO guide still states the old deadline** ("4 p.m. … one full business day before"). It predates the amendment and should not be relied on for timing.

### Source retrieval note

bccourts.ca sends only its own certificate and omits the intermediate (Entrust OV TLS Issuing RSA CA 2), so default TLS verification fails. I did **not** disable verification. I downloaded the intermediate from the AIA address in the server certificate, added it to a copy of the trusted bundle in the scratchpad, and let curl verify the full chain to the Sectigo root. This is what browsers do. This is why the earlier session could not read the PD-72 and PD-73 PDFs.

## 5. Statements in the supplied PD-72 draft that were outdated or incomplete

1. "Check ... whether a record is optional or mandatory": now answered. It is mandatory for virtual chambers (PD-73 ¶2) and permissive under PD-72 alone.
2. "Amended effective October 1, 2026 to align with the revised chambers application procedure": vague. The actual changes are the new notice of intention, the objection process and the modified notice of hearing.
3. Serve-then-file warning gave no timing. The new 5/2 business-day window is now stated, with the stale-CSO-guide warning.
4. No mention that PD-73 ¶15 requires the vetted order to be **filed separately** through regular eFiling.
5. Appendix A says "may additionally hyperlink to external sources"; the CSO guide says the opposite. The article now flags the conflict.
6. "Should" in Appendix A for cover page and index, but the rule says "must". Added.
7. "PD-72 expressly allows affidavits of service, authorities and certain other documents": more precisely, ¶5 disapplies the rule prohibiting them. Reworded.

## 6. Corrections applied

### `content/guides/rcic-client-pdf-privacy.md` (still `draft: true`)

- Citation fixed: "paragraph 85(o)" → **85(7)(o)**; wording now follows the statute ("not inconsistent with this Act", "until the day before the day on which a by-law made under section 80 comes into force"); added s. 80(1)(u) and the open interpretation question.
- Added ss. **7.3, 7.4, 10.1, 10.2** (supplied, then checked against the Regulation).
- Added BC PIPA ss. 34 and 35 (supplied, tightened to the statute text) with a source entry.
- OPC PIPEDA wording aligned with the OPC page; principle names corrected ("limiting use, disclosure and retention").
- `accessed` dates updated to 2026-11-07 only for the sources I re-read: Code, Act, College regulations page, Regulation PDF, both OPC pages. Left unchanged because they were not re-fetched today: the Interpretation Guide (2026-11-06) and the IRCC Help Centre page 1523 (2026-11-05).
- Stale front-matter comment on `draft:` replaced. `published`/`reviewed` unchanged.

### `content/guides/bc-supreme-court-pd72-pdf.md` (still `draft: true`)

- PD-73 virtual chambers section written from the amended PD-73 itself: scope, Vancouver exception, mandatory record, what changed on Oct 1.
- New filing-window paragraph (5/2 business days; removal from list; stale CSO guide warning); CSO tips (record type, sequence number, 20 MB large-file upload, fee).
- Rule 8-1(15)(b) record order and the cover-page/index "must" in the rule.
- PD-73 ¶15 vetted-order process and ¶¶16–17 adjournments.
- External-hyperlink conflict between PD-72 and the CSO guide flagged.
- Registry coverage caveat; pre-submission checklist updated.
- `metaTitle` added (default title was 78 characters; `check:dist` warns above 70).
- Sources added: PD-73, civil practice-directions index, Oct 1 court notice, Civil Rule 8-1 and Family Rule 10-6 on BC Laws, CSO guide; PD-72 `accessed` set to 2026-11-07.
- 300 DPI statement, must/should table, tool links and caveats unchanged.

## 7. Publication-readiness table

| | RCIC privacy checklist | BC PD-72 checklist |
| --- | --- | --- |
| **Decision** | **READY WITH QUALIFICATIONS** | **READY FOR OWNER APPROVAL** |
| What was verified | Regulation text (ss. 7.1–7.4, 10.1, 10.2); College page status; Act s. 85(7)(o) and s. 80(1)(u); Code ss. 28, 37; no conflicting new regulation (SOR/2026-68); OPC pages; PIPA ss. 34–35; tool behaviour in code | All five PD-72 pages incl. Appendix A; full amended PD-73 (9 pages, "Updated October 1, 2026"); Rule 8-1 and 10-6 consolidations to Nov 3, 2026; OIC 264/2026; court notice and index; CSO guide |
| Corrections needed | Yes: s. 85(7)(o) citation, OPC wording, PIPA precision, added ss. 7.3/7.4/10.1/10.2 | Yes: items 1–7 in §5 above |
| Sources current? | Yes as of Nov 7, 2026. Act and Code current to Oct 19, 2026; PIPA to Nov 3, 2026. The Regulation PDF itself is the 2022 posting of the 2021 version. | Yes. The PDs and rules are current. The CSO guide is **not** fully current (timing) and is labelled as such. |
| Remaining uncertainty | The s. 85(7)(o) / Code s. 37 interpretation (§2). Whether the College will replace the Regulation with a s. 80 by-law. | PD-72/PD-73 are pilot-project directions that were amended five weeks ago and may change again. Registry coverage list in the CSO guide is internally inconsistent about Vancouver. |
| Professional review recommended? | **Yes, recommended** (an RCIC or privacy lawyer on the retention and privacy paragraphs). Not a legal requirement for a general information article. | Optional (a BC litigator skimming the PD-73 and timing paragraphs). |
| Ready for your approval? | Yes, with the qualification stated in the article. | Yes. |
| Can be published separately? | Yes | Yes |

Neither article claims, or should be described as having, CICC, court, or professional approval. No professional review has taken place.

## 8. Remaining questions that need human judgment

1. **RCIC:** are you comfortable publishing before an RCIC or privacy lawyer reviews the retention paragraphs? (Recommended but not required.)
2. **RCIC:** the article says the Regulation is treated as in effect by the College and that the statutory interpretation is not resolved. Do you want to keep that visible, or ask the College?
3. **PD-72:** the CSO guide and PD-72 disagree on external hyperlinks in authorities. The article gives both and recommends including full copies. Do you agree?
4. **PD-72:** the article states the October 1 filing window. If you prefer not to state a deadline at all, that paragraph can be reduced to a pointer to the rules.
5. Both guides carry dated statements. Choose a review schedule (suggest rechecking PD-72/PD-73 and the College page quarterly).

## 9. Source URLs and verification dates (all read 2026-11-07)

**CICC / federal**

- https://college-ic.ca/about-the-college/regulations-and-policies (and its By-Laws tab)
- https://college-ic.ca/ICCRC/Assets/Documents/Regulations/Client%20File%20Management%20Regulation.pdf
- https://laws-lois.justice.gc.ca/eng/acts/C-33.6/FullText.html (current to 2026-10-19)
- https://laws-lois.justice.gc.ca/eng/regulations/SOR-2022-128/FullText.html (current to 2026-10-19)
- https://gazette.gc.ca/rp-pr/p2/2026/2026-05-06/html/sor-dors68-eng.html (SOR/2026-68)

**Privacy**

- https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/prov-pipeda/
- https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/
- https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/00_03063_01 (current to 2026-11-03)

**BC courts**

- https://www.bccourts.ca/supreme_court/practice_and_procedure/practice_directions/civil/PD-72_Electronic_Application_Records.pdf
- https://www.bccourts.ca/supreme_court/practice_and_procedure/practice_directions/civil/PD-73_Virtual_Chambers.pdf
- https://www.bccourts.ca/supreme_court/practice_and_procedure/civil_practice_directions.aspx
- https://www.bccourts.ca/supreme_court/index.aspx (Oct 1, 2026 notice)
- https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/168_2009_01 (Civil Rules, Rule 8-1; current to 2026-11-03)
- https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/169_2009_02 (Family Rules, Rule 10-6; current to 2026-11-03)
- https://www.bclaws.gov.bc.ca/civix/document/id/oic/oic_cur/0264_2026 (OIC 264/2026)
- https://justice.gov.bc.ca/pdfs/cso/InstructionsForUsersForApplicationRecords.pdf (April 2026 edition)

**Not re-read today:** the CICC Code interpretation guide and IRCC Help Centre page 1523 (cited in the RCIC article; their earlier access dates are unchanged).

## 10. Publication, tests and GitHub (after owner approval)

**Approval:** the owner approved both articles in the Claude Code conversation on 2026-11-07. The verification above was not repeated.

### Changes made for publication

- `draft: true` removed from both guides. `published` and `reviewed` are both **2026-11-07** (the date of the source review and of approval).
- Both articles keep the qualifications described in §2 and §5: the s. 85(7)(o) interpretation question, the College's position that the Client File Management Regulation applies, the recommendation to confirm current obligations with the College or a qualified professional, the verified October 1, 2026 PD-73 changes, the 5/2 business-day filing window, and the must/should distinctions. Each now also states that it has **not** been reviewed or approved by the CICC, a lawyer, an RCIC (RCIC guide) or the Court (PD-72 guide).
- Tool-page links (existing `guides` field in `src/data/tools.mjs`):
  - to the RCIC guide: Redact PDF, Sanitize PDF, Remove PDF Metadata;
  - to the PD-72 guide: Merge PDF, Compress PDF, OCR PDF, Edit PDF Bookmarks, Add Page Numbers, Add Page Labels.
- Guide-to-guide links: the RCIC guide links to the metadata, redaction and bank-statement guides, and those three link back to it; *Prepare PDF exhibits* links to the PD-72 guide, which already linked to it.
- **Rendering fix found during verification:** the Markdown renderer's typographic mode turned "Rule 8-1(15)(c)" into "Rule 8-1(15)©". The parenthesis is now escaped in the source. No other occurrence exists in either article, and the renderer was not changed.

### Results (production-style build, `VITE_LIBREOFFICE_ASSET_URL` set as in production)

| Check | Result |
| --- | --- |
| `npm run build` | Pass. 1,489 files (was 1,487), 205.5 MiB. |
| Sitemap | **150 URLs = 148 baseline + 2.** The only additions are `/guides/rcic-client-pdf-privacy/` and `/guides/bc-supreme-court-pd72-pdf/`, both `lastmod` 2026-11-07. |
| `npm run check:dist` | Pass: 151 pages, 150 sitemap URLs. Five warnings about third-party URL strings inside vendored engine bundles, which are unrelated to this change. |
| `npm run test:run` | 1,101 / 1,101 (73 files). |
| `npm run test:e2e` | 41 / 41, including the network-privacy audit and redaction audits. Needed `python3 tests/fixtures/make_fixtures.py`, `pip install pymupdf pyhanko` and `npm run serve:dist`. |
| Metadata | Both pages: self-canonical, `index, follow`, one H1, unique title (57 and 61 characters) and description, Article + BreadcrumbList JSON-LD with the dates above and no ratings or reviews. |
| Listings | Both appear in the guides hub and the site index. |
| Layout | Playwright at 390 px and 1280 px, 13 pages each (both guides, hub, site index, 9 linking tool pages): HTTP 200, one H1, no horizontal scroll, no page errors. The PD-72 table was checked visually on a phone. |
| Draft leakage | No draft guides remain; no page links to a withheld guide. |

Not tested: Safari, Firefox, real phones, Lighthouse, the live Cloudflare deployment.

### GitHub

- Branch: `claude/trusting-brown-b1fjfd`, based on the latest `main` (`9f4a89a`).
- Pull request: see the PR link in the final message. It is **not merged** and nothing was deployed.

### After you merge

1. Confirm the Cloudflare deployment, then open the two production URLs and check the sitemap shows 150 URLs.
2. Consider the optional professional skim of the RCIC retention paragraphs and the PD-72 timing paragraph (§7, §8).
3. Re-check PD-72, PD-73 and the College's regulations page periodically; both topics change.

### Publication URLs (once deployed)

- https://qpdf.ca/guides/rcic-client-pdf-privacy/
- https://qpdf.ca/guides/bc-supreme-court-pd72-pdf/

## 11. Front-matter validation

Run on 2026-11-07 with the repository's own guide loader and again by the full build:

| Check | `rcic-client-pdf-privacy` | `bc-supreme-court-pd72-pdf` |
| --- | --- | --- |
| Front matter parses, required keys present | Pass | Pass |
| `draft` | removed | removed |
| `published` / `reviewed` | 2026-11-07 / 2026-11-07 | 2026-11-07 / 2026-11-07 |
| `<title>` length | 57 | 61 |
| Description length | 157 | 128 |
| Sources (each has title and https URL) | 9 | 7 |
| `relatedTools` and `relatedGuides` resolve | Pass | Pass |
