---
title: How to make a PDF smaller without ruining it
description: Practical steps to reduce a PDF’s file size while keeping text sharp, links working and signatures intact — and what to do when compression is not enough.
category: pdf-basics
published: 2026-11-04
reviewed: 2026-11-04
relatedTools: [compress-pdf, compress-pdf-to-2mb, delete-pages, pdf-to-greyscale, split-pdf]
relatedGuides: [check-if-pdf-tool-uploads-files]
---

A PDF that is too big to email or upload is a common headache. The good news is that most oversized PDFs can be
reduced substantially without anyone noticing a difference. The key is knowing what makes the file large.

## What makes a PDF large

- **Images and scans.** Photographs and scanned pages usually account for most of a file’s size, especially
  when they were captured at high resolution or saved with little compression.
- **Embedded fonts.** PDFs carry the fonts they use. Complete font files, or the same font embedded several
  times after merging, add weight.
- **Duplicated and leftover data.** Repeated logos, unused objects and editing history can remain inside a
  file.

Text itself is tiny. A 100-page text-only report is often well under 1 MB.

## Start with recommended compression

Open [Compress PDF](/compress-pdf/) and try the **Recommended** level first. It recompresses images to a
sensible quality, cleans up fonts and removes unused data, while keeping text selectable and links and forms
working. Compare the original and new sizes that QPDF shows, then open the result and zoom in on a scanned page
or photo to check it.

If the file is still too large, try **Stronger compression**, which lowers image quality further. If the images
matter — photographs, plans, medical images — try **Higher quality** instead and accept a larger file.

## Aim for a target size

Upload portals often have a fixed limit. Enter it as the target size and QPDF searches for the best quality that
fits. Aim a little below the limit, and if the target cannot be reached, QPDF tells you rather than producing an
unreadable file.

## When compression is not enough

- **Remove pages you do not need** with [Delete PDF Pages](/delete-pdf-pages/) — blank backs of scans and
  duplicate pages are common culprits.
- **Convert colour scans to greyscale** with [PDF to Greyscale](/pdf-to-greyscale/) if colour is not needed.
- **Split the document** into parts with [Split PDF](/split-pdf/) when a portal accepts several files.
- **Re-scan at a lower resolution.** For text documents, 200–300 dpi is usually plenty.

## Things to avoid

- **Rasterizing text pages.** Turning pages into images can shrink some scans, but it removes selectable,
  searchable text and can make the file larger. QPDF leaves it off unless you choose it.
- **Compressing signed documents.** Any change to a digitally signed PDF invalidates the signature. QPDF leaves
  signed files untouched by default; compress before signing instead.
- **Compressing the only copy.** Keep the original until you have checked the smaller version.
