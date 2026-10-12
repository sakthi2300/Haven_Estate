import { ArrowRight, ChevronDown, House, Menu, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { fetchAdminSession } from '../services/propertyService'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/properties', label: 'Properties', dropdown: true },
  { to: '/services', label: 'Services', dropdown: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/properties', label: 'Manage Properties' },
  { to: '/admin/properties/new', label: 'Add Property' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [mobileAdminOpen, setMobileAdminOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const adminMenuRef = useRef(null)
  const overlay = location.pathname === '/'
  const text = overlay ? 'text-[#F8F6F0]' : 'text-charcoal'

  useEffect(() => {
    let active = true
    fetchAdminSession()
      .then(() => {
        if (active) setIsAdmin(true)
      })
      .catch(() => {
        if (active) setIsAdmin(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!adminOpen) return undefined

    function closeMenu(event) {
      if (event.type === 'keydown' && event.key === 'Escape') {
        setAdminOpen(false)
      } else if (event.type === 'pointerdown' && !adminMenuRef.current?.contains(event.target)) {
        setAdminOpen(false)
      }
    }

    document.addEventListener('keydown', closeMenu)
    document.addEventListener('pointerdown', closeMenu)
    return () => {
      document.removeEventListener('keydown', closeMenu)
      document.removeEventListener('pointerdown', closeMenu)
    }
  }, [adminOpen])

  function submitSearch(event) {
    event.preventDefault()
    const q = query.trim()
    setSearchOpen(false)
    setOpen(false)
    navigate(q ? `/properties?q=${encodeURIComponent(q)}` : '/properties')
  }

  function closeMenus() {
    setOpen(false)
    setAdminOpen(false)
    setMobileAdminOpen(false)
  }

  return (
    <header
      className={
        overlay
          ? 'absolute inset-x-0 top-0 z-40'
          : 'sticky top-0 z-40 border-b border-sand bg-ivory/95 backdrop-blur'
      }
    >
      <div className="flex h-[76px] w-full items-center justify-between gap-4 px-5 max-[380px]:gap-2 max-[380px]:px-3 sm:px-8 xl:h-[88px] xl:px-16">
        <Link
          to="/"
          onClick={closeMenus}
          className={`inline-flex shrink-0 items-center gap-3 whitespace-nowrap max-[380px]:gap-2 ${text}`}
        >
          <House
            className="h-8 w-7 shrink-0 text-[#D9B36B] max-[380px]:h-6 max-[380px]:w-6"
            strokeWidth={2.2}
            aria-hidden="true"
          />
          <span
            className="font-serif text-[28px] font-semibold leading-none tracking-tight max-[380px]:text-[22px] sm:text-[30px]"
          >
            Haven Estate
          </span>
        </Link>

        <nav
          className="hidden h-full shrink-0 items-center gap-6 xl:flex 2xl:gap-8"
          aria-label="Primary"
        >
          {LINKS.slice(0, 4).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => {
                const activeStyle = overlay ? 'text-[#D9B36B]' : 'text-[#8B6B2F]'
                const inactiveStyle = overlay
                  ? 'text-[#F8F6F0] hover:text-white'
                  : 'text-ink/80 hover:text-charcoal'
                return `relative inline-flex h-full shrink-0 items-center gap-1 whitespace-nowrap text-[16px] font-medium leading-5 transition-colors duration-150 focus-visible:outline-[#8B6B2F] ${isActive ? activeStyle : inactiveStyle} ${link.to === '/' && isActive ? 'after:absolute after:bottom-[24px] after:left-0 after:h-[2px] after:w-[38px] after:bg-[#D9B96C] after:content-[""]' : ''}`
              }}
            >
              {link.label}
              {link.dropdown ? <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            </NavLink>
          ))}
          {isAdmin ? (
            <div className="relative h-full" ref={adminMenuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={adminOpen}
                onClick={() => setAdminOpen((value) => !value)}
                className={`relative flex h-full items-center gap-1 whitespace-nowrap text-[16px] font-medium leading-5 transition-colors hover:text-[#D9B36B] focus-visible:outline-[#8B6B2F] ${location.pathname.startsWith('/admin') ? overlay ? 'text-[#D9B36B]' : 'text-[#8B6B2F]' : overlay ? 'text-[#F8F6F0]' : 'text-ink/80'}`}
              >
                Admin <ChevronDown className={`h-3.5 w-3.5 transition-transform ${adminOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {adminOpen ? (
                <div role="menu" className="absolute left-0 top-full z-50 mt-1 min-w-52 rounded-xl border border-sand bg-white p-2 text-charcoal shadow-[0_12px_32px_rgba(23,23,23,0.14)]">
                  {ADMIN_LINKS.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      role="menuitem"
                      onClick={() => setAdminOpen(false)}
                      className={({ isActive }) => `block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-cream focus-visible:outline-[#8B6B2F] ${isActive ? 'font-semibold text-[#8B6B2F]' : 'text-charcoal'}`}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <NavLink
              to="/admin/login"
              className={({ isActive }) => `relative inline-flex h-full shrink-0 items-center whitespace-nowrap text-[16px] font-medium leading-5 transition-colors focus-visible:outline-[#8B6B2F] ${isActive ? overlay ? 'text-[#D9B36B]' : 'text-[#8B6B2F]' : overlay ? 'text-[#F8F6F0] hover:text-white' : 'text-ink/80 hover:text-charcoal'}`}
            >
              Admin
            </NavLink>
          )}
          <NavLink to="/contact" className={({ isActive }) => `relative inline-flex h-full items-center whitespace-nowrap text-[16px] font-medium leading-5 transition-colors focus-visible:outline-[#8B6B2F] ${isActive ? overlay ? 'text-[#D9B36B]' : 'text-[#8B6B2F]' : overlay ? 'text-[#F8F6F0] hover:text-white' : 'text-ink/80 hover:text-charcoal'}`}>
            Contact
          </NavLink>
        </nav>

        <div className="flex shrink-0 items-center gap-3 max-[380px]:gap-2 xl:gap-6">
          <button
            type="button"
            className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline-[#8B6B2F] ${text}`}
            aria-label="Search properties"
            aria-expanded={searchOpen}
            aria-controls="nav-search-form"
            onClick={() => setSearchOpen((value) => !value)}
          >
            <Search className="h-[22px] w-[22px]" strokeWidth={1.8} />
          </button>

          <Link
            to="/contact?intent=sell"
            className={`hidden h-[52px] w-[165px] shrink-0 items-center justify-center gap-3 rounded-full px-6 text-[14px] font-semibold leading-[17px] transition-colors focus-visible:outline-[#8B6B2F] sm:inline-flex ${
              'bg-[#D9B36B] text-charcoal hover:bg-[#E6C57E]'
            }`}
          >
            <span>List Property</span>
            <ArrowRight className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
          </Link>

          <button
            type="button"
            className={`flex h-11 w-11 items-center justify-center xl:hidden ${text}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      <form
        id="nav-search-form"
        hidden={!searchOpen}
        onSubmit={submitSearch}
        className="w-full px-5 pb-4 sm:px-8 xl:px-16"
      >
        <label className="sr-only" htmlFor="nav-search">Search by location</label>
        <input
          id="nav-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search city, area or property"
          className={`w-full px-4 py-3 text-[16px] outline-none max-sm:text-[14px] ${
            overlay
              ? 'border border-ivory/20 bg-charcoal/40 text-ivory placeholder:text-ivory/60'
              : 'border border-sand bg-white text-charcoal'
          }`}
        />
      </form>

      {open ? (
        <div
          id="mobile-menu"
          className={`px-5 py-5 xl:hidden ${
            overlay
              ? 'border-t border-ivory/10 bg-charcoal/95 text-ivory'
              : 'border-t border-sand bg-ivory text-charcoal'
          }`}
        >
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={closeMenus}
                className="py-1"
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin ? (
              <div>
                <button
                  type="button"
                  aria-expanded={mobileAdminOpen}
                  onClick={() => setMobileAdminOpen((value) => !value)}
                  className="flex w-full items-center justify-between py-1 text-left"
                >
                  Admin <ChevronDown className={`h-4 w-4 transition-transform ${mobileAdminOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                {mobileAdminOpen ? (
                  <div className="ml-3 mt-2 flex flex-col gap-2 border-l border-current/20 pl-3">
                    {ADMIN_LINKS.map((link) => (
                      <NavLink key={link.to} to={link.to} end={link.end} onClick={closeMenus} className="py-1 text-sm">
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <NavLink to="/admin/login" onClick={closeMenus} className="py-1">
                Admin
              </NavLink>
            )}
            <Link to="/contact?intent=sell" onClick={closeMenus} className="pt-2 text-[15px] font-medium">
              List Property
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
