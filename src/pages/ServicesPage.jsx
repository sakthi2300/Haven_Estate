import { ArrowRight, BadgeCheck, FileText, Gem, House, KeyRound, Scale, Search, ShieldCheck, Signature } from 'lucide-react'
import { Link } from 'react-router-dom'

const SERVICES = [
  {
    icon: Search,
    title: 'Acquisition',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',
    alt: 'Contemporary home surrounded by a landscaped garden',
    text: 'A private search across off-market and published homes, shaped around your life rather than a checklist of rooms.',
  },
  {
    icon: Signature,
    title: 'Representation',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
    alt: 'Warm, carefully styled living room',
    text: 'Thoughtful presentation, considered storytelling and qualified viewings for distinctive residences.',
  },
  {
    icon: KeyRound,
    title: 'Lettings',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c55848d?auto=format&fit=crop&w=900&q=80',
    alt: 'Bright living space opening toward a garden',
    text: 'Long-stay rentals for owners who want their homes cared for and tenants who value quiet quality.',
  },
  {
    icon: Scale,
    title: 'Advisory',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
    alt: 'Refined interior with natural materials',
    text: 'Valuation, title notes and negotiation support from the first conversation through handover.',
  },
]

const TRUST_POINTS = [
  { icon: ShieldCheck, title: 'Trusted expertise', text: 'Professional and transparent' },
  { icon: House, title: 'Personalised solutions', text: 'Tailored to your lifestyle' },
  { icon: FileText, title: 'End-to-end support', text: 'From search to handover' },
  { icon: Gem, title: 'Long-term value', text: 'Focused on your future' },
]

export default function ServicesPage() {
  return (
    <div className="bg-[#F8F6F0]">
      <section className="relative isolate overflow-hidden bg-[#142535] text-[#F8F6F0]">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2200&q=85"
          alt="Modern villa with a pool at dusk"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_58%]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,22,34,0.92)_0%,rgba(7,22,34,0.76)_44%,rgba(7,22,34,0.18)_100%)]" />
        <div className="mx-auto grid min-h-[370px] max-w-7xl items-center gap-10 px-5 py-12 pb-16 sm:min-h-[390px] lg:grid-cols-[minmax(0,1fr)_minmax(350px,0.8fr)] lg:px-8 lg:py-14">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D9B36B]">Our services</p>
            <h1 className="mt-3 font-serif text-5xl leading-[0.98] sm:text-6xl">
              Complete Real Estate<br />
              <em className="text-[#D9B36B]">Solutions for Every Need</em>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
              From finding your dream home to managing your property investment, we bring considered guidance to every step.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D9B36B] px-5 py-3 text-sm font-semibold text-charcoal transition hover:bg-[#E6C57E]"
            >
              Get in touch <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/15 overflow-hidden rounded-xl border border-white/15 bg-charcoal/55 shadow-xl backdrop-blur-sm lg:mt-36">
            {[
              { eyebrow: 'Trusted by', value: '500+', caption: 'Happy clients' },
              { eyebrow: 'Properties', value: '1,000+', caption: 'Listed & sold' },
              { eyebrow: 'Experience', value: '10+', caption: 'Years in real estate' },
            ].map((stat) => (
              <div key={stat.eyebrow} className="px-3 py-4 sm:px-5">
                <p className="text-[10px] text-white/70 sm:text-xs">{stat.eyebrow}</p>
                <p className="mt-1 font-serif text-2xl text-[#D9B36B] sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[9px] text-white/75 sm:text-[11px]">{stat.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-14">
        <div className="mb-7 flex flex-col justify-between gap-4 md:mb-8 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B6B2F]">What we offer</p>
            <h2 className="mt-2 font-serif text-4xl text-charcoal sm:text-5xl">How we work with you</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">
            We make buying, selling, renting or investing simple, secure and rewarding—with advice shaped around you.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service) => (
            <article key={service.title} className="group overflow-hidden rounded-2xl border border-sand bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-charcoal/10">
              <div className="relative aspect-[16/9] overflow-hidden bg-cream">
                <img src={service.image} alt={service.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="relative px-5 pb-5">
                <span className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-cream text-[#A8792D] shadow-sm">
                  <service.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-serif text-2xl text-charcoal">{service.title}</h3>
                <p className="mt-2 min-h-[72px] text-sm leading-6 text-muted">{service.text}</p>
                <Link to="/contact" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B6B2F] transition hover:gap-2.5">
                  Learn more <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-[#E8DDC9] bg-[radial-gradient(ellipse_at_85%_130%,rgba(217,179,107,0.25),transparent_45%),#FBF8F1] px-6 py-5 sm:flex-row sm:items-center sm:px-8">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">Not sure which service is right for you?</h2>
            <p className="mt-1 text-sm text-muted">Talk to our team for personal guidance based on your goals.</p>
          </div>
          <Link to="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#D9B36B] px-5 py-3 text-xs font-semibold text-charcoal transition hover:bg-[#C49B4E]">
            Contact our team <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>

        <div className="mt-8 grid gap-5 rounded-2xl border border-sand/80 bg-white px-5 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:px-2">
          {TRUST_POINTS.map((point, index) => (
            <div key={point.title} className={`flex items-center gap-3 px-3 ${index > 0 ? 'lg:border-l lg:border-sand' : ''}`}>
              <point.icon className="h-6 w-6 shrink-0 text-[#A8792D]" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-charcoal">{point.title}</p>
                <p className="mt-0.5 text-[11px] text-muted">{point.text}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
