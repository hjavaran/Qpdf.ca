// Vite plugin: serve only the Lucide icons Qpdf.ca actually uses.
//
// Upstream tool code does `import { createIcons, icons } from 'lucide'` in
// ~120 modules. `icons` is Lucide's full set (every icon and alias, ~400 KB
// of JavaScript) and it was bundled into the shared chunk that every tool
// page loads. This plugin resolves the bare `lucide` import to a virtual
// module that re-exports `createIcons` and an `icons` object containing only
// the icons whose names appear in the source.
//
// Name collection is deliberately over-inclusive: every kebab-case token in
// src/, the root pages, guides and public/locales that is also a Lucide icon
// name is kept (no code builds icon names by concatenation). An icon that is
// somehow missing does not break a tool: Lucide logs a console warning and
// leaves the <i data-lucide> element empty. Set QPDF_FULL_LUCIDE=1 to disable.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const VIRTUAL = '\0qpdf-lucide-subset';
const SCAN_DIRS = ['src', 'guides', 'public/locales'];
const SCAN_EXT = /\.(ts|js|mjs|html|json)$/;
const TOKEN = /[a-z][a-z0-9]*(?:-[a-z0-9]+)*/g;

// Same conversion Lucide uses (shared/src/utils/toPascalCase.js).
const toPascalCase = (s) => {
  const camel = s.replace(/^([A-Z])|[\s-_]+(\w)/g, (_m, p1, p2) => (p2 ? p2.toUpperCase() : p1.toLowerCase()));
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

function walk(dir, out) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== 'node_modules' && e.name !== 'tests') walk(p, out);
    } else if (SCAN_EXT.test(e.name)) out.push(p);
  }
  return out;
}

/** Lucide's named icon exports (canonical names and aliases). */
function lucideExportNames(root) {
  const require = createRequire(path.join(root, 'package.json'));
  const entry = path.join(path.dirname(require.resolve('lucide/package.json')), 'dist/esm/lucide.js');
  const src = fs.readFileSync(entry, 'utf8');
  const names = new Set();
  for (const m of src.matchAll(/default as ([A-Z][A-Za-z0-9]*)/g)) names.add(m[1]);
  if (names.size < 1000) throw new Error(`lucide-subset: could not read icon exports from ${entry}`);
  return names;
}

export function collectLucideIcons(root) {
  const available = lucideExportNames(root);
  const files = [
    ...SCAN_DIRS.flatMap((d) => walk(path.join(root, d), [])),
    ...fs.readdirSync(root).filter((f) => f.endsWith('.html')).map((f) => path.join(root, f)),
  ];
  const used = new Set();
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    for (const [token] of text.matchAll(TOKEN)) {
      const name = toPascalCase(token);
      if (available.has(name)) used.add(name);
    }
  }
  return [...used].sort();
}

export function lucideSubsetPlugin(root) {
  let names = null;
  return {
    name: 'qpdf-lucide-subset',
    enforce: 'pre',
    resolveId(id, importer) {
      if (process.env.QPDF_FULL_LUCIDE === '1') return null;
      if (id === 'lucide' && importer !== VIRTUAL) return VIRTUAL;
      return null;
    },
    load(id) {
      if (id !== VIRTUAL) return null;
      names ??= collectLucideIcons(root);
      return [
        `import { createIcons, ${names.join(', ')} } from 'lucide';`,
        `export { createIcons };`,
        `export const icons = { ${names.join(', ')} };`,
      ].join('\n');
    },
  };
}
