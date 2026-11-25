// Minimal static server for the built site (dist/), with the same /u/{user}/{slug}
// rewrite the production .htaccess does. Used by Playwright's webServer.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const root = process.env.DIST_DIR || join(import.meta.dirname, '..', '..', 'dist')
const port = Number(process.env.PORT || 4173)
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' }

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (/^\/u\/[^/]+\/[^/]+\/?$/.test(path)) path = '/public.html'
  if (path.endsWith('/')) path += 'index.html'
  const file = normalize(join(root, path))
  if (!file.startsWith(root)) { res.writeHead(403).end(); return }
  try {
    if (!(await stat(file)).isFile()) throw new Error('not a file')
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' })
    res.end(await readFile(file))
  } catch {
    res.writeHead(404, { 'content-type': 'text/html' }).end(await readFile(join(root, '404.html')).catch(() => 'Not found'))
  }
}).listen(port, () => console.log(`dist/ served on http://localhost:${port}`))
