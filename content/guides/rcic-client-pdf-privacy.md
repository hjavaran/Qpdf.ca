---
title: "RCIC Document Privacy Checklist for Client PDFs"
description: "A practical RCIC checklist for safeguarding client PDFs, assessing local processing, verifying redaction and managing records under applicable privacy rules."
category: immigration
published: 2026-11-05
reviewed: 2026-11-05
draft: true   # withheld pending qualified regulatory/privacy review; retention section corrected 2026-11-06 (see docs/SEO-STAGE2-FINAL-AUDIT.md §6)
relatedTools: [redact-pdf, remove-pdf-metadata, sanitize-pdf, compress-pdf]
relatedGuides: [compress-bank-statements-ircc, ircc-pdf-validation-barcodes]
sources:
  - title: "Code of Professional Conduct for College of Immigration and Citizenship Consultants Licensees"
    url: https://laws-lois.justice.gc.ca/eng/regulations/SOR-2022-128/FullText.html
    publisher: Department of Justice Canada
    accessed: 2026-11-06
  - title: "PIPEDA fair information principles"
    url: https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/
    publisher: Office of the Privacy Commissioner of Canada
    accessed: 2026-11-05
  - title: "Provincial laws that may apply instead of PIPEDA"
    url: https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/prov-pipeda/
    publisher: Office of the Privacy Commissioner of Canada
    accessed: 2026-11-05
  - title: "Client File Management Regulation 2021-001"
    url: https://college-ic.ca/ICCRC/Assets/Documents/Regulations/Client%20File%20Management%20Regulation.pdf
    publisher: Immigration Consultants of Canada Regulatory Council (continued; listed by the College of Immigration and Citizenship Consultants)
    accessed: 2026-11-06
  - title: "By-Laws, Regulations and Policies"
    url: https://college-ic.ca/about-the-college/regulations-and-policies
    publisher: College of Immigration and Citizenship Consultants
    accessed: 2026-11-06
  - title: "College of Immigration and Citizenship Consultants Act (S.C. 2019, c. 29, s. 292), section 85"
    url: https://laws-lois.justice.gc.ca/eng/acts/C-33.6/FullText.html
    publisher: Department of Justice Canada
    accessed: 2026-11-06
  - title: "Code of Professional Conduct Interpretation Guide 2022-001"
    url: https://college-ic.ca/ICCRC/Assets/Documents/Protecting%20the%20Public/Code-of-Professional-Conduct/PC_Code%20Guide-EN.pdf
    publisher: College of Immigration and Citizenship Consultants
    accessed: 2026-11-06
  - title: "How do I fill out and validate IRCC application forms with 2D barcodes?"
    url: https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1523
    publisher: Immigration, Refugees and Citizenship Canada
    accessed: 2026-11-05
---

An RCIC's client PDFs can contain passports, financial records, identity documents, immigration history, family details and information about third parties. **Keeping the PDF out of an online processing server can reduce one exposure, but it is not a complete privacy or compliance program.** The consultant still has to secure the device, control access, preserve the client file, handle disclosures lawfully and dispose of records properly when authorized.

This checklist separates **professional obligations**, **privacy-law considerations** and **what a PDF tool can actually do**. It is a practice-management aid, not a regulator-approved compliance standard or individualized legal advice.

## Start with the RCIC's professional duties

### Confidentiality continues after the engagement

Section **28** of the federal [CICC Code of Professional Conduct (SOR/2022-128)](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2022-128/FullText.html) requires licensees to keep information about current and former clients confidential and to take necessary measures to maintain that confidentiality **indefinitely**. The section also provides specified grounds on which disclosure is permitted or required; confidentiality is not a statement that information can *never* be disclosed under any circumstances.

**Practical implication:** before emailing, sharing, uploading or extracting a client PDF, ask who needs it and for what authorized purpose. A temporary assistant, translation provider, IT vendor or third-party software service should not receive unrestricted access merely because the file is convenient to share.

### Record keeping is also a professional responsibility

Section **37** of the [Code](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2022-128/FullText.html) requires a reliable office-administration system and preservation of records in accordance with by-laws made under the governing Act. The Code's provisions on supervising people who assist the licensee also matter when staff or contractors handle PDFs.

Confidentiality and record preservation are **not the same thing**. A duty to keep information confidential indefinitely does not require storing every working copy forever. Equally, deleting a client's only required case record immediately after an application is submitted is not a privacy improvement.

## Determine which privacy law applies to the practice

Do not assume every RCIC firm in Canada is governed **exclusively** by the federal *Personal Information Protection and Electronic Documents Act* (PIPEDA). The [Office of the Privacy Commissioner of Canada explains](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/prov-pipeda/) that British Columbia, Alberta and Quebec have substantially similar private-sector legislation. For many activities occurring within those provinces, provincial legislation may apply instead, while PIPEDA can remain relevant to certain interprovincial or international transfers and federally regulated activities. Applicable rules depend on the facts.

