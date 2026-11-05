# Licensing review (Stage 1, 2026-11-04)

This is an engineering summary, not legal advice.

## Qpdf's licence

Qpdf is a modified version of **BentoPDF v2.8.11** (commit
`1a55d8d44b61f35e1274607582207e4cfabd2bd8`), licensed **AGPL-3.0-only**.
Qpdf is therefore also distributed under AGPL-3.0-only (`LICENSE`).
No commercial licence has been purchased, and none is needed as long as the
AGPL is followed.

### Obligations and how they are met

| AGPL-3.0 requirement | Status |
| --- | --- |
| Keep copyright and licence notices | `LICENSE` kept; upstream notices untouched in source; credits on `/licenses/` and in the footer |
| Mark modifications | Git history starts with a pure upstream import commit; changes listed on `/licenses/` and in commit messages |
| §13: offer the Corresponding Source to network users | Footer “Source code” link and `/licenses/` point to `SOURCE_URL` (default `https://github.com/hjavaran/Qpdf.ca`) |
| Source of bundled AGPL engines | Self-hosted unmodified npm packages; licence files deployed next to them (`/wasm/*/LICENSE`); upstream repositories linked on `/licenses/` |

**Unresolved — action required before launch:** the GitHub repository is
currently **private**. Under §13 the source must be available to everyone who
uses qpdf.ca. Make the repository public (it contains no secrets), or publish
the complete source at another public URL and set `SOURCE_URL`. The alternative
is a BentoPDF commercial licence, which Qpdf does not need otherwise.

BentoPDF's licensing page also asks AGPL users to retain the PDF “producer
line”. Qpdf does not change producer metadata written by the libraries (the
Remove Metadata and Sanitize tools clear it only when the user asks).

See also `SOURCE-NOTICE.md` (bundled engines and where their source is). EditCore source is published at `bentopdf-pdfium-viewer` commit `3f6b6114b166` (verified 2026-11-05; see `SOURCE-NOTICE.md`). `check:dist` still fails if the `EDITCORE_SOURCE_URL` line is missing or `PENDING`.

## Hyper Compress

The engine behind Compress PDF is published as `hyper-compress-wasm`
(vendored by BentoPDF) under **AGPL-3.0-only**. The restrictions in BentoPDF's
`COMMERCIAL-LICENSE.md` (revenue cap, “not a compression product”, at least 10
other tools, no server use…) apply only to the *commercial* licence's bundled
grant. Under the AGPL, Qpdf may use it, provided the AGPL obligations above are
met. Qpdf would also satisfy those commercial conditions anyway: it is a
general toolkit with 110+ tools, its home page is not the compressor, and
compression runs only on the user's device when the user starts it. Making
Compress PDF the default favourite does not change this.

## Other AGPL components loaded at runtime

PyMuPDF/MuPDF (`@bentopdf/pymupdf-wasm`), Ghostscript (`@bentopdf/gs-wasm`) and
CoherentPDF (`coherentpdf`) are AGPL. Upstream loads them from jsDelivr; Qpdf
self-hosts the same pinned versions, so Qpdf distributes them and must (and
does, via the source repository and upstream links) make their source
available. `bentopdf-pdfium` (editing engine) is also AGPL.

## Permissive components (selection)

pdf-lib (MIT), PDF.js (Apache-2.0), qpdf-wasm (ISC; qpdf itself Apache-2.0),
Tesseract.js and core (Apache-2.0), language data (Apache-2.0/MIT packaging),
wasm-vips (MIT), LibreOffice converter (MPL-2.0), Pyodide (MPL-2.0),
zgapdfsigner (MIT), node-forge (BSD-3-Clause), jsPDF (MIT), JSZip (MIT),
DOMPurify (MPL-2.0/Apache-2.0), Phosphor Icons (MIT), Lucide (ISC), DM Sans
and Noto fonts (SIL OFL 1.1), Tailwind CSS (MIT). The full list with installed
versions is generated on `/licenses/` at build time.

## Brand and affiliation

- **qpdf**: an established open-source PDF library (Jay Berkenbilt and
  contributors, Apache-2.0). Qpdf uses a WebAssembly build of it. The About,
  Licences pages and footer state that Qpdf (qpdf.ca) is not affiliated with
  the qpdf project. This review did not include a trademark search; because
  the names are nearly identical, consider a professional trademark search
  before investing heavily in the brand.
- No BentoPDF branding, logos, badges or marketing copy are used. BentoPDF's
  GDPR/HIPAA/CCPA badge images were removed; Qpdf makes no certification or
  compliance claims.
- No government symbols are used. The maple leaf is an original stylised
  drawing, not the flag's leaf.
