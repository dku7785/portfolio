import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.wasm': 'application/wasm',
  '.zip': 'application/zip', '.json': 'application/json', '.pdf': 'application/pdf', '.mp4': 'video/mp4',
  '.vtt': 'text/vtt; charset=utf-8'
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    const requested = decodeURIComponent(url.pathname).replace(/^[/\\]+/, '');
    let path = resolve(dist, requested);
    const rel = relative(dist, path);
    if (isAbsolute(rel) || rel === '..' || rel.startsWith(`..${sep}`)) return res.writeHead(403).end();
    let info = await stat(path);
    if (info.isDirectory()) {
      path = join(path, 'index.html');
      info = await stat(path);
    }
    res.writeHead(200, {
      'Content-Type': mime[extname(path)] ?? 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-store'
    });
    if (req.method === 'HEAD') return res.end();
    createReadStream(path).on('error', () => res.destroy()).pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Page not found');
  }
});

const port = Number(process.argv[2] ?? 4180);
server.listen(port, '127.0.0.1', () => console.log(`Portfolio preview: http://127.0.0.1:${port}/`));
