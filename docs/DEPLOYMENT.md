# Deploying Qpdf to Cloudflare Pages

Qpdf is a static site. Cloudflare Pages builds it from GitHub and serves it
from `dist/`. No Workers, Functions, databases or paid services are required
for the core site. Status on 2026-11-05: **live at https://qpdf.ca**, built by
Cloudflare Pages from the `main` branch (verified: `/sitemap.xml` and
`/robots.txt` return 200 with valid content; the sitemap matches a local build).

## Before the first public deployment (required)

1. **Make the GitHub repository public** (or publish the exact source another
   way). Qpdf is AGPL-3.0; users of the website must be able to obtain its
   source. The footer links to `SOURCE_URL` (default
   `https://github.com/hjavaran/Qpdf.ca`). See [LICENSING.md](LICENSING.md).
2. Office converters: enabled in production via R2 (see
   [cloudflare-r2.md](cloudflare-r2.md)). Without the variable they are left out of the build.
3. Have the privacy policy and terms reviewed by someone qualified, if desired.

## 1. Create the Pages project (Git integration)

Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** →
select `hjavaran/Qpdf.ca`.

| Setting | Value |
| --- | --- |
| Production branch | `main` (other branches get Preview deployments) |
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
| `VITE_LIBREOFFICE_ASSET_URL` | `https://assets.qpdf.ca/libreoffice/bentopdf-2.8.11/` | Enables the 13 Office converters. Set (production) once the R2 files are uploaded; leave empty to build without them |
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
2. Check that `https://qpdf.ca/merge-pdf` (no slash) and `/merge-pdf.html`
   redirect to `/merge-pdf/`, `https://www.qpdf.ca/` redirects to
   `https://qpdf.ca/`, and `https://qpdf.ca/does-not-exist` returns the 404
   page with status 404. (Upstream ids that differ from Qpdf slugs, such as
   `/extract-pages`, redirect too; `/merge` was never a page and returns 404.)
3. Submit `https://qpdf.ca/sitemap.xml` in Google Search Console and Bing
   Webmaster Tools.

## Manual deployment (alternative)

```bash
npm run build
```

```bash
npx wrangler pages deploy dist --project-name qpdf --branch main
```

Do **not** add a `wrangler.toml` to the repository: when Pages finds one it uses only the file's
`[vars]` and ignores the dashboard's environment variables (this silently disabled the contact form
and analytics keys). Build settings and variables live in the Cloudflare dashboard.

## Costs

The core site fits Cloudflare's free tier: static asset requests and bandwidth
on Pages are free, and the build (~1.5 minutes) is far below the monthly build
allowance. The R2 bucket (LibreOffice engine) stores about 75 MB, well inside R2's free
storage allowance, and R2 does not charge for egress. Check current pricing on
Cloudflare's website and keep billing alerts on.
