'use client'

import { useState, useEffect } from 'react'

interface DashboardStats {
  todayOrders: number
  todayRevenue: number
  pendingOrders: number
  preparingOrders: number
  readyOrders: number
  completedOrders: number
  cancelledOrders: number
}

interface RecentOrder {
  id: string
  orderNumber: number
  type: string
  status: string
  total: number
  createdAt: string
  items: { quantity: number; product: { name: string } }[]
}

export default function AdminDashboard() {
  const [sites, setSites] = useState<any[]>([])
  const [selectedSite, setSelectedSite] = useState<string>('')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
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

    Promise.all([
      fetch(`/api/orders?siteId=${selectedSite}`).then((r) => r.json()),
      fetch(`/api/orders?siteId=${selectedSite}&status=pending`).then((r) => r.json()),
      fetch(`/api/orders?siteId=${selectedSite}&status=preparing`).then((r) => r.json()),
      fetch(`/api/orders?siteId=${selectedSite}&status=ready`).then((r) => r.json()),
    ])
      .then(([all, pending, preparing, ready]) => {
        const orders = all.orders || []
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        const todayOrders = orders.filter((o: any) => new Date(o.createdAt) >= todayStart)

        setStats({
          todayOrders: todayOrders.length,
          todayRevenue: todayOrders.reduce((sum: number, o: any) => sum + o.total, 0),
          pendingOrders: (pending.orders || []).length,
          preparingOrders: (preparing.orders || []).length,
          readyOrders: (ready.orders || []).length,
          completedOrders: todayOrders.filter((o: any) => o.status === 'completed').length,
          cancelledOrders: todayOrders.filter((o: any) => o.status === 'cancelled').length,
        })
        setRecentOrders(orders.slice(0, 10))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [selectedSite])

  const statusColor: Record<string, string> = {
    pending: 'bg-red-100 text-red-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-gray-200 text-gray-500',
  }

  const statusLabel: Record<string, string> = {
    pending: 'En attente',
    preparing: 'En cours',
    ready: 'Pret',
    completed: 'Termine',
    cancelled: 'Annule',
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Vue d&apos;ensemble du jour</p>
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

      {loading ? (
        <div className="text-center py-20 text-gray-400">Chargement...</div>
      ) : stats ? (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Commandes aujourd'hui" value={stats.todayOrders} color="blue" />
            <StatCard label="Chiffre d'affaires" value={`${stats.todayRevenue.toFixed(2)} CHF`} color="green" />
            <StatCard label="En attente" value={stats.pendingOrders} color="red" />
            <StatCard label="En preparation" value={stats.preparingOrders} color="yellow" />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Pretes" value={stats.readyOrders} color="emerald" />
            <StatCard label="Terminees" value={stats.completedOrders} color="gray" />
            <StatCard label="Annulees" value={stats.cancelledOrders} color="gray" />
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Dernieres commandes</h2>
            </div>
            {recentOrders.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400">Aucune commande</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Articles</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Statut</th>
                    <th className="px-6 py-3">Heure</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3 font-bold">{order.orderNumber}</td>
                      <td className="px-6 py-3 text-sm">
                        {order.type === 'surPlace' ? 'Sur place' : 'A emporter'}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                      </td>
                      <td className="px-6 py-3 font-medium">{order.total.toFixed(2)} CHF</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status] || ''}`}>
                          {statusLabel[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    gray: 'bg-gray-50 border-gray-200',
  }
  const textColors: Record<string, string> = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    red: 'text-red-700',
    yellow: 'text-yellow-700',
    emerald: 'text-emerald-700',
    gray: 'text-gray-600',
  }

  return (
    <div className={`rounded-xl border p-5 ${bgColors[color] || bgColors.gray}`}>
      <div className="text-xs text-gray-500 mb-2">{label}</div>
      <div className={`text-2xl font-bold ${textColors[color] || textColors.gray}`}>{value}</div>
    </div>
  )
}
