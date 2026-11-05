// Generate one HTML entry per published guide from src/templates/guide.html.
// The entries are gitignored; the article itself is rendered from Markdown
// at build time through the Handlebars context (scripts/qpdf/context.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { loadGuides, ROOT } from './guides.mjs';

const outDir = path.join(ROOT, 'guides');
const template = fs.readFileSync(path.join(ROOT, 'src/templates/guide.html'), 'utf8');
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) {
  if (f.endsWith('.html') && f !== 'index.html') fs.rmSync(path.join(outDir, f));
}
const guides = loadGuides();
for (const g of guides) {
  fs.writeFileSync(path.join(outDir, `${g.slug}.html`), template);
}
console.log(`prebuild: ${guides.length} guide page(s) generated`);

// Guard: every icon used in the tool registry must exist in the subset icon
// font used by QPDF's own pages (scripts/qpdf/subset-icons.py).
const { TOOLS } = await import('../../src/data/tools.mjs');
const iconCss = fs.readFileSync(path.join(ROOT, 'src/css/icons-site.css'), 'utf8');
const missingIcons = [...new Set(TOOLS.map((t) => t.icon).filter(Boolean))].filter(
  (i) => !iconCss.includes(`.ph.${i}::before`)
);
if (missingIcons.length) {
  throw new Error(
    `Icons missing from src/css/icons-site.css: ${missingIcons.join(', ')}. Run: python3 scripts/qpdf/subset-icons.py`
  );
}
