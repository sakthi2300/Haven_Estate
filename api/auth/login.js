import { createSessionCookie } from '../_lib/auth.js'
import { applyCors } from '../_lib/cors.js'
import { methodNotAllowed, readJsonBody } from '../_lib/http.js'

export default async function handler(req, res) {
  if (!applyCors(req, res)) return
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST')

  const body = readJsonBody(req)
  const email = String(body.email || body.username || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const adminPassword = String(process.env.ADMIN_PASSWORD || '')

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ error: 'Admin credentials are not configured on the server' })
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  res.setHeader('Set-Cookie', createSessionCookie(adminEmail))
  return res.status(200).json({ user: { email: adminEmail, role: 'admin' } })
}
