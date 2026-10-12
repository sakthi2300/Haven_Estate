import { createReadStream, existsSync, statSync } from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = path.join(root, 'dist')
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function findApiHandler(pathname) {
  const routes = new Map([
    ['/api/auth/login', 'api/auth/login.js'],
    ['/api/auth/logout', 'api/auth/logout.js'],
    ['/api/auth/me', 'api/auth/me.js'],
    ['/api/enquiries', 'api/enquiries/index.js'],
    ['/api/properties', 'api/properties/index.js'],
  ])
  if (routes.has(pathname)) return { file: routes.get(pathname), id: undefined }
  const propertyMatch = pathname.match(/^\/api\/properties\/([^/]+)$/)
  if (propertyMatch) return { file: 'api/properties/[id].js', id: propertyMatch[1] }
  return null
}

async function readBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > 1024 * 1024) throw Object.assign(new Error('Request body is too large'), { status: 413 })
    chunks.push(chunk)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

function createApiResponse(res) {
  const api = {
    statusCode: 200,
    status(code) {
      api.statusCode = code
      res.statusCode = code
      return api
    },
    json(data) {
      res.statusCode = api.statusCode
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(data))
      return api
    },
    setHeader(key, value) {
      res.setHeader(key, value)
      return api
    },
    end(body) {
      res.end(body)
      return api
    },
  }
  return api
}

async function serveApi(req, res, url) {
  const route = findApiHandler(url.pathname)
  if (!route) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }

  try {
    const handler = await import(pathToFileURL(path.join(root, route.file)).href)
    req.query = Object.fromEntries(url.searchParams.entries())
    if (route.id) req.query.id = route.id
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) req.body = await readBody(req)
    await handler.default(req, createApiResponse(res))
  } catch (error) {
    console.error(error)
    if (!res.headersSent) {
      const status = error.status || 500
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: status === 500 ? 'Internal server error' : error.message }))
    }
  }
}

function serveStatic(req, res, url) {
  let decodedPath
  try {
    decodedPath = decodeURIComponent(url.pathname)
  } catch {
    res.writeHead(400)
    res.end('Bad request')
    return
  }
  const requested = path.resolve(dist, `.${decodedPath}`)
  if (requested !== dist && !requested.startsWith(`${dist}${path.sep}`)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }
  const file = existsSync(requested) && statSync(requested).isFile()
    ? requested
    : path.join(dist, 'index.html')
  res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(file)] || 'application/octet-stream' })
  if (req.method === 'HEAD') res.end()
  else createReadStream(file).pipe(res)
}

const server = http.createServer((req, res) => {
  let url
  try {
    url = new URL(req.url || '/', 'http://localhost')
  } catch {
    res.writeHead(400)
    res.end('Bad request')
    return
  }
  if (url.pathname.startsWith('/api/')) void serveApi(req, res, url)
  else if (req.method === 'GET' || req.method === 'HEAD') serveStatic(req, res, url)
  else {
    res.writeHead(405, { Allow: 'GET, HEAD' })
    res.end('Method not allowed')
  }
})

const port = Number(process.env.PORT || 3000)
server.listen(port, '0.0.0.0', () => console.log(`Haven Estate listening on port ${port}`))
