# QPDF.ca Stage 2, Step 5 — Sources and Editorial Notes

**Draft preparation and ordinary-web verification date:** 2026-11-05  
**Deliverables:** Six English-language Markdown immigration guides plus this handoff file.  
**Status:** Editorial drafts completed and checked; not deployed. **Professional regulatory review and Claude Code integration/build checks remain necessary before publication.**

## 1. Inputs and evidence hierarchy

The six articles were drafted from these user-supplied documents:

1. `QPDF_Stage2_04_Immigration_Research.docx` — article topics, intended search questions, examples and underlying research. Its unverified numerical, legal and technical assertions were not accepted automatically.
2. `QPDF_Stage2_04A_Research_Corrections.md` — controlling editorial correction memo, including required caveats and disallowed claims.
3. `QPDF_Stage2_03_Claude_Technical_SEO_Report.md` — QPDF.ca's tested tool behaviours, safety limitations, tool slugs and front-matter architecture. Its findings are from the author's recorded local synthetic tests, **not an independent security audit**.

Where the research was more categorical than official instructions, the articles use the narrow official scope. For legal/regulatory requirements, direct official sources take priority. This was an **article-writing** stage, not a fresh comprehensive research project.

## 2. Primary sources actually inspected using ordinary web access on November 5, 2026

| Source | URL | Applied in |
| --- | --- | --- |
| IRCC — account-specific upload size limits (page modified Nov 3, 2026) | https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1123 | Articles 1, 2, 3 |
| IRCC — reduce oversized documents | https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1213 | Articles 1, 2, 3 |
| IRCC — combining multiple files for one field (page modified Nov 3, 2026) | https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1160 | Article 3 |
| IRCC — Guide 0192 for CBSA refugee claims via the IRCC Portal (Nov 3, 2026 asylum change notice; 9.6/2 MB in this workflow) | https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/guide-0192-cbsa-refugee-claims-ircc-portal.html | Article 1 |
| IRCC — downloading and opening forms (page modified Nov 3, 2026) | https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=140 | Articles 4, 5 |
| IRCC — barcode form validation, online and paper workflows (page modified Nov 3, 2026) | https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1523 | Articles 1, 3, 4, 5, 6 |
| IRCC — validation troubleshooting (page modified Nov 3, 2026) | https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=767 | Articles 4, 5 |
| IRCC — IMM 0008 form webpage, including portal digital version vs paper PDF version | https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/imm0008.html | Article 5 |
| Department of Justice — CICC Code of Professional Conduct (SOR/2022-128; online consolidation current to Oct 19, 2026) | https://laws-lois.justice.gc.ca/eng/regulations/SOR-2022-128/FullText.html | Article 6 |
| Office of the Privacy Commissioner — PIPEDA fair information principles | https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/ | Article 6 |
| Office of the Privacy Commissioner — substantially similar provincial laws and cross-border context | https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/prov-pipeda/ | Article 6 |
| College-hosted historical ICCRC Client File Management Regulation 2021-001, particularly §7.2 (PDF page 7, visually checked) | https://college-ic.ca/ICCRC/Assets/Documents/Regulations/Client%20File%20Management%20Regulation.pdf | Article 6, **historical, not established as currently operative** |
| College Code of Professional Conduct Interpretation Guide 2022-001, §37 interpretation (PDF page 63, visually checked) | https://college-ic.ca/ICCRC/Assets/Documents/Protecting%20the%20Public/Code-of-Professional-Conduct/PC_Code%20Guide-EN.pdf | Article 6, **historical, status needs confirmation** |

The website/tool internals were **not** independently retested live during this authoring stage. QPDF capability statements are sourced to Claude's supplied technical audit and explicitly limited to that audit's test scope. `https://qpdf.ca/privacy/` could not be retrieved through the web verification tool during this pass; the internal URL and privacy-summary claims derive from the supplied audit and require a production check at integration.

## 3. Important editorial corrections applied

- **Portal limits:** Presented 4 MB and 5 MB as account-level *general* values, not a universal rule. The 9.6 MB / 2 MB exception is limited to Guide 0192's CBSA refugee-claim workflow. The November 3, 2026 process-change notice is included.
- **Byte sizes:** Distinguished decimal MB from binary MiB, did not claim IRCC always uses one base, and recommended checking downloaded file bytes rather than relying on a rounded label.
- **Compression:** Described QPDF.ca's approximately 3.8 MB 4 MB preset as a *target*, not a guaranteed output or assurance of upload approval. The audit's single observed test size was not generalized as a promise.
- **DPI and financial records:** Treated IRCC's 96/150 DPI suggestions as optional size-saving techniques, not a mandatory bank-document resolution. Did not equate every removed page with proven statutory misrepresentation.
- **One upload field:** Applied IRCC's one-file-per-field guidance to relevant upload slots; did not require an all-application bundle or prescribe one universal translation order.
- **XFA and barcodes:** Directed readers to IRCC/Adobe Reader for specialized forms. Did not promote QPDF.ca's fill, flatten, merge, compress, sanitize or other transformations as substitutes for form validation. Removed unsupported statements about inevitable cryptographic-signature corruption and automatic application rejection.
- **Redaction:** Accurate description of synthetic tests: content *inside* an area mark was removed, but outside-area copies in annotations, bookmarks, attachments or metadata survived; text-mark cleaning of repeated content was exact-phrase dependent. Explicit output verification is recommended. Sanitizing is not represented as automatically solving all redaction leakage.
- **Privacy:** Distinguished browser-local **document processing** from website network activity. No claim of independent audit, regulator endorsement, Canadian-only data residence, blanket safety or automatic CICC/PIPEDA compliance.
- **RCIC retention:** Acknowledged both College-hosted historical six-year documents, but **did not assert an unconditional current 2026 six-year rule**. Flagged operative by-laws and privacy-law interaction for human verification. Explained that confidentiality and file retention differ.
- **Provincial law:** Corrected the notion that all RCIC practices are necessarily governed exclusively by PIPEDA; provincial legislation can apply.

