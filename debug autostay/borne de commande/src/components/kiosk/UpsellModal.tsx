'use client'

import { motion } from 'framer-motion'
import { useKioskStore } from '@/store/kioskStore'
import { PRODUCTS } from '@/data/menu'
import { t } from '@/data/i18n'
import { CartItemCustomization } from '@/data/types'

export default function UpsellModal() {
  const { showUpsell, setShowUpsell, addToCart, lang } = useKioskStore()

  if (!showUpsell) return null

  const isFrites = showUpsell === 'frites'

  const upsellProducts = isFrites
    ? PRODUCTS.filter((p) => p.id === 'portion-frites')
    : PRODUCTS.filter((p) => p.category === 'boissons').slice(0, 4)

  const handleAdd = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId)
    if (!product) return

    const customization: CartItemCustomization = {
      supplements: [],
      removedIngredients: [],
    }

    // Add directly without triggering another upsell
    const unitPrice = product.price
    const store = useKioskStore.getState()
    const newItem = {
      id: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      product,
      quantity: 1,
      customization,
      unitPrice,
      totalPrice: unitPrice,
    }

    useKioskStore.setState((state) => ({
      cart: [...state.cart, newItem],
      showUpsell: isFrites ? 'boisson' : null,
    }))
  }

  const handleSkip = () => {
    if (isFrites) {
      setShowUpsell('boisson')
    } else {
      setShowUpsell(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-4xl p-8 w-full max-w-sm shadow-2xl"
      >
        {/* Emoji */}
        <div className="text-center mb-4">
          <span className="text-7xl">{isFrites ? '🍟' : '🥤'}</span>
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl text-fry-text text-center mb-2">
          {isFrites
            ? t('upsell.frites.title', lang)
            : t('upsell.boisson.title', lang)}
        </h2>
        <p className="text-fry-textmuted text-center text-sm mb-6">
          {isFrites
            ? t('upsell.frites.subtitle', lang)
            : t('upsell.boisson.subtitle', lang)}
        </p>

        {/* Products */}
        <div className={`${isFrites ? '' : 'grid grid-cols-2'} gap-3 mb-6`}>
          {upsellProducts.map((product) => (
            <motion.button
              key={product.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAdd(product.id)}
              className="touch-scale w-full bg-fry-cream rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-transparent hover:border-fry-yellow transition-all"
            >
              <span className="text-4xl">{isFrites ? '🍟' : '🥤'}</span>
              <span className="font-medium text-sm text-fry-text">{product.name}</span>
              <span className="font-display text-fry-gold text-sm">CHF {product.price.toFixed(2)}</span>
            </motion.button>
          ))}
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="w-full text-center text-fry-textmuted text-sm py-3 underline underline-offset-4"
        >
          {t('upsell.no', lang)}
        </button>
      </motion.div>
    </motion.div>
  )
}
