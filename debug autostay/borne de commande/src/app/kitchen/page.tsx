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
  type: string
  status: string
  createdAt: string
  items: OrderItem[]
}

const POLL_INTERVAL = 3000

function parseSupplements(json: string): { name: string; price: number }[] {
  try { return JSON.parse(json) } catch { return [] }
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })
}

function timeSince(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  return `${Math.floor(diff / 3600)}h`
}

// Only show kitchen items (not drinks/desserts)
const barSlugs = [
  'coca-cola', 'coca-zero', 'fanta', 'sprite', 'ice-tea',
  'eau-minerale', 'eau-gazeuse', 'capri-sun',
  'mousse-mangue', 'donut',
  'glace-choco-cornet', 'glace-fraise-cornet', 'glace-vanille-cornet',
  'glace-choquello', 'glace-fusee', 'glace-almond',
  'glace-choco-bol', 'glace-caramel-bol', 'glace-cafe-bol',
]

function isKitchenItem(slug: string): boolean {
  return !barSlugs.includes(slug)
}

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<Order[]>([])
  const [siteId, setSiteId] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())

  // Get site from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const site = params.get('site') || 'bulle'

    // Fetch sites to get DB id from slug
    fetch('/api/sites')
      .then((r) => r.json())
      .then(({ sites }) => {
        const found = sites.find((s: any) => s.slug === site)
        if (found) setSiteId(found.id)
      })
      .catch(console.error)
  }, [])

  // Poll for orders
  const fetchOrders = useCallback(async () => {
    if (!siteId) return
    try {
      const [pending, preparing] = await Promise.all([
        fetch(`/api/orders?siteId=${siteId}&status=pending`).then((r) => r.json()),
        fetch(`/api/orders?siteId=${siteId}&status=preparing`).then((r) => r.json()),
      ])
      const all = [...(pending.orders || []), ...(preparing.orders || [])]
      all.sort((a: Order, b: Order) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      setOrders(all)
    } catch (e) {
      console.error('Failed to fetch orders:', e)
    }
  }, [siteId])

  useEffect(() => {
    if (!siteId) return
    fetchOrders()
    const interval = setInterval(fetchOrders, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [siteId, fetchOrders])

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchOrders()
    } catch (e) {
      console.error('Failed to update:', e)
    }
  }

  const pendingOrders = orders.filter((o) => o.status === 'pending')
  const preparingOrders = orders.filter((o) => o.status === 'preparing')

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '12px 20px',
        backgroundColor: '#16213e',
        borderRadius: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🍔</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>CUISINE</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#8892b0' }}>
          <span>En attente: <strong style={{ color: '#e74c3c', fontSize: '18px' }}>{pendingOrders.length}</strong></span>
          <span>En cours: <strong style={{ color: '#f39c12', fontSize: '18px' }}>{preparingOrders.length}</strong></span>
        </div>
        <div style={{ fontSize: '14px', color: '#8892b0' }}>
          {new Date().toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          color: '#8892b0',
          fontSize: '24px',
        }}>
          <span style={{ fontSize: '64px', marginBottom: '20px' }}>👨‍🍳</span>
          Aucune commande en attente
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}>
          {orders.map((order) => {
            const kitchenItems = order.items.filter((i) => isKitchenItem(i.product.slug))
            if (kitchenItems.length === 0) return null

            const isPending = order.status === 'pending'
            const elapsed = Math.floor((now - new Date(order.createdAt).getTime()) / 1000)
            const isUrgent = elapsed > 300 // 5 min

            return (
              <div
                key={order.id}
                style={{
                  backgroundColor: isPending ? '#0f3460' : '#1a1a2e',
                  border: `2px solid ${isUrgent ? '#e74c3c' : isPending ? '#e94560' : '#f39c12'}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  animation: isUrgent ? 'pulse 1s infinite' : undefined,
                }}
              >
                {/* Order header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: isPending ? '#e94560' : '#f39c12',
                  color: '#fff',
                }}>
                  <div>
                    <span style={{ fontSize: '28px', fontWeight: 'bold' }}>#{order.orderNumber}</span>
                    <span style={{
                      marginLeft: '10px',
                      fontSize: '13px',
                      padding: '2px 8px',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                    }}>
                      {order.type === 'surPlace' ? 'SUR PLACE' : 'À EMPORTER'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px' }}>
                    <div>{formatTime(order.createdAt)}</div>
                    <div style={{ fontWeight: 'bold' }}>{timeSince(order.createdAt)}</div>
                  </div>
                </div>

                {/* Items */}
                <div style={{ padding: '12px 16px' }}>
                  {kitchenItems.map((item, idx) => {
                    const supps = parseSupplements(item.supplements)
                    return (
                      <div key={idx} style={{
                        marginBottom: '10px',
                        paddingBottom: '10px',
                        borderBottom: idx < kitchenItems.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                      }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {item.quantity}x {item.product.name}
                        </div>
                        {item.protein && (
                          <div style={{ color: '#8892b0', fontSize: '14px', paddingLeft: '8px' }}>
                            ▸ {item.protein}
                          </div>
                        )}
                        {item.withFrites && (
                          <div style={{ color: '#8892b0', fontSize: '14px', paddingLeft: '8px' }}>
                            ▸ + Frites
                          </div>
                        )}
                        {supps.map((s, si) => (
                          <div key={si} style={{ color: '#8892b0', fontSize: '14px', paddingLeft: '8px' }}>
                            ▸ + {s.name}
                          </div>
                        ))}
                        {item.sauce && (
                          <div style={{ color: '#8892b0', fontSize: '14px', paddingLeft: '8px' }}>
                            ▸ Sauce: {item.sauce}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Action buttons */}
                <div style={{ padding: '0 16px 12px', display: 'flex', gap: '8px' }}>
                  {isPending ? (
                    <button
                      onClick={() => updateStatus(order.id, 'preparing')}
                      style={{
                        flex: 1,
                        padding: '14px',
                        backgroundColor: '#f39c12',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      COMMENCER
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(order.id, 'ready')}
                      style={{
                        flex: 1,
                        padding: '14px',
                        backgroundColor: '#27ae60',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      PRÊT ✓
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
