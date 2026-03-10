'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useKioskStore } from '@/store/kioskStore'
import { t } from '@/data/i18n'

export default function ConfirmationScreen() {
  const { orderNumber, orderType, resetKiosk, lang } = useKioskStore()

  useEffect(() => {
    const timer = setTimeout(resetKiosk, 15000)
    return () => clearTimeout(timer)
  }, [resetKiosk])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="kiosk-container flex flex-col items-center justify-center bg-fry-cream relative overflow-hidden"
      onClick={resetKiosk}
    >
      {/* Success circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        className="w-28 h-28 rounded-full bg-fry-green flex items-center justify-center mb-8 shadow-xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Check className="w-14 h-14 text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>

      {/* Thank you */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-10"
      >
        <h1 className="font-display text-5xl text-fry-text mb-2">{t('confirm.thanks', lang)}</h1>
        <p className="text-fry-textmuted text-lg">{t('confirm.orderPlaced', lang)}</p>
      </motion.div>

      {/* Order number */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
        className="bg-white rounded-4xl p-10 text-center mb-10 shadow-lg border border-gray-100"
      >
        <p className="text-fry-textmuted text-lg mb-2">{t('confirm.orderNumber', lang)}</p>
        <div className="count-up">
          <span className="font-display text-8xl text-fry-gold">{orderNumber}</span>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center space-y-3 px-8"
      >
        <div className="bg-white rounded-2xl px-8 py-4 shadow-sm border border-gray-100">
          <p className="text-fry-text text-lg">
            {orderType === 'surPlace'
              ? `📍 ${t('confirm.eatInMsg', lang)}`
              : `🛍️ ${t('confirm.takeOutMsg', lang)}`}
          </p>
        </div>
        <p className="text-fry-textmuted text-sm">
          🖨️ {t('confirm.printing', lang)}
        </p>
      </motion.div>

      {/* Auto-dismiss */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <p className="text-fry-textmuted text-sm">{t('confirm.newOrder', lang)}</p>
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 15, ease: 'linear' }}
          className="mt-3 mx-auto w-48 h-1 bg-fry-yellow rounded-full origin-left"
        />
      </motion.div>
    </motion.div>
  )
}
