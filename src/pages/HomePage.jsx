import {
  ArrowRight,
  Bath,
  BadgeCheck,
  BedDouble,
  Headphones,
  Home,
  MapPin,
  Maximize,
  Play,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PropertySkeleton } from '../components/Loader'
import PropertyCard from '../components/PropertyCard'
import { fetchProperties, formatNumber, formatPrice } from '../services/propertyService'

const HERO =
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80'

const CATEGORIES = [
  { label: 'Villas', type: 'Villa', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80' },
  { label: 'Apartments', type: 'Apartment', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80' },
  { label: 'Independent homes', type: 'Independent House', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80' },
  { label: 'Penthouses', type: 'Penthouse', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [featuredVilla, setFeaturedVilla] = useState(null)
  const [error, setError] = useState('')
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [videoOpen, setVideoOpen] = useState(false)
  const videoDialogRef = useRef(null)
  const videoCloseRef = useRef(null)

  useEffect(() => {
    let active = true
    Promise.all([
      fetchProperties({ limit: 4, sort: 'newest' }),
      fetchProperties({ type: 'Villa', limit: 24, sort: 'newest' }),
    ])
      .then(([data, villaData]) => {
        if (!active) return
        setFeatured(data.items || [])
        setFeaturedVilla(
          villaData.items?.find((property) => property.title.toLowerCase() === 'forest edge villa') ||
            villaData.items?.[0] ||
            null,
        )
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoadingFeatured(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!videoOpen) return undefined

    const previousFocus = document.activeElement
    videoCloseRef.current?.focus()

    function handleDialogKeys(event) {
      if (event.key === 'Escape') {
        setVideoOpen(false)
        return
      }
      if (event.key !== 'Tab') return

      const focusable = videoDialogRef.current?.querySelectorAll(
        'button:not([disabled]), video[controls], [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
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
  }, [videoOpen])

  const villaCard = featuredVilla || featured.find((property) => property.propertyType?.toLowerCase() === 'villa')
  const villaHref = villaCard ? `/properties/${villaCard.id}` : '/properties?type=Villa'
  const villaImage = villaCard?.imageUrls?.[0] || CATEGORIES[0].image

  return (
    <div>
      <section className="relative isolate mb-12 min-h-[100svh] overflow-visible text-[#F8F6F0] sm:mb-16 max-sm:mb-36">
        <img src={HERO} alt="Modern luxury villa beside a pool at dusk" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_55%]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,22,34,0.82)_0%,rgba(7,22,34,0.56)_38%,rgba(7,22,34,0.12)_72%,rgba(7,22,34,0.08)_100%)]" />
        <div className="mx-auto flex min-h-[100svh] w-full items-center px-5 pb-32 pt-28 sm:px-8 sm:max-w-none lg:px-[5vw] lg:pb-32 lg:pt-28">
          <div className="grid w-full items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(300px,0.88fr)] md:gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.95fr)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(500px,560px)] xl:gap-14">
            <div className="max-w-[570px]">
              <p className="text-[13px] font-semibold uppercase tracking-[3px] text-[#D9B36B] max-sm:text-[11px] max-sm:tracking-[2px]">Premium real estate</p>
              <h1 className="mt-4 font-serif text-[clamp(48px,5.5vw,84px)] font-medium leading-[1.08] tracking-[-1.8px] max-md:text-[clamp(40px,7vw,54px)] max-sm:text-[clamp(36px,9vw,48px)]">
                <span className="block">Find Your</span>
                <span className="mt-1 block"><em className="font-medium text-[#D9B36B]">Dream</em> Home</span>
              </h1>
              <p className="mt-5 max-w-[580px] text-[18px] font-normal leading-[1.7] text-[#F8F6F0]/90 max-sm:text-[15px] max-sm:leading-[1.65]">
                Discover exceptional properties curated for discerning individuals, where architectural distinction meets timeless sophistication.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                <Link
                  to="/properties"
                  className="inline-flex h-[54px] items-center gap-2 rounded-full bg-[#D9B36B] px-6 text-[15px] font-semibold text-charcoal transition hover:bg-[#E6C57E] max-sm:text-[14px]"
                >
                  Explore Properties <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  className="inline-flex h-[54px] items-center gap-2 rounded-full border border-white/60 bg-charcoal/20 px-6 text-[15px] font-semibold text-[#F8F6F0] transition hover:bg-white/10 max-sm:text-[14px]"
                >
                  <Play className="h-4 w-4" /> Watch Video
                </button>
              </div>
              <div className="mt-7 grid max-w-[560px] grid-cols-3 divide-x divide-white/30">
                {[
                  { value: '500+', label: 'Premium Properties' },
                  { value: '95%', label: 'Client Satisfaction' },
                  { value: '10+', label: 'Cities Covered' },
                ].map((stat) => (
                  <div key={stat.label} className="min-w-0 px-4 first:pl-0 last:pr-0">
                    <p className="font-serif text-[34px] font-semibold leading-none text-[#D9B36B] max-sm:text-[24px]">{stat.value}</p>
                    <p className="mt-1 text-[15px] leading-snug text-[#F8F6F0]/90 max-sm:text-[12px]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to={villaHref}
              className="group w-full max-w-[560px] justify-self-end overflow-hidden rounded-[22px] bg-white text-charcoal shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative h-[220px] overflow-hidden sm:h-[270px]">
                <img
                  src={villaImage}
                  alt={villaCard?.title || 'Luxury villa'}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute left-5 top-5 rounded-full bg-[#D9B36B] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal">
                  Featured villa
                </span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B6B2F]">Haven collection</p>
                    <h2 className="mt-2 font-serif text-2xl font-medium leading-tight sm:text-[28px]">
                      {villaCard?.title || 'Discover our villas'}
                    </h2>
                  </div>
                  {villaCard ? (
                    <p className="shrink-0 font-serif text-xl font-semibold text-[#8B6B2F] sm:text-2xl">
                      {formatPrice(villaCard)}
                    </p>
                  ) : null}
                </div>
                  <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <MapPin className="h-4 w-4 shrink-0 text-[#8B6B2F]" />
                  {villaCard?.location || 'Explore our curated villa collection'}
                </p>
                {villaCard ? (
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-sand pt-4 text-xs font-medium text-muted">
                    <span className="inline-flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-[#8B6B2F]" /> {villaCard.bedrooms} beds</span>
                    <span className="inline-flex items-center gap-1.5"><Bath className="h-4 w-4 text-[#8B6B2F]" /> {villaCard.bathrooms} baths</span>
                    <span className="inline-flex items-center gap-1.5"><Maximize className="h-4 w-4 text-[#8B6B2F]" /> {formatNumber(villaCard.areaSqft)} sq ft</span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-forest">View Property <ArrowRight className="h-4 w-4" /></span>
                  </div>
                ) : (
                  <p className="mt-5 border-t border-sand pt-4 text-sm font-semibold text-[#8B6B2F]">
                    Browse villas <ArrowRight className="ml-1 inline h-4 w-4" />
                  </p>
                )}
              </div>
            </Link>
          </div>
        </div>
        <div className="absolute inset-x-1/2 bottom-16 z-10 grid w-[calc(100%-2rem)] max-w-[1240px] translate-y-1/2 -translate-x-1/2 grid-cols-1 gap-y-0 rounded-2xl border border-black/5 bg-white px-4 py-3 text-charcoal shadow-[0_14px_36px_rgba(20,24,24,0.14)] sm:w-[calc(100%-4rem)] sm:grid-cols-2 sm:px-5 sm:py-4 lg:grid-cols-4">
          {[
            { icon: Home, title: 'Premium Properties', text: 'Curated luxury homes' },
            { icon: ShieldCheck, title: 'Verified Listings', text: '100% verified properties' },
            { icon: BadgeCheck, title: 'Expert Guidance', text: 'From real estate professionals' },
            { icon: Headphones, title: 'Personalized Support', text: 'End-to-end assistance' },
          ].map((item, index) => (
            <div key={item.title} className={`flex min-w-0 items-center gap-2.5 px-2 py-3 sm:gap-3 sm:px-3 ${index < 2 ? 'sm:border-b sm:border-sand/80 lg:border-b-0' : ''} ${index % 2 === 0 ? 'sm:border-r sm:border-sand/80 lg:border-r-0' : ''} ${index % 4 !== 3 ? 'lg:border-r lg:border-sand/80' : ''}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF0EC] text-forest">
                <item.icon className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold leading-snug text-charcoal max-sm:text-[14px]">{item.title}</p>
                <p className="mt-0.5 text-[13px] font-normal leading-snug text-muted max-sm:text-[12px]">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted">Featured properties</p>
            <h2 className="mt-2 font-serif text-4xl text-charcoal md:text-5xl">Exclusive Properties</h2>
            <p className="mt-3 text-sm text-muted">Handpicked premium properties for a refined lifestyle.</p>
          </div>
          <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-forest">
            View All Properties <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {error ? (
          <p className="rounded-2xl border border-sand bg-white p-6 text-sm text-muted">{error}. Start the local Node API to load listings.</p>
        ) : null}
        {loadingFeatured ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <PropertySkeleton key={index} />
            ))}
          </div>
        ) : null}
        {!loadingFeatured && !error && featured.length === 0 ? (
          <p className="border border-sand bg-white p-8 text-sm text-muted">No published listings yet.</p>
        ) : null}
        {!loadingFeatured && !error && featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((property, index) => (
              <PropertyCard key={property.id} property={property} eager={index < 2} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="bg-[#F7F4EE] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted">Collections</p>
          <h2 className="mt-2 font-serif text-4xl text-charcoal">Property categories</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link key={category.type} to={`/properties?type=${encodeURIComponent(category.type)}`} className="group relative block overflow-hidden">
                <img src={category.image} alt="" loading="lazy" className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-charcoal/35" />
                <span className="absolute bottom-5 left-5 font-serif text-2xl text-ivory">{category.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted">Why choose us</p>
            <h2 className="mt-2 font-serif text-4xl text-charcoal md:text-5xl">Quiet confidence, from first viewing to keys.</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted">
              Haven Estate is not a marketplace. It is a studio for architecture of lasting quality.
              Every listing is photographed, verified and presented with the same care we expect of the homes themselves.
            </p>
          </div>
          <ul className="space-y-6">
            {[
              { icon: Sparkles, title: 'Editorial presentation', text: 'Photography, copy and floor context prepared as a private catalogue, not a classified ad.' },
              { icon: ShieldCheck, title: 'Verified titles', text: 'We work only with documented ownership and clear due-diligence notes before a home is published.' },
              { icon: UserRound, title: 'A single advisor', text: 'One specialist remains with you from the first shortlist through negotiation and handover.' },
            ].map((item) => (
              <li key={item.title} className="flex gap-4 border-b border-sand pb-6">
                <item.icon className="mt-1 h-5 w-5 text-forest" />
                <div>
                  <p className="font-medium text-charcoal">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-sand bg-white py-20">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted">Client notes</p>
          <blockquote className="mt-6 font-serif text-3xl leading-snug text-charcoal md:text-4xl">
            “They understood the house before they sold it — the light, the silence, the way the garden
            meets the rooms. That is rare.”
          </blockquote>
          <p className="mt-6 text-sm text-muted">Amrita V. — Villa, East Coast Road</p>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 text-[#F8F6F0]">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c55848d?auto=format&fit=crop&w=1800&q=80"
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/70" />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-serif text-4xl md:text-5xl">Begin a private search</h2>
          <p className="mt-4 text-sm text-[#F8F6F0]/80">
            Tell us the light, the street, the pace of life you want. We will answer with a considered shortlist.
          </p>
          <Link to="/contact" className="mt-8 inline-flex rounded-full bg-ivory px-6 py-3 text-sm font-medium text-charcoal">
            Speak with an advisor
          </Link>
        </div>
      </section>

      {videoOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="studio-film-title"
        >
          <div ref={videoDialogRef} className="w-full max-w-4xl overflow-hidden bg-charcoal">
            <div className="flex items-center justify-between px-4 py-3 text-[#F8F6F0]">
              <h2 id="studio-film-title" className="font-serif text-xl">
                Haven Estate — studio film
              </h2>
              <button ref={videoCloseRef} type="button" onClick={() => setVideoOpen(false)} className="p-2 focus-visible:outline-ivory" aria-label="Close video">
                <X className="h-5 w-5" />
              </button>
            </div>
            <video
              controls
              autoPlay
              playsInline
              poster={HERO}
              className="aspect-video w-full bg-charcoal"
            >
              <source
                src="https://videos.pexels.com/video-files/3773486/3773486-uhd_2560_1440_30fps.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      ) : null}
    </div>
  )
}
