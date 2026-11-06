---
title: "Federal Court E-Filing PDF Requirements: Size, Bookmarks and Confidential Files"
description: "Prepare Federal Court PDF e-filings with the 100 MB limit, searchable text, bookmarks and separate confidential-filing rules."
metaTitle: "Federal Court E-Filing PDF Requirements | Qpdf.ca"
category: legal
published: 2026-11-06
reviewed: 2026-11-06
relatedTools: [compress-pdf, merge-pdf, split-pdf, ocr-pdf, edit-pdf-bookmarks]
relatedGuides: [prepare-pdf-exhibits, ontario-court-of-appeal-pdf]
sources:
  - title: "E-Filing Instructions"
    url: https://www.fct-cf.ca/en/pages/online-access/e-filing
    publisher: "Federal Court of Canada"
    accessed: 2026-11-06
  - title: "Amended Consolidated General Practice Guidelines"
    url: https://www.fct-cf.ca/Content/assets/pdf/base/2025-06-20__Amended-Consolidated-General-Practice-Guidelines.pdf
    publisher: "Federal Court of Canada"
    accessed: 2026-11-06
---

## Federal Court PDF e-filing: the essentials

For an ordinary **non-confidential Federal Court** filing, prepare a readable PDF that is searchable, carries the required page numbering and bookmarks, is not password protected, and is **no larger than 100 MB** for the Court's standard E-Filing System. If it is too large after appropriate compression, divide it into the fewest necessary volumes. **Do not use the ordinary portal for documents subject to a confidentiality order or direction.**

These instructions concern the **Federal Court of Canada**, not the **Federal Court of Appeal**. The Federal Court's [E-Filing instructions](https://www.fct-cf.ca/en/pages/online-access/e-filing) explicitly say its system does not accept Federal Court of Appeal filings. The [Amended Consolidated General Practice Guidelines, June 20, 2025](https://www.fct-cf.ca/Content/assets/pdf/base/2025-06-20__Amended-Consolidated-General-Practice-Guidelines.pdf), particularly paragraph 19, provide additional formatting rules. Check any specialized guidelines and orders applying to your proceeding.

## Use the correct filing channel

Under paragraph 19 of the Federal Court's practice guidelines, electronic non-confidential documents are normally filed using the **Federal Court E-Filing portal**. Since June 23, 2025, filing by ordinary email has generally not been accepted except in listed circumstances, including confidential filings, a court direction, a posted notice or Registry authorization.

Submission is not the same as acceptance. The Registry examines the documents and provides a separate processing response. Save your portal confirmation number and watch for subsequent instructions or rejection notices. Filing dates, fees, service and holidays are governed by the court's current instructions; do not assume a successful upload means a document was already accepted and filed.

Before you begin, have the court file number if applicable, contact information, your formatted PDFs and the relevant proof of service. The system's online instructions also note that a partial session cannot be saved; complete the submission in one session.

## File size: 100 MB, not a universal 500-page ceiling

