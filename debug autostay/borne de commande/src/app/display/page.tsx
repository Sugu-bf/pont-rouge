'use client'

import { useState, useEffect, useCallback } from 'react'

interface Order {
  id: string
  orderNumber: number
  type: string
  status: string
  createdAt: string
}

const POLL_INTERVAL = 3000

export default function CustomerDisplay() {
  const [preparingOrders, setPreparingOrders] = useState<Order[]>([])
  const [readyOrders, setReadyOrders] = useState<Order[]>([])
  const [siteId, setSiteId] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const site = params.get('site') || 'bulle'
    fetch('/api/sites')
      .then((r) => r.json())
      .then(({ sites }) => {
        const found = sites.find((s: any) => s.slug === site)
        if (found) setSiteId(found.id)
      })
      .catch(console.error)
  }, [])

  const fetchOrders = useCallback(async () => {
    if (!siteId) return
    try {
      const [prep, ready] = await Promise.all([
        fetch(`/api/orders?siteId=${siteId}&status=preparing`).then((r) => r.json()),
        fetch(`/api/orders?siteId=${siteId}&status=ready`).then((r) => r.json()),
      ])
      setPreparingOrders(prep.orders || [])
      setReadyOrders(ready.orders || [])
    } catch (e) {
      console.error('Failed to fetch:', e)
    }
  }, [siteId])

  useEffect(() => {
    if (!siteId) return
    fetchOrders()
    const interval = setInterval(fetchOrders, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [siteId, fetchOrders])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '24px',
        backgroundColor: '#111',
        borderBottom: '3px solid #333',
      }}>
        <div style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '4px' }}>
          FRYBURGER
        </div>
      </div>

      {/* Two columns */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}>
        {/* En préparation */}
        <div style={{
          padding: '24px',
          borderRight: '2px solid #333',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#f39c12',
            borderRadius: '12px',
            fontSize: '24px',
            fontWeight: 'bold',
            letterSpacing: '2px',
          }}>
            EN PRÉPARATION
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '16px',
          }}>
            {preparingOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#2a2a2a',
                  border: '2px solid #f39c12',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#f39c12',
                }}>
                  {order.orderNumber}
                </div>
                <div style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#888',
                  textTransform: 'uppercase',
                }}>
                  {order.type === 'surPlace' ? 'Sur place' : 'À emporter'}
                </div>
              </div>
            ))}

            {preparingOrders.length === 0 && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#555',
                fontSize: '18px',
              }}>
                Aucune commande
              </div>
            )}
          </div>
        </div>

        {/* Prêt */}
        <div style={{ padding: '24px' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#27ae60',
            borderRadius: '12px',
            fontSize: '24px',
            fontWeight: 'bold',
            letterSpacing: '2px',
          }}>
            PRÊT
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '16px',
          }}>
            {readyOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#1a3a2a',
                  border: '2px solid #27ae60',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  animation: 'readyPulse 2s ease-in-out infinite',
                }}
              >
                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#27ae60',
                }}>
                  {order.orderNumber}
                </div>
                <div style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#888',
                  textTransform: 'uppercase',
                }}>
                  {order.type === 'surPlace' ? 'Sur place' : 'À emporter'}
                </div>
              </div>
            ))}

            {readyOrders.length === 0 && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#555',
                fontSize: '18px',
              }}>
                Aucune commande
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes readyPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}
