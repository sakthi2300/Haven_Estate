import { methodNotAllowed, readJsonBody, sendError } from '../_lib/http.js'
import { applyCors } from '../_lib/cors.js'
import { createEnquiry } from '../_lib/repo.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (!applyCors(req, res)) return
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST')

  try {
    const body = readJsonBody(req)
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const phone = String(body.phone || '').trim()
    const message = String(body.message || '').trim()
    const propertyId = body.propertyId ? Number.parseInt(body.propertyId, 10) : null

    if (name.length < 2) return res.status(400).json({ error: 'Please enter your full name' })
    if (!EMAIL.test(email)) return res.status(400).json({ error: 'Please enter a valid email address' })
    if (message.length < 10) return res.status(400).json({ error: 'Message must be at least 10 characters' })
    if (phone && phone.length < 7) return res.status(400).json({ error: 'Please enter a valid phone number' })

    await createEnquiry({ name, email, phone, message, propertyId })
    return res.status(201).json({ ok: true })
  } catch (error) {
    return sendError(res, error)
  }
}
