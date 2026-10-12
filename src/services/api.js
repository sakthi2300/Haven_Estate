const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export async function apiFetch(path, { method = 'GET', body, headers } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text }
    }
  }

  if (!response.ok) {
    const error = new Error(data?.error || 'Request failed')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}
