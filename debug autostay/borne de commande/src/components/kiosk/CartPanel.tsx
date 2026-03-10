'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react'
import { useKioskStore } from '@/store/kioskStore'
import { t, LANGUAGES } from '@/data/i18n'
import { CategoryId } from '@/data/types'

const CATEGORY_EMOJI: Record<CategoryId, string> = {
  'burgers': '🍔', 'burgers-speciaux': '🍔', 'bowls-tasty': '🍟',
  'bowls-healthy': '🥗', 'extras': '🍗', 'enfant': '🎁',
  'desserts': '🍦', 'boissons': '🥤',
}

export default function CartPanel({ onClose }: { onClose: () => void }) {
  const {
    cart, updateQuantity, removeFromCart, getCartTotal, getCartCount,
    orderType, setScreen, lang, setLang,
  } = useKioskStore()

  const total = getCartTotal()
  const count = getCartCount()

  const handleCheckout = () => {
    onClose()
    setScreen('checkout')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full h-full bg-fry-green flex flex-col"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="touch-scale flex items-center gap-2 text-white/70 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t('cart.back', lang)}</span>
            </button>
            <div className="flex gap-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    lang === l.id ? 'bg-white/20 ring-1 ring-white/40' : 'bg-white/10'
                  }`}
                >
                  {l.flag}
                </button>
              ))}
            </div>
          </div>

          {/* Logo */}
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-fry-red flex items-center justify-center mx-auto mb-4">
              <div className="text-center text-white">
                <div className="font-display text-lg leading-none">FRY</div>
                <div className="font-display text-xs leading-none -mt-0.5">BURGER</div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl text-white whitespace-pre-line leading-tight">
            {t('cart.title', lang)}
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {orderType === 'surPlace' ? t('cart.eatIn', lang) : t('cart.takeOut', lang)}
          </p>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 space-y-4 pb-6">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <p className="text-lg">{t('cart.empty', lang)}</p>
            </div>
          ) : (
            cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                {/* Product image */}
                <div className="w-14 h-14 rounded-xl bg-fry-lightgreen flex items-center justify-center shrink-0">
                  <span className="text-2xl">{CATEGORY_EMOJI[item.product.category]}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm">{item.product.name}</h4>
                  <p className="text-white/40 text-xs">CHF {item.unitPrice.toFixed(2)}</p>
                  {item.customization.protein && (
                    <p className="text-white/30 text-[10px]">
                      {item.customization.protein === 'boeuf' ? '🥩' : item.customization.protein === 'poulet' ? '🍗' : '🥬'}
                      {' '}{item.customization.protein}
                      {item.customization.withFrites ? ' + 🍟' : ''}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="touch-scale w-8 h-8 rounded-lg bg-fry-lightgreen flex items-center justify-center"
                  >
                    <Minus className="w-3.5 h-3.5 text-white/70" />
                  </button>
                  <span className="text-white font-medium text-sm w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="touch-scale w-8 h-8 rounded-lg bg-fry-lightgreen flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5 text-white/70" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Bottom - Total + Checkout */}
        {cart.length > 0 && (
          <div className="px-6 pb-8 pt-4 shrink-0">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-white/50 text-sm">{t('cart.total', lang)}</p>
                <p className="font-display text-3xl text-white">CHF {total.toFixed(2)}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className="touch-scale bg-fry-yellow hover:bg-fry-gold text-fry-text font-display text-lg px-8 py-4 rounded-2xl shadow-lg"
              >
                {t('cart.checkout', lang)}
              </motion.button>
            </div>
            <button
              onClick={onClose}
              className="w-full text-center text-white/40 text-sm underline underline-offset-4"
            >
              {t('cart.addMore', lang)}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
