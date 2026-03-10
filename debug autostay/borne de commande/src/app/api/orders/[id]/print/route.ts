import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  generateKitchenTicket,
  generateBarTicket,
  generateClientTicket,
  generateKitchenTicketHTML,
  generateBarTicketHTML,
  generateClientTicketHTML,
} from '@/lib/tickets'

// GET /api/orders/[id]/print — generate tickets for an order
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
      site: {
        select: {
          name: true,
          slug: true,
          legalName: true,
          cheNumber: true,
          address: true,
          postalCode: true,
          city: true,
          phone: true,
        },
      },
    },
  })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const ticketOrder = {
    orderNumber: order.orderNumber,
    receiptNumber: order.receiptNumber,
    type: order.type,
    siteName: order.site.name,
    site: {
      name: order.site.name,
      legalName: order.site.legalName,
      cheNumber: order.site.cheNumber,
      address: order.site.address,
      postalCode: order.site.postalCode,
      city: order.site.city,
      phone: order.site.phone,
    },
    createdAt: order.createdAt.toISOString(),
    paymentMethod: order.paymentMethod,
    total: order.total,
    subtotal: order.subtotal,
    tvaRate: order.tvaRate,
    tvaAmount: order.tvaAmount,
    fiscalHash: order.fiscalHash,
    terminalId: order.terminalId,
    items: order.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      protein: item.protein,
      withFrites: item.withFrites,
      supplements: item.supplements, // JSON string
      sauce: item.sauce,
    })),
  }

  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'html'

  if (format === 'text') {
    return NextResponse.json({
      kitchen: generateKitchenTicket(ticketOrder),
      bar: generateBarTicket(ticketOrder),
      client: generateClientTicket(ticketOrder),
    })
  }

  return NextResponse.json({
    kitchen: generateKitchenTicketHTML(ticketOrder),
    bar: generateBarTicketHTML(ticketOrder),
    client: generateClientTicketHTML(ticketOrder),
  })
}
