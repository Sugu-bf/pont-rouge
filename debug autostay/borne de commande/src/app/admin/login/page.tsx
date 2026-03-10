'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erreur de connexion')
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Erreur réseau')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-fry-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-fry-yellow mb-2">FRYBURGER</h1>
          <p className="text-fry-textlight text-sm">Backoffice Administration</p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleSubmit} className="bg-fry-darkcard rounded-2xl p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-fry-textlight mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-fry-darker border border-fry-darkborder text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fry-yellow focus:border-transparent"
              placeholder="admin@fryburger.ch"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-fry-textlight mb-1.5">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-fry-darker border border-fry-darkborder text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fry-yellow focus:border-transparent"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-fry-yellow hover:bg-fry-gold text-fry-text font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Accès réservé au personnel autorisé
        </p>
      </div>
    </div>
  )
}
