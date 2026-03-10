import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fryburger-default-secret'
)
const COOKIE_NAME = 'fryburger-admin-token'

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return false
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip login page and auth API
  if (pathname === '/admin/login' || pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Protect /admin pages
  if (pathname.startsWith('/admin')) {
    const authed = await isAuthenticated(request)
    if (!authed) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect /api/admin endpoints
  if (pathname.startsWith('/api/admin')) {
    const authed = await isAuthenticated(request)
    if (!authed) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
