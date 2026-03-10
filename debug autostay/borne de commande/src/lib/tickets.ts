// Ticket generation for thermal printers (ESC/POS compatible)
// 3 ticket types: kitchen, bar, client
// Swiss compliant: CHE number, address, receipt number, fiscal hash

import { shortFiscalCode } from './fiscal'

interface TicketSite {
  name: string
  legalName: string
  cheNumber: string
  address: string
  postalCode: string
  city: string
  phone: string
}

interface TicketOrder {
  orderNumber: number
  receiptNumber: string
  type: string // surPlace | aEmporter
  siteName: string
  site?: TicketSite
  createdAt: string
  paymentMethod?: string | null
  total: number
  subtotal: number
  tvaRate: number
  tvaAmount: number
  fiscalHash?: string
  terminalId?: string
  items: {
    product: { name: string; slug: string }
    quantity: number
    unitPrice: number
    totalPrice: number
    protein?: string | null
    withFrites: boolean
    supplements: string // JSON
    sauce?: string | null
  }[]
}

// Bar item slugs (drinks + desserts)
const barSlugs = [
  'coca-cola', 'coca-zero', 'fanta', 'sprite', 'ice-tea',
  'eau-minerale', 'eau-gazeuse', 'capri-sun',
  'mousse-mangue', 'donut',
  'glace-choco-cornet', 'glace-fraise-cornet', 'glace-vanille-cornet',
  'glace-choquello', 'glace-fusee', 'glace-almond',
  'glace-choco-bol', 'glace-caramel-bol', 'glace-cafe-bol',
]

function isKitchenItem(slug: string): boolean {
  return !barSlugs.includes(slug)
}

