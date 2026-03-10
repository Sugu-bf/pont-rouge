'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Commandes', icon: '📋' },
  { href: '/admin/menu', label: 'Menu', icon: '🍔' },
  { href: '/admin/sites', label: 'Sites', icon: '📍' },
  { href: '/admin/audit', label: 'Audit Log', icon: '🔒' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Login page: no sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ userSelect: 'auto' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-fry-black text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-fry-darkborder">
          <Link href="/admin" className="block">
            <div className="text-xl font-bold text-fry-yellow">FRYBURGER</div>
            <div className="text-xs text-fry-textlight mt-1">Backoffice</div>
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-fry-darkcard text-fry-yellow border-r-2 border-fry-yellow'
                    : 'text-gray-400 hover:text-white hover:bg-fry-darker'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-fry-darkborder space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors w-full"
          >
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Retour borne</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
