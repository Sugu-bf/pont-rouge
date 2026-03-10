'use client'

import { useState, useEffect } from 'react'

interface Site {
  id: string
  slug: string
  name: string
  legalName: string
  cheNumber: string
  address: string
  postalCode: string
  city: string
  phone: string
  email: string
  tvaSurPlace: number
  tvaEmporter: number
}

export default function AdminSites() {
  const [sites, setSites] = useState<Site[]>([])
  const [editing, setEditing] = useState<Site | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/sites')
      .then((r) => r.json())
      .then(({ sites }) => setSites(sites))
      .catch(console.error)
  }, [])

  const saveSite = async () => {
    if (!editing) return
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch(`/api/admin/sites/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (!res.ok) throw new Error('Failed')
      const { site } = await res.json()
      setSites((prev) => prev.map((s) => (s.id === site.id ? site : s)))
      setEditing(null)
      setMessage('Site mis a jour')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des restaurants, infos legales et taux TVA</p>
        </div>
        {message && (
          <div className={`px-4 py-2 rounded-lg text-sm ${message.includes('Erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {sites.map((site) => (
          <div key={site.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {editing?.id === site.id ? (
              /* Edit mode */
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nom" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
                  <Field label="Slug" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} />
                  <Field label="Raison sociale" value={editing.legalName} onChange={(v) => setEditing({ ...editing, legalName: v })} />
                  <Field label="N. CHE (IDE/TVA)" value={editing.cheNumber} onChange={(v) => setEditing({ ...editing, cheNumber: v })} />
                  <Field label="Adresse" value={editing.address} onChange={(v) => setEditing({ ...editing, address: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Code postal" value={editing.postalCode} onChange={(v) => setEditing({ ...editing, postalCode: v })} />
                    <Field label="Ville" value={editing.city} onChange={(v) => setEditing({ ...editing, city: v })} />
                  </div>
                  <Field label="Telephone" value={editing.phone} onChange={(v) => setEditing({ ...editing, phone: v })} />
                  <Field label="Email" value={editing.email} onChange={(v) => setEditing({ ...editing, email: v })} />
                  <Field
                    label="TVA Sur place (%)"
                    value={String(editing.tvaSurPlace * 100)}
                    onChange={(v) => setEditing({ ...editing, tvaSurPlace: parseFloat(v) / 100 || 0 })}
                    type="number"
                  />
                  <Field
                    label="TVA A emporter (%)"
                    value={String(editing.tvaEmporter * 100)}
                    onChange={(v) => setEditing({ ...editing, tvaEmporter: parseFloat(v) / 100 || 0 })}
                    type="number"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={saveSite}
                    disabled={saving}
                    className="px-6 py-2 bg-fry-green text-white rounded-lg text-sm font-medium hover:bg-fry-darkgreen disabled:opacity-50"
                  >
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              /* View mode */
              <div className="p-6 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{site.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{site.slug}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                    <div><span className="text-gray-400">Raison sociale:</span> {site.legalName || '-'}</div>
                    <div><span className="text-gray-400">CHE:</span> {site.cheNumber || '-'}</div>
                    <div><span className="text-gray-400">Adresse:</span> {site.address}, {site.postalCode} {site.city}</div>
                    <div><span className="text-gray-400">Tel:</span> {site.phone || '-'}</div>
                    <div>
                      <span className="text-gray-400">TVA sur place:</span>{' '}
                      <span className="font-medium">{(site.tvaSurPlace * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">TVA emporter:</span>{' '}
                      <span className="font-medium">{(site.tvaEmporter * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setEditing({ ...site })}
                  className="px-4 py-2 bg-fry-yellow text-fry-black rounded-lg text-sm font-medium hover:bg-fry-gold"
                >
                  Modifier
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fry-yellow"
      />
    </div>
  )
}
