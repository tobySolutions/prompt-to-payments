// Server-side payment check. The browser saying "I paid" proves nothing;
// the chain does. Every rule below is one the AI-generated version skipped.
import { signature as toSignature } from '@solana/kit'
import { rpc } from './config'
import type { Order } from './orders'

type TokenBalance = { accountIndex: number; mint: string; owner?: string; uiTokenAmount: { amount: string } }
type ParsedIx = { program?: string; programId: string; parsed?: unknown }

export type VerifyResult = { ok: true } | { ok: false; reason: string }

export async function verifyPayment(order: Order, sig: string): Promise<VerifyResult> {
  let s
  try {
    s = toSignature(sig)
  } catch {
    return { ok: false, reason: 'Not a valid signature' }
  }

  // 1. The transaction must exist at "confirmed" or better. maxSupportedTransactionVersion: 1
  //    so v0 and the new v1 transactions both come back instead of erroring.
  //    (Use "finalized" when the amount is large enough to care about a rollback.)
  const tx = await rpc
    .getTransaction(s, { commitment: 'confirmed', encoding: 'jsonParsed', maxSupportedTransactionVersion: 1 })
    .send()
  if (!tx) return { ok: false, reason: 'Transaction not found yet. Try again in a few seconds.' }

  // 2. It must have succeeded. A failed transaction still has a signature.
  if (tx.meta?.err) return { ok: false, reason: 'Transaction failed on-chain' }

  // 3. It must carry this order's id in a memo, so one payment maps to one order.
  const ixs = tx.transaction.message.instructions as unknown as ParsedIx[]
  const memoOk = ixs.some(ix => ix.program === 'spl-memo' && ix.parsed === order.id)
  if (!memoOk) return { ok: false, reason: 'Memo does not match this order' }

  // 4. The merchant's balance of the right mint must go up by the full price.
  //    Checking balances (not instruction args) also covers Token-2022 and
  //    transfers that happen inside another program.
  const pre = (tx.meta?.preTokenBalances ?? []) as unknown as TokenBalance[]
  const post = (tx.meta?.postTokenBalances ?? []) as unknown as TokenBalance[]
  const isMerchantUsdc = (b: TokenBalance) => b.mint === order.mint && b.owner === order.recipient
  const before = pre.filter(isMerchantUsdc).reduce((n, b) => n + BigInt(b.uiTokenAmount.amount), 0n)
  const after = post.filter(isMerchantUsdc).reduce((n, b) => n + BigInt(b.uiTokenAmount.amount), 0n)
  if (after - before < order.amount) {
    return { ok: false, reason: `Merchant received ${after - before} base units, expected ${order.amount}` }
  }

  return { ok: true }
}
