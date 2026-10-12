const ALLOWED_METHODS = 'GET, POST, PUT, DELETE, OPTIONS'

export function applyCors(req, res) {
  const origin = req.headers?.origin
  if (!origin) return true

  try {
    const parsedOrigin = new URL(origin)
    const host = String(req.headers?.host || '').toLowerCase()
    const protocol = String(
      req.headers?.['x-forwarded-proto'] || (req.socket?.encrypted ? 'https' : 'http'),
    )
      .split(',')[0]
      .trim()
    if (parsedOrigin.host.toLowerCase() === host && parsedOrigin.protocol === `${protocol}:`) return true
  } catch {
    res.status(403).json({ error: 'Origin is not allowed' })
    return false
  }

  const allowedOrigins = String(process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  if (!allowedOrigins.includes(origin)) {
    res.status(403).json({ error: 'Origin is not allowed' })
    return false
  }

  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return false
  }

  return true
}
