# Corresponding source and bundled engines (AGPL-3.0 §6, §13)

Qpdf (https://qpdf.ca) is free software under the GNU AGPL-3.0-only.
Its complete source is this repository: https://github.com/hjavaran/Qpdf.ca

Qpdf is a modified version of BentoPDF 2.8.11
(https://github.com/alam00000/bentopdf, commit
`1a55d8d44b61f35e1274607582207e4cfabd2bd8`). The first commit in this
repository is an unmodified (pruned) import of that commit, so every Qpdf
change is visible in the history that follows.

## Pre-built engines shipped in `vendor/`

These are installed unmodified from the tarballs in `vendor/` and are served
to browsers as part of the site. They are distributed as built artefacts, as
BentoPDF distributes them.

| Package | Licence | What it contains | Where its source is |
| --- | --- | --- | --- |
| `hyper-compress-wasm` 1.0.3 (Compress PDF) | AGPL-3.0-only | `engine/hyper-compress.wasm` + JS glue | https://github.com/alam00000/bentopdf-hyper-compress (declared in the package's own `package.json`); its bundled third-party parts are listed in that repository's `NOTICE.md` |
| `bentopdf-pdfium` (EditCore, used by Edit PDF / Edit PDF Text / Redact) | AGPL-3.0 (declared in its `package.json`) | `editcore.js`, `editcore.wasm` | https://github.com/alam00000/bentopdf-pdfium-viewer at commit `3f6b6114b166` (see below) |
| `bentopdf-viewer` 2.9.1 | MIT | EmbedPDF-based viewer bundle | Package `README.md`, upstream BentoPDF repository |

The pinned upstream build identifier is `3f6b6114b166` (`vendor/*/.upstream-version`).

### EditCore (`editcore.wasm`) — Corresponding Source

Build identifier `3f6b6114b166` is a commit of
https://github.com/alam00000/bentopdf-pdfium-viewer (AGPL-3.0 at the repository
root; NOTICE lists included MIT/BSD parts). The repository at that commit
contains the EditCore C++ source (`packages/pdfium/build/code/editcore/`), the
build patches (`packages/pdfium/build/patch/`: `editcore-pdfium.patch`,
`security-fixes.patch`, `brotli-decode.patch`) and the build scripts
(`packages/pdfium/scripts/build.sh`, `packages/pdfium/build/compile*.sh`,
`Dockerfile`). Its `packages/pdfium/pdfium-src` submodule is pinned to
`fce2b000cc7a9e2cabc92db41cd57ca03233f07d` of the PDFium fork
https://github.com/alam00000/bentopdf-pdfium (BSD-3-Clause, Google/Foxit
PDFium; the same commit is also in https://github.com/embedpdf/pdfium).
The upstream BentoPDF project references this build in
https://github.com/alam00000/bentopdf/pull/964.

EDITCORE_SOURCE_URL: https://github.com/alam00000/bentopdf-pdfium-viewer/tree/3f6b6114b166

The three tarballs in `vendor/` were taken unmodified from BentoPDF 2.8.11.
Byte-for-byte reproduction of `editcore.wasm` from this source has not been
independently verified by the Qpdf maintainers. If these upstream repositories
are removed or the source cannot be obtained, this site must stop distributing
EditCore.

## Other AGPL engines (self-hosted from npm, unmodified)

`@bentopdf/pymupdf-wasm` 0.11.16, `@bentopdf/gs-wasm` 0.1.1 and `coherentpdf`
2.5.5 are installed from npm at the pinned versions (`package.json`,
`package-lock.json`) and copied by `scripts/qpdf/copy-engines.mjs`; their
licence files are deployed next to them under `/wasm/`.
