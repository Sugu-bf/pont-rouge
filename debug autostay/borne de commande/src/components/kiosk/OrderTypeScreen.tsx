'use client'

import { motion } from 'framer-motion'
import { useKioskStore } from '@/store/kioskStore'
import { t, LANGUAGES } from '@/data/i18n'

export default function OrderTypeScreen() {
  const { setOrderType, resetKiosk, lang, setLang } = useKioskStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="kiosk-container flex flex-col bg-fry-cream relative overflow-hidden"
    >
      {/* Language selector */}
      <div className="absolute top-6 right-6 z-20 flex gap-2">
        {LANGUAGES.map((l) => (
          <button
            key={l.id}
            onClick={() => setLang(l.id)}
            className={`touch-scale w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
              lang === l.id
                ? 'bg-white shadow-md ring-2 ring-fry-yellow'
                : 'bg-white/60'
            }`}
          >
            {l.flag}
          </button>
        ))}
      </div>

      {/* Top section */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-10"
        >
          <div className="w-28 h-28 rounded-full bg-fry-red flex items-center justify-center shadow-lg">
            <div className="text-center text-white">
              <div className="font-display text-2xl leading-none">FRY</div>
              <div className="font-display text-base leading-none -mt-0.5">BURGER</div>
            </div>
          </div>
        </motion.div>

        {/* Question */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display text-4xl text-center text-fry-text leading-tight whitespace-pre-line mb-4"
        >
          {t('orderType.title', lang)}
        </motion.h1>
      </div>

      {/* Bottom yellow wave with cards */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      >
        <svg viewBox="0 0 500 60" preserveAspectRatio="none" className="w-full h-12 block">
          <path d="M0,50 C150,0 350,0 500,50 L500,60 L0,60 Z" fill="#FFBC0D" />
        </svg>
        <div className="bg-fry-yellow px-6 pb-12 pt-2">
          <div className="flex gap-4 max-w-md mx-auto">
            {/* Eat In */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setOrderType('surPlace')}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="touch-scale flex-1 bg-white rounded-3xl p-6 flex flex-col items-center gap-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-6xl">🍽️</div>
              <span className="font-display text-xl text-fry-text">
                {t('orderType.eatIn', lang)}
              </span>
            </motion.button>

            {/* Take Out */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setOrderType('aEmporter')}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="touch-scale flex-1 bg-white rounded-3xl p-6 flex flex-col items-center gap-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-6xl">🛍️</div>
              <span className="font-display text-xl text-fry-text">
                {t('orderType.takeOut', lang)}
              </span>
            </motion.button>
          </div>

          {/* Back */}
          <button
            onClick={resetKiosk}
            className="block mx-auto mt-6 text-fry-text/60 text-sm underline underline-offset-4"
          >
            {t('cart.back', lang)}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
