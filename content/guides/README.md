# Qpdf.ca guides (content system)

Each guide is one Markdown file in this folder. The build turns
`content/guides/<slug>.md` into `https://qpdf.ca/guides/<slug>/`, adds it to
the guides hub, the site index and the sitemap, and renders breadcrumbs,
Article structured data, an optional table of contents, sources, related
tools and related guides.

Files starting with `_` (such as `_template.md`) and this README are ignored.

## Front matter

```yaml
---
title: How to …                      # H1 and default <title> (required)
description: One or two sentences.   # meta description, ≤ 160 chars (required)
category: pdf-basics                 # required, one of the keys below
published: 2026-11-04                # required, YYYY-MM-DD
reviewed: 2026-11-04                 # last reviewed date (defaults to published)
slug: custom-url-segment             # optional, defaults to the file name
metaTitle: Custom <title> | Qpdf.ca     # optional
author: Qpdf.ca                         # optional, defaults to Qpdf.ca
lang: en-CA                          # optional; use fr-CA for French articles
translations: { fr-CA: /fr/guides/… } # optional, reserved for French versions
toc: true                            # optional; TOC shows when ≥ 3 H2 headings
draft: true                          # optional; drafts are never built
relatedTools: [compress-pdf, merge-pdf]   # tool ids or slugs from src/data/tools.mjs
relatedGuides: [another-guide-slug]
sources:
  - title: Source title
    url: https://example.org/page
    publisher: Organisation          # optional
    accessed: 2026-11-04             # optional
---
```

Categories (`scripts/qpdf/guides.mjs`):

| key                | Hub heading                     |
| ------------------ | ------------------------------- |
| `pdf-basics`       | PDF guides                      |
| `privacy-security` | Privacy and security            |
| `immigration`      | Canadian immigration documents  |
| `legal`            | For legal professionals         |
| `comparisons`      | Software comparisons            |

## Build-time validation

`npm run build` stops with a message naming the file when a guide has:

- a missing `title`, `description`, `category` or `published`;
- an unknown `category`;
- `published` / `reviewed` not written as `YYYY-MM-DD`, or `reviewed` earlier
  than `published`;
- a `relatedTools` entry that is not a tool id or slug in `src/data/tools.mjs`
  (tools that exist but are switched off in a build are skipped silently);
- a `relatedGuides` entry that is neither a published guide nor a draft;
- a source without a `title` or without an `https://` `url`;
- two guides with the same slug.

A `description` over 170 characters only produces a warning. After the build,
`npm run check:dist` also checks the guide's canonical URL, single H1,
Article structured data (headline, dates, no ratings/reviews), internal links,
and that its sitemap entry carries `<lastmod>` (= `reviewed`).

## Writing rules

- Use `##` for sections and `###` for sub-sections. Do not add an `#` H1.
- Link to tools with their public URL, e.g. `[Compress PDF](/compress-pdf/)`.
- Cite primary sources for any factual requirement (file-size limits, rules).
- Only publish complete, reviewed articles. Keep unfinished work as `draft: true`.
- Raw HTML is disabled in Markdown for safety.
