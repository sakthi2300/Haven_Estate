import { BadgeCheck, Building2, FileEdit, Plus, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../../components/Loader'
import { fetchAdminSummary, formatPrice } from '../../services/propertyService'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminSummary()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="Loading dashboard" />
  if (error) return <p className="text-sm text-red-700">{error}</p>

  const cards = [
    { label: 'Total properties', value: data.summary.total, icon: Building2 },
    { label: 'Published', value: data.summary.published, icon: Store },
    { label: 'Draft', value: data.summary.draft, icon: FileEdit },
    { label: 'Sold', value: data.summary.sold, icon: BadgeCheck },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8B6B2F]">Overview</p>
          <h1 className="font-serif text-4xl text-charcoal">Dashboard</h1>
        </div>
        <Link to="/admin/properties/new" className="inline-flex items-center gap-2 bg-[#D9B36B] px-4 py-2.5 text-sm text-charcoal">
          <Plus className="h-4 w-4" /> New property
        </Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-sand bg-white p-5">
            <card.icon className="h-5 w-5 text-[#8B6B2F]" />
            <p className="mt-4 font-serif text-4xl text-charcoal">{card.value}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </div>
        ))}
      </div>
      <section className="mt-10">
        <h2 className="font-serif text-2xl text-charcoal">Recent properties</h2>
        <div className="mt-4 divide-y divide-sand border border-sand bg-white">
          {data.recent.length ? (
            data.recent.map((property) => (
              <Link key={property.id} to={`/admin/properties/${property.id}/edit`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-cream/50">
                <span className="text-sm text-charcoal">{property.title}</span>
                <span className="text-sm text-muted">
                  {formatPrice(property)} · {property.status}
                </span>
              </Link>
            ))
          ) : (
            <p className="px-4 py-6 text-sm text-muted">No properties yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}
