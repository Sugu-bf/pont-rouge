'use client'

import { useState, useEffect } from 'react'

interface AuditEntry {
  id: string
  action: string
  entity: string
  entityId: string
  oldValue: string | null
  newValue: string | null
  terminalId: string
  orderId: string | null
  siteId: string | null
  createdAt: string
}

export default function AdminAudit() {
  const [sites, setSites] = useState<any[]>([])
  const [selectedSite, setSelectedSite] = useState('')
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sites')
      .then((r) => r.json())
      .then(({ sites }) => {
        setSites(sites)
        if (sites.length > 0) setSelectedSite(sites[0].id)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!selectedSite) return
    setLoading(true)
    fetch(`/api/admin/audit?siteId=${selectedSite}`)
      .then((r) => r.json())
      .then(({ logs }) => {
        setLogs(logs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [selectedSite])

  const actionLabels: Record<string, string> = {
    'order.created': 'Commande creee',
    'order.status_changed': 'Statut modifie',
    'order.cancelled': 'Commande annulee',
  }

  const actionColors: Record<string, string> = {
    'order.created': 'bg-blue-100 text-blue-700',
    'order.status_changed': 'bg-yellow-100 text-yellow-700',
    'order.cancelled': 'bg-red-100 text-red-700',
  }

  function parseJson(str: string | null): any {
    if (!str) return null
    try { return JSON.parse(str) } catch { return str }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-500 text-sm mt-1">Tracabilite complete des operations (GeBuV)</p>
        </div>
        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
        >
          {sites.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Chargement...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Aucune entree</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <th className="px-4 py-3">Date/Heure</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Terminal</th>
                <th className="px-4 py-3">Ancien</th>
                <th className="px-4 py-3">Nouveau</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const oldVal = parseJson(log.oldValue)
                const newVal = parseJson(log.newValue)

                return (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div>{new Date(log.createdAt).toLocaleDateString('fr-CH')}</div>
                      <div className="text-gray-400 text-xs">
                        {new Date(log.createdAt).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-600'}`}>
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{log.terminalId}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono max-w-48 truncate">
                      {oldVal ? (typeof oldVal === 'object' ? JSON.stringify(oldVal) : String(oldVal)) : '-'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-mono max-w-48 truncate">
                      {newVal ? (typeof newVal === 'object' ? JSON.stringify(newVal) : String(newVal)) : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
