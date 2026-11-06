---
title: "IRCC PDF Upload Limits: 4 MB, 5 MB and Exceptions"
description: "Find the IRCC file-size limit for your account, understand refugee-claim exceptions, and reduce supporting PDFs without losing essential details."
category: immigration
published: 2026-11-06
reviewed: 2026-11-06
relatedTools: [compress-pdf, compress-pdf-to-4mb]
relatedGuides: [compress-bank-statements-ircc, merge-documents-ircc, ircc-pdf-validation-barcodes]
sources:
  - title: "Is there a file size limit for documents I upload to my account?"
    url: https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1123
    publisher: Immigration, Refugees and Citizenship Canada
    accessed: 2026-11-06
  - title: "Guide 0192 – CBSA refugee claims submitted through the IRCC Portal"
    url: https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/guide-0192-cbsa-refugee-claims-ircc-portal.html
    publisher: Immigration, Refugees and Citizenship Canada
    accessed: 2026-11-05
  - title: "My documents are too large to upload. How do I reduce the file size?"
    url: https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1213
    publisher: Immigration, Refugees and Citizenship Canada
    accessed: 2026-11-06
---

**There is no single IRCC PDF upload limit.** The general maximum is **4 MB for some accounts and 5 MB for others**, while a particular refugee-claim workflow specifies **2 MB for many supporting documents and 9.6 MB for certain named documents**. Before compressing anything, identify the account and the upload field you are actually using.

## IRCC file-size limits by online account

IRCC's [official upload-limit Help Centre page](https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1123), modified November 3, 2026, lists these **general per-file** limits:

| Online account or portal | General maximum per file |
| --- | ---: |
| IRCC secure account | 4 MB |
| IRCC Portal | 5 MB |
| IRCC Portal – New version | 5 MB |
| Online citizenship application | 4 MB |
| Asylum portal | 4 MB |
| Permanent Residence Portal | 4 MB |

These are account-level reference figures, not a promise that every program, document category or upload screen has the same rule. Check the instructions for your application and the message shown beside the actual upload field. In particular, **do not assume that an IRCC Portal field accepts 5 MB just because the general table says so**.

IRCC's own file-reduction advice adds that, depending on what you are applying for, the limit can be [as low as 2 MB](https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1213).

There is also no verified, universal 4 MB figure for *every* IRCC webform request. A webform or other special process may have its own attachment restrictions; follow those on-screen instructions rather than borrowing a number from another process.

## Refugee-claim exception: 9.6 MB for specified files, 2 MB for others

[IRCC's Guide 0192 for CBSA refugee claims submitted through the IRCC Portal](https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/guide-0192-cbsa-refugee-claims-ircc-portal.html) gives a different rule for that **specific workflow**:

- **9.6 MB** for the **Passport**, **Other travel documents** and **Basis of Claim** document categories.
- **2 MB** for **every other document** in the workflow described by that guide.

Guide 0192 also carries a **November 3, 2026 asylum-system change notice**. According to that notice, a claim already submitted is processed as usual; someone who started a claim in the IRCC Portal before November 3 but had not submitted it must answer new questions and review earlier answers, while saved personal information remains. Read the current guide and your portal prompts before continuing.

**Example:** A 6 MB passport scan might fall under the 9.6 MB category in Guide 0192, but a 6 MB supporting letter would not fit its 2 MB category. This does **not** mean every asylum application, or every use of the IRCC Portal, has those same exceptions.

## Why a file shown as “4 MB” may still be too large

Computer displays do not always use the same units or rounding rules.

| Unit | Exact bytes |
| --- | ---: |
| 1 MB (decimal megabyte) | 1,000,000 |
| 1 MiB (binary mebibyte) | 1,048,576 |
| 4 MB (decimal) | 4,000,000 |
| 4 MiB (binary) | 4,194,304 |
| 5 MB (decimal) | 5,000,000 |
| 5 MiB (binary) | 5,242,880 |

A 4,100,000-byte PDF is **4.1 MB**, but about **3.91 MiB**. Depending on the operating system's labels and the upload service's enforcement, the display can be misleading. IRCC's general Help Centre does not specify a universal byte-counting algorithm for all portals, so avoid treating either conversion as a guarantee.

**Practical approach:** give yourself some space below the displayed limit instead of aiming for the exact boundary. For a 4 MB field, a file under **4,000,000 bytes** provides a useful conservative check for decimal counting. But even a smaller file can fail for reasons unrelated to size.

## How to make a supporting PDF smaller

1. **Check the right limit first.** Record the portal, document field, permitted file types and any special instructions. A 2 MB refugee supporting-document field requires a different approach from a 5 MB IRCC Portal field.
2. **Keep the original.** Save an untouched copy of the bank statement, passport scan, translation or letter before trying compression.
3. **Choose the appropriate QPDF.ca tool.** For a 4 MB upload field, try [Compress PDF to 4 MB](/compress-pdf-to-4mb/). That preset aims below the nominal maximum (approximately 3.8 MB), but it is a **target, not a guaranteed final size**. For other limits, use [Compress PDF](/compress-pdf/) and select a suitable target or compression setting.
4. **Download and inspect the result.** Compare its actual size in file properties with the field's requirement. Then open it and check every page at readable zoom, especially dates, signatures, seals, account balances and small print.
5. **Upload only when both checks pass.** The compressed file must still satisfy the application checklist and the portal's permitted-format rules.

IRCC itself suggests techniques such as saving at a smaller PDF size and reducing image resolution; it mentions **96 DPI or 150 DPI** as possible settings for images. Those are *size-reduction suggestions*, not universal readability requirements. [Read IRCC's guidance](https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1213), and do not make an image too blurry to assess.

For detailed financial-document checks, use [our bank-statement compression guide](/guides/compress-bank-statements-ircc/). If several supporting PDFs belong in one upload field, see [how to merge them](/guides/merge-documents-ircc/) before compressing the combined result.

## What if the PDF still exceeds the limit?

Start with the source document. A digitally downloaded statement may already be compact, while a high-resolution colour scan may contain large page images. If you have control over the scanning process, create a new readable scan at a more modest resolution, keeping official stamps and fine text legible. If an original image has wide blank borders, cropping only the blank background may help, provided no document information is lost.

Try one moderate compression pass and compare it with the original. Repeatedly compressing a badly degraded scan can make the evidence unusable without achieving the required size. If the file genuinely cannot be made readable and small enough, consult the application-specific submission instructions or IRCC's technical-support channel. Do **not** invent extra upload slots or omit required evidence simply to make the upload succeed.

## Important exception: validated IRCC application forms

This guide is about **supporting PDFs**, not specialized IRCC application forms that have a **Validate** button or generate **2D barcode pages**. Do **not** run those forms through QPDF.ca compression, merging, flattening or sanitizing tools to force them under a size limit. Such processing can interfere with the form features required for submission. Follow [IRCC's official instructions for barcode forms](https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1523) and read [what not to change after validation](/guides/ircc-pdf-validation-barcodes/).

**Before you submit:** confirm the **correct field limit**, the **downloaded file's actual size**, **all required pages**, and **readability**. A successful compression is not the same as IRCC accepting a document or an application.
