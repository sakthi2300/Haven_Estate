import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Compass, House, MapPin, Play, Sparkles, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const PRINCIPLES = [
  {
    icon: Sparkles,
    number: '01',
    title: 'People first',
    text: 'We take the time to understand how you live, so we can find homes that truly fit.',
  },
  {
    icon: Compass,
    number: '02',
    title: 'Considered selection',
    text: 'A curated portfolio of properties with architectural character and a strong sense of place.',
  },
  {
    icon: House,
    number: '03',
    title: 'Long-term perspective',
    text: 'We focus on homes that feel right today and continue to feel right over time.',
  },
]

const STUDIO_FILM = 'https://videos.pexels.com/video-files/3773486/3773486-uhd_2560_1440_30fps.mp4'

export default function AboutPage() {
  const [storyOpen, setStoryOpen] = useState(false)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!storyOpen) return undefined
    const previousFocus = document.activeElement
    closeButtonRef.current?.focus()
    function closeOnEscape(event) {
      if (event.key === 'Escape') setStoryOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      previousFocus?.focus?.()
    }
  }, [storyOpen])

  return (
    <main className="bg-white">
      <section className="about-hero-layout mx-auto grid max-w-7xl items-center gap-8 px-5 py-8 sm:py-10 lg:gap-6 lg:px-8 lg:py-9">
        <aside className="about-hero-rail hidden flex-col items-center gap-1 border-r border-[#E8DDC9] py-8 text-[9px] font-medium uppercase leading-4 tracking-[0.14em] text-muted">
          <span>Homes</span><span>People</span><span>Places</span>
          <span className="mt-1 h-7 w-px bg-[#D9B36B]" aria-hidden="true" />
        </aside>

        <div className="max-w-lg">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B68B3C]">About Haven Estate</p>
          <h1 className="about-hero-title mt-3 font-serif tracking-tight text-charcoal">
            Architecture<br />
            <em className="text-[#B68B3C]">first.</em> Market<br />
            second.
          </h1>
          <p className="mt-4 max-w-md text-[13px] leading-[1.65] text-muted sm:text-sm">
            Haven Estate is a private brokerage for homes with lasting architectural character. We work with a considered number of residences each season, chosen for proportion, light and a sense of place.
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] font-medium text-muted sm:text-[11px]">
            <MapPin className="h-3.5 w-3.5 text-[#B68B3C]" aria-hidden="true" />
            Chennai <span className="text-[#C6B89D]">/</span> Coimbatore <span className="text-[#C6B89D]">/</span> Bengaluru <span className="text-[#C6B89D]">/</span> Tamil Nadu coast
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link to="/properties" className="inline-flex items-center gap-2 rounded-full bg-[#D9B36B] px-4 py-2.5 text-[11px] font-semibold text-charcoal transition hover:bg-[#C49B4E] sm:text-xs">
              Explore our homes <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-2.5 text-[11px] font-semibold text-charcoal transition hover:border-[#D9B36B] sm:text-xs">
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#D9B36B] text-[#8B6B2F]" aria-hidden="true">↗</span>
              Talk to our team
            </Link>
          </div>

          <div className="mt-6 grid max-w-md grid-cols-3 divide-x divide-[#E8DDC9]">
            {[
              { value: '500+', label: 'Premium properties' },
              { value: '95%', label: 'Client satisfaction' },
              { value: '10+', label: 'Cities covered' },
            ].map((stat) => (
              <div key={stat.label} className="px-3 first:pl-0 last:pr-0">
                <p className="font-serif text-2xl leading-none text-[#B68B3C] sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[9px] leading-4 text-muted sm:text-[10px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <figure className="relative min-w-0 lg:ml-1">
          <div className="about-hero-media relative overflow-hidden rounded-xl bg-cream shadow-lg shadow-charcoal/10">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1700&q=85"
              alt="Contemporary home with warm exterior lighting and a landscaped setting"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/75 via-charcoal/30 to-transparent p-3 pt-16 sm:p-4 sm:pt-20">
              <div className="flex items-end justify-between gap-3 rounded-lg border border-white/15 bg-charcoal/55 p-3 text-white shadow-lg backdrop-blur-sm sm:p-4">
                <div className="min-w-0">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#E4C37F] sm:text-[9px]">Our point of view</p>
                  <p className="mt-1 font-serif text-base leading-tight sm:text-xl">Homes chosen for their character and place.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStoryOpen(true)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-md bg-white/10 px-2 py-2 text-[10px] font-medium text-white transition hover:bg-white/20 sm:px-3 sm:text-xs"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9B36B] text-[#D9B36B]">
                    <Play className="ml-0.5 h-3 w-3 fill-current" aria-hidden="true" />
                  </span>
                  <span className="hidden sm:inline">Watch story</span>
                </button>
              </div>
            </div>
          </div>
        </figure>
      </section>

      <section className="border-t border-sand/80 bg-[#FBFAF7]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:py-12 lg:px-8">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-7 md:flex-row md:items-end">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#B68B3C]">What guides us</p>
              <h2 className="mt-2 font-serif text-3xl leading-tight text-charcoal sm:text-4xl lg:text-5xl">
                A more thoughtful way <em className="text-[#B68B3C]">home.</em>
              </h2>
            </div>
            <p className="max-w-md text-xs leading-5 text-muted sm:text-[13px]">
              Good property decisions start with listening. We bring local knowledge and a clear point of view to each conversation.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <article key={principle.number} className="flex gap-3 rounded-xl border border-sand/80 bg-white p-4 sm:gap-4 sm:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F6F0] text-[#B68B3C]">
                  <principle.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-lg text-charcoal sm:text-xl">{principle.title}</h3>
                    <span className="text-[9px] font-semibold tracking-[0.12em] text-muted">{principle.number}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-5 text-muted sm:text-xs">{principle.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {storyOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/85 p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="studio-story-title">
          <div className="w-full max-w-5xl overflow-hidden rounded-xl bg-charcoal shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 text-white">
              <h2 id="studio-story-title" className="font-serif text-lg">A Haven Estate story</h2>
              <button ref={closeButtonRef} type="button" onClick={() => setStoryOpen(false)} className="rounded-full p-2 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B36B]" aria-label="Close story video">
                <X className="h-5 w-5" />
              </button>
            </div>
            <video controls autoPlay playsInline poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80" className="aspect-video w-full bg-charcoal">
              <source src={STUDIO_FILM} type="video/mp4" />
            </video>
          </div>
        </div>
      ) : null}
    </main>
  )
}
