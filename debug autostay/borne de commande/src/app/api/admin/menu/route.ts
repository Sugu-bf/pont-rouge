import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/menu — returns ALL menu items (including inactive) with active field
export async function GET() {
  const [categories, products, supplements, sauces] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.product.findMany({
      include: { category: { select: { slug: true } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.supplement.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.sauce.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  const transformedProducts = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    priceWithFrites: p.priceWithFrites,
    image: p.image,
    hasProteinChoice: p.hasProteinChoice,
    veganAvailable: p.veganAvailable,
    isNew: p.isNew,
    isGourmet: p.isGourmet,
    hasSupplements: p.hasSupplements,
    hasSauceChoice: p.hasSauceChoice,
    includesFrites: p.includesFrites,
    active: p.active,
    sortOrder: p.sortOrder,
    category: p.category.slug,
  }))

  return NextResponse.json({
    categories,
    products: transformedProducts,
    supplements,
    sauces,
  })
}
