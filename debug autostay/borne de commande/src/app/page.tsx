'use client'

import { useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useKioskStore } from '@/store/kioskStore'
import { fetchMenu, fetchSites } from '@/lib/api'
import WelcomeScreen from '@/components/kiosk/WelcomeScreen'
import OrderTypeScreen from '@/components/kiosk/OrderTypeScreen'
import MenuScreen from '@/components/kiosk/MenuScreen'
import CheckoutScreen from '@/components/kiosk/CheckoutScreen'
import ConfirmationScreen from '@/components/kiosk/ConfirmationScreen'

const INACTIVITY_TIMEOUT = 120_000

export default function KioskPage() {
  const { screen, resetKiosk, touchInteraction, lastInteraction, setMenuData, menuLoaded, setSiteId } = useKioskStore()

  // Load menu data from API on mount
  useEffect(() => {
    if (menuLoaded) return

    Promise.all([fetchMenu(), fetchSites()])
      .then(([menuData, sitesData]) => {
        setMenuData(menuData)

        // Auto-detect site from URL or default to first
        const urlParams = new URLSearchParams(window.location.search)
        const siteSlug = urlParams.get('site')
        const site = siteSlug
          ? sitesData.sites.find((s) => s.slug === siteSlug)
          : sitesData.sites[0]

        if (site) {
          setSiteId(site.slug, site.id, site.tvaSurPlace, site.tvaEmporter)
        }
      })
      .catch(console.error)
  }, [menuLoaded, setMenuData, setSiteId])

  const handleTouch = useCallback(() => {
    touchInteraction()
  }, [touchInteraction])

  useEffect(() => {
    if (screen === 'welcome' || screen === 'confirmation') return

    const interval = setInterval(() => {
      if (Date.now() - lastInteraction > INACTIVITY_TIMEOUT) {
        resetKiosk()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [screen, lastInteraction, resetKiosk])

  return (
    <div
      className="kiosk-container"
      onTouchStart={handleTouch}
      onClick={handleTouch}
    >
      <AnimatePresence mode="wait">
        {screen === 'welcome' && <WelcomeScreen key="welcome" />}
        {screen === 'orderType' && <OrderTypeScreen key="orderType" />}
        {screen === 'menu' && <MenuScreen key="menu" />}
        {screen === 'checkout' && <CheckoutScreen key="checkout" />}
        {screen === 'confirmation' && <ConfirmationScreen key="confirmation" />}
      </AnimatePresence>
    </div>
  )
}
