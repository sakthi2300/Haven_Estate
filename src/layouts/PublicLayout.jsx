import { MessageCircle } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import WhatsAppButton from '../components/WhatsAppButton'

export default function PublicLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      {location.pathname !== '/' ? (
        <Link
          to="/contact"
          aria-label="Enquire with Haven Estate"
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#D9B36B] text-charcoal shadow-lg transition hover:bg-[#C49B4E]"
        >
          <MessageCircle className="h-6 w-6" />
        </Link>
      ) : null}
    </div>
  )
}
