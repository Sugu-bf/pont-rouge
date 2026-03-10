import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/admin/supplements
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, slug, price } = body

  if (!name || !slug) {
    return NextResponse.json({ error: 'name et slug sont requis' }, { status: 400 })
  }

  const supplement = await prisma.supplement.create({
    data: { name, slug, price: price || 0 },
  })

  return NextResponse.json({ supplement }, { status: 201 })
}
