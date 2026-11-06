---
title: "Ontario Court of Appeal PDF Filing: 512 MiB, 500 Pages and Navigation"
description: "Meet Ontario appellate PDF limits, OCR settings, hyperlink rules, naming conventions and special sealed-material procedures."
metaTitle: "Ontario Court of Appeal PDF Filing Rules | Qpdf.ca"
category: legal
published: 2026-11-06
reviewed: 2026-11-06
relatedTools: [compress-pdf, split-pdf, ocr-pdf, edit-pdf-bookmarks]
relatedGuides: [prepare-pdf-exhibits, federal-court-pdf-efiling]
sources:
  - title: "General Practice Direction Regarding All Proceedings"
    url: https://www.ontariocourts.ca/coa/how-to-proceed-court/general/
    publisher: "Court of Appeal for Ontario"
    accessed: 2026-11-06
  - title: "Appendix B: Naming Conventions"
    url: https://www.ontariocourts.ca/coa/how-to-proceed-court/general/appendix-b/
    publisher: "Court of Appeal for Ontario"
    accessed: 2026-11-06
---

## Ontario Court of Appeal PDF filing rules at a glance

The **Court of Appeal for Ontario** sets a maximum of **512 MiB and 500 pages for each non-video electronic file**. If a PDF exceeds **either** threshold, divide it into volumes. Ordinary materials generally go through the **Ontario Court of Appeal Public Portal**, while **sealed materials follow a special placeholder and secure-link procedure**. The court also has specific rules for searchable scans, naming, navigation and hyperlinks.

