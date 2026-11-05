#!/usr/bin/env bash
# Upload the two LibreOffice WebAssembly files that exceed Cloudflare Pages'
# 25 MiB per-file limit to a Cloudflare R2 bucket. They are software assets
# only — Qpdf never stores documents in R2.
#
# Prerequisites: an R2 bucket with a public custom domain (e.g. assets.qpdf.ca),
# `npx wrangler login`, and approval of any R2 charges (see docs/cloudflare-r2.md).
#
# Usage: cloudflare/upload-libreoffice-to-r2.sh <bucket-name>
set -euo pipefail

BUCKET="${1:?usage: $0 <r2-bucket-name>}"
# soffice.js / soffice.worker.js in public/libreoffice-wasm come from this
# pinned upstream commit, so the large files must come from the same commit.
COMMIT="1a55d8d44b61f35e1274607582207e4cfabd2bd8"
VERSION="bentopdf-2.8.11"
PREFIX="libreoffice/${VERSION}"
BASE="https://raw.githubusercontent.com/alam00000/bentopdf/${COMMIT}/public/libreoffice-wasm"
declare -A SHA=(
  [soffice.wasm.gz]="36a7d3171b99961c04eb804a5faa5be5079b670935df2b068a1746a7ddc449b8"
  [soffice.data.gz]="2bb76a56f6ebf5dfe214dfb4ceb7ec1370b9d0d5d7c4d66796cf66f762c098e0"
)

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
for f in soffice.wasm.gz soffice.data.gz; do
  echo "Downloading $f from the pinned upstream commit…"
  curl -fL --retry 3 -o "$WORK/$f" "$BASE/$f"
  echo "${SHA[$f]}  $WORK/$f" | sha256sum -c -
  npx wrangler r2 object put "$BUCKET/$PREFIX/$f" \
    --file "$WORK/$f" \
    --content-type "application/gzip" \
    --cache-control "public, max-age=31536000, immutable" \
    --remote
done

echo "Applying CORS policy (allows GET from https://qpdf.ca)…"
npx wrangler r2 bucket cors set "$BUCKET" --file "$(dirname "$0")/r2-cors.json"

cat <<MSG

Done. Set this environment variable in the Cloudflare Pages project
(Settings → Environment variables → Production) and redeploy:

  VITE_LIBREOFFICE_ASSET_URL=https://<your-r2-custom-domain>/${PREFIX}/

The Word/Excel/PowerPoint/ODF converters are then built and published.
MSG
