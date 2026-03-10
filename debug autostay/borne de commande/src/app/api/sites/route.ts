import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/sites — returns all active sites (with TVA rates for kiosk)
export async function GET() {
  const sites = await prisma.site.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      legalName: true,
      cheNumber: true,
      address: true,
      postalCode: true,
      city: true,
      phone: true,
      email: true,
      tvaSurPlace: true,
      tvaEmporter: true,
    },
  })

  return NextResponse.json({ sites })
}
