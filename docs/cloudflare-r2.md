# LibreOffice engine on Cloudflare R2 (optional)

## Why R2 is needed

Word, Excel, PowerPoint, OpenDocument, RTF, Pages, WordPerfect, WPS, Publisher
and Visio → PDF use LibreOffice compiled to WebAssembly. Two of its files are
larger than Cloudflare Pages' 25 MiB per-file limit:

| File | Size (gzip) | Uncompressed |
| --- | --- | --- |
| `soffice.wasm.gz` | 48,763,638 B (46.5 MiB) | ≈ 141 MiB |
| `soffice.data.gz` | 28,604,373 B (27.3 MiB) | ≈ 95 MiB |

Even with Brotli they remain above 25 MiB, and splitting binaries is not a
reliable option, so they are served from an R2 bucket. The smaller loader files
(`soffice.js`, `soffice.worker.js`, `browser.worker.global.js`) stay on
Pages because Web Workers must be same-origin.

**R2 stores software only. Qpdf never uploads or stores documents.** The
browser downloads the engine from R2 and converts the document locally.

## What is already implemented

- `src/js/utils/libreoffice-loader.ts` fetches the two `.gz` files from
  `VITE_LIBREOFFICE_ASSET_URL` (CORS mode, no credentials) and decompresses them
  in the browser.
- When the variable is set, the build publishes the 13 converter pages, adds the
  asset origin to the CSP `connect-src`, and lets the service worker cache it.
  When it is not set, the converters are excluded and their URLs redirect to
  `/tools/`.
- Tested locally with a simulated R2 origin (separate port, CORS headers):
  DOCX→PDF and RTF→PDF converted successfully under the production COOP/COEP
  and CSP headers.

## Setup (requires your Cloudflare account and approval of any charges)

1. **Create a bucket**: Dashboard → R2 → Create bucket, e.g. `qpdf-assets`
   (location: automatic). R2 needs a payment method on file even within the
   free tier.
2. **Connect a custom domain** to the bucket: R2 → bucket → Settings → Public
   access → Custom domains → `assets.qpdf.ca` (the zone must be on Cloudflare).
   Do not use the `r2.dev` development URL in production.
3. **Upload the engine and set CORS** (downloads the files from the pinned
   upstream commit and verifies their SHA-256):

   ```bash
   npx wrangler login
   ```

   ```bash
   cloudflare/upload-libreoffice-to-r2.sh qpdf-assets
   ```

   CORS policy (`cloudflare/r2-cors.json`): `GET`/`HEAD` from
   `https://qpdf.ca` and `https://www.qpdf.ca` only.
4. **Configure Pages**: add the Production environment variable

   ```
   VITE_LIBREOFFICE_ASSET_URL=https://assets.qpdf.ca/libreoffice/bentopdf-2.8.11/
   ```

   and redeploy. The build log shows `LibreOffice tools enabled`.
5. **Verify**: open `https://qpdf.ca/word-to-pdf/`, convert a test DOCX, and
   confirm in DevTools that the only cross-origin requests are `GET`s for
   `soffice.wasm.gz` / `soffice.data.gz` from `assets.qpdf.ca`.

## Headers

Objects are uploaded with `Content-Type: application/gzip` and
`Cache-Control: public, max-age=31536000, immutable`. No `Content-Encoding` is
needed: the loader detects gzip and decompresses it. CORS responses satisfy the
site's `Cross-Origin-Embedder-Policy: require-corp`.

## Versioning

The object prefix includes the upstream version (`libreoffice/bentopdf-2.8.11/`).
When updating BentoPDF, upload the matching files under a new prefix, update
`public/libreoffice-wasm/*.js` from the same commit, and change the variable.

## Cost estimate

About 75 MB of storage and a few reads per conversion session. This is far
inside R2's published free allowances (storage, Class A/B operations) and R2
has no egress fees. Confirm current pricing before enabling it.
