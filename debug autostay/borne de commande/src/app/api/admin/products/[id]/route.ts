import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/products/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const allowedFields = [
    'name', 'slug', 'description', 'price', 'priceWithFrites', 'active',
    'hasProteinChoice', 'veganAvailable', 'isNew', 'isGourmet',
    'hasSupplements', 'hasSauceChoice', 'includesFrites', 'sortOrder',
  ]
  const data: any = {}
  for (const key of allowedFields) {
    if (body[key] !== undefined) data[key] = body[key]
  }
  const product = await prisma.product.update({ where: { id: params.id }, data })
  return NextResponse.json({ product })
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
