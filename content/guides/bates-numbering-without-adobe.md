---
title: "Bates Numbering PDFs Without Adobe Acrobat Pro"
description: "Apply consistent Bates IDs across multiple PDFs, distinguish them from page labels, and avoid production numbering mistakes."
category: legal
published: 2026-11-06
reviewed: 2026-11-06
relatedTools: [bates-numbering, add-page-numbers-to-pdf, add-page-labels]
relatedGuides: [prepare-pdf-exhibits, federal-court-pdf-efiling]
sources:
  - title: "Bates Numbering tool"
    url: https://qpdf.ca/bates-numbering/
    publisher: "QPDF.ca"
    accessed: 2026-11-06
  - title: "Amended Consolidated General Practice Guidelines"
    url: https://www.fct-cf.ca/Content/assets/pdf/base/2025-06-20__Amended-Consolidated-General-Practice-Guidelines.pdf
    publisher: "Federal Court of Canada"
    accessed: 2026-11-06
  - title: "General Practice Direction"
    url: https://www.ontariocourts.ca/coa/how-to-proceed-court/general/
    publisher: "Court of Appeal for Ontario"
    accessed: 2026-11-06
---

## You can Bates-number PDFs without Adobe Acrobat Pro

Bates numbering assigns a **distinct identifier to each page** of a document set, usually in a predictable sequence such as `DISC-000001`, `DISC-000002` and `DISC-000003`. It is useful for referring to pages in document production, litigation, internal investigations and large reviews: two people can identify `DISC-000417` without guessing which attachment or page-number convention the other person is using.

You do not need Adobe Acrobat Pro to apply these identifiers. QPDF.ca provides a [Bates Numbering tool](/bates-numbering/) that processes supported PDFs in the browser and can number multiple files continuously. **Bates stamps are a production convention, not a universal rule imposed by every Canadian court.** Before processing records, follow the receiving party's disclosure protocol, a court direction or the agreed numbering specification.

## Bates number, page number and PDF page label: three different things

| Feature | What it tells the reader | Example |
| --- | --- | --- |
| Bates number | A stable identifier for a page across a production or document set | `WT-000148` |
| Printed page number | A page's position within a document, affidavit or record | `Page 12` |
| PDF Page Label | The value shown in the PDF viewer's page-navigation field | `A-12` |

The distinctions matter. A 40-page affidavit may have page numbers 1–40 while receiving Bates numbers `PROD-000501` to `PROD-000540`. Separately, a PDF viewer may display Roman-numeral preliminary pages or labels that do not match physical page positions. [Add Page Numbers](/add-page-numbers-to-pdf/) prints visible numbers; [Add Page Labels](/add-page-labels/) changes navigation labels. Neither operation automatically creates a production-wide Bates series.

## Choose a numbering scheme before touching the files

A useful Bates specification answers five questions:

1. **Prefix:** What short, consistent string identifies the production or producing party? For example, `ACME-` or `EXH-`.
2. **Starting number:** Does the set begin at 1, or continue from an earlier delivery? If an earlier production ended at `ACME-000350`, the next page ordinarily starts at `ACME-000351`.
3. **Number width:** How many digits are needed? Six digits (`000001`) can accommodate an extensive series without uneven formatting.
4. **File order:** Which document is first, and what is the order within each document? Record the final order *before* numbering.
5. **Stamp placement:** Where can the identifier go without obscuring text, stamps, handwritten notes or an exhibit marker?

For example, a firm preparing three disclosure volumes might decide on `LIT-000001` onward, with the identifier near the lower-right margin. If a page already contains a signature there, move the placement or alter the layout; legibility matters more than visual uniformity.

A documented prefix and numbering map reduce the risk of duplicated ranges, accidental resets and confusion when a supplementary production follows months later.

## How to Bates-number multiple PDFs in QPDF.ca

