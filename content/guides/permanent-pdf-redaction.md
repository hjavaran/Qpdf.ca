---
title: "How to Permanently Redact a PDF (Not Just Draw Black Boxes)"
metaTitle: "How to Permanently Redact a PDF | Qpdf.ca"
description: "Remove sensitive PDF content properly, understand hidden copies and OCR risks, and verify every redaction before disclosure."
category: privacy-security
published: 2026-11-06
reviewed: 2026-11-06
relatedTools: [redact-pdf, remove-pdf-metadata, sanitize-pdf]
relatedGuides: [pdf-metadata-disclosure-checklist, prepare-pdf-exhibits, rcic-client-pdf-privacy, check-if-pdf-tool-uploads-files]
sources:
  - title: "Interpretation Bulletin: Safeguards"
    url: https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda-compliance-help/pipeda-interpretation-bulletins/interpretations_08_sg/
    publisher: "Office of the Privacy Commissioner of Canada"
    accessed: 2026-11-06
  - title: "Code of Professional Conduct, Chapter 3"
    url: https://www.lawsociety.bc.ca/for-lawyers/act-rules-and-code/code-of-professional-conduct/chapter-3-%E2%80%93-relationship-to-clients/
    publisher: "Law Society of British Columbia"
    accessed: 2026-11-06
---

## A black rectangle is not a redaction

To permanently redact a PDF, you must **remove the information**, not merely hide it from view. A black rectangle placed over a name, account number or sentence can leave the original text underneath. Someone may still find it with Search, select and copy it, extract PDF objects, or inspect a hidden OCR layer. Printing a document to PDF or flattening a black overlay is not a dependable substitute for actual content removal.

The practical rule is simple: preserve an untouched original, apply a purpose-built redaction operation to a working copy, **export a new PDF**, and test the exported file before sharing it. If the material is subject to a court order, disclosure protocol or records-retention duty, determine *what may be removed* before using any tool.

## What can survive an apparently successful redaction?

A PDF is more than the image you see on the screen. Sensitive information may occur in several places:

- **Selectable page text:** The words behind a drawn rectangle can still exist in the text stream.
- **Scanned images:** The actual image pixels depicting a signature or number must be changed, not merely covered by a separate shape.
- **Invisible OCR text:** A scanned page may have a searchable text layer behind the image. Editing only the visible scan can leave that text intact.
- **Comments and annotations:** A comment may repeat a person's name, or a note outside the redacted area may quote a supposedly deleted phrase.
- **Bookmarks and attachments:** Navigation titles and embedded files may repeat material removed from a page.
- **Document properties and XMP:** Author, title, keywords and other descriptive fields can disclose information independently of page content.
- **Earlier document states:** Some PDFs contain incremental revisions or other embedded structures requiring deeper inspection.

For example, removing a client's address from page 3 does not remove the same address from an attached intake form or from a bookmark titled with the client's address. A defensible review examines both the **visible page** and the **other places the same fact may exist**.

## How QPDF.ca's Redact PDF tool works—and where its tests stop

[Redact PDF](/redact-pdf/) supports area marks and text marks. QPDF.ca's own tests (November 2026) used synthetic PDFs inspected for visible text, hidden OCR text, image pixels, annotations, attachments, bookmarks, metadata and underlying PDF objects. These were implementation tests, **not an independent security audit or a guarantee for every real-world PDF**.

**Area (box) redaction:** In those tests, content inside the marked rectangle was genuinely removed, including selectable text, OCR text, scanned-image pixels and an in-area annotation. Crucially, an area mark **did not remove copies elsewhere**, including outside comments, bookmarks, attachments or document properties. Do not treat a successful-looking box as whole-document cleanup.

**Text-mark redaction:** Selecting the exact sensitive phrase removed it from the page and, in the tested fixture, cleaned up exact matching copies elsewhere. But the secondary cleanup depends on the **exact marked phrase**. If a page says `Account: 12345678` and a bookmark says `Client 12345678`, marking the entire phrase `Account: 12345678` is not a reliable way to find the shorter identifier in the bookmark. Selecting the identifier itself is more appropriate—but you still need to verify the outcome.

The tests did not cover every font, rotated-page arrangement, encrypted input, form-field value or unusual PDF structure. For a highly sensitive record, consider an independently reviewed workflow and a second verification method.

## Step by step: redact a PDF before disclosure