The [Federal Court's e-filing page](https://www.fct-cf.ca/en/pages/online-access/e-filing) gives a **100 MB maximum per uploaded document**, describing that amount as approximately **500 pages**. The 500-page figure is an approximation, **not a separately verified hard page cap** in that wording. A text-only 650-page document might be far smaller than a 300-page scanned record; where an unusually long record raises procedural concerns, follow applicable record/volume requirements or ask the Registry.

If a PDF exceeds 100 MB:

1. Confirm it was exported cleanly from the source rather than assembled as huge unoptimized images.
2. Use [Compress PDF](/compress-pdf/) on a working copy, without sacrificing the readability of handwriting, exhibits, stamps or photographs.
3. Recheck the downloaded file's **actual byte size**; compression targets are not guarantees.
4. If the result still exceeds the maximum, use [Split PDF](/split-pdf/) to create the **fewest practical volumes**, with clear sequential titles and intact page references, following any applicable record-specific instructions.
5. Open and inspect every volume, including its first and last pages. Do not overlook missing exhibits at the split boundary.

Large PDFs are processed using your device's resources in the browser for QPDF.ca's supported tools. Available memory and source complexity can affect what your browser can process. Plan for a PDF editor or workflow with sufficient capacity when handling particularly large records.

## Make the pages searchable and citations predictable

The Federal Court requires typed text in filed PDFs to be searchable. Paragraph 19(g) of the [practice guidelines](https://www.fct-cf.ca/Content/assets/pdf/base/2025-06-20__Amended-Consolidated-General-Practice-Guidelines.pdf) also directs parties to OCR electronic filings that contain scanned content or images. Where possible, export directly from Word or another digital source instead of printing and rescanning it. For unavoidable scans, run [OCR PDF](/ocr-pdf/) on a copy and test text searches across several pages.

Paragraph 19(d) calls for **visible, consecutive page numbering beginning on the first page of each PDF**, with the numbers corresponding to the electronic PDF pages and pinpoint references in submissions. Use [Add Page Numbers](/add-page-numbers-to-pdf/) if appropriate, but confirm the placement and sequence match the format required in your filing. A separate PDF Page Label setting is not a substitute for a printed number where visible numbering is required.

For example, if a volume begins with a cover followed by a table of contents, check whether the PDF's displayed page 1 is actually its first physical page. An index reference to `page 75` should take the reader directly to that page in the filed electronic file, not require mental arithmetic.

## Bookmarks and links: make a record navigable

Paragraph 19(e) requires bookmarks in electronic files containing more than one document. Each separate document, exhibit, schedule, appendix or authority—and any passage relied upon—must be separately bookmarked. The same paragraph instructs parties to verify bookmark accuracy and permit the Court to add its own bookmarks. [Edit PDF Bookmarks](/edit-pdf-bookmarks/) may assist with that organizational work.

Paragraph 19(f) also addresses external legal-authority hyperlinks in memoranda of fact and law or argument, **where materials are publicly and freely available**. Those are separate from bookmarks and from internal index navigation. Do not remove working hyperlinks inadvertently when optimizing a completed record. For exhibits and more extensive assembly advice, see [preparing PDF exhibits](/guides/prepare-pdf-exhibits/).

## Proof of service: a recommendation you should not misquote

Service and proof-of-service requirements depend on the document and the applicable rules. When proof must be filed, provide it as directed. But **the formatting recommendation in Guideline 35 is not an unconditional “must.”** It says parties **should** attach proof of service together with the electronically filed document in **one PDF**, and the proof **should** be bookmarked.

A practical workflow is to prepare the document and proof of service as separate working files, confirm they are suitable for combination (including any signature considerations), then use [Merge PDF](/merge-pdf/) and add a distinct `Proof of Service` bookmark. Verify that all pages of the proof appear and remain readable. If a court direction or document type calls for different treatment, follow that direction.

This distinction matters: the underlying obligation to serve a document or file proof where required may be mandatory, while the **single-file and bookmark arrangement described in Guideline 35 uses “should.”** See [Federal Court Guideline 35, page 12](https://www.fct-cf.ca/Content/assets/pdf/base/2025-06-20__Amended-Consolidated-General-Practice-Guidelines.pdf).

## Confidential documents require a different route

The Court instructs parties **not** to upload a document subject to a **confidentiality order or direction** through the ordinary E-Filing System. Instead, follow the [Federal Court's confidential-filing instructions](https://www.fct-cf.ca/en/pages/online-access/e-filing) and any case-specific direction. Available Registry routes include properly handled email, secure file transfer, delivery in person or mail.

For the Registry's confidential **email attachment** option, **each PDF attachment must be smaller than 18 MB**. This is not the same as the normal portal's 100 MB ceiling. The Court describes password-protected PDFs or a secure file-transfer link for this workflow, with a password or access instructions communicated **separately**, such as in another email or by telephone. Clearly identify confidential materials; do not send a password in an exposed document or assume any generic cloud link is automatically suitable.

For a 28 MB confidential exhibit, one option may be a court-accepted secure transfer link rather than degrading evidence until it is below 18 MB. If using attachments, split into compliant parts and follow the Registry's guidance. The 18 MB condition is specific to that email channel; it is **not** a general Federal Court PDF limit.

## Pre-filing PDF and submission checklist

- [ ] Confirm the matter belongs in the **Federal Court**, not the Federal Court of Appeal.
- [ ] Check current directions, special immigration or other proceeding-specific rules, and deadlines.
- [ ] Confirm the ordinary portal is appropriate; identify any confidentiality order or direction **before uploading**.
- [ ] Verify the PDF format, legibility and absence of passwords or access restrictions for ordinary E-Filing.
- [ ] Check each uploaded document is no larger than **100 MB**; if split, verify volume sequence.
- [ ] Verify typed and scanned text is searchable, with OCR where required.
- [ ] Confirm page numbers, PDF navigation and pinpoint references agree.
- [ ] Check bookmarks for each separate document, exhibit, schedule and required passage.
- [ ] Include and bookmark proof of service in the recommended arrangement when appropriate.
- [ ] Review digitally signed materials before any merge, stamping or compression.
- [ ] Submit through the correct channel and retain the confirmation; monitor the Registry's acceptance response.

QPDF.ca can help prepare files locally in your browser, but it cannot determine procedural eligibility, confirm valid service, or guarantee Registry acceptance. Always use the [Federal Court's current E-Filing guidance](https://www.fct-cf.ca/en/pages/online-access/e-filing) as the final operational authority. This guide is general PDF-preparation information, not legal advice: have a lawyer or other qualified practitioner familiar with your proceeding confirm court-specific procedure before you file.
