'use client'

import { motion } from 'framer-motion'
import { useKioskStore } from '@/store/kioskStore'
import { t, LANGUAGES } from '@/data/i18n'

export default function WelcomeScreen() {
  const { setScreen, lang, setLang } = useKioskStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="kiosk-container flex flex-col bg-fry-cream relative overflow-hidden"
      onClick={() => setScreen('orderType')}
    >
      {/* Language selector - top right */}
      <div className="absolute top-6 right-6 z-20 flex gap-2" onClick={(e) => e.stopPropagation()}>
        {LANGUAGES.map((l) => (
          <button
            key={l.id}
            onClick={() => setLang(l.id)}
            className={`touch-scale w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
              lang === l.id
                ? 'bg-white shadow-lg scale-110 ring-2 ring-fry-yellow'
                : 'bg-white/60 hover:bg-white/80'
            }`}
          >
            {l.flag}
          </button>
        ))}
      </div>

      {/* Top section - cream with logo */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 pb-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-40 h-40 rounded-full bg-fry-red flex items-center justify-center shadow-2xl">
            <div className="text-center text-white">
              <div className="font-display text-4xl tracking-tight leading-none">FRY</div>
              <div className="font-display text-2xl tracking-tight leading-none -mt-1">BURGER</div>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-fry-textmuted text-lg mb-2">{t('welcome.title', lang)}</p>
          <h1 className="font-display text-5xl text-fry-text">FRYBURGER</h1>
        </motion.div>

        {/* Swiss badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center gap-2 bg-white/70 px-5 py-2 rounded-full"
        >
          <span className="text-xl">🇨🇭</span>
          <span className="text-fry-textmuted font-medium">{t('welcome.homemade', lang)}</span>
        </motion.div>
      </div>

      {/* Bottom yellow wave section */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        className="relative z-10"
      >
        {/* Wave shape */}
        <svg viewBox="0 0 500 80" preserveAspectRatio="none" className="w-full h-16 block">
          <path d="M0,60 C150,0 350,0 500,60 L500,80 L0,80 Z" fill="#FFBC0D" />
        </svg>
        <div className="bg-fry-yellow px-8 pb-16 pt-4 text-center">
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="font-display text-fry-text text-2xl">
              {t('welcome.touch', lang)}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
