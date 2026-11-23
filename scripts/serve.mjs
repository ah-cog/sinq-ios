import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = path.resolve(fileURLToPath(new URL('../www/', import.meta.url)));
const types = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.svg':'image/svg+xml', '.gif':'image/gif'};
http.createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    // Cordova injects this script in native builds; the browser needs no bridge.
    if (pathname === '/cordova.js') { res.writeHead(200, {'Content-Type':'text/javascript'}); res.end(''); return; }
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep) || !(await stat(file)).isFile()) throw new Error('Not found');
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store'});
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(Number(process.env.PORT || 8080), process.env.HOST || '127.0.0.1', () => console.log('SINQ mobile preview: http://localhost:' + (process.env.PORT || 8080)));
