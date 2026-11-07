---
title: "PDF Metadata, Comments and Hidden Information: Disclosure Checklist"
description: "Inspect PDF metadata, XMP, attachments, notes and OCR layers before disclosure—and choose the right cleanup tool."
metaTitle: "PDF Metadata and Hidden Information Checklist | Qpdf.ca"
category: privacy-security
published: 2026-11-06
reviewed: 2026-11-06
relatedTools: [remove-pdf-metadata, sanitize-pdf, redact-pdf, flatten-pdf]
relatedGuides: [permanent-pdf-redaction, prepare-pdf-exhibits, rcic-client-pdf-privacy, ircc-pdf-validation-barcodes]
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

## The information you cannot see may still be in the PDF

Before disclosing a PDF, check more than its visible pages. The file may contain an author's name, editing history, comments, document attachments, bookmarks that reveal client names, searchable OCR text behind scans, and interactive elements. Some of these are harmless; others may expose confidential information or be essential evidence that **must be preserved**.

The right approach is a **disclosure checklist**, not a one-click promise to make every PDF safe. Start with an untouched source, decide which information belongs in the release, use the smallest appropriate changes on a copy, and verify the result. Whether any material can be withheld is a legal or procedural decision independent of the PDF technology.

## What hidden information should you look for?

| PDF component | Why it matters | What to check |
| --- | --- | --- |
| Document properties | May show author, title, subject, application or timestamps | Open the PDF's Properties or document information panel |
| XMP metadata | Structured metadata may extend beyond the Properties dialog | Inspect document-level and, when material, page or image XMP |
| Comments and annotations | Notes, highlights and replies may contain internal discussion | Open the comments pane; inspect notes on every page |
| Attachments | Entire spreadsheets, drafts or supporting PDFs may be embedded | Check the attachments pane and attachment names |
| Bookmarks | Titles can identify a person or reveal case strategy | Expand the complete bookmark tree |
| OCR text | Text beneath a scan can be selected or searched, even if invisible | Search and copy terms on scanned pages |
| Form fields and scripts | Field values, actions and JavaScript may carry data or behaviour | Inspect active fields and embedded actions when relevant |
| Links and accessibility structure | Useful for navigation or assistive technology, but may include descriptive data | Test and decide whether these must remain in the deliverable |
| Earlier revisions or embedded objects | Some file histories or alternate objects may retain previous material | Use a capable PDF inspection tool for high-risk releases |

A visual-only review can miss a bookmark named after a client, an attachment containing a draft contract, or an invisible OCR result exposing an account number. Conversely, deleting every hidden object can destroy required citations, links and the provenance of an evidentiary document.

## Which QPDF.ca tool does what?

The four operations below solve different problems. They are **not interchangeable**.

### Remove PDF Metadata: document properties, not page content

[Remove PDF Metadata](/remove-pdf-metadata/) removes document properties, document-level XMP, file IDs and PieceInfo, as checked in QPDF.ca's own tests with synthetic PDFs (November 2026). It does **not** remove the main page content, comments, attachments, form entries or bookmarks. XMP attached to individual pages or images may remain. A cleared Author field is therefore **not proof** that all metadata has been removed.

Use it when a released, non-evidentiary copy should not carry ordinary document-level properties. Verify its output and consider whether provenance fields are needed first.

### Sanitize PDF: broader structure removal, with trade-offs

[Sanitize PDF](/sanitize-pdf/) removes several classes of non-page content by default, including metadata, comments, JavaScript, attachments, layers, links and the structure tree used for accessibility; it also flattens forms by default. It **does not remove sensitive visible or hidden searchable page text**. It is not a redaction operation.

This matters particularly for court bundles. Sanitizing after building a hyperlinked index can remove the links; removing accessibility structure may affect users of assistive technology. Do not automatically sanitize a completed record. Inspect the required deliverable and the tool's effects before using it.

### Redact PDF: removal of selected content

[Redact PDF](/redact-pdf/) removes content under applied marks in tested synthetic PDFs, including text and marked scan pixels. Its area marks do not remove copies elsewhere in bookmarks, attachments, metadata or outside annotations. Text marks performed exact-phrase cleanup in those tests, but outside copies with different wording remained. See [how to permanently redact a PDF](/guides/permanent-pdf-redaction/) for the removal and verification workflow.