These rules come from the [General Practice Direction Regarding All Proceedings in the Court of Appeal](https://www.ontariocourts.ca/coa/how-to-proceed-court/general/), as revised through June 11, 2026. They apply to **Ontario's Court of Appeal**, not the Ontario Superior Court of Justice or its Case Center processes. Always check case-specific orders and the current practice direction before submission.

## What do 512 MiB and 500 pages actually mean?

Paragraph 10 states that the maximum for each non-video file is **512 MiB** (mebibytes) **and 500 pages**. One MiB is 1,048,576 bytes, so the limit corresponds to **536,870,912 bytes**. A file must satisfy both the file-size limit and the page-count limit. Paragraphs 59 and 67 apply those thresholds to the ordinary portal and sealed-file procedure respectively.

A **470-page, 540 MiB** scanned appeal book exceeds the size limit even though its page count is acceptable. A **620-page, 80 MiB** book exceeds the page limit even though it is small. Both need an appropriate multiple-volume arrangement; merely compressing the second book will not solve its page-count problem.

Use [Compress PDF](/compress-pdf/) for suitable working copies and [Split PDF](/split-pdf/) for oversized records. Preserve the sequence, navigation and citations across volumes. After processing, confirm file size in bytes where possible, count pages and test the opening and closing pages of every volume.

## Searchability, OCR and scanning settings

Paragraph 8 says electronic materials **should** be text-searchable and use appropriate PDF page references, numbering and descriptive bookmarks. For **scanned PDF documents**, it states more specifically that the documents **must use OCR**, and the **OCR software must be set to at least 300 dpi and must not be set to grayscale**. Do not turn this into a claim that all born-digital documents must be scanned in colour: those scanned-document conditions concern the OCR/scanning workflow.

Prefer a searchable PDF created directly from its source document. For scanned affidavits or exhibit pages, configure the scanning/OCR workflow to meet the direction and visually inspect the result. [OCR PDF](/ocr-pdf/) can assist with searchability, but **QPDF.ca has not verified that its OCR tool exposes or guarantees a 300 dpi, non-grayscale configuration**. Verify those settings in the scanning/OCR software you actually use. Do not claim compliance from a successful text search alone.

An OCR layer can also contain errors. Search for distinctive terms on multiple pages and inspect handwritten notes, stamps and photographs to make sure they remain legible.

## Navigation: bookmarks and internal links are different

A PDF bookmark is a sidebar entry that jumps to a page or section. An **internal hyperlink** is a clickable passage in an index or contents page that navigates within the same PDF. The court requires both in specific types of material:

- **Books of authorities:** Paragraph 26 requires bookmarks naming each authority and an index with internal links to each.
- **Appeal books, compendiums and exhibit books:** Paragraph 27 requires bookmarks naming the tab and document plus a linked index.
- **Three-judge panel motion records:** Paragraph 33 requires both.
- **Single-judge motion records of 100 pages or more:** Paragraph 34 requires both. Under paragraph 35, bookmarking and hyperlinking are **not necessary** for single-judge motion records under 100 pages.

Use [Edit PDF Bookmarks](/edit-pdf-bookmarks/) for the bookmark tree, but do not assume it generates clickable index links. Create and verify those links using an editor capable of internal PDF destinations. Confirm that the links remain correct after splitting, compressing or reorganizing a record.

### Links to a different filed PDF are prohibited

Paragraph 11 states that **hyperlinks between filed materials are not permitted**. Do not add a clickable jump from a factum PDF to a separately filed appeal-book PDF. Instead, cite the appropriate PDF page reference in a way the court can follow. This restriction is different from **links within a single filed PDF**, which the direction requires for many books and records.

External case-law links are treated differently: paragraph 19 says factums **should** contain links to cited cases on Canadian court judgment sites or [CanLII](https://www.canlii.org/) where available, with alternative legal research services in the stated circumstances. Do not confuse external legal-authority links with prohibited inter-file navigation.

## Name the file according to Appendix B

Paragraphs 9 and 57 require electronically filed materials to follow [Appendix B's naming convention](https://www.ontariocourts.ca/coa/how-to-proceed-court/general/appendix-b/). Names generally start with a document-type code, followed by the Court of Appeal file number, and end with the correct extension. The Appendix includes examples such as `FAP.COA-22-CR-2321.PDF` (appellant's factum), and uses `ABCO` for an appeal book and compendium. For multiple volumes, place `Vol1`, `Vol2` and so on immediately after the document code, as in `ABCO.Vol1.COA-24-CV-1928.PDF`.

Use the code that matches your *actual document type*, not a convenient generic label. Appendix B provides a procedure for items without an established code and uses `SLD` in the name for sealed materials. Review the Appendix's current list rather than copying an example court number into a real filename.

## Ordinary filing versus sealed materials

For an ordinary filing, paragraph 56 generally requires submission through the **Ontario Court of Appeal Public Portal** unless the court directs an alternative. Paragraph 61 states that the court's previous filing email address has been decommissioned; do not use it as a substitute for the portal. The [Public Portal User Guide](https://www.ontariocourts.ca/coa/how-to-proceed-court/general/) linked from the practice direction explains portal operation.

**Sealed PDFs are not uploaded directly as ordinary portal documents.** Under paragraphs 62–69, most sealed materials require a **placeholder document** uploaded through the portal describing the sealed material and linking to a court-accessible file-sharing service. The actual material is delivered through that link. The placeholder must contain the description and link but **should not include the password**.

The practice direction identifies supported file-sharing services, including OneDrive, Google Drive, Dropbox and Enterprise Attachment Transfer Service, subject to the court's access restrictions. It warns against links that require online registration or incompatible two-stage authentication, and names WeTransfer as inaccessible. Sealed electronic documents must be **labelled as sealed** and **password protected**, with the password provided to the court's Intake Office **by telephone**, as specified in paragraph 68. The **512 MiB and 500-page limits still apply** to sealed documents.

For material involving confidential informer privilege, national security, or child sexual abuse and exploitation material, paragraph 62 instructs parties to **contact the Deputy Registrar and Manager of Court Administration for specific filing directions** rather than simply applying the ordinary link procedure. An order may also direct another route. Do not treat all confidential cases as interchangeable.

## Pre-submission checks for an appellate PDF

- [ ] Confirm this is the **Court of Appeal for Ontario** and identify the filing type and any special direction.
- [ ] Check **both** limits: at most 512 MiB and at most 500 pages per non-video file.
- [ ] Verify all scanned-document OCR settings, including at least 300 dpi and not grayscale, using the actual OCR software.
- [ ] Confirm the required bookmark tree and **internal** index links for this record type.
- [ ] Remove any prohibited hyperlink from one separately filed document to another.
- [ ] Match PDF navigation references and the printed pagination.
- [ ] Use the correct Appendix B type code, court file number, volume marker and extension.
- [ ] For a sealed file, use the applicable **placeholder, link, password and telephone** procedure rather than ordinary direct upload.
- [ ] Preserve certificate-signed originals before any PDF transformation.
- [ ] Open the final file in a second viewer and check every volume's content and navigation.

The [exhibit-preparation guide](/guides/prepare-pdf-exhibits/) covers the underlying workflow, but the Ontario appellate direction controls where it differs. QPDF.ca helps with some PDF operations; it does not certify that a finished file meets the Court of Appeal's technical, legal or filing requirements. This guide is general PDF-preparation information, not legal advice: have a lawyer or other qualified practitioner confirm court-specific procedure, especially for sealed material, before you file.
