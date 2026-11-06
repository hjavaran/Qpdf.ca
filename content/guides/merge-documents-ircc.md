---
title: "How to Merge Multiple Documents for One IRCC Upload Field"
description: "Combine supporting PDFs for a single IRCC upload slot, arrange pages clearly and check the finished file without altering validated application forms."
metaTitle: "Merge Documents for One IRCC Upload Field | Qpdf.ca"
category: immigration
published: 2026-11-06
reviewed: 2026-11-06
relatedTools: [merge-pdf, reorder-pdf-pages, compress-pdf, compress-pdf-to-4mb]
relatedGuides: [ircc-pdf-upload-limits, compress-bank-statements-ircc, ircc-pdf-validation-barcodes]
sources:
  - title: "I need to add multiple files to my online application, but there is only one field to upload documents. What can I do?"
    url: https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1160
    publisher: Immigration, Refugees and Citizenship Canada
    accessed: 2026-11-06
  - title: "My documents are too large to upload. How do I reduce the file size?"
    url: https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1213
    publisher: Immigration, Refugees and Citizenship Canada
    accessed: 2026-11-06
  - title: "How do I fill out and validate IRCC application forms with 2D barcodes?"
    url: https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1523
    publisher: Immigration, Refugees and Citizenship Canada
    accessed: 2026-11-06
  - title: "Is there a file size limit for documents I upload to my account?"
    url: https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1123
    publisher: Immigration, Refugees and Citizenship Canada
    accessed: 2026-11-06
---

If your IRCC checklist gives you **one upload field for several related supporting documents**, combine them into **one organized PDF** before uploading. IRCC's [Help Centre explains](https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1160) that only **one file can be saved per field** and, if you upload several files to that same field, **only the last one** will be retained.

The goal is to produce one readable package that satisfies *that particular field's instructions*—not to merge an entire application into a single PDF.

## When should you merge supporting documents?

Merging is useful when several items together support one checklist requirement. Examples include:

- A birth certificate, its translation and any accompanying translator documentation required by the relevant program.
- Multiple pages of a single lease or employment contract that were scanned as separate PDFs.
- Several bank statement files covering a financial period requested in one proof-of-funds upload field.
- A main supporting letter with clearly related attachments, when the checklist permits a single evidence bundle.

Before combining them, read the application guide. Some portals give **separate** fields for the original document, translation and other evidence; others describe a different packaging method. Follow those instructions. IRCC's one-file-per-field guidance does **not** require merging unrelated evidence or putting documents in the wrong slot.

Do not assume that one specific order for original-language documents, certified translations and affidavits is legally required in **every** immigration program. Translation requirements vary with the application. Use the relevant IRCC checklist to determine which components must be included and whether their order is specified.

## An example of a readable upload package

Suppose the portal has a single field labelled **Birth certificate** and the instructions require a foreign-language original with an English or French translation and translator documentation. You have three PDFs:

1. `birth-certificate-original.pdf`
2. `birth-certificate-translation.pdf`
3. `translator-documentation.pdf`

A sensible practical order—**if your specific checklist does not prescribe a different order**—might be the translation, the original certificate, then the associated translator documentation. Another program may call for the original first or require an additional item. The key is that an officer can easily locate the original and its corresponding translation, and all required pages are present.

A second example is a four-month statement package. Put the oldest or most recent month first according to the purpose and any checklist directions, then keep the remaining months in a consistent chronological order. Do not interleave pages from separate accounts without clear organization.

## Step-by-step: merge PDFs using QPDF.ca

### 1. Prepare the inputs

Keep the originals in a secure folder and work with copies. Open each PDF and check that it is complete: no cut-off scans, unreadable seals, blank backsides that contain important information or missing signature pages.

Give the working copies clear names so you can recognize them during merging. If one item is a photo rather than a PDF, check whether the portal accepts it directly or whether it must be included in a combined PDF. Do not convert documents simply for convenience when your program specifies another format.

### 2. Combine the files

Open [Merge PDF](/merge-pdf/) and select the supporting PDFs for **one upload field**. Arrange the files in the sequence you want the officer to see and generate the combined PDF.

QPDF.ca's tested browser-based merging workflow processes the PDF content locally rather than uploading it to a PDF-processing server. That reduces one category of exposure for sensitive documents, but does not replace secure device handling. See the site's [privacy information](/privacy/) and avoid working with confidential evidence on a shared computer.

### 3. Fix page order only if needed

Open the merged result and review it from the first page to the last. If pages ended up in the wrong sequence, you can use [Reorder PDF Pages](/reorder-pdf-pages/) on the **supporting-document bundle**. Verify the corrected output before uploading.

A cover page or table of contents can help with a long bundle, but add one only if useful and permitted. It should accurately identify what follows; it should not replace required evidence or introduce unnecessary pages.

### 4. Check the merged file's size

Merging multiple scans often produces a file larger than the portal's allowance. IRCC's [file-size limits differ by account](https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1123); in some special procedures they also differ by document type. Check [the IRCC upload-limit guide](/guides/ircc-pdf-upload-limits/) rather than assuming a universal 4 MB rule.

For a supporting-document field with a **4 MB limit**, try [Compress PDF to 4 MB](/compress-pdf-to-4mb/). For other limits, try [Compress PDF](/compress-pdf/). Both are compression aids, **not guarantees** of a particular result or an accepted upload. If a scan becomes unreadable, use a better source or less aggressive compression. Our [bank statement guide](/guides/compress-bank-statements-ircc/) provides a fuller verification process for financial evidence.

### 5. Run a final document check

Before uploading the bundle, confirm:

- **Coverage:** Every item requested for this field is included; nothing belonging in a separate field was added by mistake.
- **Order:** The original, translation, related affidavit or other attachments can be identified without guesswork.
- **Page integrity:** All scans have the right orientation, and the page count equals the sum of the necessary inputs, unless an intentional and justified correction was made.
- **Readability:** Names, dates, official seals, numerical values and all necessary text remain clear.
- **Consistency:** Pages from different people or different applications have not been accidentally combined.
- **Size and format:** The actual downloaded file satisfies the upload field's stated conditions.

Finally, upload the **merged** file and check that it appears in the correct slot. Do not upload the components one at a time into the same field expecting the portal to keep them all; IRCC says it will retain only the final file in that situation.

## Do not merge specialized validated IRCC forms

**Official application forms with a Validate button or 2D barcode pages are different from ordinary supporting documents.** They may depend on form fields, scripts and data structures that generic PDF processing does not preserve. Do not merge, compress, flatten or otherwise re-save those forms with QPDF.ca as a workaround.

Instead, complete and validate such forms using the program-specific official instructions and [IRCC's guidance for 2D barcode forms](https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1523). If the form has a barcode or signature problem, use [our separate validation guide](/guides/ircc-pdf-validation-barcodes/) rather than changing the form through a merging tool.

## Common mistakes that cause trouble

**The upload includes only one of three files.** This often happens when each component was uploaded separately to the same field. Create and inspect one combined PDF, then upload it once.

**The bundle is below the limit but blurry.** The goal is not to satisfy the byte limit at any cost. Start again from higher-quality source documents, compress less aggressively and verify small print.

**There are two places to upload the same kind of evidence.** Read the labels and checklist carefully. An additional-documents field is not automatically permission to relocate a required document from its dedicated field.

**The translation appears incomplete.** Confirm the program's requirements for translations and supporting documentation. Merging technically valid PDFs does not remedy missing, incorrect or improperly prepared evidence.

A successful merge means the PDFs were combined. **It does not certify that IRCC will accept the package**, that a translation meets program rules or that the content satisfies the application checklist.
