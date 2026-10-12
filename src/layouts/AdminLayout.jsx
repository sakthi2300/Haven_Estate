import { Building2, LayoutDashboard, LogOut, Menu, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { fetchAdminSession, logoutAdmin } from '../services/propertyService'

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/properties', label: 'Properties', icon: Building2, end: false },
  { to: '/admin/properties/new', label: 'New listing', icon: Plus, end: false },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let active = true
    fetchAdminSession()
      .then((data) => {
        if (active) setUser(data.user)
      })
      .catch(() => {
        if (active) navigate('/admin/login', { replace: true })
      })
    return () => {
      active = false
    }
  }, [navigate])

  async function handleLogout() {
    try {
      await logoutAdmin()
      navigate('/admin/login')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) return <Loader label="Checking session" />

  return (
    <div className="min-h-screen bg-ivory text-ink lg:grid lg:grid-cols-[240px_1fr]">
      <aside className={`border-r border-sand bg-[#F7F4EE] ${open ? 'block' : 'hidden'} lg:block`}>
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" className="font-serif text-2xl text-charcoal">
            Haven
          </Link>
          <button type="button" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 px-3" aria-label="Admin">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={() => {
                const path = location.pathname
                const isActive =
                  link.to === '/admin'
                    ? path === '/admin'
                    : link.to === '/admin/properties/new'
                      ? path.startsWith('/admin/properties/new')
                      : path.startsWith('/admin/properties') && !path.startsWith('/admin/properties/new')
                return `flex items-center gap-2 px-3 py-2.5 text-sm ${isActive ? 'bg-[#D9B36B] text-charcoal' : 'text-ink hover:bg-sand/60'}`
              }}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>
        <header className="flex items-center justify-between border-b border-sand px-5 py-4">
          <button type="button" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm text-muted">{user.email}</p>
          <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-[#8B6B2F]">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </header>
        {error ? <p className="px-5 pt-4 text-sm text-red-700">{error}</p> : null}
        <div className="p-5 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
