'use client'

import { motion } from 'framer-motion'
import { CreditCard, ArrowLeft, Banknote, Smartphone } from 'lucide-react'
import { useKioskStore } from '@/store/kioskStore'
import { t } from '@/data/i18n'

export default function CheckoutScreen() {
  const { getCartTotal, getCartCount, getTvaAmount, getTvaRate, orderType, confirmOrder, setScreen, cart, lang, isSubmitting } = useKioskStore()

  const total = getCartTotal()
  const count = getCartCount()
  const tva = getTvaAmount()
  const tvaRate = getTvaRate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="kiosk-container flex flex-col bg-fry-cream"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-4 shrink-0">
        <button
          onClick={() => setScreen('menu')}
          className="touch-scale flex items-center gap-2 text-fry-textmuted hover:text-fry-text"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t('cart.back', lang)}</span>
        </button>
        <h1 className="font-display text-xl flex-1 text-center pr-16 text-fry-text">{t('checkout.title', lang)}</h1>
      </div>

      {/* Order summary */}
      <div className="p-5 shrink-0">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-display text-base text-fry-text mb-3">{t('checkout.summary', lang)}</h3>
          <div className="space-y-2 text-sm max-h-36 overflow-y-auto scrollbar-thin">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-fry-textmuted">
                <span>
                  {item.quantity}x {item.product.name}
                </span>
                <span>CHF {(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-fry-textmuted">
              <span>{t('checkout.tva', lang)} ({(tvaRate * 100).toFixed(1)}%)</span>
              <span>CHF {tva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-display text-2xl text-fry-text pt-2 border-t border-gray-100">
              <span>{t('cart.total', lang)}</span>
              <span className="text-fry-gold">CHF {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="flex-1 px-5 pb-6 flex flex-col gap-3">
        <h3 className="font-display text-base text-fry-text">{t('checkout.paymentMethod', lang)}</h3>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => confirmOrder('card')}
          disabled={isSubmitting}
          className="touch-scale bg-white border-2 border-gray-100 hover:border-fry-yellow rounded-2xl p-5 flex items-center gap-4 transition-all shadow-sm disabled:opacity-50"
        >
          <div className="w-14 h-14 rounded-xl bg-fry-yellow/20 flex items-center justify-center shrink-0">
            <CreditCard className="w-7 h-7 text-fry-gold" />
          </div>
          <div className="text-left">
            <h4 className="font-display text-lg text-fry-text">{t('checkout.card', lang)}</h4>
            <p className="text-fry-textmuted text-sm">{t('checkout.cardDesc', lang)}</p>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => confirmOrder('twint')}
          disabled={isSubmitting}
          className="touch-scale bg-white border-2 border-gray-100 hover:border-fry-yellow rounded-2xl p-5 flex items-center gap-4 transition-all shadow-sm disabled:opacity-50"
        >
          <div className="w-14 h-14 rounded-xl bg-fry-yellow/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-7 h-7 text-fry-gold" />
          </div>
          <div className="text-left">
            <h4 className="font-display text-lg text-fry-text">{t('checkout.twint', lang)}</h4>
            <p className="text-fry-textmuted text-sm">{t('checkout.twintDesc', lang)}</p>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => confirmOrder('counter')}
          disabled={isSubmitting}
          className="touch-scale bg-white border-2 border-gray-100 hover:border-fry-yellow rounded-2xl p-5 flex items-center gap-4 transition-all shadow-sm disabled:opacity-50"
        >
          <div className="w-14 h-14 rounded-xl bg-fry-green/20 flex items-center justify-center shrink-0">
            <Banknote className="w-7 h-7 text-fry-green" />
          </div>
          <div className="text-left">
            <h4 className="font-display text-lg text-fry-text">{t('checkout.counter', lang)}</h4>
            <p className="text-fry-textmuted text-sm">{t('checkout.counterDesc', lang)}</p>
          </div>
        </motion.button>

        {isSubmitting && (
          <div className="text-center text-fry-textmuted text-sm py-2">
            Envoi de la commande...
          </div>
        )}
      </div>
    </motion.div>
  )
}
