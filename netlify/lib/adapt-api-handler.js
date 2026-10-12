export function adaptApiHandler(handler, { propertyId = false } = {}) {
  return async (request, context) => {
    const url = new URL(request.url)
    const headers = Object.fromEntries(request.headers.entries())
    headers.host ||= url.host
    headers['x-forwarded-proto'] ||= url.protocol.slice(0, -1)

    let body
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      const rawBody = await request.text()
      if (rawBody.length > 1024 * 1024) {
        return Response.json({ error: 'Request body is too large' }, { status: 413 })
      }
      if (rawBody) {
        try {
          body = JSON.parse(rawBody)
        } catch {
          body = rawBody
        }
      }
    }

    const query = Object.fromEntries(url.searchParams.entries())
    if (propertyId) query.id = context.params.id
    const req = {
      method: request.method,
      headers,
      query,
      body,
      socket: { encrypted: url.protocol === 'https:' },
    }

    let statusCode = 200
    const responseHeaders = new Headers()
    let responseBody = ''
    let ended = false
    const res = {
      status(code) {
        statusCode = code
        return res
      },
      setHeader(key, value) {
        responseHeaders.set(key, value)
        return res
      },
      json(data) {
        responseHeaders.set('Content-Type', 'application/json; charset=utf-8')
        responseBody = JSON.stringify(data)
        ended = true
        return res
      },
      end(data = '') {
        responseBody = data
        ended = true
        return res
      },
    }

    try {
      await handler(req, res)
      if (!ended) responseBody = ''
      return new Response(responseBody, { status: statusCode, headers: responseHeaders })
    } catch (error) {
      console.error(error)
      return Response.json(
        { error: error.status && error.status < 500 ? error.message : 'Internal server error' },
        { status: error.status || 500 },
      )
    }
  }
}
