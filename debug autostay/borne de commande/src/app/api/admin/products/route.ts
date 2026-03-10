import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/admin/products — create a new product
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, slug, description, price, priceWithFrites, category, ...flags } = body

  if (!name || !slug || !category) {
    return NextResponse.json({ error: 'name, slug et category sont requis' }, { status: 400 })
  }

  // Find category by slug
  const cat = await prisma.category.findUnique({ where: { slug: category } })
  if (!cat) {
    return NextResponse.json({ error: `Categorie "${category}" introuvable` }, { status: 404 })
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description || '',
      price: price || 0,
      priceWithFrites: priceWithFrites || null,
      categoryId: cat.id,
      hasProteinChoice: flags.hasProteinChoice || false,
      veganAvailable: flags.veganAvailable || false,
      isNew: flags.isNew || false,
      isGourmet: flags.isGourmet || false,
      hasSupplements: flags.hasSupplements || false,
      hasSauceChoice: flags.hasSauceChoice || false,
      includesFrites: flags.includesFrites || false,
      sortOrder: flags.sortOrder || 0,
    },
  })

  return NextResponse.json({ product }, { status: 201 })
}
