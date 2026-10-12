import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Clock3, Mail, MapPin, Phone } from 'lucide-react'
import FilterDropdown from '../components/FilterDropdown'
import { submitEnquiry } from '../services/propertyService'

const ENQUIRY_OPTIONS = [
  { value: '', label: 'Select an option' },
  { value: 'Buying a home', label: 'Buying a home' },
  { value: 'Selling a property', label: 'Selling a property' },
  { value: 'Renting a home', label: 'Renting a home' },
  { value: 'Property valuation', label: 'Property valuation' },
  { value: 'Other enquiry', label: 'Other enquiry' },
]

const CONTACT_CARDS = [
  {
    icon: MapPin,
    title: 'Our office',
    lines: ['12 Cathedral Road,', 'Chennai 600086'],
    note: 'Visit us by appointment',
  },
  {
    icon: Clock3,
    title: 'Office hours',
    lines: ['Mon – Sat: 9:00 AM – 6:00 PM', 'Sunday: By appointment'],
    note: 'We are here when you need us',
  },
  {
    icon: Phone,
    title: 'Call us',
    lines: ['+91 44 4000 1280'],
    note: 'Speak with our team',
    href: 'tel:+914440001280',
  },
  {
    icon: Mail,
    title: 'Email us',
    lines: ['studio@havenestate.in'],
    note: 'We typically respond within 24 hours',
    href: 'mailto:studio@havenestate.in',
  },
]

