import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateReceiptNumber, generateFiscalHash } from '@/lib/fiscal'

// GET /api/orders?siteId=xxx&status=pending — list orders for a site
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get('siteId')
  const status = searchParams.get('status')

  if (!siteId) {
    return NextResponse.json({ error: 'siteId is required' }, { status: 400 })
  }

  const where: any = { siteId }
  if (status) {
    where.status = status
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: { select: { name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json({ orders })
}

// POST /api/orders — create a new order
export async function POST(request: NextRequest) {
  const body = await request.json()

  const { siteId, type, items, paymentMethod, lang, terminalId } = body

  if (!siteId || !type || !items || items.length === 0) {
    return NextResponse.json(
      { error: 'siteId, type, and items are required' },
      { status: 400 }
    )
  }

  // Verify site exists and get TVA rates
  const site = await prisma.site.findUnique({ where: { id: siteId } })
  if (!site) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 })
  }

  // TVA from site config (backoffice)
  const tvaRate = type === 'aEmporter' ? site.tvaEmporter : site.tvaSurPlace

  // Calculate totals
  let subtotal = 0
  const orderItems = items.map((item: any) => {
    const totalPrice = item.unitPrice * item.quantity
    subtotal += totalPrice
    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice,
      protein: item.protein || null,
      withFrites: item.withFrites || false,
      supplements: JSON.stringify(item.supplements || []),
      sauce: item.sauce || null,
      removedIngredients: JSON.stringify(item.removedIngredients || []),
    }
  })

  // Prix affichés TTC → TVA extraite du total
  const tvaAmount = (subtotal * tvaRate) / (1 + tvaRate)
  const total = subtotal // Les prix sont déjà TTC

  // Generate order number with race-condition protection via transaction
  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)

  const order = await prisma.$transaction(async (tx) => {
    // Lock: find last order for this site today
    const lastOrder = await tx.order.findFirst({
      where: {
        siteId,
        createdAt: { gte: todayStart },
      },
      orderBy: { orderNumber: 'desc' },
    })

    const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1
    const receiptNumber = generateReceiptNumber(site.slug, now, orderNumber)

    // Get previous order's fiscal hash for chain-linking
    const previousOrder = await tx.order.findFirst({
      where: { siteId },
      orderBy: { createdAt: 'desc' },
      select: { fiscalHash: true },
    })

    const fiscalHash = generateFiscalHash({
      receiptNumber,
      total,
      tvaAmount,
      tvaRate,
      type,
      createdAt: now.toISOString(),
      previousHash: previousOrder?.fiscalHash || '0',
    })

    // Create order
    const created = await tx.order.create({
      data: {
        orderNumber,
        receiptNumber,
        type,
        status: 'pending',
        subtotal,
        tvaRate,
        tvaAmount,
        total,
        paymentMethod: paymentMethod || null,
        paidAt: paymentMethod ? now : null,
        terminalId: terminalId || 'kiosk-01',
        fiscalHash,
        lang: lang || 'fr',
        siteId,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: { select: { name: true, slug: true } },
          },
        },
      },
    })

    // Audit log — order created
    await tx.auditLog.create({
      data: {
        action: 'order.created',
        entity: 'order',
        entityId: created.id,
        newValue: JSON.stringify({
          orderNumber,
          receiptNumber,
          type,
          total,
          tvaRate,
          tvaAmount,
          paymentMethod,
          itemCount: orderItems.length,
        }),
        terminalId: terminalId || 'kiosk-01',
        orderId: created.id,
        siteId,
      },
    })

    return created
  })

  return NextResponse.json({ order }, { status: 201 })
}
