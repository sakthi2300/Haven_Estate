import { ArrowRight, Search } from 'lucide-react'
import FilterDropdown from './FilterDropdown'

const TYPES = [
  { value: '', label: 'All types' },
  ...['Villa', 'Apartment', 'Independent House', 'Penthouse', 'Townhouse'].map((type) => ({ value: type, label: type })),
]
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
]
const LISTING_OPTIONS = [
  { value: '', label: 'All listings' },
  { value: 'sale', label: 'For sale' },
  { value: 'rent', label: 'For rent' },
]

export default function PropertyFilters({ value, onChange, onSubmit }) {
  function update(field, next) {
    onChange({ ...value, [field]: next })
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.()
      }}
      className="grid gap-4 rounded-2xl border border-sand/80 bg-white p-4 shadow-xl shadow-charcoal/10 md:grid-cols-2 md:p-5 lg:grid-cols-6"
    >
      <label className="block text-sm">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Location</span>
        <span className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={value.q}
            onChange={(event) => update('q', event.target.value)}
            placeholder="City, area or state"
            className="w-full rounded-lg border border-sand bg-ivory py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#B68B3C] focus:ring-2 focus:ring-[#B68B3C]/15"
          />
        </span>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Property type</span>
        <FilterDropdown value={value.type || ''} onChange={(next) => update('type', next)} options={TYPES} label="Property type" />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Buy / rent</span>
        <FilterDropdown value={value.listingType || ''} onChange={(next) => update('listingType', next)} options={LISTING_OPTIONS} label="Buy or rent" />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Max price (₹)</span>
        <input
          type="number"
          min="0"
          value={value.maxPrice}
          onChange={(event) => update('maxPrice', event.target.value)}
          placeholder="Any"
          className="w-full rounded-lg border border-sand bg-ivory px-3 py-2.5 text-sm outline-none transition focus:border-[#B68B3C] focus:ring-2 focus:ring-[#B68B3C]/15"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Sort</span>
        <FilterDropdown value={value.sort} onChange={(next) => update('sort', next)} options={SORTS} label="Sort listings" />
      </label>
      <div className="flex items-end">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#D9B36B] px-4 py-2.5 text-sm font-semibold text-charcoal shadow-sm transition hover:bg-[#C49B4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6B2F] focus-visible:ring-offset-2"
        >
          Apply filters <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