export default function ContactPage() {
  const [params] = useSearchParams()
  const intent = params.get('intent')
  const defaultMessage = useMemo(
    () =>
      intent === 'sell'
        ? 'I would like to list a property with Haven Estate. Please contact me to arrange a valuation.'
        : '',
    [intent],
  )
  const [form, setForm] = useState({ name: '', email: '', phone: '', enquiryType: '', message: defaultMessage })
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sending, setSending] = useState(false)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (form.name.trim().length < 2) return setError('Please enter your full name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Please enter a valid email address.')
    if (form.message.trim().length < 10) return setError('Please write a message of at least 10 characters.')
    if (form.phone && form.phone.trim().length < 7) return setError('Please enter a valid phone number.')
    if (!agreed) return setError('Please agree to be contacted about your enquiry.')

    setSending(true)
    try {
      const message = form.enquiryType
        ? `Enquiry type: ${form.enquiryType}\n\n${form.message.trim()}`
        : form.message.trim()
      await submitEnquiry({ ...form, message })
      setSuccess('Thank you. Your message has been sent to the studio.')
      setForm({ name: '', email: '', phone: '', enquiryType: '', message: '' })
      setAgreed(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="bg-[#F7F4EE]">
      <section className="relative isolate overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85"
          alt="Contemporary home framed by trees and warm evening light"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_55%]"
        />
        <div className="contact-hero-wash absolute inset-0 -z-10" />

        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-14">
          <div className="max-w-xl py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A8792D]">Contact</p>
            <h1 className="mt-3 font-serif text-5xl leading-[0.98] tracking-tight text-[#172431] sm:text-6xl">
              Let’s start a<br />
              <em className="text-[#A8792D]">conversation.</em>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#55564F] sm:text-base">
              Enquiries are read by an advisor, not a queue. Share the brief, the neighbourhood, or the home you wish to place with us.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-charcoal">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#A8792D] shadow-sm"><MapPin className="h-4 w-4" aria-hidden="true" /></span>
                <span>12 Cathedral Road, Chennai 600086</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#A8792D] shadow-sm"><Phone className="h-4 w-4" aria-hidden="true" /></span>
                <a href="tel:+914440001280" className="hover:text-[#8B6B2F]">+91 44 4000 1280</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#A8792D] shadow-sm"><Mail className="h-4 w-4" aria-hidden="true" /></span>
                <a href="mailto:studio@havenestate.in" className="hover:text-[#8B6B2F]">studio@havenestate.in</a>
              </li>
            </ul>
          </div>

          <form onSubmit={onSubmit} className="contact-form-panel rounded-2xl p-5 shadow-xl shadow-charcoal/10 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-sand/80 pb-4">
              <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">Send us an enquiry</h2>
              <span className="hidden text-[8px] font-semibold uppercase tracking-[0.18em] text-[#8B6B2F] sm:block">We are here to help</span>
            </div>

            <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
              <label className="block text-[11px] font-medium text-charcoal">
                Name <span className="text-[#A8792D]">*</span>
                <input
                  className="mt-1.5 w-full rounded-md border border-sand bg-white px-3 py-2.5 text-xs font-normal outline-none transition placeholder:text-[#99958C] focus:border-[#B68B3C] focus:ring-2 focus:ring-[#B68B3C]/15"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </label>
              <label className="block text-[11px] font-medium text-charcoal">
                Email <span className="text-[#A8792D]">*</span>
                <input
                  type="email"
                  className="mt-1.5 w-full rounded-md border border-sand bg-white px-3 py-2.5 text-xs font-normal outline-none transition placeholder:text-[#99958C] focus:border-[#B68B3C] focus:ring-2 focus:ring-[#B68B3C]/15"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label className="block text-[11px] font-medium text-charcoal">
                Phone
                <input
                  type="tel"
                  className="mt-1.5 w-full rounded-md border border-sand bg-white px-3 py-2.5 text-xs font-normal outline-none transition placeholder:text-[#99958C] focus:border-[#B68B3C] focus:ring-2 focus:ring-[#B68B3C]/15"
                  value={form.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </label>
              <label className="block text-[11px] font-medium text-charcoal">
                Enquiry type
                <span className="mt-1.5 block">
                  <FilterDropdown value={form.enquiryType} onChange={(value) => update('enquiryType', value)} options={ENQUIRY_OPTIONS} label="Enquiry type" />
                </span>
              </label>
              <label className="block text-[11px] font-medium text-charcoal sm:col-span-2">
                Message <span className="text-[#A8792D]">*</span>
                <textarea
                  rows="3"
                  className="mt-1.5 w-full resize-y rounded-md border border-sand bg-white px-3 py-2.5 text-xs font-normal leading-5 outline-none transition placeholder:text-[#99958C] focus:border-[#B68B3C] focus:ring-2 focus:ring-[#B68B3C]/15"
                  value={form.message}
                  onChange={(event) => update('message', event.target.value)}
                  placeholder="Tell us about your requirements..."
                  required
                />
              </label>
            </div>

            <label className="mt-3 flex cursor-pointer items-start gap-2 text-[10px] leading-4 text-muted">
              <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 accent-[#A8792D]" />
              <span>I agree to be contacted by Haven Estate regarding my enquiry.</span>
            </label>
            {error ? <p role="alert" className="mt-3 text-xs text-red-700">{error}</p> : null}
            {success ? <p role="status" className="mt-3 text-xs text-[#6B7F62]">{success}</p> : null}
            <button type="submit" disabled={sending} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#D9B36B] px-4 py-3 text-xs font-semibold text-charcoal transition hover:bg-[#C49B4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6B2F] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
              {sending ? 'Sending…' : 'Send enquiry'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-3 px-5 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {CONTACT_CARDS.map((card) => (
          <article key={card.title} className="flex min-h-28 items-start gap-3 rounded-xl border border-sand/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F4EA] text-[#A8792D]">
              <card.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="font-serif text-lg text-charcoal">{card.title}</h2>
              <div className="mt-1 text-[11px] leading-4 text-charcoal">
                {card.lines.map((line) => (
                  <p key={line}>{card.href ? <a href={card.href} className="hover:text-[#8B6B2F]">{line}</a> : line}</p>
                ))}
              </div>
              <p className="mt-1.5 text-[9px] text-muted">{card.note}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
