import { clearSessionCookie } from '../_lib/auth.js'
import { applyCors } from '../_lib/cors.js'
import { methodNotAllowed } from '../_lib/http.js'

export default async function handler(req, res) {
  if (!applyCors(req, res)) return
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST')
  res.setHeader('Set-Cookie', clearSessionCookie())
  return res.status(200).json({ ok: true })
}
