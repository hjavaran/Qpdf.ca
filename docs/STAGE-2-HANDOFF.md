# Stage 2 handoff — content and SEO expansion

Stage 1 delivered the working toolkit, design system, privacy pages, technical
SEO and a Markdown content system. Stage 2 adds content. This page is what a
future session needs to know to do that without touching the architecture.

## Where things live

| Need | File |
| --- | --- |
| Write a guide | `content/guides/<slug>.md` (see `content/guides/README.md`) |
| Change a tool's title, description, landing copy, related tools | `src/data/tools.mjs` |
| Change static page metadata / navigation | `src/data/site.mjs` |
| Guide categories (hub headings) | `GUIDE_CATEGORIES` in `scripts/qpdf/guides.mjs` |
| Guide page layout | `src/templates/guide.html` |
| Guides hub | `guides/index.html` |
| Page metadata, breadcrumbs, JSON-LD | `scripts/qpdf/context.mjs` + `src/partials/head.html` |
| Sitemap, robots, redirects, headers | `scripts/qpdf/postbuild.mjs` |
| Styles for article text | `.qp-prose` in `src/css/qpdf-theme.css` |

## Publishing a guide

1. Copy `content/guides/_template.md` to `content/guides/<slug>.md`.
2. Fill in the front matter: `title`, `description`, `category`, `published`,
   `reviewed`, `relatedTools`, `relatedGuides`, `sources`. Remove `draft: true`.
3. Write the body in Markdown starting at `##` headings (the template supplies
   the H1). Link tools by URL, e.g. `[Compress PDF](/compress-pdf/)`.
4. `npm run build && npm run check:dist`. The guide appears at
   `/guides/<slug>/`, on `/guides/`, `/site-index/` and in `sitemap.xml`,
   with Article and BreadcrumbList structured data, an automatic table of
   contents (≥ 3 `##` sections), sources, related tools (as star-able cards)
   and related guides.

Categories ready for Stage 2: `pdf-basics`, `privacy-security`,
`immigration`, `legal`, `comparisons`. Empty categories are hidden.

Published so far (both short and original):

- `/guides/check-if-pdf-tool-uploads-files/`
- `/guides/make-a-pdf-smaller/`

## Suggested Stage 2 structure

- Immigration: IRCC file-size limits and compression, Express Entry document
  organisation, common IRCC PDF errors, PNP documents. Cite IRCC pages in
  `sources` and record `reviewed` dates — requirements change.
- Legal: Bates numbering (`/bates-numbering/`), exhibit organisation (merge +
  bookmarks + page labels), permanent redaction (`/redact-pdf/`), metadata
  (`/remove-pdf-metadata/`, `/sanitize-pdf/`), court filing / PDF/A
  (`/pdf-to-pdfa/`).
- Privacy: browser-local processing, risks of uploading confidential files.
- Comparisons: keep factual, dated and sourced; avoid trademark misuse.
- Tool-intent landing pages already exist for presets such as
  `/compress-pdf-to-2mb/` and `/compress-pdf-for-email/`; immigration-specific
  presets (e.g. a fixed IRCC limit) can be added as new compress pages by
  copying `src/pages/compress-pdf-to-2mb.html` and adding a registry entry —
  only after confirming the current official limit.

## Reusable components

- `{{> tool-card }}` — tool card with favourite star (needs `home.ts`).
- `{{> breadcrumbs }}`, `{{> head }}`, `{{> navbar }}`, `{{> footer }}`.
- CSS: `.qp-prose`, `.qp-callout`, `.qp-callout-ok`, `.qp-callout-warn`,
  `.qp-demo`, `.qp-steps`, `.qp-grid`, `.qp-block`, `.qp-btn`, `.qp-pill`.

## Existing URLs

- Home `/`, `/tools/`, `/privacy/`, `/privacy-policy/`, `/about/`, `/terms/`,
  `/guides/`, `/site-index/`, `/licenses/`.
- 111 tool pages at `/<slug>/` — the full list is on `/site-index/` and in
  `dist/sitemap.xml`. Key slugs: `compress-pdf`, `merge-pdf`, `split-pdf`,
  `edit-pdf`, `jpg-to-pdf`, `pdf-to-jpg`, `extract-pdf-pages`,
  `reorder-pdf-pages`, `delete-pdf-pages`, `rotate-pdf`,
  `add-page-numbers-to-pdf`, `watermark-pdf`, `sign-pdf`,
  `password-protect-pdf`, `unlock-pdf`, `flatten-pdf`, `remove-pdf-metadata`,
  `ocr-pdf`, `redact-pdf`, `bates-numbering`, `pdf-to-pdfa`.
- Office converters (`/word-to-pdf/` …) appear only when
  `VITE_LIBREOFFICE_ASSET_URL` is configured.
- Upstream BentoPDF paths (`/extract-pages`, `/merge-pdf.html`, …) 301-redirect
  to the Qpdf slugs.

## French (future)

Not built in Stage 1. The plan that fits the architecture:

- Serve French under `/fr/…` with `lang="fr-CA"`; add `hreflang` alternates in
  `src/partials/head.html` using the guide `translations` field and a
  per-tool `fr` block in the registry.
- Upstream BentoPDF ships French UI strings for the tools
  (`public/locales/fr/*.json` at the pinned upstream commit); they were removed
  from this repository to avoid a half-translated interface.
- Guides already accept `lang: fr-CA` and `translations` in front matter.

## SEO notes and limitations

- Every tool page has a unique title, description, H1, canonical,
  `WebApplication` + `BreadcrumbList` JSON-LD, and original landing copy.
  Copy is intentionally concise; deepen the most important tools first.
- `lastmod` is emitted only for guides (dates are known); tool pages omit it
  rather than fake a date.
- The tool UIs are rendered by JavaScript after load; the landing copy,
  headings and links are in the static HTML.
- Upstream tool UI strings still use `data-i18n` and English JSON in
  `public/locales/en/`; edit there if a UI label needs changing.
- `npm run check:dist` must pass before deploying (it checks unique titles and
  descriptions, canonicals, internal links and the sitemap).

## Highest-priority technical follow-ups

1. Make the repository public (AGPL) and deploy (see `docs/DEPLOYMENT.md`).
2. Optionally enable the Office converters via R2 (`docs/cloudflare-r2.md`).
3. Run Lighthouse and Search Console after launch. Qpdf's own pages are light
   (subset icon font, ~10 KB); tool pages still load the upstream application
   bundle (~1.6 MB uncompressed: PDF.js, full icon sets). Splitting that
   bundle per tool is the main remaining performance task (see docs/TESTING.md).
   After adding icons, run `python3 scripts/qpdf/subset-icons.py`.
4. Consider a custom, lighter page for Sign PDF (currently the PDF.js viewer
   with annotation tools).
