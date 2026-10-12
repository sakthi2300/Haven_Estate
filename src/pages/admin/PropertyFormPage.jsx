import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FilterDropdown from '../../components/FilterDropdown'
import Loader from '../../components/Loader'
import { createProperty, fetchProperty, updateProperty } from '../../services/propertyService'

const EMPTY = {
  title: '',
  description: '',
  price: '',
  propertyType: 'Villa',
  listingType: 'sale',
  location: '',
  bedrooms: 3,
  bathrooms: 3,
  areaSqft: '',
  imageUrls: '',
  amenities: '',
  status: 'published',
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'sold', label: 'Sold' },
]

export default function PropertyFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    fetchProperty(id)
      .then(({ item }) => {
        setForm({
          title: item.title,
          description: item.description,
          price: item.price,
          propertyType: item.propertyType,
          listingType: item.listingType,
          location: item.location,
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms,
          areaSqft: item.areaSqft,
          imageUrls: (item.imageUrls || []).join('\n'),
          amenities: (item.amenities || []).join(', '),
          status: item.status,
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    if (form.title.trim().length < 3) return setError('Title must be at least 3 characters.')
    if (form.description.trim().length < 20) return setError('Description must be at least 20 characters.')
    if (!Number(form.price) || Number(form.price) <= 0) return setError('Enter a valid price.')
    if (!form.location.trim()) return setError('Location is required.')
    if (!Number(form.areaSqft) || Number(form.areaSqft) <= 0) return setError('Enter area in square feet.')
    if (!form.imageUrls.trim()) return setError('Add at least one image URL.')

    const payload = {
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      areaSqft: Number(form.areaSqft),
      imageUrls: form.imageUrls.split(/\n|,/).map((item) => item.trim()).filter(Boolean),
      amenities: form.amenities.split(',').map((item) => item.trim()).filter(Boolean),
    }

    setSaving(true)
    try {
      if (isEdit) await updateProperty(id, payload)
      else await createProperty(payload)
      navigate('/admin/properties')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading property" />

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <h1 className="font-serif text-4xl text-charcoal">{isEdit ? 'Edit property' : 'Create property'}</h1>
      <div className="mt-8 grid gap-4">
        <Field label="Title">
          <input value={form.title} onChange={(event) => update('title', event.target.value)} className={inputClass} required />
        </Field>
        <Field label="Description">
          <textarea rows="5" value={form.description} onChange={(event) => update('description', event.target.value)} className={inputClass} required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Price (₹)">
            <input type="number" min="1" value={form.price} onChange={(event) => update('price', event.target.value)} className={inputClass} required />
          </Field>
          <Field label="Listing">
            <select value={form.listingType} onChange={(event) => update('listingType', event.target.value)} className={inputClass}>
              <option value="sale">For sale</option>
              <option value="rent">For rent</option>
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Property type">
            <select value={form.propertyType} onChange={(event) => update('propertyType', event.target.value)} className={inputClass}>
              <option>Villa</option>
              <option>Apartment</option>
              <option>Independent House</option>
              <option>Penthouse</option>
              <option>Townhouse</option>
            </select>
          </Field>
          <Field label="Status">
            <FilterDropdown value={form.status} onChange={(next) => update('status', next)} options={STATUS_OPTIONS} label="Status" className="mt-1" />
            <span className="mt-1 block text-xs text-muted">Only published listings appear on the public property page.</span>
          </Field>
        </div>
        <Field label="Location">
          <input value={form.location} onChange={(event) => update('location', event.target.value)} className={inputClass} required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Bedrooms">
            <input type="number" min="0" value={form.bedrooms} onChange={(event) => update('bedrooms', event.target.value)} className={inputClass} />
          </Field>
          <Field label="Bathrooms">
            <input type="number" min="0" value={form.bathrooms} onChange={(event) => update('bathrooms', event.target.value)} className={inputClass} />
          </Field>
          <Field label="Area (sq ft)">
            <input type="number" min="1" value={form.areaSqft} onChange={(event) => update('areaSqft', event.target.value)} className={inputClass} required />
          </Field>
        </div>
        <Field label="Image URLs (one per line)">
          <textarea rows="4" value={form.imageUrls} onChange={(event) => update('imageUrls', event.target.value)} className={inputClass} required />
        </Field>
        <Field label="Amenities (comma separated)">
          <input value={form.amenities} onChange={(event) => update('amenities', event.target.value)} className={inputClass} />
        </Field>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <button type="submit" disabled={saving} className="mt-6 bg-[#D9B36B] px-6 py-3 text-sm text-charcoal disabled:opacity-60">
        {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create listing'}
      </button>
    </form>
  )
}

const inputClass = 'mt-1 w-full border border-sand bg-white px-3 py-2.5 text-sm outline-none focus:border-[#B68B3C]'

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      {label}
      {children}
    </label>
  )
}
