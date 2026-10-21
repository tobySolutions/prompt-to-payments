// Orders are signed by the server instead of stored, so any server instance
// (your laptop, or many on Vercel) can check them without a database.
// The client can read an order, but changing the price breaks the signature.
import { createHmac, randomBytes, timingSafeEqual, randomUUID } from 'node:crypto'
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
  createdAt: number
}

export type OrderDTO = Omit<Order, 'amount'> & { amount: string; memo: string; token: string }

const g = globalThis as unknown as { orderSecret?: Buffer; usedSignatures?: Map<string, string>; refused?: Refusal[] }
// Set ORDER_SECRET in production. Locally a random one per process is fine.
const secret = () => (process.env.ORDER_SECRET ? Buffer.from(process.env.ORDER_SECRET) : (g.orderSecret ??= randomBytes(32)))

// The memo that ties a payment to exactly one order. Public on-chain: no personal data.
export const memoFor = (o: Pick<Order, 'id' | 'item'>) => `mamaput:${o.id}:${o.item}`
export const MEMO_RE = /^mamaput:([0-9a-f]{12}):([a-z]+)$/

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

export function createOrder(o: Omit<Order, 'id' | 'createdAt'>): OrderDTO {
  const order = { ...o, id: randomUUID().replace(/-/g, '').slice(0, 12), createdAt: Date.now() }
  const payload = Buffer.from(JSON.stringify({ ...order, amount: order.amount.toString() })).toString('base64url')
  return { ...order, amount: order.amount.toString(), memo: memoFor(order), token: `${payload}.${sign(payload)}` }
}

// Returns the order only if the server signed it and nobody changed it.
export function readOrder(token: unknown): Order | null {
  if (typeof token !== 'string') return null
  const [payload, mac] = token.split('.')
  if (!payload || !mac) return null
  const want = Buffer.from(sign(payload)), got = Buffer.from(mac)
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null
  const o = JSON.parse(Buffer.from(payload, 'base64url').toString())
  return { ...o, amount: BigInt(o.amount) }
}

// Belt and braces: the memo already binds a payment to one order, and this
// remembers which order each signature paid, on this server. In production: a UNIQUE column.
export function claimSignature(sig: string, orderId: string): 'new' | 'repeat' | 'other' {
  const used = (g.usedSignatures ??= new Map())
  const had = used.get(sig)
  if (had) return had === orderId ? 'repeat' : 'other'
  used.set(sig, orderId)
  return 'new'
}

// Recent refusals, for the kitchen screen. Per server instance, not durable.
export type Refusal = { at: number; reason: string; orderId?: string }
export function logRefusal(r: Omit<Refusal, 'at'>) {
  const list = (g.refused ??= [])
  list.unshift({ ...r, at: Date.now() })
  list.length = Math.min(list.length, 20)
}
export const recentRefusals = () => g.refused ?? []
