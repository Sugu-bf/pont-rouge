import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/menu — returns full menu: categories, products, supplements, sauces
export async function GET() {
  const [categories, products, supplements, sauces] = await Promise.all([
    prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { active: true },
      include: { category: { select: { slug: true } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.supplement.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.sauce.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  // Transform products to include category slug at top level
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
    category: p.category.slug,
  }))

  return NextResponse.json({
    categories,
    products: transformedProducts,
    supplements,
    sauces,
  })
}
