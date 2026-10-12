import { Bath, BedDouble, MapPin, Maximize } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import PropertyCard from '../components/PropertyCard'
import { fetchProperty, formatNumber, formatPrice, listingLabel, submitEnquiry } from '../services/propertyService'

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [related, setRelated] = useState([])
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')
    setActive(0)
    fetchProperty(id)
      .then((data) => {
        if (!mounted) return
        setProperty(data.item)
        setRelated(data.related || [])
        setForm((current) => ({
          ...current,
          message: `I would like to know more about ${data.item.title}.`,
        }))
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.status === 404 ? 'This listing is unavailable or the link is invalid.' : err.message)
        setProperty(null)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [id])

  async function onEnquire(event) {
    event.preventDefault()
    setFormError('')
    setFormSuccess('')
    if (form.name.trim().length < 2) return setFormError('Please enter your name.')
    if (!form.email.includes('@')) return setFormError('Please enter a valid email.')
    if (form.message.trim().length < 10) return setFormError('Please add a short message.')
    setSending(true)
    try {
      await submitEnquiry({ ...form, propertyId: property.id })
      setFormSuccess('Your enquiry has been received. An advisor will reply shortly.')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) return <Loader label="Opening residence" />
  if (error || !property) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-serif text-4xl text-charcoal">Property not found</h1>
        <p className="mt-3 text-sm text-muted">{error}</p>
        <Link to="/properties" className="mt-6 inline-block text-[#8B6B2F]">
          Return to the collection
        </Link>
      </div>
    )
  }

  const images = property.imageUrls?.length ? property.imageUrls : []

  return (
      <main className="min-h-screen bg-[#F8F6F0]">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-12">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#8B6B2F]">{listingLabel(property.listingType)}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">{property.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-muted">
            <MapPin className="h-4 w-4" /> {property.location}
          </p>
        </div>
        <p className="font-serif text-3xl text-[#8B6B2F]">{formatPrice(property)}</p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="overflow-hidden rounded-2xl border border-sand bg-white p-1.5 shadow-sm">
          {images[active] ? (
            <img src={images[active]} alt={property.title} className="h-[420px] w-full rounded-xl object-cover md:h-[520px]" />
          ) : (
            <div className="flex h-[420px] items-center justify-center text-muted">No photography yet</div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              className={`overflow-hidden rounded-xl border-2 bg-white p-1 transition ${active === index ? 'border-[#D9B36B] shadow-sm' : 'border-white hover:border-sand'}`}
              aria-label={`View photo ${index + 1}`}
            >
              <img src={image} alt="" loading="lazy" className="h-24 w-full rounded-lg object-cover lg:h-36" />
            </button>
          ))}
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-sand bg-white p-6 shadow-sm sm:grid-cols-4">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Type</dt>
          <dd className="mt-1 text-charcoal">{property.propertyType}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Bedrooms</dt>
          <dd className="mt-1 flex items-center gap-2 text-charcoal">
            <BedDouble className="h-4 w-4" /> {property.bedrooms}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Bathrooms</dt>
          <dd className="mt-1 flex items-center gap-2 text-charcoal">
            <Bath className="h-4 w-4" /> {property.bathrooms}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Area</dt>
          <dd className="mt-1 flex items-center gap-2 text-charcoal">
            <Maximize className="h-4 w-4" /> {formatNumber(property.areaSqft)} sq ft
          </dd>
        </div>
      </dl>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-serif text-3xl text-charcoal">About this home</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{property.description}</p>
          {property.amenities?.length ? (
            <>
              <h3 className="mt-8 font-serif text-2xl text-charcoal">Amenities</h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {property.amenities.map((item) => (
                  <li key={item} className="rounded-lg border border-sand bg-white px-4 py-3 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        <form onSubmit={onEnquire} className="h-fit rounded-2xl border border-sand bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl text-charcoal">Enquire</h2>
          <p className="mt-1 text-sm text-muted">A private note to the studio. We do not share your details.</p>
          <label className="mt-5 block text-sm">
            Name
            <input
              className="mt-1 w-full border border-sand px-3 py-2.5 outline-none focus:border-[#B68B3C]"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label className="mt-3 block text-sm">
            Email
            <input
              type="email"
              className="mt-1 w-full border border-sand px-3 py-2.5 outline-none focus:border-[#B68B3C]"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label className="mt-3 block text-sm">
            Phone
            <input
              className="mt-1 w-full border border-sand px-3 py-2.5 outline-none focus:border-[#B68B3C]"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
          </label>
          <label className="mt-3 block text-sm">
            Message
            <textarea
              rows="4"
              className="mt-1 w-full border border-sand px-3 py-2.5 outline-none focus:border-[#B68B3C]"
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              required
            />
          </label>
          {formError ? <p className="mt-3 text-sm text-red-700">{formError}</p> : null}
          {formSuccess ? <p className="mt-3 text-sm text-[#8B6B2F]">{formSuccess}</p> : null}
          <button
            type="submit"
            disabled={sending}
            className="mt-5 w-full bg-[#D9B36B] py-3 text-sm text-charcoal disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send enquiry'}
          </button>
        </form>
        </div>
      {related.length ? (
        <section className="mt-16">
          <h2 className="font-serif text-3xl text-charcoal">Related residences</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        </section>
      ) : null}
        </div>
      </main>
  )
}
