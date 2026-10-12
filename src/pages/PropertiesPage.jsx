import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Grid2X2, List } from 'lucide-react'
import { PropertySkeleton } from '../components/Loader'
import PropertyCard from '../components/PropertyCard'
import PropertyFilters from '../components/PropertyFilters'
import { fetchProperties } from '../services/propertyService'

const PAGE_SIZE = 8
const PROPERTIES_HERO = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2200&q=85'

export default function PropertiesPage() {
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [draft, setDraft] = useState({
    q: params.get('q') || '',
    type: params.get('type') || '',
    listingType: params.get('listingType') || '',
    maxPrice: params.get('maxPrice') || '',
    sort: params.get('sort') || 'newest',
  })

  const query = useMemo(
    () => ({
      q: params.get('q') || '',
      type: params.get('type') || '',
      maxPrice: params.get('maxPrice') || '',
      listingType: params.get('listingType') || '',
      sort: params.get('sort') || 'newest',
      page: Number(params.get('page') || 1),
    }),
    [params],
  )

  useEffect(() => {
    setDraft({
      q: query.q,
      type: query.type,
      listingType: query.listingType,
      maxPrice: query.maxPrice,
      sort: query.sort,
    })
  }, [query.q, query.type, query.listingType, query.maxPrice, query.sort])

  useEffect(() => {
    const handle = setTimeout(() => {
      if (draft.q === query.q) return
      const next = new URLSearchParams(params)
      if (draft.q) next.set('q', draft.q)
      else next.delete('q')
      next.set('page', '1')
      setParams(next, { replace: true })
    }, 350)
    return () => clearTimeout(handle)
  }, [draft.q, query.q, params, setParams])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    fetchProperties({ ...query, limit: PAGE_SIZE })
      .then((data) => {
        if (!active) return
        setItems(data.items || [])
        setTotal(Number(data.total || 0))
      })
      .catch((err) => {
        if (!active) return
        setError(err.message)
        setItems([])
        setTotal(0)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [query])

  function applyFilters() {
    const next = new URLSearchParams()
    if (draft.q) next.set('q', draft.q)
    if (draft.type) next.set('type', draft.type)
    if (draft.listingType) next.set('listingType', draft.listingType)
    if (draft.maxPrice) next.set('maxPrice', draft.maxPrice)
    next.set('sort', draft.sort)
    next.set('page', '1')
    setParams(next)
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="min-h-screen bg-[#F8F6F0]">
      <section className="relative isolate overflow-visible bg-[#142535] text-white">
        <img
          src={PROPERTIES_HERO}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_55%]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,22,34,0.9)_0%,rgba(7,22,34,0.72)_42%,rgba(7,22,34,0.2)_100%)]" />
        <div className="mx-auto max-w-7xl px-5 pb-24 pt-12 lg:px-8 lg:pb-28 lg:pt-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D9B36B]">Explore properties</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[0.98] text-[#F8F6F0] sm:text-6xl lg:text-7xl">
            Find Your<br />Perfect <em className="text-[#D9B36B]">Property</em>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
            Search by neighbourhood, filter by type and price, and find the right home for your next chapter.
          </p>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-12 max-w-7xl px-5 pb-16 lg:-mt-14 lg:px-8">
        <PropertyFilters value={draft} onChange={setDraft} onSubmit={applyFilters} />
      {query.listingType ? (
        <p className="mt-4 text-sm text-muted">
          Showing {query.listingType === 'rent' ? 'rentals' : 'homes for sale'}.
        </p>
      ) : null}

      {error ? (
        <div className="mt-10 rounded-2xl border border-sand bg-white p-10 text-center shadow-sm">
          <p className="font-serif text-2xl text-charcoal">Unable to load listings</p>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <PropertySkeleton key={index} />
          ))}
        </div>
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-sand bg-white p-12 text-center shadow-sm">
          <p className="font-serif text-3xl text-charcoal">No homes match this search</p>
          <p className="mt-2 text-sm text-muted">Widen the location, type or price to see more of the collection.</p>
        </div>
      ) : null}

      {!loading && items.length > 0 ? (
        <>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted"><span className="font-semibold text-charcoal">{total}</span> residences</p>
            <div className="flex items-center gap-1 rounded-xl border border-sand bg-white p-1 shadow-sm" aria-label="Property layout">
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${viewMode === 'grid' ? 'bg-[#D9B36B] text-charcoal' : 'text-muted hover:bg-cream'}`}
              >
                <Grid2X2 className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
                onClick={() => setViewMode('list')}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${viewMode === 'list' ? 'bg-[#D9B36B] text-charcoal' : 'text-muted hover:bg-cream'}`}
              >
                <List className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className={`mt-4 grid gap-5 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {items.map((property) => (
              <PropertyCard key={property.id} property={property} layout={viewMode} />
            ))}
          </div>
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
            <button
              type="button"
              disabled={query.page <= 1}
              onClick={() => {
                const next = new URLSearchParams(params)
                next.set('page', String(query.page - 1))
                setParams(next)
              }}
              className="border border-sand px-3 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-3 text-sm text-muted">
              Page {query.page} of {pages}
            </span>
            <button
              type="button"
              disabled={query.page >= pages}
              onClick={() => {
                const next = new URLSearchParams(params)
                next.set('page', String(query.page + 1))
                setParams(next)
              }}
              className="border border-sand px-3 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        </>
      ) : null}
      </main>
    </div>
  )
}