## 4. Material questions not resolved in this writing stage

1. **Current CICC retention instruments:** The historic Council regulation's §7.2 refers to a minimum six years after file closure, while the College's 2022 interpretation guide refers to six years after completion of services. The Code's current §37 directs licensees to by-laws. **A qualified regulatory reviewer must confirm the current governing instruments, amendment status and start event before this becomes a firm-wide compliance instruction.**
2. **Individual application/portal restrictions:** IRCC's general table and Guide 0192 are real but do not resolve every individual upload field. Each applicant must follow their specific live checklist and portal prompts. No blanket IRCC webform attachment limit was established.
3. **Tool deployment status:** Claude's audit expressly says its fixes were on a feature branch and would reach production only after merging. Claude Code should confirm the actual production code reflects the audited behaviour before publishing the guides, especially compression targeting, XFA warnings, redaction notices and privacy copy.
4. **Live privacy and tool links:** The supplied technical report verifies slugs such as `/redact-pdf/`, `/compress-pdf/`, `/merge-pdf/`, `/reorder-pdf-pages/`, `/sanitize-pdf/`, `/remove-pdf-metadata/` and `/privacy/`. Confirm the production path and HTTP response for all links during build and live QA.
5. **Full security guarantees:** Synthetic redaction and browser-local network tests do not prove every PDF is safe or that every endpoint, extension, device or browser session is secure. No universal claim is made.
6. **Program-specific signatures, translation requirements and submission formats:** Follow the latest application-specific IRCC instructions, which may vary from the general Help Centre examples.

## 5. Claims intentionally omitted or narrowed

- A universal 4 MB IRCC webform attachment limit.
- Universal acceptance of every PDF under 4 MB or 5 MB, or guaranteed achievement of a compression target.
- A universal rule that *all* certified translations must appear before original-language documents or have the same affidavit arrangement.
- A claim that every edit after validation invariably breaks a cryptographic signature or automatically leads to a refusal.
- A claim that flattening, sanitizing or removing metadata is appropriate for dynamic IRCC barcode forms.
- A claim that area redaction merely draws opaque pixels over text (contradicted by the documented tests).
- A claim that redaction necessarily cleans matching material throughout attachments, bookmarks and metadata.
- A claim that six-year RCIC record retention is unquestionably the operative duration for every practice in November 2026.
- Any claim that QPDF.ca is certified or endorsed by the CICC, IRCC or a privacy regulator.

## 6. Metadata and technical integration handoff

All six articles contain only the requested supported YAML keys:

`title`, `description`, `category`, `published`, `reviewed`, `relatedTools`, `relatedGuides`, `sources`.

- `category` is `immigration`; `published` and `reviewed` are `2026-11-05`, the actual draft and source-verification date. **If the actual publication/review process occurs later, update these fields to accurate dates rather than leaving stale metadata.**
- Each article body starts with prose, not an H1; QPDF renders front-matter `title` as H1.
- The articles have distinct search intents and proposed destinations under `/guides/<filename-without-extension>/`.
- `relatedTools` uses only IDs supported by Claude's uploaded technical report. No related tool is declared in the XFA-opening or barcode-validation articles.
- `relatedGuides` references only the other five guides in this package. All six must be added together or the build may reject unresolved slugs; the integration process should confirm guide registry semantics.
- External authoritative claims link to full primary-source URLs in the article body; front matter `sources` mirrors the principal references.
- There is no raw HTML and no new PDF tool or duplicate tool landing page.

### Suggested Claude Code publication QA

1. Copy the six article files into `content/guides/`. Do not place `SOURCE_AND_EDITORIAL_NOTES.md` in that public guides folder unless intended as an internal note; keep it in project documentation.
2. Validate front matter against `content/guides/README.md` and the actual guides parser; confirm `sources.accessed` and date fields are accepted.
3. Confirm all linked tool and guide slugs exist, as well as `/privacy/`. Ensure all six related guides are present before building.
4. Run the project build and `npm run check:dist`, and resolve any duplicate paths, broken links, metadata or sitemap errors.
5. Review desktop/mobile rendering of tables, headings, internal links and long lists; confirm one H1 per article page.
6. Have a qualified RCIC/regulatory professional approve the retention/privacy paragraph and sample IRCC submission instructions. Review any program-specific changes since November 5, 2026.
7. Check live IRCC sources again immediately before deployment if publication is delayed or new policy guidance appears. Confirm the deployed QPDF safety behaviour matches the supplied audit.

**No repository modifications, GitHub writes or deployment were performed in this stage.**
