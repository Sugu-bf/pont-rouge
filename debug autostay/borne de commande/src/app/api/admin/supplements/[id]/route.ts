import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/supplements/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const data: any = {}

  if (body.name !== undefined) data.name = body.name
  if (body.price !== undefined) data.price = body.price
  if (body.active !== undefined) data.active = body.active

  const supplement = await prisma.supplement.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json({ supplement })
}

// DELETE /api/admin/supplements/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.supplement.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
