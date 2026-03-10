'use client'

import { create } from 'zustand'
import {
  OrderType,
  CategoryId,
  KioskScreen,
  CartItem,
  CartItemCustomization,
  Product,
} from '@/data/types'
import { Lang } from '@/data/i18n'
import { createOrder, ApiSupplement, ApiSauce, ApiCategory, ApiProduct } from '@/lib/api'

interface KioskState {
  // Language
  lang: Lang
  setLang: (lang: Lang) => void

  // Navigation
  screen: KioskScreen
  setScreen: (screen: KioskScreen) => void

  // Site
  siteId: string
  siteDbId: string | null
  siteTvaSurPlace: number
  siteTvaEmporter: number
  setSiteId: (slug: string, dbId: string, tvaSurPlace?: number, tvaEmporter?: number) => void

  // Menu data from API
  menuLoaded: boolean
  apiCategories: ApiCategory[]
  apiProducts: ApiProduct[]
  apiSupplements: ApiSupplement[]
  apiSauces: ApiSauce[]
  setMenuData: (data: {
    categories: ApiCategory[]
    products: ApiProduct[]
    supplements: ApiSupplement[]
    sauces: ApiSauce[]
  }) => void

  // Order type
  orderType: OrderType | null
  setOrderType: (type: OrderType) => void

  // Menu navigation
  activeCategory: CategoryId
  setActiveCategory: (id: CategoryId) => void

  // Protein subcategory filter
  preSelectedProtein: 'boeuf' | 'poulet' | 'vegetarien' | 'vegan' | null
  setPreSelectedProtein: (protein: 'boeuf' | 'poulet' | 'vegetarien' | 'vegan' | null) => void

  // Product customization modal
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void

  // Cart
  cart: CartItem[]
  addToCart: (product: Product, customization: CartItemCustomization) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void

  // Upsell
  showUpsell: 'frites' | 'boisson' | null
  setShowUpsell: (type: 'frites' | 'boisson' | null) => void
  lastAddedNeedsFrites: boolean

  // Order
  orderNumber: number | null
  isSubmitting: boolean
  confirmOrder: (paymentMethod: string) => Promise<void>

  // Computed
  getCartTotal: () => number
  getCartCount: () => number
  getTvaAmount: () => number
  getTvaRate: () => number

  // Reset
  resetKiosk: () => void

  // Inactivity
  lastInteraction: number
  touchInteraction: () => void
}

function calculateItemPrice(product: Product, customization: CartItemCustomization): number {
  let price = product.price
  if (customization.withFrites && product.priceWithFrites) {
    price = product.priceWithFrites
  }
  for (const supp of customization.supplements) {
    price += supp.price
  }
  if (customization.sauce) {
    price += customization.sauce.price
  }
  return price
}

export const useKioskStore = create<KioskState>((set, get) => ({
  lang: 'fr',
  setLang: (lang) => set({ lang }),

  screen: 'welcome',
  setScreen: (screen) => set({ screen }),

  siteId: 'bulle',
  siteDbId: null,
  siteTvaSurPlace: 0.081,
  siteTvaEmporter: 0.026,
  setSiteId: (slug, dbId, tvaSurPlace, tvaEmporter) => set({
    siteId: slug,
    siteDbId: dbId,
    ...(tvaSurPlace !== undefined && { siteTvaSurPlace: tvaSurPlace }),
    ...(tvaEmporter !== undefined && { siteTvaEmporter: tvaEmporter }),
  }),

  menuLoaded: false,
  apiCategories: [],
  apiProducts: [],
  apiSupplements: [],
  apiSauces: [],
  setMenuData: (data) => set({
    menuLoaded: true,
    apiCategories: data.categories,
    apiProducts: data.products,
    apiSupplements: data.supplements,
    apiSauces: data.sauces,
  }),

  orderType: null,
  setOrderType: (type) => set({ orderType: type, screen: 'menu' }),

  activeCategory: 'burgers',
  setActiveCategory: (id) => set({ activeCategory: id, preSelectedProtein: null }),

  preSelectedProtein: null,
  setPreSelectedProtein: (protein) => set({ preSelectedProtein: protein }),

  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  cart: [],
  showUpsell: null,
  setShowUpsell: (type) => set({ showUpsell: type }),
  lastAddedNeedsFrites: false,

  addToCart: (product, customization) => {
    const unitPrice = calculateItemPrice(product, customization)
    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      product,
      quantity: 1,
      customization,
      unitPrice,
      totalPrice: unitPrice,
    }

    const needsFritesUpsell =
      !customization.withFrites &&
      !product.includesFrites &&
      product.priceWithFrites != null &&
      product.category !== 'boissons' &&
      product.category !== 'desserts'

    set((state) => ({
      cart: [...state.cart, newItem],
      selectedProduct: null,
      showUpsell: needsFritesUpsell ? 'frites' : 'boisson',
      lastAddedNeedsFrites: needsFritesUpsell,
    }))
  },

  removeFromCart: (cartItemId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== cartItemId),
    }))
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(cartItemId)
      return
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      ),
    }))
  },

  clearCart: () => set({ cart: [] }),

  orderNumber: null,
  isSubmitting: false,

  confirmOrder: async (paymentMethod: string) => {
    const state = get()
    if (state.isSubmitting || state.cart.length === 0) return

    set({ isSubmitting: true })

    try {
      // Find the site DB id
      let siteDbId = state.siteDbId
      if (!siteDbId) {
        // Fetch sites to find the id
        const res = await fetch('/api/sites')
        const { sites } = await res.json()
        const site = sites.find((s: any) => s.slug === state.siteId)
        if (site) siteDbId = site.id
      }

      if (!siteDbId) {
        console.error('Site not found')
        set({ isSubmitting: false })
        return
      }

      const items = state.cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        protein: item.customization.protein || undefined,
        withFrites: item.customization.withFrites || false,
        supplements: item.customization.supplements.map((s) => ({
          name: s.name,
          price: s.price,
        })),
        sauce: item.customization.sauce?.name || undefined,
        removedIngredients: item.customization.removedIngredients,
      }))

      const result = await createOrder({
        siteId: siteDbId,
        type: state.orderType || 'surPlace',
        items,
        paymentMethod,
        lang: state.lang,
      })

      set({
        orderNumber: result.order.orderNumber,
        screen: 'confirmation',
        isSubmitting: false,
      })
    } catch (error) {
      console.error('Failed to create order:', error)
      set({ isSubmitting: false })
    }
  },

  getCartTotal: () => get().cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  getCartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

  getTvaRate: () => {
    const state = get()
    return state.orderType === 'aEmporter' ? state.siteTvaEmporter : state.siteTvaSurPlace
  },

  getTvaAmount: () => {
    const total = get().getCartTotal()
    const rate = get().getTvaRate()
    return (total * rate) / (1 + rate)
  },

  resetKiosk: () => {
    set({
      screen: 'welcome',
      orderType: null,
      activeCategory: 'burgers',
      preSelectedProtein: null,
      selectedProduct: null,
      cart: [],
      orderNumber: null,
      showUpsell: null,
      lang: 'fr',
      isSubmitting: false,
    })
  },

  lastInteraction: Date.now(),
  touchInteraction: () => set({ lastInteraction: Date.now() }),
}))
