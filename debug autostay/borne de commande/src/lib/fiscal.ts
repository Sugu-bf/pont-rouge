// Fiscal utilities for Swiss compliance (GeBüV / MWSTG)

import { createHash } from 'crypto'

/**
 * Generate a unique receipt number
 * Format: FB-{SITE}-{YYYYMMDD}-{NNNN}
 */
export function generateReceiptNumber(siteSlug: string, date: Date, orderNumber: number): string {
  const d = date.toISOString().slice(0, 10).replace(/-/g, '')
  const num = String(orderNumber).padStart(4, '0')
  return `FB-${siteSlug.toUpperCase()}-${d}-${num}`
}

/**
 * Generate a fiscal hash (SHA-256) for order integrity verification.
 * Chain-links to previous order hash for tamper detection.
 *
 * Hash input: receiptNumber|total|tvaAmount|tvaRate|type|createdAt|previousHash
 */
export function generateFiscalHash(params: {
  receiptNumber: string
  total: number
  tvaAmount: number
  tvaRate: number
  type: string
  createdAt: string
  previousHash: string
}): string {
  const data = [
    params.receiptNumber,
    params.total.toFixed(2),
    params.tvaAmount.toFixed(2),
    params.tvaRate.toString(),
    params.type,
    params.createdAt,
    params.previousHash,
  ].join('|')

  return createHash('sha256').update(data).digest('hex')
}

/**
 * Extract short verification code from fiscal hash (for receipts)
 * Shows first 8 chars of hash — enough for visual verification
 */
export function shortFiscalCode(hash: string): string {
  return hash.slice(0, 8).toUpperCase()
}
