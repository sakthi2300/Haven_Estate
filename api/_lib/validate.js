const TYPES = new Set(['Villa', 'Apartment', 'Independent House', 'Penthouse', 'Townhouse'])
const LISTING_TYPES = new Set(['sale', 'rent'])
const STATUSES = new Set(['draft', 'published', 'sold'])

export { TYPES, LISTING_TYPES, STATUSES }

function asInt(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function validateProperty(body) {
  const errors = []
  const data = {}

  const title = body.title?.trim()
  if (!title || title.length < 3) errors.push('Title must be at least 3 characters')
  else data.title = title

  const description = body.description?.trim()
  if (!description || description.length < 20) errors.push('Description must be at least 20 characters')
  else data.description = description

  const price = Number(body.price)
  if (!Number.isFinite(price) || price <= 0) errors.push('Price must be a positive number')
  else data.price = price

  if (!TYPES.has(body.propertyType)) errors.push('Select a valid property type')
  else data.property_type = body.propertyType

  if (!LISTING_TYPES.has(body.listingType)) errors.push('Listing type must be sale or rent')
  else data.listing_type = body.listingType

  const location = body.location?.trim()
  if (!location) errors.push('Location is required')
  else data.location = location

  const bedrooms = asInt(body.bedrooms, -1)
  if (bedrooms < 0 || bedrooms > 20) errors.push('Bedrooms must be between 0 and 20')
  else data.bedrooms = bedrooms

  const bathrooms = asInt(body.bathrooms, -1)
  if (bathrooms < 0 || bathrooms > 20) errors.push('Bathrooms must be between 0 and 20')
  else data.bathrooms = bathrooms

  const area = Number(body.areaSqft)
  if (!Number.isFinite(area) || area <= 0) errors.push('Area must be a positive number')
  else data.area_sqft = area

  const images = Array.isArray(body.imageUrls)
    ? body.imageUrls.map((item) => String(item).trim()).filter(Boolean)
    : String(body.imageUrls || '')
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean)
  if (!images.length) errors.push('At least one image URL is required')
  else data.image_urls = JSON.stringify(images)

  const amenities = Array.isArray(body.amenities)
    ? body.amenities.map((item) => String(item).trim()).filter(Boolean)
    : String(body.amenities || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
  data.amenities = JSON.stringify(amenities)

  if (!STATUSES.has(body.status)) errors.push('Status must be draft, published, or sold')
  else data.status = body.status

  return { errors, data }
}
