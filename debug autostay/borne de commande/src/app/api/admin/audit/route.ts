import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/audit?siteId=xxx — get audit logs for a site
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get('siteId')

  if (!siteId) {
    return NextResponse.json({ error: 'siteId is required' }, { status: 400 })
  }

  const logs = await prisma.auditLog.findMany({
    where: { siteId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return NextResponse.json({ logs })
}
