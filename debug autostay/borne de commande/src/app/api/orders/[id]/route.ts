import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/orders/[id] — get a single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: { select: { name: true, slug: true } },
        },
      },
      site: { select: { name: true, slug: true, legalName: true, cheNumber: true, address: true, postalCode: true, city: true, phone: true } },
    },
  })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({ order })
}

// PATCH /api/orders/[id] — update order status (with audit trail)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const { status, terminalId, cancelReason } = body

  const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled']
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json(
      { error: `Status must be one of: ${validStatuses.join(', ')}` },
      { status: 400 }
    )
  }

  // Fetch current order to check immutability
  const existing = await prisma.order.findUnique({
    where: { id: params.id },
    select: { status: true, siteId: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Immutability: completed/cancelled orders cannot be modified
  if (existing.status === 'completed' || existing.status === 'cancelled') {
    return NextResponse.json(
      { error: `Cannot modify order with status '${existing.status}'. Orders are immutable once completed or cancelled.` },
      { status: 403 }
    )
  }

  // Use transaction for atomic update + audit log
  const order = await prisma.$transaction(async (tx) => {
    const updateData: any = { status }

    // Track cancellation details
    if (status === 'cancelled') {
      updateData.cancelledAt = new Date()
      updateData.cancelReason = cancelReason || 'Non spécifié'
    }

    const updated = await tx.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        items: {
          include: {
            product: { select: { name: true, slug: true } },
          },
        },
      },
    })

    // Audit log — status change
    await tx.auditLog.create({
      data: {
        action: status === 'cancelled' ? 'order.cancelled' : 'order.status_changed',
        entity: 'order',
        entityId: params.id,
        oldValue: JSON.stringify({ status: existing.status }),
        newValue: JSON.stringify({ status, cancelReason: cancelReason || null }),
        terminalId: terminalId || 'kitchen-display',
        orderId: params.id,
        siteId: existing.siteId,
      },
    })

    return updated
  })

  return NextResponse.json({ order })
}
