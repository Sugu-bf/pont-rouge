import type { Metadata, Viewport } from 'next'
import { Inter, Archivo_Black } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'FryBurger - Borne de Commande',
  description: 'Commandez vos burgers, bowls et extras sur notre borne interactive',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${archivoBlack.variable}`}>
      <body className="bg-fry-cream text-fry-text font-body antialiased">
        {children}
      </body>
    </html>
  )
}
