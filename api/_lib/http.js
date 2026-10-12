export function sendError(res, error) {
  const status = error.status || 500
  const message = error.message || 'Internal server error'
  if (status >= 500) console.error(error)
  return res.status(status).json({ error: message })
}

export function methodNotAllowed(res, allow) {
  res.setHeader('Allow', allow)
  return res.status(405).json({ error: 'Method not allowed' })
}

export function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return {}
}