1. **Preserve the originals.** Work from copies. For potentially evidentiary native files, retain the untouched source and relevant metadata.
2. **Finalize document ordering.** Rename working files with a clear sort order if useful (`01_Correspondence.pdf`, `02_Statements.pdf`, `03_Exhibits.pdf`).
3. **Open [Bates Numbering](/bates-numbering/).** Add the PDFs to the tool and confirm their order in its interface.
4. **Set the identifier scheme.** Pick a style or write a custom one (for example `CASE-[BATES]`), then set the number of digits, the start number and one of the six header or footer positions, according to the agreed production instructions. The tool offers fixed positions rather than free placement, so check that nothing is covered on dense pages. Apply Bates numbering after redaction and other page changes, because the stamp becomes part of the page.
5. **Check sample pages for collisions.** Inspect the first page, a page with dense content and any landscaped or unusually sized page. A Bates stamp must not cover underlying evidence.
6. **Generate the numbered files.** Download the output and retain the original-to-production mapping.
7. **Verify continuity.** Check the first and last identifier of each resulting file and the transitions between files. Search visually for duplicate, omitted or unexpectedly restarted identifiers.

A QPDF.ca synthetic test numbered two PDFs containing three and two pages. The resulting sequence ran continuously from `000001` through `000005`. This demonstrates the tested multi-file behaviour; it does not remove the need to inspect your own output, including rotated pages, unusual page sizes and long document sets.

## Example: five pages in two files

Suppose the first PDF contains three pages of correspondence and the second contains two bank-statement pages. With prefix `CASE-`, a six-digit sequence and starting value 1, your expected results are:

| Source file | Page | Expected Bates ID |
| --- | --- | --- |
| Correspondence.pdf | 1 | `CASE-000001` |
| Correspondence.pdf | 2 | `CASE-000002` |
| Correspondence.pdf | 3 | `CASE-000003` |
| Statements.pdf | 1 | `CASE-000004` |
| Statements.pdf | 2 | `CASE-000005` |

The critical check is the boundary: the second PDF begins at `CASE-000004`, not `CASE-000001`. If the files are later merged or pages removed, prepare a revised index explaining the changes. Avoid silently reassigning identifiers that have already been cited in correspondence or pleadings.

## Common Bates-numbering mistakes

**Resetting the counter for each file.** That creates duplicate identifiers across a multi-file production. Use a continuous sequence and verify it at file boundaries.

**Numbering before settling the order.** Moving or inserting pages later can produce confusing gaps or mismatches between the production index and the stamped pages. Finalize order first. A gap may be intentional in a controlled production, but should not be accidental.

**Covering evidence.** A stamp placed over a footer, date or signature can make an otherwise useful page harder to read. Inspect problem pages at high zoom.

**Confusing Bates IDs with PDF navigation.** A lawyer may cite `CASE-000327`, while a court direction requires PDF page references that point to the same physical page. Use the required court pagination alongside Bates identifiers, rather than replacing it without permission.

**Changing digitally signed documents.** Bates stamping modifies the PDF and may affect certificate-based signature validation. Keep the signed original untouched, assess whether a stamped copy is acceptable, and verify signatures if a transformation is authorized. See the [exhibits preparation guide](/guides/prepare-pdf-exhibits/).

**Assuming numbering proves authenticity.** A Bates ID is an organizational label; it does not authenticate evidence, establish when a record was created or prove that the production is complete.

## Do Canadian courts require Bates numbering?

Not universally. Requirements vary by proceeding, judge, registry and production agreement. For example, the [Federal Court's June 2025 general practice guidelines](https://www.fct-cf.ca/Content/assets/pdf/base/2025-06-20__Amended-Consolidated-General-Practice-Guidelines.pdf) focus on PDF page numbering, bookmarks and pinpoint navigation for electronic filings; they do not establish a blanket Bates-stamping rule for all Canadian proceedings. The [Court of Appeal for Ontario's practice direction](https://www.ontariocourts.ca/coa/how-to-proceed-court/general/) likewise contains its own page-reference and electronic-navigation requirements. A Bates sequence does not override them.

For records being filed rather than produced to another party, check the specific [court PDF formatting guide](/guides/federal-court-pdf-efiling/) or [Ontario appellate guide](/guides/ontario-court-of-appeal-pdf/) first. If you need a single PDF after applying identifiers, [Merge PDF](/merge-pdf/) may help, but recheck the resulting pages and any signed material.

## Final production check

Before delivery, confirm the count of source pages equals the count of numbered pages, the sequence is unique and continuous where intended, the prefix is correct, no identifier obscures content, and all files open normally. Record the sequence ranges in a simple production log. A five-minute check now is far easier than explaining conflicting Bates references after the documents have been distributed.
