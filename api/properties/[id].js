import { getSession, requireAdmin } from '../_lib/auth.js'
import { applyCors } from '../_lib/cors.js'
import { methodNotAllowed, readJsonBody, sendError } from '../_lib/http.js'
import { deletePropertyRecord, getPropertyById, updatePropertyRecord } from '../_lib/repo.js'
import { validateProperty } from '../_lib/validate.js'

export default async function handler(req, res) {
  if (!applyCors(req, res)) return
  try {
    const id = Number.parseInt(req.query.id, 10)
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid property id' })
    }

    if (req.method === 'GET') return await getHandler(req, res, id)
    if (req.method === 'PUT') return await updateHandler(req, res, id)
    if (req.method === 'DELETE') return await deleteHandler(req, res, id)
    return methodNotAllowed(res, 'GET, PUT, DELETE')
  } catch (error) {
    return sendError(res, error)
  }
}

async function getHandler(req, res, id) {
  const { property, related } = await getPropertyById(id, { admin: Boolean(getSession(req)) })
  if (!property) return res.status(404).json({ error: 'Property not found' })
  return res.status(200).json({ item: property, related })
}

async function updateHandler(req, res, id) {
  if (!requireAdmin(req, res)) return
  const { errors, data } = validateProperty(readJsonBody(req))
  if (errors.length) return res.status(400).json({ error: errors[0], errors })
  const item = await updatePropertyRecord(id, data)
  if (!item) return res.status(404).json({ error: 'Property not found' })
  return res.status(200).json({ item })
}

async function deleteHandler(req, res, id) {
  if (!requireAdmin(req, res)) return
  const ok = await deletePropertyRecord(id)
  if (!ok) return res.status(404).json({ error: 'Property not found' })
  return res.status(200).json({ ok: true })
}
