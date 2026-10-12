import { useEffect, useRef, useState } from 'react'
import { Trash2, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import FilterDropdown from '../../components/FilterDropdown'
import Loader from '../../components/Loader'
import { deleteProperty, fetchProperties, formatPrice, updateProperty } from '../../services/propertyService'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'sold', label: 'Sold' },
]

export default function ManagePropertiesPage() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const deleteDialogRef = useRef(null)
  const cancelDeleteRef = useRef(null)

  async function load(search = q, nextStatus = status) {
    setLoading(true)
    setError('')
    try {
      const data = await fetchProperties({ q: search, status: nextStatus, limit: 24, page: 1 })
      setItems(data.items || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handle = setTimeout(() => load(q, status), q ? 350 : 0)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status])

  useEffect(() => {
    if (!pendingDelete) return undefined

    const previousFocus = document.activeElement
    cancelDeleteRef.current?.focus()

    function handleDialogKeys(event) {
      if (event.key === 'Escape') {
        setPendingDelete(null)
        return
      }
      if (event.key !== 'Tab') return

      const focusable = deleteDialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleDialogKeys)
    return () => {
      document.removeEventListener('keydown', handleDialogKeys)
      previousFocus?.focus?.()
    }
  }, [pendingDelete])

  async function confirmDelete() {
    if (!pendingDelete) return
    setBusyId(pendingDelete.id)
    try {
      await deleteProperty(pendingDelete.id)
      setNotice(`Deleted “${pendingDelete.title}”.`)
      setPendingDelete(null)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function publish(property) {
    setBusyId(property.id)
    try {
      await updateProperty(property.id, {
        ...toPayload(property),
        status: property.status === 'published' ? 'draft' : 'published',
      })
      setNotice(property.status === 'published' ? 'Moved to draft.' : 'Published.')
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8B6B2F]">Listings</p>
          <h1 className="font-serif text-4xl text-charcoal">Manage properties</h1>
        </div>
        <Link to="/admin/properties/new" className="bg-[#D9B36B] px-4 py-2.5 text-sm text-charcoal">
          Create property
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <label className="text-sm">
          <span className="sr-only">Search</span>
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search title or location"
            className="border border-sand px-3 py-2 text-sm outline-none focus:border-[#B68B3C]"
          />
        </label>
        <label className="text-sm">
          <span className="sr-only">Status</span>
          <FilterDropdown value={status} onChange={setStatus} options={STATUS_OPTIONS} label="Filter by status" />
        </label>
      </div>

      {notice ? <p className="mt-4 text-sm text-[#8B6B2F]">{notice}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {loading ? <Loader label="Loading properties" /> : null}

      {!loading && items.length === 0 ? (
        <p className="mt-8 border border-sand bg-white p-8 text-sm text-muted">No properties found.</p>
      ) : null}

      {!loading && items.length > 0 ? (
        <>
          <div className="mt-6 hidden overflow-x-auto border border-sand bg-white md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-sand bg-cream/70 text-[11px] uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((property) => (
                  <tr key={property.id} className="border-b border-sand last:border-0">
                    <td className="px-4 py-3">{property.title}</td>
                    <td className="px-4 py-3 text-muted">{property.location}</td>
                    <td className="px-4 py-3">{formatPrice(property)}</td>
                    <td className="px-4 py-3 capitalize">{property.status}</td>
                    <td className="px-4 py-3">
                      <div className="grid grid-cols-[40px_88px_84px] items-center gap-1 whitespace-nowrap">
                        <Link to={`/admin/properties/${property.id}/edit`} className="text-[#8B6B2F]">
                          Edit
                        </Link>
                        <button type="button" disabled={busyId === property.id} onClick={() => publish(property)}>
                          {property.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === property.id}
                          aria-label={`Delete ${property.title}`}
                          onClick={() => setPendingDelete(property)}
                          className="inline-flex w-[84px] items-center justify-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-3 md:hidden">
            {items.map((property) => (
              <article key={property.id} className="border border-sand bg-white p-4">
                <h2 className="font-medium text-charcoal">{property.title}</h2>
                <p className="text-sm text-muted">
                  {property.location} · {formatPrice(property)} · {property.status}
                </p>
                <div className="mt-3 grid grid-cols-[40px_88px_84px] items-center gap-1 text-sm">
                  <Link to={`/admin/properties/${property.id}/edit`} className="text-[#8B6B2F]">
                    Edit
                  </Link>
                  <button type="button" onClick={() => publish(property)}>
                    {property.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === property.id}
                    aria-label={`Delete ${property.title}`}
                    onClick={() => setPendingDelete(property)}
                    className="inline-flex w-[84px] items-center justify-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : null}

      {pendingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/55 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <div ref={deleteDialogRef} className="w-full max-w-md rounded-2xl border border-sand bg-white p-6 shadow-2xl shadow-charcoal/20 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-700">
                <TriangleAlert className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 id="delete-title" className="font-serif text-2xl text-charcoal">
                  Delete this listing?
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
              “{pendingDelete.title}” will be removed permanently. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button ref={cancelDeleteRef} type="button" disabled={busyId === pendingDelete.id} onClick={() => setPendingDelete(null)} className="rounded-lg border border-sand px-4 py-2.5 text-sm font-medium text-charcoal transition hover:bg-cream disabled:opacity-60">
                Cancel
              </button>
              <button type="button" disabled={busyId === pendingDelete.id} onClick={confirmDelete} className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                {busyId === pendingDelete.id ? 'Deleting…' : 'Delete listing'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function toPayload(property) {
  return {
    title: property.title,
    description: property.description,
    price: property.price,
    propertyType: property.propertyType,
    listingType: property.listingType,
    location: property.location,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqft: property.areaSqft,
    imageUrls: property.imageUrls,
    amenities: property.amenities,
    status: property.status,
  }
}
