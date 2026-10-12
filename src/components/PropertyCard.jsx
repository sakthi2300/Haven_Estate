import { Bath, BedDouble, Heart, MapPin, Maximize } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatNumber, formatPrice, listingLabel } from '../services/propertyService'

const FAVORITES_KEY = 'haven-favorites'

function readFavorites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function PropertyCard({ property, eager = false, layout = 'grid' }) {
  const image = property.imageUrls?.[0]
  const to = `/properties/${property.id}`
  const [saved, setSaved] = useState(() => readFavorites().includes(property.id))
  const isList = layout === 'list'

  function toggleFavorite(event) {
    event.preventDefault()
    event.stopPropagation()
    const next = new Set(readFavorites())
    if (next.has(property.id)) next.delete(property.id)
    else next.add(property.id)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]))
    setSaved(next.has(property.id))
  }

  return (
    <article className={`group overflow-hidden rounded-xl border border-sand/90 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-[#D9B36B]/70 hover:shadow-[0_16px_36px_rgba(28,27,24,0.09)] ${isList ? 'sm:flex' : ''}`}>
      <Link to={to} className={`block ${isList ? 'sm:w-72 sm:shrink-0' : ''}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-cream">
          {image ? (
            <img
              src={image}
              alt={property.title}
              width="800"
              height="600"
              loading={eager ? 'eager' : 'lazy'}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">No image</div>
          )}
            <span className="absolute left-3 top-3 rounded-md bg-ivory/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal">
            {listingLabel(property.listingType)}
          </span>
          <button
            type="button"
            onClick={toggleFavorite}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${property.title} from saved homes` : `Save ${property.title}`}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/95 shadow-sm transition hover:scale-105 ${
              saved ? 'text-[#8B6B2F]' : 'text-muted'
            }`}
          >
            <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </Link>
      <div className={`flex-1 space-y-2.5 p-4 ${isList ? 'sm:p-5' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl leading-tight text-charcoal">
            <Link to={to} className="line-clamp-2 hover:text-[#8B6B2F]">
              {property.title}
            </Link>
          </h3>
          <p className="shrink-0 font-medium text-[#8B6B2F]">{formatPrice(property)}</p>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {property.location}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-sand pt-3 text-[10px] uppercase tracking-[0.1em] text-muted sm:text-[11px]">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms} Beds
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5" /> {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-3.5 w-3.5" /> {formatNumber(property.areaSqft)} Sq Ft
          </span>
        </div>
      </div>
    </article>
  )
}
