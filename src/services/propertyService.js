import { apiFetch } from './api'

export function formatPrice(property) {
  const amount = Number(property?.price || 0)
  const suffix = property?.listingType === 'rent' ? '/mo' : ''

  if (amount >= 10000000) {
    const crores = amount / 10000000
    const value = crores >= 10 ? crores.toFixed(0) : crores.toFixed(1).replace(/\.0$/, '')
    return `₹ ${value} Cr${suffix}`
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000
    const value = lakhs >= 10 ? lakhs.toFixed(0) : lakhs.toFixed(1).replace(/\.0$/, '')
    return `₹ ${value} L${suffix}`
  }
  return `₹ ${amount.toLocaleString('en-IN')}${suffix}`
}

export function formatNumber(value) {
  return Number(value || 0).toLocaleString('en-IN')
}

export function listingLabel(listingType) {
  return listingType === 'rent' ? 'For Rent' : 'For Sale'
}

export function fetchProperties(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value)
  })
  const query = search.toString()
  return apiFetch(`/api/properties${query ? `?${query}` : ''}`)
}

export function fetchProperty(id) {
  return apiFetch(`/api/properties/${id}`)
}

export function createProperty(payload) {
  return apiFetch('/api/properties', { method: 'POST', body: payload })
}

export function updateProperty(id, payload) {
  return apiFetch(`/api/properties/${id}`, { method: 'PUT', body: payload })
}

export function deleteProperty(id) {
  return apiFetch(`/api/properties/${id}`, { method: 'DELETE' })
}

export function fetchAdminSummary() {
  return apiFetch('/api/properties?summary=1')
}

export function loginAdmin(email, password) {
  return apiFetch('/api/auth/login', { method: 'POST', body: { email, password } })
}

export function logoutAdmin() {
  return apiFetch('/api/auth/logout', { method: 'POST' })
}

export function fetchAdminSession() {
  return apiFetch('/api/auth/me')
}

export function submitEnquiry(payload) {
  return apiFetch('/api/enquiries', { method: 'POST', body: payload })
}
