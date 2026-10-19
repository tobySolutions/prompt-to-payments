// In-memory order store. Fine for a workshop; use a database in production,
// with a UNIQUE constraint on the payment signature.
import { randomUUID } from 'node:crypto'
import type { Address } from '@solana/kit'
import type { MenuItem } from './config'

export type Order = {
  id: string
  item: MenuItem
  amount: bigint // USDC base units
  mint: Address
  tokenProgram: Address
  decimals: number
  recipient: Address // merchant wallet (owner), not a token account
  status: 'pending' | 'paid'
  signature?: string
  createdAt: number
}

const g = globalThis as unknown as { orders?: Map<string, Order>; usedSignatures?: Set<string> }
const orders = (g.orders ??= new Map())
const usedSignatures = (g.usedSignatures ??= new Set())

export function createOrder(o: Omit<Order, 'id' | 'status' | 'createdAt'>): Order {
  const order: Order = { ...o, id: randomUUID(), status: 'pending', createdAt: Date.now() }
  orders.set(order.id, order)
  return order
}

export const getOrder = (id: string) => orders.get(id)

// Returns false if this signature already paid for something. Check and set
// happen together so the same payment can't unlock two orders.
export function markPaid(order: Order, signature: string): boolean {
  if (usedSignatures.has(signature)) return false
  usedSignatures.add(signature)
  order.status = 'paid'
  order.signature = signature
  return true
}

export const toJSON = (o: Order) => ({ ...o, amount: o.amount.toString() })
