'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Plus, Minus, Check, Info } from 'lucide-react'
import { useKioskStore } from '@/store/kioskStore'
import { SUPPLEMENTS as STATIC_SUPPLEMENTS, SAUCES as STATIC_SAUCES } from '@/data/menu'
import { ProteinChoice, Supplement, SauceOption, CartItemCustomization, CategoryId } from '@/data/types'
import { t } from '@/data/i18n'

const PROTEINS: { id: ProteinChoice; label: string; icon: string }[] = [
  { id: 'boeuf', label: 'Boeuf', icon: '🥩' },
  { id: 'poulet', label: 'Poulet', icon: '🍗' },
  { id: 'vegetarien', label: 'Végétarien', icon: '🥬' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
]

const CATEGORY_EMOJI: Record<CategoryId, string> = {
  'burgers': '🍔', 'burgers-speciaux': '🍔', 'bowls-tasty': '🍟',
  'bowls-healthy': '🥗', 'extras': '🍗', 'enfant': '🎁',
  'desserts': '🍦', 'boissons': '🥤',
}

export default function ProductModal() {
  const { selectedProduct: product, setSelectedProduct, addToCart, lang, apiSupplements, apiSauces, menuLoaded, preSelectedProtein } = useKioskStore()

  // Use API data if loaded, else fallback
  const SUPPLEMENTS = menuLoaded && apiSupplements.length > 0
    ? apiSupplements.map((s) => ({ id: s.slug, name: s.name, price: s.price }))
    : STATIC_SUPPLEMENTS
  const SAUCES = menuLoaded && apiSauces.length > 0
    ? apiSauces.map((s) => ({ id: s.slug, name: s.name, price: s.price }))
    : STATIC_SAUCES

  const [protein, setProtein] = useState<ProteinChoice>(preSelectedProtein || 'boeuf')
  const [withFrites, setWithFrites] = useState(false)
  const [selectedSupplements, setSelectedSupplements] = useState<Supplement[]>([])
  const [selectedSauce, setSelectedSauce] = useState<SauceOption | undefined>(undefined)
  const [quantity, setQuantity] = useState(1)

  const calculatedPrice = useMemo(() => {
    if (!product) return 0
    let price = withFrites && product.priceWithFrites ? product.priceWithFrites : product.price
    for (const s of selectedSupplements) price += s.price
    if (selectedSauce) price += selectedSauce.price
    return price
  }, [product, withFrites, selectedSupplements, selectedSauce])

  if (!product) return null

  const toggleSupplement = (supp: Supplement) => {
    setSelectedSupplements((prev) =>
      prev.find((s) => s.id === supp.id)
        ? prev.filter((s) => s.id !== supp.id)
        : [...prev, supp]
    )
  }

  const handleAddToCart = () => {
    const customization: CartItemCustomization = {
      protein: product.hasProteinChoice ? protein : undefined,
      withFrites: withFrites && !!product.priceWithFrites,
      supplements: selectedSupplements,
      sauce: selectedSauce,
      removedIngredients: [],
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product, customization)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-end"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full h-full bg-fry-black flex flex-col"
      >
        {/* Header - Dark */}
        <div className="flex items-center justify-between px-4 py-4 shrink-0">
          <button
            onClick={() => setSelectedProduct(null)}
            className="touch-scale w-10 h-10 rounded-full bg-fry-darkcard flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button className="w-10 h-10 rounded-full bg-fry-darkcard flex items-center justify-center">
            <Info className="w-5 h-5 text-white/50" />
          </button>
        </div>

        {/* Product hero */}
        <div className="text-center px-6 pb-6 shrink-0">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-fry-darkcard flex items-center justify-center">
            <span className="text-7xl">{CATEGORY_EMOJI[product.category]}</span>
          </div>
          <h2 className="font-display text-3xl text-white mb-1">{product.name}</h2>
          <p className="text-fry-textlight text-sm mb-3">{product.description}</p>
          <p className="font-display text-3xl text-fry-yellow">
            CHF {calculatedPrice.toFixed(2)}
          </p>
        </div>

        {/* Scrollable options */}
        <div className="flex-1 overflow-y-auto scrollbar-dark px-6 space-y-6 pb-32">

          {/* Protein choice */}
          {product.hasProteinChoice && (
            <div>
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                {t('product.protein', lang)}
                <span className="text-[10px] text-fry-yellow bg-fry-yellow/10 px-2 py-0.5 rounded-full">
                  {t('product.required', lang)}
                </span>
              </h3>
              <div className="space-y-2">
                {PROTEINS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProtein(p.id)}
                    className="touch-scale w-full flex items-center gap-4 p-3 rounded-xl transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-fry-darkcard flex items-center justify-center text-2xl">
                      {p.icon}
                    </div>
                    <span className="flex-1 text-left text-white font-medium text-sm">
                      {t(`product.${p.id === 'boeuf' ? 'beef' : p.id === 'poulet' ? 'chicken' : p.id === 'vegan' ? 'vegan' : 'veggie'}` as any, lang)}
                    </span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      protein === p.id
                        ? 'bg-fry-yellow'
                        : 'bg-fry-darkcard border border-fry-darkborder'
                    }`}>
                      {protein === p.id && <Check className="w-4 h-4 text-fry-text" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* With fries */}
          {product.priceWithFrites && (
            <div>
              <h3 className="text-white font-bold text-sm mb-3">
                {t('product.withFrites', lang)} ?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setWithFrites(false)}
                  className={`touch-scale p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    !withFrites
                      ? 'bg-fry-yellow/10 ring-2 ring-fry-yellow'
                      : 'bg-fry-darkcard'
                  }`}
                >
                  <span className="text-3xl">🍔</span>
                  <span className="text-white text-xs">{t('product.withoutFrites', lang)}</span>
                  <span className="font-display text-fry-yellow text-sm">{product.price.toFixed(2)}</span>
                </button>
                <button
                  onClick={() => setWithFrites(true)}
                  className={`touch-scale p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    withFrites
                      ? 'bg-fry-yellow/10 ring-2 ring-fry-yellow'
                      : 'bg-fry-darkcard'
                  }`}
                >
                  <span className="text-3xl">🍟</span>
                  <span className="text-white text-xs">{t('product.withFrites', lang)}</span>
                  <span className="font-display text-fry-yellow text-sm">{product.priceWithFrites.toFixed(2)}</span>
                </button>
              </div>
            </div>
          )}

          {/* Supplements */}
          {product.hasSupplements && (
            <div>
              <h3 className="text-white font-bold text-sm mb-3">{t('product.supplements', lang)}</h3>
              <div className="space-y-2">
                {SUPPLEMENTS.map((supp) => {
                  const isSelected = selectedSupplements.some((s) => s.id === supp.id)
                  return (
                    <button
                      key={supp.id}
                      onClick={() => toggleSupplement(supp)}
                      className="touch-scale w-full flex items-center gap-4 p-3 rounded-xl transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-fry-darkcard flex items-center justify-center text-lg">
                        🧀
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-white text-sm">{supp.name}</span>
                      </div>
                      <span className="text-fry-textlight text-sm mr-2">+{supp.price.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-fry-darkcard' : 'bg-fry-darkcard opacity-30'
                          }`}
                        >
                          <Minus className="w-4 h-4 text-fry-textlight" />
                        </button>
                        <span className="text-white text-sm w-4 text-center">{isSelected ? 1 : 0}</span>
                        <button
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-fry-yellow' : 'bg-fry-yellow'
                          }`}
                        >
                          <Plus className="w-4 h-4 text-fry-text" />
                        </button>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Sauce choice */}
          {product.hasSauceChoice && (
            <div>
              <h3 className="text-white font-bold text-sm mb-3">{t('product.chooseSauce', lang)}</h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                <button
                  onClick={() => setSelectedSauce(undefined)}
                  className={`touch-scale shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl w-24 transition-all ${
                    !selectedSauce ? 'bg-fry-yellow/10 ring-2 ring-fry-yellow' : 'bg-fry-darkcard'
                  }`}
                >
                  <span className="text-2xl">❌</span>
                  <span className="text-white text-[10px] text-center">{t('product.noSauce', lang)}</span>
                </button>
                {SAUCES.map((sauce) => (
                  <button
                    key={sauce.id}
                    onClick={() => setSelectedSauce(sauce)}
                    className={`touch-scale shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl w-24 transition-all ${
                      selectedSauce?.id === sauce.id
                        ? 'bg-fry-yellow/10 ring-2 ring-fry-yellow'
                        : 'bg-fry-darkcard'
                    }`}
                  >
                    <span className="text-2xl">🥣</span>
                    <span className="text-white text-[10px] text-center leading-tight">{sauce.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom - Quantity + Apply button */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-fry-black via-fry-black to-transparent pt-8 pb-6 px-6">
          {/* Quantity */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="touch-scale w-10 h-10 rounded-full border border-fry-darkborder flex items-center justify-center"
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
            <span className="font-display text-2xl text-white w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(20, quantity + 1))}
              className="touch-scale w-10 h-10 rounded-full bg-fry-yellow flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-fry-text" />
            </button>
          </div>

          {/* Apply button - Yellow rounded like McDo */}
          <button
            onClick={handleAddToCart}
            className="touch-scale mx-auto block bg-fry-yellow hover:bg-fry-gold text-fry-text font-display text-xl px-12 py-4 rounded-2xl shadow-lg"
          >
            {t('product.apply', lang)} · CHF {(calculatedPrice * quantity).toFixed(2)}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
