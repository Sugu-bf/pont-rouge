export type OrderType = 'surPlace' | 'aEmporter'

export type CategoryId =
  | 'burgers'
  | 'burgers-speciaux'
  | 'bowls-tasty'
  | 'bowls-healthy'
  | 'extras'
  | 'enfant'
  | 'desserts'
  | 'boissons'

export interface Category {
  id: CategoryId
  name: string
  icon: string
  description?: string
}

export type ProteinChoice = 'boeuf' | 'poulet' | 'vegetarien' | 'vegan'

export interface Supplement {
  id: string
  name: string
  price: number
}

export interface SauceOption {
  id: string
  name: string
  price: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  priceWithFrites?: number
  category: CategoryId
  image?: string
  hasProteinChoice?: boolean
  veganAvailable?: boolean
  isNew?: boolean
  isGourmet?: boolean
  hasSupplements?: boolean
  hasSauceChoice?: boolean
  includesFrites?: boolean
  tags?: string[]
}

export interface CartItemCustomization {
  protein?: ProteinChoice
  withFrites?: boolean
  supplements: Supplement[]
  sauce?: SauceOption
  removedIngredients: string[]
  specialInstructions?: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  customization: CartItemCustomization
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: string
  orderNumber: number
  type: OrderType
  items: CartItem[]
  subtotal: number
  tva: number
  tvaRate: number
  total: number
  createdAt: Date
  siteId: string
}

export interface Site {
  id: string
  name: string
  address: string
  city: string
}

export type KioskScreen =
  | 'welcome'
  | 'orderType'
  | 'menu'
  | 'checkout'
  | 'confirmation'
