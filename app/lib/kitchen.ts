// The kitchen's view of paid orders, read from Solana. No database: the
// merchant's USDC account history is the ledger, and each memo names the order.
import { fetchEncodedAccount, type Address } from '@solana/kit'
import { findAssociatedTokenPda } from '@solana-program/token'
import { MENU, MERCHANT_WALLET, USDC_MINT, rpc, type MenuItem } from './config'
import { MEMO_RE } from './orders'
import { fetchTx, isOrderMemo, memosOf, received } from './verify'

export type KitchenOrder = {
  orderId: string
  item: MenuItem
  name: string
  amount: string // base units received
  customer: string
  signature: string
  blockTime: number | null
  verified: boolean
  reason?: string
}

const g = globalThis as unknown as { kitchenCache?: Map<string, KitchenOrder | null>; merchantAta?: Address }

async function merchantAta(): Promise<Address> {
  if (g.merchantAta) return g.merchantAta
  const mint = await fetchEncodedAccount(rpc, USDC_MINT)
  if (!mint.exists) throw new Error('Mint not found on this cluster')
  const [ata] = await findAssociatedTokenPda({ owner: MERCHANT_WALLET, mint: USDC_MINT, tokenProgram: mint.programAddress })
  return (g.merchantAta = ata)
}

// Confirmed transactions never change, so each one is fetched once per server.
async function readOne(signature: string): Promise<KitchenOrder | null> {
  const cache = (g.kitchenCache ??= new Map())
  if (cache.has(signature)) return cache.get(signature)!
  const tx = await fetchTx(signature)
  if (!tx) return null // not visible to this RPC yet; try again next poll
  // One payment, one order: a payment that names several orders counts for none.
  const memos = memosOf(tx).filter(isOrderMemo)
  const memo = memos.length === 1 ? MEMO_RE.exec(memos[0]) : null
  let result: KitchenOrder | null = null
  if (memo && memo[2] in MENU) {
    const item = memo[2] as MenuItem
    const got = received(tx, USDC_MINT, MERCHANT_WALLET)
    const ok = !tx.meta?.err && got >= MENU[item].price
    result = {
      orderId: memo[1],
      item,
      name: MENU[item].name,
      amount: got.toString(),
      customer: tx.transaction.message.accountKeys[0]?.pubkey ?? '',
      signature,
      blockTime: tx.blockTime == null ? null : Number(tx.blockTime),
      verified: ok,
      reason: ok ? undefined : tx.meta?.err ? 'failed on-chain' : `paid ${got}, costs ${MENU[item].price}`,
    }
  }
  cache.set(signature, result)
  return result
}

export async function kitchenOrders(limit = 20): Promise<KitchenOrder[]> {
  const sigs = await rpc.getSignaturesForAddress(await merchantAta(), { limit, commitment: 'confirmed' }).send()
  const out: KitchenOrder[] = []
  // Sequential on purpose: the public devnet RPC rate-limits bursts.
  for (const s of sigs) {
    if (s.err) continue
    const o = await readOne(s.signature)
    if (o) out.push(o)
  }
  // One order, one payment: keep the first (oldest) payment that names each order.
  const seen = new Set<string>()
  return out
    .reverse()
    .filter(o => (seen.has(o.orderId) ? false : (seen.add(o.orderId), true)))
    .reverse()
}
