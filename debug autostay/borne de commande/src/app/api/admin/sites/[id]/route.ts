import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/sites/[id] — update site info (legal, TVA, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()

  const allowedFields = [
    'name', 'slug', 'legalName', 'cheNumber', 'address', 'postalCode',
    'city', 'phone', 'email', 'tvaSurPlace', 'tvaEmporter', 'active',
  ]

  const data: any = {}
  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      data[key] = body[key]
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const site = await prisma.site.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json({ site })
}
