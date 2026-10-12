import { getSession, requireAdmin } from '../_lib/auth.js'
import { applyCors } from '../_lib/cors.js'
import { methodNotAllowed, readJsonBody, sendError } from '../_lib/http.js'
import { createPropertyRecord, getSummary, listProperties } from '../_lib/repo.js'
import { validateProperty } from '../_lib/validate.js'

function asInt(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) return
  try {
    if (req.method === 'GET') return await listHandler(req, res)
    if (req.method === 'POST') return await createHandler(req, res)
    return methodNotAllowed(res, 'GET, POST')
  } catch (error) {
    return sendError(res, error)
  }
}

async function listHandler(req, res) {
  const admin = Boolean(getSession(req))

  if (admin && String(req.query.summary || '') === '1') {
    return res.status(200).json(await getSummary())
  }

  const result = await listProperties({
    admin,
    q: String(req.query.q || '').trim(),
    type: String(req.query.type || '').trim(),
    listingType: String(req.query.listingType || '').trim(),
    status: String(req.query.status || '').trim(),
    sort: String(req.query.sort || 'newest'),
    page: Math.max(1, asInt(req.query.page, 1)),
    limit: Math.min(24, Math.max(1, asInt(req.query.limit, 8))),
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : null,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : null,
  })

  return res.status(200).json(result)
}

async function createHandler(req, res) {
  if (!requireAdmin(req, res)) return
  const { errors, data } = validateProperty(readJsonBody(req))
  if (errors.length) return res.status(400).json({ error: errors[0], errors })
  const item = await createPropertyRecord(data)
  return res.status(201).json({ item })
}