function parseSupplements(json: string): { name: string; price: number }[] {
  try { return JSON.parse(json) } catch { return [] }
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function orderTypeLabel(type: string): string {
  return type === 'surPlace' ? 'SUR PLACE' : 'A EMPORTER'
}

function paymentLabel(method: string | null | undefined): string {
  if (!method) return ''
  const labels: Record<string, string> = {
    card: 'Carte bancaire',
    twint: 'TWINT',
    counter: 'En caisse',
  }
  return labels[method] || method
}

// ═══════════════════════════════════════
// KITCHEN TICKET — food items only
// ═══════════════════════════════════════
export function generateKitchenTicket(order: TicketOrder): string {
  const kitchenItems = order.items.filter((item) => isKitchenItem(item.product.slug))
  if (kitchenItems.length === 0) return ''

  let ticket = ''
  ticket += '================================\n'
  ticket += '         CUISINE\n'
  ticket += '================================\n'
  ticket += `  COMMANDE #${order.orderNumber}\n`
  ticket += `  ${orderTypeLabel(order.type)}\n`
  ticket += `  ${formatTime(order.createdAt)}\n`
  ticket += '--------------------------------\n'

  for (const item of kitchenItems) {
    const supps = parseSupplements(item.supplements)
    ticket += `\n  ${item.quantity}x ${item.product.name.toUpperCase()}\n`
    if (item.protein) ticket += `     > ${item.protein}\n`
    if (item.withFrites) ticket += `     > + Frites\n`
    for (const s of supps) ticket += `     > + ${s.name}\n`
    if (item.sauce) ticket += `     > Sauce: ${item.sauce}\n`
  }

  ticket += '\n--------------------------------\n'
  ticket += `  ${kitchenItems.reduce((sum, i) => sum + i.quantity, 0)} article(s)\n`
  ticket += '================================\n'
  return ticket
}

// ═══════════════════════════════════════
// BAR TICKET — drinks + desserts only
// ═══════════════════════════════════════
export function generateBarTicket(order: TicketOrder): string {
  const barItems = order.items.filter((item) => !isKitchenItem(item.product.slug))
  if (barItems.length === 0) return ''

  let ticket = ''
  ticket += '================================\n'
  ticket += '         BAR\n'
  ticket += '================================\n'
  ticket += `  COMMANDE #${order.orderNumber}\n`
  ticket += `  ${orderTypeLabel(order.type)}\n`
  ticket += `  ${formatTime(order.createdAt)}\n`
  ticket += '--------------------------------\n'

  for (const item of barItems) {
    ticket += `\n  ${item.quantity}x ${item.product.name.toUpperCase()}\n`
  }

  ticket += '\n--------------------------------\n'
  ticket += `  ${barItems.reduce((sum, i) => sum + i.quantity, 0)} article(s)\n`
  ticket += '================================\n'
  return ticket
}

// ═══════════════════════════════════════
// CLIENT TICKET — full receipt (Swiss compliant)
// ═══════════════════════════════════════
export function generateClientTicket(order: TicketOrder): string {
  const site = order.site
  let ticket = ''

  ticket += '================================\n'
  ticket += '          FRYBURGER\n'
  ticket += '       Fait Maison\n'
  ticket += '================================\n'

  // Legal entity info (required by MWSTG)
  if (site) {
    ticket += `  ${site.legalName}\n`
    ticket += `  ${site.address}\n`
    ticket += `  ${site.postalCode} ${site.city}\n`
    if (site.cheNumber) ticket += `  TVA: ${site.cheNumber}\n`
    if (site.phone) ticket += `  Tel: ${site.phone}\n`
  } else {
    ticket += `  ${order.siteName}\n`
  }

  ticket += `  ${formatDate(order.createdAt)} ${formatTime(order.createdAt)}\n`
  ticket += '--------------------------------\n'
  ticket += `  COMMANDE #${order.orderNumber}\n`
  ticket += `  Recu: ${order.receiptNumber}\n`
  ticket += `  ${orderTypeLabel(order.type)}\n`
  if (order.terminalId) ticket += `  Terminal: ${order.terminalId}\n`
  ticket += '--------------------------------\n'

  for (const item of order.items) {
    const supps = parseSupplements(item.supplements)
    const lineTotal = (item.unitPrice * item.quantity).toFixed(2)

    ticket += `\n  ${item.quantity}x ${item.product.name}\n`
    if (item.protein) ticket += `     ${item.protein}\n`
    if (item.withFrites) ticket += `     + Frites\n`
    for (const s of supps) ticket += `     + ${s.name} (${s.price.toFixed(2)})\n`
    if (item.sauce) ticket += `     Sauce: ${item.sauce}\n`
    ticket += `     ${' '.repeat(20)}${lineTotal} CHF\n`
  }

  ticket += '\n--------------------------------\n'
  ticket += `  Sous-total:      ${order.subtotal.toFixed(2)} CHF\n`
  ticket += `  TVA (${(order.tvaRate * 100).toFixed(1)}%):    ${order.tvaAmount.toFixed(2)} CHF\n`
  ticket += '--------------------------------\n'
  ticket += `  TOTAL:           ${order.total.toFixed(2)} CHF\n`
  ticket += '--------------------------------\n'

  if (order.paymentMethod) {
    ticket += `  Paiement: ${paymentLabel(order.paymentMethod)}\n`
  }

  // Fiscal verification code (GeBüV)
  if (order.fiscalHash) {
    ticket += `\n  Verif: ${shortFiscalCode(order.fiscalHash)}\n`
  }

  ticket += '\n================================\n'
  ticket += '     Merci et a bientot !\n'
  ticket += '        www.fryburger.ch\n'
  ticket += '================================\n'

  return ticket
}

// ═══════════════════════════════════════
// HTML versions for screen preview
// ═══════════════════════════════════════
export function generateKitchenTicketHTML(order: TicketOrder): string {
  const kitchenItems = order.items.filter((item) => isKitchenItem(item.product.slug))
  if (kitchenItems.length === 0) return ''

  let html = `<div style="font-family:monospace;font-size:14px;padding:20px;max-width:300px;background:#fff;color:#000;">`
  html += `<div style="text-align:center;border-bottom:2px dashed #000;padding-bottom:10px;margin-bottom:10px;">`
  html += `<div style="font-size:18px;font-weight:bold;">CUISINE</div>`
  html += `<div style="font-size:28px;font-weight:bold;margin:8px 0;">#${order.orderNumber}</div>`
  html += `<div style="font-size:16px;font-weight:bold;">${orderTypeLabel(order.type)}</div>`
  html += `<div>${formatTime(order.createdAt)}</div>`
  html += `</div>`

  for (const item of kitchenItems) {
    const supps = parseSupplements(item.supplements)
    html += `<div style="margin-bottom:12px;">`
    html += `<div style="font-size:16px;font-weight:bold;">${item.quantity}x ${item.product.name}</div>`
    if (item.protein) html += `<div style="color:#666;padding-left:12px;">▸ ${item.protein}</div>`
    if (item.withFrites) html += `<div style="color:#666;padding-left:12px;">▸ + Frites</div>`
    for (const s of supps) html += `<div style="color:#666;padding-left:12px;">▸ + ${s.name}</div>`
    if (item.sauce) html += `<div style="color:#666;padding-left:12px;">▸ Sauce: ${item.sauce}</div>`
    html += `</div>`
  }

  html += `<div style="border-top:2px dashed #000;padding-top:10px;text-align:center;">`
  html += `${kitchenItems.reduce((sum, i) => sum + i.quantity, 0)} article(s)</div>`
  html += `</div>`
  return html
}

export function generateBarTicketHTML(order: TicketOrder): string {
  const barItems = order.items.filter((item) => !isKitchenItem(item.product.slug))
  if (barItems.length === 0) return ''

  let html = `<div style="font-family:monospace;font-size:14px;padding:20px;max-width:300px;background:#fff;color:#000;">`
  html += `<div style="text-align:center;border-bottom:2px dashed #000;padding-bottom:10px;margin-bottom:10px;">`
  html += `<div style="font-size:18px;font-weight:bold;">BAR</div>`
  html += `<div style="font-size:28px;font-weight:bold;margin:8px 0;">#${order.orderNumber}</div>`
  html += `<div style="font-size:16px;font-weight:bold;">${orderTypeLabel(order.type)}</div>`
  html += `<div>${formatTime(order.createdAt)}</div>`
  html += `</div>`

  for (const item of barItems) {
    html += `<div style="margin-bottom:8px;font-size:16px;font-weight:bold;">`
    html += `${item.quantity}x ${item.product.name}</div>`
  }

  html += `<div style="border-top:2px dashed #000;padding-top:10px;text-align:center;">`
  html += `${barItems.reduce((sum, i) => sum + i.quantity, 0)} article(s)</div>`
  html += `</div>`
  return html
}

export function generateClientTicketHTML(order: TicketOrder): string {
  const site = order.site
  let html = `<div style="font-family:monospace;font-size:13px;padding:20px;max-width:300px;background:#fff;color:#000;">`

  // Header with legal info
  html += `<div style="text-align:center;border-bottom:2px dashed #000;padding-bottom:12px;margin-bottom:12px;">`
  html += `<div style="font-size:20px;font-weight:bold;">FRYBURGER</div>`
  html += `<div>Fait Maison</div>`

  if (site) {
    html += `<div style="margin-top:6px;font-size:11px;">${site.legalName}</div>`
    html += `<div style="font-size:11px;">${site.address}</div>`
    html += `<div style="font-size:11px;">${site.postalCode} ${site.city}</div>`
    if (site.cheNumber) html += `<div style="font-size:11px;">TVA: ${site.cheNumber}</div>`
    if (site.phone) html += `<div style="font-size:11px;">Tel: ${site.phone}</div>`
  } else {
    html += `<div style="margin-top:4px;font-size:11px;">${order.siteName}</div>`
  }

  html += `<div style="font-size:11px;">${formatDate(order.createdAt)} ${formatTime(order.createdAt)}</div>`
  html += `</div>`

  // Order info
  html += `<div style="text-align:center;margin-bottom:12px;">`
  html += `<div style="font-size:24px;font-weight:bold;">#${order.orderNumber}</div>`
  html += `<div style="font-size:11px;color:#666;">Recu: ${order.receiptNumber}</div>`
  html += `<div style="font-weight:bold;">${orderTypeLabel(order.type)}</div>`
  if (order.terminalId) html += `<div style="font-size:10px;color:#999;">Terminal: ${order.terminalId}</div>`
  html += `</div>`

  // Items
  html += `<div style="border-top:1px solid #ccc;border-bottom:1px solid #ccc;padding:10px 0;">`
  for (const item of order.items) {
    const supps = parseSupplements(item.supplements)
    const lineTotal = (item.unitPrice * item.quantity).toFixed(2)
    html += `<div style="margin-bottom:8px;">`
    html += `<div style="display:flex;justify-content:space-between;"><span style="font-weight:bold;">${item.quantity}x ${item.product.name}</span><span>${lineTotal}</span></div>`
    if (item.protein) html += `<div style="color:#666;font-size:11px;padding-left:12px;">${item.protein}</div>`
    if (item.withFrites) html += `<div style="color:#666;font-size:11px;padding-left:12px;">+ Frites</div>`
    for (const s of supps) html += `<div style="color:#666;font-size:11px;padding-left:12px;">+ ${s.name} (${s.price.toFixed(2)})</div>`
    if (item.sauce) html += `<div style="color:#666;font-size:11px;padding-left:12px;">Sauce: ${item.sauce}</div>`
    html += `</div>`
  }
  html += `</div>`

  // Totals
  html += `<div style="padding:10px 0;">`
  html += `<div style="display:flex;justify-content:space-between;"><span>Sous-total</span><span>${order.subtotal.toFixed(2)} CHF</span></div>`
  html += `<div style="display:flex;justify-content:space-between;color:#666;"><span>TVA (${(order.tvaRate * 100).toFixed(1)}%)</span><span>${order.tvaAmount.toFixed(2)} CHF</span></div>`
  html += `<div style="display:flex;justify-content:space-between;font-size:18px;font-weight:bold;margin-top:8px;padding-top:8px;border-top:2px solid #000;"><span>TOTAL</span><span>${order.total.toFixed(2)} CHF</span></div>`
  html += `</div>`

  if (order.paymentMethod) {
    html += `<div style="text-align:center;color:#666;margin-top:8px;">Paiement: ${paymentLabel(order.paymentMethod)}</div>`
  }

  // Fiscal verification
  if (order.fiscalHash) {
    html += `<div style="text-align:center;font-size:10px;color:#999;margin-top:8px;">Verif: ${shortFiscalCode(order.fiscalHash)}</div>`
  }

  // Footer
  html += `<div style="text-align:center;border-top:2px dashed #000;padding-top:12px;margin-top:12px;">`
  html += `<div>Merci et a bientot !</div>`
  html += `<div style="font-size:11px;color:#666;">www.fryburger.ch</div>`
  html += `</div></div>`
  return html
}
