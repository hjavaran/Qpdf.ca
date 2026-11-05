import { defineConfig } from 'vitest/config';
import type { Connect, Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';
import fs from 'fs';
import { createHash } from 'crypto';
import {
  getPageContext,
  ENABLED_TOOLS,
  DISABLED_TOOL_IDS,
  PAGES,
} from './scripts/qpdf/context.mjs';
import { loadGuides } from './scripts/qpdf/guides.mjs';

// QPDF build configuration.
//
// Source layout
//   index.html, about.html, …       Site pages (repo root)
//   guides/index.html               Guides hub
//   guides/<slug>.html              Generated from content/guides/*.md (prebuild)
//   src/pages/<id>.html             Tool pages (from BentoPDF)
//
// Public URLs use trailing slashes (/merge-pdf/). The dev server maps them
// to the source files below; scripts/qpdf/postbuild.mjs moves the built
// files into <slug>/index.html for Cloudflare Pages.

function engineVersion(): string {
  try {
    const dir = resolve(__dirname, 'node_modules/bentopdf-pdfium');
    const h = createHash('sha256');
    for (const f of ['editcore.js', 'editcore.wasm']) {
      h.update(fs.readFileSync(resolve(dir, f)));
    }
    return h.digest('hex').slice(0, 12);
  } catch {
    return 'dev';
  }
}

const SLUG_TO_ID = new Map(ENABLED_TOOLS.map((t) => [t.slug, t.id]));
const ROOT_PAGES = Object.keys(PAGES).filter(
  (k) => k !== 'guides' && fs.existsSync(resolve(__dirname, `${k}.html`))
);

/** Dev/preview server: map clean URLs to source HTML files. */
function cleanUrlMiddleware(isDev: boolean): Connect.NextHandleFunction {
  return (req, _res, next) => {
    if (!req.url) return next();
    const [pathname, query] = req.url.split('?');
    const q = query ? `?${query}` : '';
    const m = pathname.match(/^\/([a-z0-9-]+)\/?$/);
    const g = pathname.match(/^\/guides\/([a-z0-9-]+)\/?$/);
    if (pathname === '/guides' || pathname === '/guides/') {
      req.url = `/guides/index.html${q}`;
    } else if (g) {
      req.url = `/guides/${g[1]}.html${q}`;
    } else if (m && SLUG_TO_ID.has(m[1])) {
      const id = SLUG_TO_ID.get(m[1]);
      req.url = isDev ? `/src/pages/${id}.html${q}` : `/${id}.html${q}`;
    } else if (m && ROOT_PAGES.includes(m[1])) {
      req.url = `/${m[1]}.html${q}`;
    }
    next();
  };
}

function cleanUrlPlugin(): Plugin {
  return {
    name: 'qpdf-clean-urls',
    configureServer(server) {
      server.middlewares.use(cleanUrlMiddleware(true));
    },
    configurePreviewServer(server) {
      server.middlewares.use(cleanUrlMiddleware(false));
    },
  };
}

/** Move built tool pages from dist/src/pages/<id>.html to dist/<id>.html. */
function flattenPagesPlugin(): Plugin {
  return {
    name: 'flatten-pages',
    enforce: 'post',
    writeBundle(options, bundle) {
      const outDir = options.dir;
      if (!outDir) return;
      for (const fileName of Object.keys(bundle)) {
        if (!fileName.startsWith('src/pages/') || !fileName.endsWith('.html')) {
          continue;
        }
        const from = resolve(outDir, fileName);
        const to = resolve(outDir, fileName.replace('src/pages/', ''));
        if (!fs.existsSync(from)) continue;
        if (fs.existsSync(to)) fs.rmSync(to, { force: true });
        fs.renameSync(from, to);
      }
      for (const dir of ['src/pages', 'src']) {
        const p = resolve(outDir, dir);
        if (fs.existsSync(p) && fs.readdirSync(p).length === 0) fs.rmdirSync(p);
      }
    },
  };
}

function buildInputs(): Record<string, string> {
  const inputs: Record<string, string> = {};
  for (const key of ROOT_PAGES) {
    inputs[key === 'index' ? 'main' : key] = resolve(__dirname, `${key}.html`);
  }
  inputs['guides-index'] = resolve(__dirname, 'guides/index.html');
  for (const g of loadGuides()) {
    const file = resolve(__dirname, `guides/${g.slug}.html`);
    if (!fs.existsSync(file)) {
      throw new Error(
        `guides/${g.slug}.html is missing. Run "node scripts/qpdf/prebuild.mjs" first.`
      );
    }
    inputs[`guide-${g.slug}`] = file;
  }
  for (const t of ENABLED_TOOLS) {
    const file = resolve(__dirname, `src/pages/${t.id}.html`);
    if (!fs.existsSync(file)) throw new Error(`Missing tool page ${file}`);
    inputs[t.id] = file;
  }
  return inputs;
}

const hbsHelpers = {
  eq: (a: unknown, b: unknown) => a === b,
  or: (...args: unknown[]) => args.slice(0, -1).some(Boolean),
  inc: (n: number) => n + 1,
  join: (arr: unknown[], sep: string) =>
    Array.isArray(arr) ? arr.join(typeof sep === 'string' ? sep : ', ') : '',
};

export default defineConfig(() => {
  return {
    base: '/',
    worker: {
      format: 'es' as const,
    },
    plugins: [
      handlebars({
        partialDirectory: resolve(__dirname, 'src/partials'),
        context: (pagePath: string) => getPageContext(pagePath),
        helpers: hbsHelpers,
      }),
      cleanUrlPlugin(),
      flattenPagesPlugin(),
      tailwindcss(),
      nodePolyfills({
        include: ['buffer', 'stream', 'util', 'zlib', 'process'],
        globals: {
          Buffer: true,
          global: false,
          process: true,
        },
      }),
    ],
    define: {
      __SIMPLE_MODE__: JSON.stringify(false),
      __DISABLE_GITHUB_STARS__: JSON.stringify(true),
      __BRAND_NAME__: JSON.stringify('QPDF'),
      __DISABLED_TOOLS__: JSON.stringify(DISABLED_TOOL_IDS),
      __ENGINE_VERSION__: JSON.stringify(engineVersion()),
    },
    resolve: {
      alias: {
        '@/types': resolve(__dirname, 'src/js/types/index.ts'),
        '@': resolve(__dirname, 'src'),
        stream: 'stream-browserify',
        zlib: 'browserify-zlib',
      },
    },
    optimizeDeps: {
      include: ['pdfkit', 'blob-stream'],
      exclude: [
        'coherentpdf',
        'wasm-vips',
        'bentopdf-pdfium',
        'hyper-compress-wasm',
      ],
    },
    server: {
      host: process.env.VITE_DEV_HOST || 'localhost',
      watch: {
        ignored: ['!**/node_modules/bentopdf-pdfium/**'],
      },
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
    preview: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
    build: {
      manifest: true,
      chunkSizeWarningLimit: 4096,
      rollupOptions: {
        input: buildInputs(),
        output: {
          assetFileNames: (assetInfo: { names?: string[] }) => {
            const name = assetInfo.names?.[0] ?? '';
            if (name.endsWith('.mjs')) {
              return 'assets/[name]-[hash].js';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/tests/setup.ts',
    },
  };
});
