import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/sauces/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const data: any = {}

  if (body.name !== undefined) data.name = body.name
  if (body.price !== undefined) data.price = body.price
  if (body.active !== undefined) data.active = body.active

  const sauce = await prisma.sauce.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json({ sauce })
}

// DELETE /api/admin/sauces/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.sauce.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
