// Guides content system.
//
// Articles live in content/guides/<slug>.md with YAML front matter.
// See content/guides/README.md for the field reference.
//
// loadGuides() parses and renders every published article. The build
// (scripts/qpdf/prebuild.mjs) writes one HTML entry per article to
// guides/<slug>.html from src/templates/guide.html; vite.config.ts injects
// the rendered article into that template through the Handlebars context.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import MarkdownIt from 'markdown-it';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '../..');
export const GUIDES_DIR = path.join(ROOT, 'content/guides');

export const GUIDE_CATEGORIES = [
  { key: 'pdf-basics', name: 'PDF guides' },
  { key: 'privacy-security', name: 'Privacy and security' },
  { key: 'immigration', name: 'Canadian immigration documents' },
  { key: 'legal', name: 'For legal professionals' },
  { key: 'comparisons', name: 'Software comparisons' },
];

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function createRenderer() {
  const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
  // Open external links safely; keep internal links as-is.
  const defaultLink =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href') || '';
    if (/^https?:\/\//.test(href) && !href.startsWith('https://qpdf.ca')) {
      tokens[idx].attrSet('rel', 'noopener noreferrer');
      tokens[idx].attrSet('target', '_blank');
    }
    return defaultLink(tokens, idx, options, env, self);
  };
  // Give h2/h3 stable ids for the table of contents.
  md.core.ruler.push('heading_ids', (state) => {
    const used = new Set();
    const toc = [];
    for (let i = 0; i < state.tokens.length; i++) {
      const t = state.tokens[i];
      if (t.type !== 'heading_open' || !['h2', 'h3'].includes(t.tag)) continue;
      const text = state.tokens[i + 1].content;
      let id = slugify(text) || 'section';
      while (used.has(id)) id += '-x';
      used.add(id);
      t.attrSet('id', id);
      toc.push({ id, text, level: t.tag === 'h2' ? 2 : 3 });
    }
    state.env.toc = toc;
  });
  return md;
}

function splitFrontMatter(raw, file) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing YAML front matter`);
  return { data: parseYaml(m[1]) || {}, body: m[2] };
}

const REQUIRED = ['title', 'description', 'published', 'category'];

export function loadGuides({ includeDrafts = false } = {}) {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  const md = createRenderer();
  const guides = [];
  for (const file of fs.readdirSync(GUIDES_DIR)) {
    if (!file.endsWith('.md') || file.startsWith('_') || file === 'README.md') continue;
    const raw = fs.readFileSync(path.join(GUIDES_DIR, file), 'utf8');
    const { data, body } = splitFrontMatter(raw, file);
    for (const key of REQUIRED) {
      if (!data[key]) throw new Error(`content/guides/${file}: missing "${key}"`);
    }
    if (data.draft && !includeDrafts) continue;
    const slug = data.slug || file.replace(/\.md$/, '');
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`${file}: invalid slug "${slug}"`);
    if (!GUIDE_CATEGORIES.some((c) => c.key === data.category)) {
      throw new Error(`${file}: unknown category "${data.category}"`);
    }
    const env = {};
    const html = md.render(body, env);
    const words = body.split(/\s+/).filter(Boolean).length;
    const iso = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d));
    guides.push({
      slug,
      path: `/guides/${slug}/`,
      title: data.title,
      metaTitle: data.metaTitle || `${data.title} | QPDF`,
      description: data.description,
      category: data.category,
      categoryName: GUIDE_CATEGORIES.find((c) => c.key === data.category).name,
      published: iso(data.published),
      reviewed: iso(data.reviewed || data.published),
      author: data.author || 'QPDF',
      lang: data.lang || 'en-CA',
      translations: data.translations || {},
      relatedTools: data.relatedTools || [],
      relatedGuides: data.relatedGuides || [],
      sources: data.sources || [],
      toc: (env.toc || []).filter((h) => h.level === 2),
      showToc: data.toc !== false && (env.toc || []).filter((h) => h.level === 2).length >= 3,
      readingMinutes: Math.max(1, Math.round(words / 220)),
      html,
    });
  }
  guides.sort((a, b) => (a.published < b.published ? 1 : -1));
  return guides;
}