1. **Keep the original unchanged.** Save the source separately, with appropriate access controls. Note its filename and version. Never overwrite the only evidentiary copy.
2. **Decide exactly what needs removal.** Review the applicable disclosure obligations, privilege claims, privacy grounds or redaction instructions. A technical tool cannot decide which information may lawfully be withheld.
3. **Make a review inventory.** List each sensitive name, identifier, photograph, passage and repeated occurrence. Check the whole file, including appendices and scans.
4. **Open the working copy in [Redact PDF](/redact-pdf/).** Use area marks for regions such as a signature or a section of a scan. Use text marks for distinct selectable phrases when appropriate. Review both the marked boundaries and nearby text before applying the operation.
5. **Export to a clearly named new file.** Use a name such as `Disclosure_Redacted_Review.pdf`. Keep the source and redacted versions separate.
6. **Inspect the entire output visually.** Open it with a PDF viewer other than the one used for redaction if possible. Confirm every intended area is covered, adjoining content remains legible, and page order is intact.
7. **Check hidden and repeated content.** Search and attempt to copy the exact sensitive terms. Inspect bookmarks, comments, attachments and properties; do not rely on visual appearance alone.
8. **Decide whether secondary cleanup is appropriate.** [Remove PDF Metadata](/remove-pdf-metadata/) can remove certain document-level properties, but does not remove page text, comments, attachments or bookmarks. [Sanitize PDF](/sanitize-pdf/) removes a broader set of structures by default, including links, attachments, comments and accessibility tags, but **does not redact visible or hidden page text**. Either operation may damage a required court record or destroy information that should be preserved as evidence.
9. **Repeat verification on the final version.** If you modify the file again after checking it, check it again. Release only the version that passed review.

## Post-redaction verification checklist

Use this list on the **downloaded result**, not the original:

- [ ] The targeted information is not visible at normal or high zoom, including at the edges of redaction marks.
- [ ] Searching for each removed name, number and distinctive phrase gives no unexpected matches.
- [ ] Copying or selecting the redacted area does not retrieve the removed text.
- [ ] Scanned pages and their OCR layers have been checked; the original pixels are not recoverable through ordinary extraction.
- [ ] Bookmarks, page titles, comments, annotations and embedded attachments have been reviewed for repeated information.
- [ ] Document-level metadata and any relevant page/image metadata have been reviewed, not merely the Properties dialog.
- [ ] Pages, remaining text, links and exhibits still function as required.
- [ ] A second reviewer has checked particularly sensitive releases or material governed by a formal disclosure process.
- [ ] The approved, redacted output is identified separately from the preserved original.

A basic PDF viewer's Search feature cannot prove that every stream or historical revision is clean. For high-risk release, use specialist PDF inspection and document the review.

## Should you sanitize after redacting?

**Not automatically.** If the deliverable is a public handout without important links or embedded materials, targeted metadata cleanup or sanitization may be useful after redaction. If it is a court application record, sanitization can delete clickable index links, accessibility structure or attachments the receiving authority needs. Inspect the tool's documented changes before deciding.

For a systematic comparison of these operations, see the [PDF metadata and hidden-information checklist](/guides/pdf-metadata-disclosure-checklist/). If you are assembling evidence rather than publishing a redacted copy, start with [preparing PDF exhibits](/guides/prepare-pdf-exhibits/).

## Privacy and legal responsibility remain with the sender

Processing a supported QPDF.ca file locally in your browser limits the need to send its contents to a document-processing server. That is an operational privacy feature (you can [check it yourself](/guides/check-if-pdf-tool-uploads-files/)), **not an independent security certification or an automatic finding of legal compliance**. Organizations subject to PIPEDA must adopt safeguards appropriate to the sensitivity of personal information; see the [Office of the Privacy Commissioner of Canada's safeguards interpretation bulletin](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda-compliance-help/pipeda-interpretation-bulletins/interpretations_08_sg/). BC lawyers should also consider their [professional confidentiality obligations](https://www.lawsociety.bc.ca/for-lawyers/act-rules-and-code/code-of-professional-conduct/chapter-3-%E2%80%93-relationship-to-clients/).

Redaction is not reversible once the only working content has been removed. Preserve the source, use a deliberate process, and treat failed verification as a reason to withhold the file until the problem is resolved. This guide addresses PDF preparation, not whether any particular redaction is legally permitted.
