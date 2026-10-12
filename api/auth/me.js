import { getSession } from '../_lib/auth.js'
import { applyCors } from '../_lib/cors.js'
import { methodNotAllowed } from '../_lib/http.js'

export default async function handler(req, res) {
  if (!applyCors(req, res)) return
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET')
  const session = getSession(req)
  if (!session) return res.status(401).json({ error: 'Authentication required' })
  return res.status(200).json({ user: { email: session.email, role: 'admin' } })
}
