import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { cloneSampleProperties } from './seed.js'
import { LISTING_TYPES, STATUSES, TYPES } from './validate.js'

const dataDirectory = path.join(process.cwd(), '.data')
const dataFile = path.join(dataDirectory, 'haven-estate.json')

function loadStore() {
  if (!existsSync(dataFile)) return { properties: cloneSampleProperties(), enquiries: [] }
  return JSON.parse(readFileSync(dataFile, 'utf8'))
}

const needsInitialSave = !existsSync(dataFile)
const store = loadStore()

function persist() {
  mkdirSync(dataDirectory, { recursive: true })
  writeFileSync(dataFile, JSON.stringify(store, null, 2), 'utf8')
}

if (needsInitialSave) persist()

function nextId() {
  return store.properties.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

function mapProperty(item) {
  if (!item) return null
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    price: Number(item.price),
    propertyType: item.property_type,
    listingType: item.listing_type,
    location: item.location,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    areaSqft: Number(item.area_sqft),
    imageUrls: Array.isArray(item.image_urls) ? item.image_urls : [],
    amenities: Array.isArray(item.amenities) ? item.amenities : [],
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

function fromValidated(data, extras = {}) {
  return {
    title: data.title,
    description: data.description,
    price: data.price,
    property_type: data.property_type,
    listing_type: data.listing_type,
    location: data.location,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    area_sqft: data.area_sqft,
    image_urls: JSON.parse(data.image_urls),
    amenities: JSON.parse(data.amenities || '[]'),
    status: data.status,
    ...extras,
  }
}

function matchesFilters(item, filters) {
  const { admin, q, type, listingType, status, minPrice, maxPrice } = filters
  if (admin && status && STATUSES.has(status)) {
    if (item.status !== status) return false
  } else if (!(admin && status === 'all') && item.status !== 'published') return false
  if (q && !`${item.title} ${item.location} ${item.property_type}`.toLowerCase().includes(q.toLowerCase())) return false
  if (type && TYPES.has(type) && item.property_type !== type) return false
  if (listingType && LISTING_TYPES.has(listingType) && item.listing_type !== listingType) return false
  if (Number.isFinite(minPrice) && minPrice > 0 && Number(item.price) < minPrice) return false
  if (Number.isFinite(maxPrice) && maxPrice > 0 && Number(item.price) > maxPrice) return false
  return true
}

function sortItems(items, sort) {
  const copy = [...items]
  if (sort === 'price_asc') copy.sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') copy.sort((a, b) => b.price - a.price)
  else copy.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
  return copy
}

export async function listProperties({
  admin = false, q = '', type = '', listingType = '', status = '', sort = 'newest', page = 1, limit = 8,
  minPrice = null, maxPrice = null,
} = {}) {
  const filtered = sortItems(store.properties.filter((item) =>
    matchesFilters(item, { admin, q, type, listingType, status, minPrice, maxPrice }),
  ), sort)
  const offset = (page - 1) * limit
  return { items: filtered.slice(offset, offset + limit).map(mapProperty), total: filtered.length, page, limit }
}

export async function getSummary() {
  const recent = [...store.properties]
    .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
    .slice(0, 5)
  return {
    summary: {
      total: store.properties.length,
      published: store.properties.filter((item) => item.status === 'published').length,
      draft: store.properties.filter((item) => item.status === 'draft').length,
      sold: store.properties.filter((item) => item.status === 'sold').length,
    },
    recent: recent.map(mapProperty),
  }
}

export async function getPropertyById(id, { admin = false } = {}) {
  const item = store.properties.find((property) => property.id === id)
  const property = mapProperty(item)
  if (!property || (property.status !== 'published' && !admin)) return { property: null, related: [] }
  const related = store.properties
    .filter((candidate) => candidate.id !== id && candidate.status === 'published' &&
      (candidate.property_type === property.propertyType || candidate.location === property.location))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    .slice(0, 3)
    .map(mapProperty)
  return { property, related }
}

export async function createPropertyRecord(data) {
  const now = new Date().toISOString()
  const item = fromValidated(data, { id: nextId(), created_at: now, updated_at: now })
  store.properties.unshift(item)
  persist()
  return mapProperty(item)
}

export async function updatePropertyRecord(id, data) {
  const index = store.properties.findIndex((item) => item.id === id)
  if (index === -1) return null
  store.properties[index] = {
    ...store.properties[index], ...fromValidated(data), id,
    created_at: store.properties[index].created_at,
    updated_at: new Date().toISOString(),
  }
  persist()
  return mapProperty(store.properties[index])
}

export async function deletePropertyRecord(id) {
  const index = store.properties.findIndex((item) => item.id === id)
  if (index === -1) return false
  store.properties.splice(index, 1)
  persist()
  return true
}

export async function createEnquiry({ name, email, phone, message, propertyId }) {
  const safePropertyId = propertyId && store.properties.some((item) => item.id === propertyId) ? propertyId : null
  store.enquiries.push({
    id: store.enquiries.length + 1, name, email, phone, message,
    property_id: safePropertyId, created_at: new Date().toISOString(),
  })
  persist()
  return { ok: true }
}
