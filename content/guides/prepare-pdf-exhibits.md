---
title: "Preparing PDF Exhibits and Application Records: A Practical Checklist"
description: "Preserve evidence, merge exhibits, run OCR, add accurate pagination and bookmarks, and verify PDFs before court filing."
metaTitle: "Prepare PDF Exhibits and Application Records | Qpdf.ca"
category: legal
published: 2026-11-06
reviewed: 2026-11-06
relatedTools: [merge-pdf, reorder-pdf-pages, ocr-pdf, add-page-numbers-to-pdf, add-page-labels, edit-pdf-bookmarks, compress-pdf, split-pdf]
relatedGuides: [federal-court-pdf-efiling, ontario-court-of-appeal-pdf, bates-numbering-without-adobe, make-a-pdf-smaller, ircc-pdf-validation-barcodes]
sources:
  - title: "Practice Direction PD-72"
    url: https://www.bccourts.ca/supreme_court/practice_and_procedure/practice_directions/civil/PD-72_Electronic_Application_Records.pdf
    publisher: "Supreme Court of British Columbia"
    accessed: 2026-11-06
  - title: "Amended Consolidated General Practice Guidelines"
    url: https://www.fct-cf.gc.ca/Content/assets/pdf/base/2025-06-20__Amended-Consolidated-General-Practice-Guidelines.pdf
    publisher: "Federal Court of Canada"
    accessed: 2026-11-06
  - title: "General Practice Direction"
    url: https://www.ontariocourts.ca/coa/how-to-proceed-court/general/
    publisher: "Court of Appeal for Ontario"
    accessed: 2026-11-06
  - title: "Permissions and Limitations of Signed PDFs"
    url: https://helpx.adobe.com/acrobat/desktop/e-sign-documents/learn-about-signatures/signed-pdf-limitations.html
    publisher: "Adobe"
    accessed: 2026-11-06
---

## How to prepare a PDF exhibit or application record

A useful electronic court record is not simply a large PDF made by joining smaller PDFs. It must preserve the underlying evidence, present documents in the correct order, remain readable and searchable, and allow the reader to find the cited page without confusion. Your filing court may also require particular cover pages, bookmarks, hyperlinks, page labels, scanning settings or size limits.

A reliable workflow has two separate parts: **preserve the source evidence unchanged**, then **prepare a working court copy** to the receiving court's specifications. This article explains the practical PDF work. It does not replace rules of evidence, filing deadlines, a sealing order or the court's procedural directions.

## 1. Preserve originals before editing anything

Create an evidence folder containing the original files exactly as received. Keep native electronic records where available: a digitally generated statement or spreadsheet may contain useful text and metadata that a print-and-scan copy loses. For paper records, preserve the paper original and document when and how it was scanned if that information matters to the case.

Do not overwrite originals while merging, OCR-processing, adding page numbers, redacting or compressing. Use an obvious working-copy naming convention, for example:

- `originals/2026-05-12_statement.pdf` — unchanged source.
- `working/2026-05-12_statement_ocr.pdf` — searchable working copy.
- `filing/Application_Record_Volume_1.pdf` — proposed filing output.

For a contentious evidentiary record, consider recording file hashes and an audit trail. A hash can help demonstrate that a preserved copy has not changed after it was recorded, but is not by itself proof that the original was authentic when obtained. Maintain any relevant chain-of-custody documentation under the appropriate legal process.

## 2. Identify the court's requirements before assembly

Decide where the material will be filed and which rule applies. Requirements differ significantly:

