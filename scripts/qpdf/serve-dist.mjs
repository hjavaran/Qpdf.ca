// Minimal local server that mimics Cloudflare Pages for dist/:
// _headers (wildcards), _redirects, <dir>/index.html, trailing-slash
// redirects, 404.html, and correct MIME types. For testing only.
//   node scripts/qpdf/serve-dist.mjs [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../dist');
const PORT = Number(process.argv[2] || process.env.PORT || 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.zip': 'application/zip',
  '.whl': 'application/octet-stream',
  '.gz': 'application/gzip',
  '.icc': 'application/vnd.iccprofile',
  '.bcmap': 'application/octet-stream',
  '.pfb': 'application/octet-stream',
};

function parseHeaders() {
  const rules = [];
  const file = path.join(ROOT, '_headers');
  if (!fs.existsSync(file)) return rules;
  let cur = null;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      const pat = line.trim();
      const re = new RegExp('^' + pat.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
      cur = { re, headers: [] };
      rules.push(cur);
    } else if (cur) {
      const i = line.indexOf(':');
      cur.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
    }
  }
  return rules;
}
function parseRedirects() {
  const map = new Map();
  const file = path.join(ROOT, '_redirects');
  if (!fs.existsSync(file)) return map;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const [from, to, code] = line.trim().split(/\s+/);
    if (from && to) map.set(from, [to, Number(code || 302)]);
  }
  return map;
}
const headerRules = parseHeaders();
const redirects = parseRedirects();

function send(res, status, file, urlPath) {
  const headers = {};
  for (const r of headerRules) if (r.re.test(urlPath)) for (const [k, v] of r.headers) headers[k] = v;
  headers['Content-Type'] = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const stat = fs.statSync(file);
  headers['Content-Length'] = stat.size;
  res.writeHead(status, headers);
  fs.createReadStream(file).pipe(res);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let p = decodeURIComponent(url.pathname);
    if (redirects.has(p)) {
      const [to, code] = redirects.get(p);
      res.writeHead(code, { Location: to });
      return res.end();
    }
    if (p.includes('..')) {
      res.writeHead(400);
      return res.end();
    }
    let file = path.join(ROOT, p);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!p.endsWith('/')) {
        res.writeHead(308, { Location: p + '/' + url.search });
        return res.end();
      }
      file = path.join(file, 'index.html');
    } else if (p.endsWith('.html') && fs.existsSync(file)) {
      // Pages serves /x.html as /x
    } else if (!fs.existsSync(file) && fs.existsSync(path.join(ROOT, p, 'index.html'))) {
      res.writeHead(308, { Location: p + '/' });
      return res.end();
    }
    if (!fs.existsSync(file)) return send(res, 404, path.join(ROOT, '404.html'), p);
    send(res, 200, file, p);
  })
  .listen(PORT, () => console.log(`QPDF dist served at http://localhost:${PORT}`));
