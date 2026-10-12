import { existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function createVercelResponse(res) {
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

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

function matchApiFile(root, pathname) {
  const trimmed = pathname.replace(/\/$/, '') || pathname
  const exact = path.join(root, `${trimmed}.js`)
  const indexFile = path.join(root, trimmed, 'index.js')
  if (existsSync(exact)) return { file: exact, id: undefined }
  if (existsSync(indexFile)) return { file: indexFile, id: undefined }

  const parts = trimmed.split('/').filter(Boolean)
  if (parts.length >= 3) {
    const dynamic = path.join(root, parts[0], parts[1], '[id].js')
    if (existsSync(dynamic)) return { file: dynamic, id: parts[2] }
  }
  return null
}

function localApiPlugin() {
  let root = process.cwd()

  return {
    name: 'local-vercel-api',
    configResolved(config) {
      root = config.root
    },
    configureServer(server) {
      const env = loadEnv(server.config.mode, root, '')
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value
      }

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://localhost')
        if (!url.pathname.startsWith('/api/')) return next()

        const match = matchApiFile(root, url.pathname)
        if (!match) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Not found' }))
          return
        }

        try {
          const mod = await import(`${pathToFileURL(match.file).href}?t=${Date.now()}`)
          const vercelReq = req
          vercelReq.query = Object.fromEntries(url.searchParams.entries())
          if (match.id) vercelReq.query.id = match.id
          vercelReq.body = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')
            ? await readBody(req)
            : undefined
          await mod.default(vercelReq, createVercelResponse(res))
        } catch (error) {
          console.error(error)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Internal server error' }))
          }
        }
      })
    },
  }
}

export default defineConfig({
  define: {
    __VERCEL_BUILD__: JSON.stringify(process.env.VERCEL === '1'),
  },
  plugins: [react(), tailwindcss(), localApiPlugin()],
  server: {
    port: 5173,
  },
})
