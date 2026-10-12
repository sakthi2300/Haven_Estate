import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginAdmin } from '../../services/propertyService'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }
    setLoading(true)
    try {
      await loginAdmin(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
      <form onSubmit={onSubmit} className="w-full max-w-md border border-sand bg-white p-8">
        <p className="font-serif text-3xl text-charcoal">Haven Estate</p>
        <h1 className="mt-2 text-sm uppercase tracking-[0.2em] text-[#8B6B2F]">Office login</h1>
        <label className="mt-8 block text-sm">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full border border-sand px-3 py-2.5 outline-none focus:border-[#B68B3C]"
            autoComplete="username"
            required
          />
        </label>
        <label className="mt-4 block text-sm">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full border border-sand px-3 py-2.5 outline-none focus:border-[#B68B3C]"
            autoComplete="current-password"
            required
          />
        </label>
        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
        <button type="submit" disabled={loading} className="mt-6 w-full bg-[#D9B36B] py-3 text-sm text-charcoal disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <Link to="/" className="mt-6 inline-block text-sm text-muted">
          Return to the website
        </Link>
      </form>
    </div>
  )
}
