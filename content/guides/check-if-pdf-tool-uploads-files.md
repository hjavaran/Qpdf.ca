---
title: How to check whether a PDF tool uploads your files
description: Two simple tests — switching off your Wi-Fi and watching your browser’s Network panel — show whether an online PDF tool sends your documents to a server.
category: privacy-security
published: 2026-11-04
reviewed: 2026-11-04
relatedTools: [compress-pdf, merge-pdf, redact-pdf, remove-metadata]
relatedGuides: [make-a-pdf-smaller]
sources:
  - title: Inspect network activity
    url: https://developer.chrome.com/docs/devtools/network
    publisher: Chrome for Developers
  - title: Network Monitor
    url: https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/
    publisher: Firefox Source Docs
---

Many websites that compress, merge or convert PDFs work by uploading your file to their servers. That may be
fine for a restaurant menu, but not for a tax return, a client file or a passport scan. Privacy policies help,
but you do not have to take any website’s word for it: you can check what your browser actually does.

## Why it matters

When a document is uploaded, a copy exists — at least temporarily — on equipment you do not control. It may be
logged, cached, backed up, inspected for abuse, or processed in another country. A tool that works entirely in
your browser avoids all of that, because the file never leaves your device.

## Test 1: switch off your internet connection

This is the simplest test and needs no technical knowledge.

1. Open the tool’s page while you are online and wait for it to finish loading. On Qpdf.ca, wait until the tool
   shows **Ready to work offline**.
2. Turn off Wi-Fi, or unplug the network cable.
3. Select a test PDF and run the tool.
4. Download the result.

If the tool produces a correct result while you are offline, it did not need to send your document to a
server. If it shows an error, an endless progress bar or a message about your connection, it almost certainly
relies on a server.

Use a harmless test file for this check, not a confidential one.

## Test 2: watch the Network panel

Desktop browsers include developer tools that list every request a page makes.

1. Open the tool’s page.
2. Open the developer tools (F12, or Ctrl+Shift+I on Windows and Linux, Cmd+Option+I on a Mac) and select the
   **Network** tab.
3. Clear the list, then select a test PDF and run the tool.
4. Look at the requests that appear. Pay attention to any request using the **POST** or **PUT** method, and to
   the size of data sent. An upload of a 5 MB PDF shows up as a request carrying roughly 5 MB.

Seeing only small downloads (scripts, WebAssembly files, fonts) while the tool runs is what you would expect from
a local tool. A large outgoing request around the time you pressed the button is a clear sign of an upload.

## What these tests do and do not prove

These checks show whether the tool **needed** to upload your file for the job you tested. They are good
evidence, but they are not a full security audit. A site could, in theory, behave differently another day or
for another tool, and nothing a website does can protect a device that is already compromised. For very
sensitive work, repeat the test with the exact tool you plan to use, keep your browser up to date, and avoid
browser extensions that can read every page you visit.

## Other warning signs

- **Upload progress bars.** “Uploading… 45%” means exactly that.
- **Small file-size limits.** Strict limits are often there because the provider pays to store and process
  your files.
- **Accounts for basic tasks.** Requiring a sign-in to compress one file suggests files are tied to an account
  on a server.
- **Vague policies.** Phrases such as “files are deleted after a few hours” confirm that files were stored.
