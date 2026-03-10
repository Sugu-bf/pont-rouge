import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/categories/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const allowedFields = ['name', 'slug', 'nameFr', 'nameEn', 'nameDe', 'icon', 'sortOrder', 'active']
  const data: any = {}
  for (const key of allowedFields) {
    if (body[key] !== undefined) data[key] = body[key]
  }
  const category = await prisma.category.update({ where: { id: params.id }, data })
  return NextResponse.json({ category })
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Delete all products in this category first
  await prisma.product.deleteMany({ where: { categoryId: params.id } })
  await prisma.category.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
