import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fryburger-default-secret'
)
const COOKIE_NAME = 'fryburger-admin-token'
const TOKEN_EXPIRY = '24h'

export interface AdminSession {
  id: string
  email: string
  name: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(user: AdminSession): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as AdminSession
  } catch {
    return null
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function login(email: string, password: string): Promise<{ token: string; user: AdminSession } | null> {
  const user = await prisma.adminUser.findUnique({ where: { email } })
  if (!user || !user.active) return null

  const valid = await verifyPassword(password, user.password)
  if (!valid) return null

  const session: AdminSession = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }

  const token = await createToken(session)
  return { token, user: session }
}

export { COOKIE_NAME }
