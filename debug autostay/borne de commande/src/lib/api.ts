// API client for kiosk frontend

export interface ApiCategory {
  id: string
  slug: string
  name: string
  nameFr: string
  nameEn: string
  nameDe: string
  icon: string
  description: string | null
  sortOrder: number
}

export interface ApiProduct {
  id: string
  slug: string
  name: string
  description: string
  price: number
  priceWithFrites: number | null
  image: string | null
  hasProteinChoice: boolean
  veganAvailable: boolean
  isNew: boolean
  isGourmet: boolean
  hasSupplements: boolean
  hasSauceChoice: boolean
  includesFrites: boolean
  category: string // category slug
}

export interface ApiSupplement {
  id: string
  slug: string
  name: string
  price: number
}

export interface ApiSauce {
  id: string
  slug: string
  name: string
  price: number
}

export interface ApiSite {
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

export interface MenuData {
  categories: ApiCategory[]
  products: ApiProduct[]
  supplements: ApiSupplement[]
  sauces: ApiSauce[]
}

export interface OrderItemPayload {
  productId: string
  quantity: number
  unitPrice: number
  protein?: string
  withFrites: boolean
  supplements: { name: string; price: number }[]
  sauce?: string
  removedIngredients: string[]
}

export interface CreateOrderPayload {
  siteId: string
  type: 'surPlace' | 'aEmporter'
  items: OrderItemPayload[]
  paymentMethod: string
  lang: string
}

export async function fetchMenu(): Promise<MenuData> {
  const res = await fetch('/api/menu')
  if (!res.ok) throw new Error('Failed to fetch menu')
  return res.json()
}

export async function fetchSites(): Promise<{ sites: ApiSite[] }> {
  const res = await fetch('/api/sites')
  if (!res.ok) throw new Error('Failed to fetch sites')
  return res.json()
}

export async function createOrder(payload: CreateOrderPayload) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create order')
  return res.json()
}

export async function fetchOrders(siteId: string, status?: string) {
  const params = new URLSearchParams({ siteId })
  if (status) params.set('status', status)
  const res = await fetch(`/api/orders?${params}`)
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update order')
  return res.json()
}
