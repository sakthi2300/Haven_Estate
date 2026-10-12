import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t border-sand bg-[#F7F4EE] text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl text-charcoal">Haven Estate</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted">
            A private brokerage for exceptional homes. We curate architecture of lasting quality for
            clients who prefer discretion, clarity and a measured pace.
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/properties" className="hover:text-[#8B6B2F]">
                Properties
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#8B6B2F]">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-[#8B6B2F]">
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#8B6B2F]">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-[#8B6B2F]">
                Client office
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3 text-sm text-muted">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Atelier</p>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-[#8B6B2F]" /> 12 Cathedral Road, Chennai
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#8B6B2F]" /> +91 44 4000 1280
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#8B6B2F]" /> studio@havenestate.in
          </p>
          <Link to="/contact" className="inline-flex items-center gap-1 pt-2 text-[#8B6B2F]">
            Write to us <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="border-t border-sand/80 px-5 py-5 text-center text-xs text-muted lg:px-8">
            © {CURRENT_YEAR} Haven Estate. All rights reserved.
      </div>
    </footer>
  )
}
