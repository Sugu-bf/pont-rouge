'use client'

import { useState, useEffect, useCallback } from 'react'

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  totalPrice: number
  protein: string | null
  withFrites: boolean
  supplements: string
  sauce: string | null
  product: { name: string; slug: string }
}

interface Order {
  id: string
  orderNumber: number
  receiptNumber: string
  type: string
  status: string
  subtotal: number
  tvaRate: number
  tvaAmount: number
  total: number
  paymentMethod: string | null
  terminalId: string
  fiscalHash: string
  createdAt: string
  cancelledAt: string | null
  cancelReason: string | null
  items: OrderItem[]
}

export default function AdminOrders() {
  const [sites, setSites] = useState<any[]>([])
  const [selectedSite, setSelectedSite] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
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

  const fetchOrders = useCallback(() => {
    if (!selectedSite) return
    setLoading(true)
    const params = new URLSearchParams({ siteId: selectedSite })
    if (statusFilter) params.set('status', statusFilter)

    fetch(`/api/orders?${params}`)
      .then((r) => r.json())
      .then(({ orders }) => {
        setOrders(orders || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [selectedSite, statusFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, terminalId: 'admin' }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'Erreur')
        return
      }
      fetchOrders()
      setSelectedOrder(null)
    } catch (e) {
      alert('Erreur reseau')
    }
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-red-100 text-red-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-gray-200 text-gray-500 line-through',
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
        <div className="flex gap-3">
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="preparing">En cours</option>
            <option value="ready">Pret</option>
            <option value="completed">Termine</option>
            <option value="cancelled">Annule</option>
          </select>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-fry-black text-white rounded-lg text-sm hover:bg-gray-800"
          >
            Rafraichir
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Orders list */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Chargement...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Aucune commande</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Recu</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Paiement</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Heure</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`border-b border-gray-50 cursor-pointer transition-colors ${
                      selectedOrder?.id === order.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 font-bold">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{order.receiptNumber}</td>
                    <td className="px-4 py-3 text-sm">
                      {order.type === 'surPlace' ? 'Sur place' : 'Emporter'}
                    </td>
                    <td className="px-4 py-3 font-medium">{order.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.paymentMethod === 'card' ? 'Carte' : order.paymentMethod === 'twint' ? 'TWINT' : order.paymentMethod === 'counter' ? 'Caisse' : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                        {statusLabel[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Order detail panel */}
        {selectedOrder && (
          <div className="w-96 bg-white rounded-xl border border-gray-200 overflow-hidden shrink-0">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Commande #{selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">X</button>
            </div>

            <div className="p-4 space-y-4">
              {/* Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Recu</span>
                  <span className="font-mono text-xs">{selectedOrder.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span>{selectedOrder.type === 'surPlace' ? 'Sur place' : 'A emporter'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Terminal</span>
                  <span>{selectedOrder.terminalId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">TVA ({(selectedOrder.tvaRate * 100).toFixed(1)}%)</span>
                  <span>{selectedOrder.tvaAmount.toFixed(2)} CHF</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total TTC</span>
                  <span>{selectedOrder.total.toFixed(2)} CHF</span>
                </div>
                {selectedOrder.fiscalHash && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hash fiscal</span>
                    <span className="font-mono text-xs">{selectedOrder.fiscalHash.slice(0, 12)}...</span>
                  </div>
                )}
                {selectedOrder.cancelReason && (
                  <div className="bg-red-50 text-red-700 text-xs rounded p-2 mt-2">
                    Annule: {selectedOrder.cancelReason}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-xs text-gray-500 uppercase mb-2">Articles</h4>
                {selectedOrder.items.map((item) => {
                  let supps: { name: string }[] = []
                  try { supps = JSON.parse(item.supplements) } catch {}
                  return (
                    <div key={item.id} className="mb-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.quantity}x {item.product.name}</span>
                        <span>{item.totalPrice.toFixed(2)}</span>
                      </div>
                      {item.protein && <div className="text-gray-500 text-xs pl-3">{item.protein}</div>}
                      {item.withFrites && <div className="text-gray-500 text-xs pl-3">+ Frites</div>}
                      {supps.map((s, i) => <div key={i} className="text-gray-500 text-xs pl-3">+ {s.name}</div>)}
                      {item.sauce && <div className="text-gray-500 text-xs pl-3">Sauce: {item.sauce}</div>}
                    </div>
                  )
                })}
              </div>

              {/* Actions */}
              {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <h4 className="text-xs text-gray-500 uppercase mb-2">Actions</h4>
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(selectedOrder.id, 'preparing')}
                      className="w-full py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600"
                    >
                      Commencer la preparation
                    </button>
                  )}
                  {selectedOrder.status === 'preparing' && (
                    <button
                      onClick={() => updateStatus(selectedOrder.id, 'ready')}
                      className="w-full py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                    >
                      Marquer comme pret
                    </button>
                  )}
                  {selectedOrder.status === 'ready' && (
                    <button
                      onClick={() => updateStatus(selectedOrder.id, 'completed')}
                      className="w-full py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                    >
                      Marquer comme termine
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const reason = prompt('Raison de l\'annulation :')
                      if (reason !== null) {
                        fetch(`/api/orders/${selectedOrder.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'cancelled', cancelReason: reason || 'Non specifie', terminalId: 'admin' }),
                        }).then(() => { fetchOrders(); setSelectedOrder(null) })
                      }
                    }}
                    className="w-full py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                  >
                    Annuler la commande
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
