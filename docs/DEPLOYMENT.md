# Deploying Qpdf to Cloudflare Pages

Qpdf is a static site. Cloudflare Pages builds it from GitHub and serves it
from `dist/`. No Workers, Functions, databases or paid services are required
for the core site. Status on 2026-11-04: **not yet deployed** — this
environment had no Cloudflare credentials and no access to the qpdf.ca DNS.

## Before the first public deployment (required)

1. **Make the GitHub repository public** (or publish the exact source another
   way). Qpdf is AGPL-3.0; users of the website must be able to obtain its
   source. The footer links to `SOURCE_URL` (default
   `https://github.com/hjavaran/Qpdf.ca`). See [LICENSING.md](LICENSING.md).
2. Decide whether to enable the Office converters now (needs R2, see
   [cloudflare-r2.md](cloudflare-r2.md)) or later.
3. Have the privacy policy and terms reviewed by someone qualified, if desired.

## 1. Create the Pages project (Git integration)

Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** →
select `hjavaran/Qpdf.ca`.

| Setting | Value |
| --- | --- |
| Production branch | `main` (merge `claude/lucid-clarke-k9jwjr` first) |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

Environment variables (Production and Preview):

| Variable | Value | Notes |
| --- | --- | --- |
| `NODE_VERSION` | `22` | Also pinned in `.nvmrc` |
| `SITE_URL` | `https://qpdf.ca` | Canonical domain for canonicals, sitemap, Open Graph |
| `SOURCE_URL` | `https://github.com/hjavaran/Qpdf.ca` | AGPL source link (optional override) |
| `VITE_LIBREOFFICE_ASSET_URL` | *(empty)* | Set only after the R2 bucket exists |
| `WEB3FORMS_ACCESS_KEY` | *(your Web3Forms access key)* | Optional but required for the contact form to work. See [CONTACT-FORM.md](CONTACT-FORM.md) |
| `CF_ANALYTICS_TOKEN` | *(your 32-character Web Analytics site token)* | Optional. Enables Cloudflare Web Analytics and the matching CSP allowance. Keep Pages' one-click "Web Analytics" toggle off to avoid double counting |

`.env.production` already contains the non-secret engine paths; nothing secret
is needed. The build fails deliberately if any output file exceeds 25 MiB or
the 20,000-file limit.

Preview deployments use the same build. Their pages still declare
`https://qpdf.ca` canonicals, so previews are not indexed as duplicates.

## 2. Custom domain

Pages project → **Custom domains → Set up a custom domain** → `qpdf.ca`.

- If `qpdf.ca` uses Cloudflare DNS, Cloudflare creates the record and
  certificate automatically.
- Otherwise add a `CNAME` for `qpdf.ca` (flattened at the apex) pointing to
  `<project>.pages.dev` at your DNS provider, as Cloudflare instructs.
- Add `www.qpdf.ca` too and redirect it to `https://qpdf.ca` (Rules →
  Redirect Rules, or a Bulk Redirect), so only one host is indexed.
- Enable **Always Use HTTPS**. HSTS is already sent by `_headers`.

## 3. Verify the deployment

```bash
curl -sI https://qpdf.ca/ | grep -i -E "content-security-policy|cross-origin|strict-transport"
```

```bash
curl -s https://qpdf.ca/robots.txt
```

```bash
curl -s https://qpdf.ca/sitemap.xml | head
```

Then, in a browser:

1. Open `https://qpdf.ca/compress-pdf/`, wait for **Ready to work offline**,
   disconnect Wi-Fi, compress a test PDF, download it.
2. Check `https://qpdf.ca/merge-pdf/` → `/merge` and `/merge-pdf.html` redirect
   correctly, and `https://qpdf.ca/does-not-exist` shows the 404 page.
3. Submit `https://qpdf.ca/sitemap.xml` in Google Search Console and Bing
   Webmaster Tools.

## Manual deployment (alternative)

```bash
npm run build
```

```bash
npx wrangler pages deploy dist --project-name qpdf --branch main
```

(`wrangler.toml` sets `pages_build_output_dir = "dist"`.)

## Costs

The core site fits Cloudflare's free tier: static asset requests and bandwidth
on Pages are free, and the build (~1.5 minutes) is far below the monthly build
allowance. The optional R2 bucket stores about 75 MB, well inside R2's free
storage allowance, and R2 does not charge for egress. Check current pricing on
Cloudflare's website before enabling R2, and set billing alerts.
