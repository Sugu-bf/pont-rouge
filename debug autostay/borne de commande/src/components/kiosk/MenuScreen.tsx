'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, ArrowLeft, Sparkles, Leaf, Beef } from 'lucide-react'
import { useKioskStore } from '@/store/kioskStore'
import { CATEGORIES, PRODUCTS } from '@/data/menu'
import { Product, CategoryId, ProteinChoice } from '@/data/types'
import { useMemo } from 'react'
import { t } from '@/data/i18n'
import ProductModal from './ProductModal'
import CartPanel from './CartPanel'
import UpsellModal from './UpsellModal'

const CATEGORY_ICONS: Record<CategoryId, string> = {
  'burgers': '🍔',
  'burgers-speciaux': '⭐',
  'bowls-tasty': '🍟',
  'bowls-healthy': '🥗',
  'extras': '🍗',
  'enfant': '👶',
  'desserts': '🍦',
  'boissons': '🥤',
}

function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onSelect(product)}
      className="touch-scale bg-white rounded-2xl p-3 text-left flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all border border-gray-100 relative"
    >
      {/* Badges */}
      {(product.isNew || product.isGourmet || product.veganAvailable) && (
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="bg-fry-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> NEW
            </span>
          )}
          {product.isGourmet && (
            <span className="bg-fry-yellow text-fry-text text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              GOURMET
            </span>
          )}
          {product.veganAvailable && (
            <span className="bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Leaf className="w-2.5 h-2.5" /> VEGAN
            </span>
          )}
        </div>
      )}

      {/* Product image placeholder */}
      <div className="w-full aspect-square rounded-xl bg-fry-cream flex items-center justify-center">
        <span className="text-5xl">
          {CATEGORY_ICONS[product.category] || '🍔'}
        </span>
      </div>

      {/* Name */}
      <h3 className="font-bold text-sm text-fry-text text-center leading-tight w-full">
        {product.name}
      </h3>

      {/* Price */}
      <p className="font-display text-fry-gold text-base">
        CHF {product.price.toFixed(2)}
      </p>
    </motion.button>
  )
}

export default function MenuScreen() {
  const {
    activeCategory, setActiveCategory, setSelectedProduct, selectedProduct,
    getCartTotal, getCartCount, setScreen, showUpsell, lang,
    apiProducts, apiCategories, menuLoaded,
    preSelectedProtein, setPreSelectedProtein,
  } = useKioskStore()
  const [showCart, setShowCart] = useState(false)

  // Use API products if loaded, else fallback to static
  const products = useMemo(() => {
    if (menuLoaded && apiProducts.length > 0) {
      return apiProducts.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        priceWithFrites: p.priceWithFrites ?? undefined,
        image: p.image ?? undefined,
        category: p.category as CategoryId,
        hasProteinChoice: p.hasProteinChoice,
        veganAvailable: p.veganAvailable,
        isNew: p.isNew,
        isGourmet: p.isGourmet,
        hasSupplements: p.hasSupplements,
        hasSauceChoice: p.hasSauceChoice,
        includesFrites: p.includesFrites,
      })) as Product[]
    }
    return PRODUCTS
  }, [menuLoaded, apiProducts])

  const categories = useMemo(() => {
    if (menuLoaded && apiCategories.length > 0) {
      return apiCategories.map((c) => ({
        id: c.slug as CategoryId,
        name: c.name,
        icon: c.icon,
        description: c.description ?? undefined,
      }))
    }
    return CATEGORIES
  }, [menuLoaded, apiCategories])

  // Check if current category has products with protein choice
  const categoryHasProtein = products.some(
    (p) => p.category === activeCategory && p.hasProteinChoice
  )

  const PROTEIN_FILTERS: { id: ProteinChoice | null; label: string; icon: string }[] = [
    { id: null, label: 'Tous', icon: '🍔' },
    { id: 'boeuf', label: 'Boeuf', icon: '🥩' },
    { id: 'poulet', label: 'Poulet', icon: '🍗' },
    { id: 'vegetarien', label: 'Végétarien', icon: '🥬' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
  ]

  const filteredProducts = products.filter((p) => {
    if (p.category !== activeCategory) return false
    if (!preSelectedProtein) return true
    // If product doesn't have protein choice, always show it
    if (!p.hasProteinChoice) return true
    // Vegan filter: only show products that have veganAvailable
    if (preSelectedProtein === 'vegan') return p.veganAvailable
    // Boeuf/Poulet/Végétarien: all hasProteinChoice products support these
    return true
  })
  const cartCount = getCartCount()
  const cartTotal = getCartTotal()

  return (
    <div className="kiosk-container flex bg-white relative">
      {/* Left Sidebar - Category Navigation */}
      <div className="w-20 bg-fry-cream border-r border-gray-200 flex flex-col py-2 shrink-0 overflow-y-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`touch-scale flex flex-col items-center gap-1 py-3 px-1 mx-1 rounded-xl transition-all ${
              activeCategory === cat.id
                ? 'bg-fry-yellow shadow-sm'
                : 'hover:bg-white'
            }`}
          >
            <span className="text-2xl">{CATEGORY_ICONS[cat.id]}</span>
            <span className={`text-[10px] font-medium leading-tight text-center ${
              activeCategory === cat.id ? 'text-fry-text' : 'text-fry-textmuted'
            }`}>
              {t(`cat.${cat.id}` as any, lang)}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 shrink-0 bg-white">
          <button
            onClick={() => setScreen('orderType')}
            className="touch-scale flex items-center gap-1.5 text-fry-textmuted hover:text-fry-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t('cart.back', lang)}</span>
          </button>

          <h2 className="font-display text-xl text-fry-text">
            {t(`cat.${activeCategory}` as any, lang)}
          </h2>

          <div className="w-16" />
        </div>

        {/* Protein Subcategory Bar */}
        {categoryHasProtein && (
          <div className="px-4 py-2 border-b border-gray-100 shrink-0 bg-white">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {PROTEIN_FILTERS.map((pf) => (
                <button
                  key={pf.id ?? 'all'}
                  onClick={() => setPreSelectedProtein(pf.id)}
                  className={`touch-scale flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    preSelectedProtein === pf.id
                      ? 'bg-fry-yellow text-fry-text shadow-sm'
                      : 'bg-gray-100 text-fry-textmuted hover:bg-gray-200'
                  }`}
                >
                  <span className="text-base">{pf.icon}</span>
                  {pf.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 pb-28">
          <div className="grid grid-cols-3 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        </div>

        {/* Bottom Cart Bar */}
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.div
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 80 }}
              className="absolute bottom-0 left-20 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent pt-10"
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCart(true)}
                className="touch-scale w-full bg-fry-yellow hover:bg-fry-gold text-fry-text py-4 rounded-2xl flex items-center justify-between px-6 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    <span className="badge-pop absolute -top-2 -right-2 w-5 h-5 bg-fry-red text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  </div>
                  <span className="font-display text-lg">{t('cart.checkout', lang)}</span>
                </div>
                <span className="font-display text-xl">CHF {cartTotal.toFixed(2)}</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedProduct && <ProductModal />}
      </AnimatePresence>
      <AnimatePresence>
        {showUpsell && <UpsellModal />}
      </AnimatePresence>
      <AnimatePresence>
        {showCart && <CartPanel onClose={() => setShowCart(false)} />}
      </AnimatePresence>
    </div>
  )
}
