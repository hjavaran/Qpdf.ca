#!/usr/bin/env python3
"""Report where synthetic secrets survive in a redacted PDF.

Usage: python3 tests/e2e/redaction_audit.py <original.pdf> <redacted.pdf>

Prints one JSON object: for every secret, the places it can still be found
(text layer, decompressed object/stream bytes, annotations, bookmarks,
attachments, metadata), plus whether the scanned image's pixels under the
redaction band were actually changed. Requires PyMuPDF (pip install pymupdf).
Used by tests/e2e/run.mjs ("redact audit"); fixture: redaction-audit.pdf.
"""
import hashlib
import json
import sys

import pymupdf

SECRETS = [
    "SECRET-TEXT-111",
    "SECRET-IMG-222",
    "SECRET-OCR-333",
    "ANNOT-IN-AREA-555",
    "SECRET-UNDER-BOX-777",
    "ATTACH-OTHER-666",
]
KEEP = ["KEEP-THIS-TEXT", "KEEP-BELOW-TEXT"]


def raw_hits(doc, term):
    needle = term.encode("latin-1")
    utf16 = term.encode("utf-16-be")
    hits = 0
    for x in range(1, doc.xref_length()):
        try:
            obj = doc.xref_object(x, compressed=False).encode("latin-1", "replace")
        except Exception:
            obj = b""
        try:
            stream = doc.xref_stream(x) or b""
        except Exception:
            stream = b""
        for blob in (obj, stream):
            if needle in blob or utf16 in blob:
                hits += 1
    return hits


def images(doc):
    out = {}
    for img in doc[0].get_images(full=True):
        try:
            pix = pymupdf.Pixmap(doc, img[0])
            out[img[0]] = (pix.width, pix.height, hashlib.sha256(pix.samples).hexdigest(), pix)
        except Exception:
            pass
    return out


def dark_fraction(pix):
    """Share of dark pixels in the region where SECRET-IMG-222 was drawn."""
    if pix.n > 1:
        pix = pymupdf.Pixmap(pymupdf.csGRAY, pix)
    w, h = pix.width, pix.height
    x0, x1, y0, y1 = int(w * 0.03), int(w * 0.9), int(h * 0.33), int(h * 0.66)
    s = pix.samples
    dark = total = 0
    for y in range(y0, y1, 3):
        for x in range(x0, x1, 3):
            total += 1
            if s[y * w + x] < 100:
                dark += 1
    return dark / max(total, 1)


def audit(path):
    doc = pymupdf.open(path)
    text = "\n".join(p.get_text() for p in doc)
    annots = [a.info.get("content", "") for p in doc for a in (p.annots() or [])]
    toc = [t[1] for t in doc.get_toc()]
    files = {}
    for i in range(doc.embfile_count()):
        info = doc.embfile_info(i)
        files[info["filename"]] = doc.embfile_get(i).decode("latin-1", "replace")
    meta = " ".join(str(v) for v in (doc.metadata or {}).values()) + (doc.get_xml_metadata() or "")
    report = {}
    for s in SECRETS + KEEP:
        where = []
        if s in text:
            where.append("text-layer")
        if any(s in a for a in annots):
            where.append("annotation")
        if any(s in t for t in toc):
            where.append("bookmark")
        if any(s in c or s in n for n, c in files.items()):
            where.append("attachment")
        if s in meta:
            where.append("metadata")
        n = raw_hits(doc, s)
        if n:
            where.append(f"raw-bytes x{n}")
        report[s] = where
    return doc, report, images(doc), annots


def main():
    orig_path, red_path = sys.argv[1], sys.argv[2]
    _, before, before_imgs, _ = audit(orig_path)
    doc, after, after_imgs, annots = audit(red_path)
    orig_hashes = {v[2] for v in before_imgs.values()}
    img_report = []
    for _, (w, h, digest, pix) in after_imgs.items():
        img_report.append({
            "size": f"{w}x{h}",
            "unchanged": digest in orig_hashes,
            "dark_fraction_in_secret_region": round(dark_fraction(pix), 3),
        })
    before_dark = [round(dark_fraction(v[3]), 3) for v in before_imgs.values()]
    print(json.dumps({
        "before": before,
        "after": after,
        "images_before_dark_fraction": before_dark,
        "images_after": img_report,
        "annotations_after": annots,
        "pages": doc.page_count,
    }, indent=1))


if __name__ == "__main__":
    main()