- The [BC Supreme Court PD-72 pilot](https://www.bccourts.ca/supreme_court/practice_and_procedure/practice_directions/civil/PD-72_Electronic_Application_Records.pdf) permits a **single** electronic application record of **50 MB or less** for eligible applications scheduled for 30 minutes or less before an associate judge in chambers.
- The [Federal Court](/guides/federal-court-pdf-efiling/) has an ordinary E-Filing PDF limit of **100 MB** and specific page-numbering, bookmark and confidential-filing rules.
- The [Court of Appeal for Ontario](/guides/ontario-court-of-appeal-pdf/) generally restricts non-video files to **512 MiB and 500 pages**, with its own scanning and navigation standards.

These examples are **not interchangeable**. The instructions for an appeal book can differ from those for a chambers record, even within the same province. Check the current official direction and any order in your particular matter before assembling a final volume.

## 3. Create an accurate document inventory and order

List the materials expected in the record before editing: notices, affidavits, exhibits, orders, correspondence and legal authorities as appropriate. Include the document date, original filename, proposed tab or index entry, total pages and any confidentiality or signature considerations. Make an index only from the material that may properly be included.

A simple working inventory might look like this:

| Item | Source | Pages | Proposed position |
| --- | --- | --- | --- |
| Cover and index | Newly prepared court copy | 3 | First |
| Notice of application | Born-digital PDF | 6 | Tab 1 |
| Affidavit of A. Chen | Signed scan | 12 | Tab 2 |
| Exhibit A: Invoice records | Mixed scans | 8 | Tab 3 |

Keep document boundaries clear. If an affidavit refers to `Exhibit A`, confirm the exhibit label in the PDF matches the sworn text. Check whether the applicable rules require exhibits to be attached to affidavits, filed separately or placed within a prescribed record structure. A tool cannot infer those legal relationships.

## 4. Make scans searchable without changing what they show

Whenever possible, export directly from a source application to preserve searchable text. If the source is paper, scan at sufficient quality to retain handwriting, stamps, margins, dates and small print. Then apply OCR to a **working copy** using [OCR PDF](/ocr-pdf/) if the receiving court requires searchable scans.

OCR creates machine-readable text based on a page image. It can make a record searchable while still producing errors in the text layer. Search for names or phrases on several pages and inspect the visible images; a searchable PDF is not necessarily an accurate transcription. If a court specifies an OCR configuration, use software that actually meets that setting rather than assuming any OCR result is sufficient.

Do not replace a signed original with an OCR copy and then discard the source. Retain both, clearly distinguished.

## 5. Merge documents in a controlled sequence

Once individual working copies are ready, use [Merge PDF](/merge-pdf/) to assemble an ordinary sequential PDF where that format is required. [Reorder PDF Pages](/reorder-pdf-pages/) can correct mistakes, but changing order after numbering or indexing can invalidate references. Rebuild and recheck navigation whenever the sequence changes.

A standard merged PDF generally presents pages one after another. A PDF *portfolio*, by contrast, can contain separate embedded documents within a container-like viewer experience. Not every court or filing channel handles portfolios the same way. Use the format specified by your court; do not assume portfolios are universally prohibited or universally acceptable.

After merging, check the total page count against your inventory. Look for sideways pages, unexpected blanks, missing exhibit covers, duplicate pages and scans with cropped edges.

## 6. Add visible numbers, PDF page labels and navigation

Three common concepts should be managed separately:

- **Visible page numbers** are printed on the page. Use [Add Page Numbers](/add-page-numbers-to-pdf/) when a fresh sequence is required.
- **PDF Page Labels** control the page indicator seen in many PDF viewers. Use [Add Page Labels](/add-page-labels/) when page navigation needs to match a number that begins after preliminary pages.
- **Bookmarks and internal hyperlinks** let readers navigate by document title, exhibit or index entry. Use [Edit PDF Bookmarks](/edit-pdf-bookmarks/) for bookmarks, and a capable PDF editor for any clickable index links that the court requires.

For example, if a record's first evidentiary page is labelled `1` after a three-page cover and index, check that entering `1` in the viewer finds the correct page if the court expects that behaviour. PDF labels alone do not print numbers, and bookmarks alone do not create a linked index.

[Guidance on Bates numbering](/guides/bates-numbering-without-adobe/) explains a fourth concept: unique identifiers across a production. Bates stamps may help organize disclosure, but do not replace court-mandated page numbering or PDF navigation.

## 7. Compress carefully and check every volume

Large, scan-heavy records may need optimization. Use [Compress PDF](/compress-pdf/) on a copy after the required content and organization are settled, then inspect the final output. Compression can affect photographs, fine print, signatures and stamped dates. An output meeting a numerical limit is not useful if the exhibit becomes illegible. For general compression advice, see [how to make a PDF smaller without ruining it](/guides/make-a-pdf-smaller/).

If the court permits or requires multiple volumes, use [Split PDF](/split-pdf/) at sensible document boundaries where possible and label every volume consistently. Do not arbitrarily split an electronic record that must be submitted as **one** file under a particular direction. Recheck bookmarks and indexes within and across the resulting volumes.

## 8. Treat digitally signed PDFs differently

A scanned image of an ink signature, an electronic signature placed on a page and a **certificate-based digital signature** are not technically the same thing. Cryptographic signatures can validate a particular version of a PDF and may restrict subsequent edits. Merging, stamping, redacting or changing document structures **may invalidate or affect signature validation**. Some permitted incremental updates can preserve earlier signatures, so it is inaccurate to say *every possible change* automatically invalidates every signature.

Preserve the signed original, review its signature status before editing, and verify the result after any change that is permitted. If preserving signature validation conflicts with the proposed filing assembly, consult the court's instructions, the signer or appropriate qualified counsel before selecting a workflow. See [Adobe's guidance on signed-document permissions](https://helpx.adobe.com/acrobat/desktop/e-sign-documents/learn-about-signatures/signed-pdf-limitations.html) and [comparing signed PDF versions](https://helpx.adobe.com/ca/acrobat/desktop/e-sign-documents/manage-digital-signatures/compare-versions.html).

Also keep IRCC forms that require **Validate** and generate 2D barcodes out of routine flattening, merging or compression workflows unless IRCC expressly permits the operation (see [IRCC PDF validation and 2D barcodes](/guides/ircc-pdf-validation-barcodes/)). Barcode form validation is different from cryptographic digital-signature validation.

## 9. Decide whether metadata should be preserved or removed

A newly drafted filing copy may include irrelevant author metadata. But a native evidentiary PDF may contain provenance information worth retaining. Do not automatically run [Remove PDF Metadata](/remove-pdf-metadata/) or [Sanitize PDF](/sanitize-pdf/) on original evidence. The latter removes links, attachments and accessibility structure by default and can undermine a court record's navigation requirements without removing visible page text.

If a court-authorized disclosure copy requires privacy redactions, apply **true redaction** and review hidden information on the *copy*, while preserving the source. The [metadata disclosure checklist](/guides/pdf-metadata-disclosure-checklist/) and [permanent redaction guide](/guides/permanent-pdf-redaction/) explain what each operation changes.

## 10. Final pre-filing quality assurance

Use the final downloaded or exported file, not a preview:

- [ ] The court, proceeding, document type and filing channel are correct.
- [ ] Original evidence is preserved; the working copy is clearly identifiable.
- [ ] The filing contains the required documents in the correct sequence, with no missing or duplicate pages.
- [ ] Every page is upright, legible and complete; scans are searchable where required.
- [ ] Exhibits match affidavit references, tab names and index entries.
- [ ] Visible numbering, PDF Page Labels and pinpoint citations align.
- [ ] Required bookmarks, internal links and opening navigation work after the final export.
- [ ] File sizes and any page-count limits are met **per file**, including separate sealed-material rules.
- [ ] The final record retains required accessibility features and does not carry unintended attachments or comments.
- [ ] Digitally signed originals have been preserved and signature validation has been considered.
- [ ] Any authorized redactions have been independently checked for hidden copies.
- [ ] The submission has been reviewed by the responsible person and filing confirmation retained.

A technically clean PDF does not guarantee the court will accept it. **Court-specific instructions control** over general preparation practices, and legal questions about authenticity, admissibility, privilege or filing deadlines require their own review. This guide is general PDF-preparation information, not legal advice; have a lawyer or other qualified practitioner confirm court-specific procedure before you file.