Regardless of which statute governs a particular activity, the [OPC's PIPEDA principles](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/) give useful reference points: **accountability**, limiting collection and retention, and safeguards proportionate to sensitivity. Use them as a guide alongside your actual statutory and professional requirements—not as a substitute for determining the correct law.

For a B.C.-based practice, check the province's *Personal Information Protection Act* and consider professional advice where multiple regimes, cross-border service providers or conflicting retention requirements may apply.

## A client-PDF privacy checklist

The items below are operational safeguards to consider. They are **not** a claim that the CICC mandates each particular software setting or device configuration.

### 1. Establish an intake and file-storage process

- Receive sensitive documents through channels approved by the practice; avoid casual forwarding through personal accounts or unsecured messaging.
- Assign the document to the correct client matter and restrict staff access by role.
- Keep an **unaltered original** where the document's authenticity or later review matters; label derivative working copies separately.
- Keep active and closed files organized and maintain a clear record of relevant actions, decisions and submissions.
- Minimize unnecessary duplicate downloads, email attachments and files left on desktops.

**Example:** An RCIC receives a client's bank statements for proof of funds. The original belongs in the controlled matter file. A compressed copy prepared for upload can have a separate, temporary filename, so the original is not silently overwritten.

### 2. Protect the device and browser

- Use current, supported operating-system and browser versions; install security updates promptly.
- Enable appropriate device encryption, screen locking and strong authentication; use multifactor authentication for relevant accounts.
- Avoid shared computers, unmanaged browser extensions and public workstations for client documents.
- Review browser download locations, temporary files, cloud-sync folders, backups and printing queues.
- Train staff to verify the domain of any PDF site before providing confidential content.

A file processed locally can still be exposed by malware, a compromised extension, a screenshot utility, an unlocked laptop or automatic synchronization of the Downloads folder. Local processing reduces one path of disclosure; it does not eliminate those risks.

### 3. Evaluate the PDF-processing service, not just its marketing

Ask whether the **document payload** is uploaded to a vendor's servers for processing, whether third parties receive it, whether processing requires an account, what the applicable privacy terms say and whether the workflow fits your firm's risk assessment.

QPDF.ca's [privacy information](/privacy/) and its technical testing describe supported browser tools as processing PDF contents in the browser rather than uploading the document to a PDF-processing server. That is a narrower claim than “the site makes no network requests.” The site's infrastructure can load engines from **assets.qpdf.ca** and has other network activity for website functions, including analytics and optional contact submissions. The available technical report is **not an independent security certification or regulatory approval**.

A tool with local processing may be a suitable component of a firm's workflow, but an RCIC must still evaluate the processing context, endpoint protection and any obligations imposed by clients, law or firm policy.

### 4. Use metadata removal for metadata—not for redaction

A PDF may expose details such as author, document title, producer application or modification history. [Remove PDF Metadata](/remove-pdf-metadata/) can remove several categories of document-level properties, including document-level XMP and file IDs, according to QPDF.ca's technical tests.

But the tool does **not** remove visible text, annotations, bookmarks, attached files or form values simply because those items contain sensitive information. Image- or page-level XMP may remain. Before sharing, inspect the PDF's visible content and other potentially embedded material as appropriate.

Metadata removal should be treated as a **specific transformation** with a defined scope, not as a general privacy or anonymization guarantee.

### 5. Redact information by removing it—not by covering it visually

Drawing a black rectangle on a PDF without actually removing the underlying text or image is unsafe. A viewer may still be able to select, search, copy or extract the hidden content.

QPDF.ca's [Redact PDF](/redact-pdf/) was tested with synthetic files. The tests found that **area-based marks genuinely removed the tested text, OCR text, image pixels and comments within the selected page area**. However, **copies elsewhere survived**: the test's bookmark, outside-area note, attachment and metadata still contained repeated information. For **text-based marks**, cleanup of copies elsewhere depended on **exact phrase matching**; longer selected phrases did not necessarily remove shorter repeated identifiers.

Those results establish useful behaviour in the tested cases, **not universal security for every PDF**. Before disclosure:

1. Identify every occurrence of the sensitive value, not just the obvious one on a page.
2. Apply appropriate actual redactions to the intended content.
3. Inspect the resulting document visually and, where feasible, search its text, bookmarks, annotations, attachments and properties for remaining copies.
4. Reopen the exported PDF in a separate viewer and verify that confidential data cannot be selected or recovered in the portions meant to be removed.
5. If the risk is high, use an independently tested redaction and quality-assurance process suited to that document.

**Never** rely on a black box alone, and do not assume that metadata removal automatically cleans an outside-area copy of information that an area redaction left behind.

### 6. Understand sanitizing and its limitations

[Sanitize PDF](/sanitize-pdf/) can remove categories of hidden or interactive content such as comments, attachments, links, JavaScript and metadata, and it **flattens form fields by default** in QPDF.ca's documented implementation. This may be appropriate for certain **ordinary supporting documents** when those transformations are intended.

Sanitizing is **not a replacement for removing sensitive information that is visible on the page**, and it may remove features your recipient needs. **Never use it to process specialized IRCC forms with a Validate button or 2D barcodes.** For those forms, use the [official IRCC workflow](https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1523) and our [validation guide](/guides/ircc-pdf-validation-barcodes/).

### 7. Verify compression and outbound sharing

If the firm uses [Compress PDF](/compress-pdf/) for a bank statement or supporting scan, confirm that the output remains complete and readable before submitting it. File compression is not inherently a disclosure control, and it must not change the factual contents of the evidence. See [the supporting-document compression guide](/guides/compress-bank-statements-ircc/).

Before sending a client PDF to IRCC, another professional or the client, verify the recipient, upload field, document version, permissions and any encryption or secure-transmission policy. A misaddressed email and a mistaken attachment can disclose data regardless of how securely the PDF was processed.

## Retention and secure destruction: check the current rules

The College's [By-Laws, Regulations and Policies page](https://college-ic.ca/about-the-college/regulations-and-policies) still lists the **Client File Management Regulation 2021-001**, made by the former Immigration Consultants of Canada Regulatory Council (ICCRC) and approved on November 17, 2021. The College states that By-law 2021-2 "remains in effect and applies to all College licensees" and that references to the Council are to be read as references to the College. Under paragraph 85(o) of the [*College of Immigration and Citizenship Consultants Act*](https://laws-lois.justice.gc.ca/eng/acts/C-33.6/FullText.html), every Council by-law and every regulation made by the Council's board remains in effect, to the extent it is consistent with the Act, until a College by-law made under section 80 comes into force.

[Section 7.2 of that Regulation](https://college-ic.ca/ICCRC/Assets/Documents/Regulations/Client%20File%20Management%20Regulation.pdf) says: "A Client File shall be retained in a secure and accessible location for a minimum of six (6) years after the File has been closed." Section 7.1 says a file may be closed only once fees or refunds are settled, client property has been returned, and the client has been told in writing that the retainer has ended. The College's [2022 Code interpretation guide](https://college-ic.ca/ICCRC/Assets/Documents/Protecting%20the%20Public/Code-of-Professional-Conduct/PC_Code%20Guide-EN.pdf) uses different words: files are to be "retained for 6 years following the completion of immigration or citizenship consulting services". Because the Regulation ties the period to **closing the file under section 7.1**, which can be later than the end of the services, calculate the period from the closing date and record that date.

[Section 37 of the Code](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2022-128/FullText.html) requires licensees to "keep and preserve records in accordance with the by-laws made under the Act"; it does not itself state a number of years. Before relying on this, check the College's regulations page for any newer by-law or regulation, and ask the College or a qualified adviser if your practice has unusual circumstances.

Your practice should maintain a **written retention schedule** based on the current governing College rules, applicable privacy legislation, tax or litigation obligations and valid preservation requirements. The [OPC's retention principle](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/) says not to keep personal information longer than necessary for applicable purposes. That does not authorize premature destruction of records subject to another legal requirement.

When lawful retention ends, assess all locations where copies could remain: client-management systems, local folders, synced drives, staff devices, backups, email, export files and paper files. Secure destruction and appropriate logs should be part of the process. **Indefinite confidentiality is not indefinite retention.**

## Review the whole workflow, not just the chosen tool

A practical monthly file-handling review can ask:

- Can we identify every location where current and former client PDFs are stored?
- Who has access, and are former staff and unnecessary vendors removed?
- Are original records separate from temporary compression, merging or redaction copies?
- Are we checking redacted exports for surviving copies in bookmarks, attachments and metadata?
- Are we checking PDF readability and completeness before IRCC uploads?
- Does our documented retention schedule reflect **currently operative** requirements?
- Do we have a process for lost devices, wrong-recipient disclosures, suspicious access and incident reporting under laws that actually apply?

QPDF.ca provides useful document-processing functions. It does **not** confer CICC approval, guarantee PIPEDA or provincial privacy compliance, provide legal advice, or replace a practice's security and records-management controls.

**Professional-review point:** before publishing a firm-wide policy or treating any retention period as mandatory, have a qualified professional verify the operative College by-laws and the privacy rules applicable to the practice's location, transfers and services.