### Flatten PDF: appearance, not confidentiality

[Flatten PDF](/flatten-pdf/) converts supported interactive fields or comments into page content. It is useful when a recipient needs a fixed appearance, but **flattening is not redaction** and hidden text may remain. Flattening can also change or remove functionality, including important form features. Do not use it on validated IRCC forms with a Validate button or 2D barcodes unless the issuing authority expressly permits that workflow; see [what not to change on IRCC forms](/guides/ircc-pdf-validation-barcodes/).

## A disclosure workflow that preserves what matters

1. **Identify the release purpose.** Are you sending a client copy, producing discovery, filing an exhibit, publishing an access-to-information response, or delivering a marketing handout? The answer determines what should be removed and what must stay.
2. **Preserve the original.** Store an unchanged version with appropriate controls. For evidence, retain the native file, original metadata and relevant chain-of-custody information.
3. **Make a working copy and inventory it.** Confirm page count and the presence of comments, attachments, bookmarks, forms and scans. Check document properties and selected image/page metadata if important.
4. **Review for actual confidential content.** Search distinctive names and identifiers across page text and any accessible OCR layer. Inspect the visual pages and attached documents. Decide the authorized redactions before applying them.
5. **Use targeted tools.** Apply [Redact PDF](/redact-pdf/) to information that may properly be withheld; consider metadata removal on a non-evidentiary release; use sanitization only if losing links, attachments, comments and structural accessibility is acceptable.
6. **Inspect the downloaded result.** Search for confidential phrases, check attachments and comments, test links and bookmarks, and ensure the content remains complete and readable.
7. **Document the decision.** Where the record is sensitive, note what was removed, by whom, for what disclosure purpose and which output was finally approved.

For example, a firm may wish to remove the Word author name from a public-facing brochure; metadata cleanup could be sufficient if the file contains no other sensitive content. The same approach would be unsuitable for an original signed contract whose authorship and history may matter to an evidentiary dispute.

## When preserving metadata is more important than deleting it

Metadata can help establish who created a file, when it was created or how it moved between systems. Those fields are not conclusive proof of authenticity, but deleting them from the only existing copy may obstruct later verification. Preserve native source files and relevant logs when dealing with litigation holds, electronic discovery, allegations of document alteration or records of legal significance.

A sensible approach is to maintain **two clearly labelled artefacts**: the preserved original and the approved disclosure copy. If metadata must be removed from the latter, record that alteration rather than presenting the sanitized copy as an untouched original. Our [PDF exhibits preparation guide](/guides/prepare-pdf-exhibits/) describes the separation in more detail.

## Confidentiality is not a tool setting

The [Office of the Privacy Commissioner of Canada](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda-compliance-help/pipeda-interpretation-bulletins/interpretations_08_sg/) explains that safeguards under PIPEDA are assessed in light of the sensitivity of information and the circumstances. BC lawyers should also consider the [Law Society of British Columbia's confidentiality rules](https://www.lawsociety.bc.ca/for-lawyers/act-rules-and-code/code-of-professional-conduct/chapter-3-%E2%80%93-relationship-to-clients/). Processing supported files locally in a browser reduces the need to upload their contents to a PDF-processing server, but is not a compliance certificate, an independent security audit or a substitute for firm policy.

## Final hidden-information checklist

- [ ] The preserved original and disclosure copy are clearly separated.
- [ ] Document properties and relevant XMP have been examined.
- [ ] Every comment and attachment has been reviewed for unexpected disclosure.
- [ ] Bookmarks, links, forms and field values have been considered.
- [ ] Scanned pages have been checked for both visible information and OCR text.
- [ ] Authorized redactions have been applied as actual removals, not graphic overlays.
- [ ] Any sanitization has not destroyed required navigation, accessibility or evidence.
- [ ] Search, copy/paste, page count and visual checks have been repeated on the final exported PDF.
- [ ] A responsible reviewer has approved the precise file being sent.

No single button verifies every possible hidden object. For sensitive disclosures, combine tool-specific understanding with a documented review process and, when warranted, specialist PDF inspection.
