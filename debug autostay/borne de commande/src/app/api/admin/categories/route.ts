import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/admin/categories — create a new category
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, slug, nameFr, nameEn, nameDe, icon, sortOrder } = body

  if (!name || !slug) {
    return NextResponse.json({ error: 'name et slug sont requis' }, { status: 400 })
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      nameFr: nameFr || name,
      nameEn: nameEn || name,
      nameDe: nameDe || name,
      icon: icon || '',
      sortOrder: sortOrder || 0,
    },
  })

  return NextResponse.json({ category }, { status: 201 })
}
