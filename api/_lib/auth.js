import crypto from 'node:crypto'

const COOKIE_NAME = 'haven_session'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7

function secret() {
  const value = process.env.SESSION_SECRET
  if (!value) {
    const error = new Error('SESSION_SECRET is not configured')
    error.status = 500
    throw error
  }
  return value
}

function sign(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const hmac = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url')
  return `${encoded}.${hmac}`
}

function verify(token) {
  if (!token || !token.includes('.')) return null
  const [encoded, hmac] = token.split('.')
  const expected = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url')
  const a = Buffer.from(hmac)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
    if (!payload?.exp || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function parseCookies(req) {
  const header = req.headers?.cookie
  if (!header) return {}
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...rest] = part.split('=')
        try {
          return [key, decodeURIComponent(rest.join('='))]
        } catch {
          return [key, rest.join('=')]
        }
      }),
  )
}

export function createSessionCookie(email) {
  const token = sign({ email, exp: Date.now() + MAX_AGE_SECONDS * 1000 })
  const crossSite = process.env.CROSS_SITE_COOKIES === 'true'
  const secure = process.env.NODE_ENV === 'production' || crossSite ? '; Secure' : ''
  const sameSite = crossSite ? 'None' : 'Lax'
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=${sameSite}${secure}`
}

export function clearSessionCookie() {
  const crossSite = process.env.CROSS_SITE_COOKIES === 'true'
  const secure = process.env.NODE_ENV === 'production' || crossSite ? '; Secure' : ''
  const sameSite = crossSite ? 'None' : 'Lax'
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=${sameSite}${secure}`
}

export function getSession(req) {
  const cookies = parseCookies(req)
  return verify(cookies[COOKIE_NAME])
}

export function requireAdmin(req, res) {
  const session = getSession(req)
  if (!session) {
    res.status(401).json({ error: 'Authentication required' })
    return null
  }
  return session
}

export function jsonError(res, status, message) {
  return res.status(status).json({ error: message })
}
