// Server-side payment check. The browser saying "I paid" proves nothing;
// the chain does. Every rule below is one the AI-generated version skipped.
import { signature as toSignature } from '@solana/kit'
import { rpc } from './config'
import { memoFor, type Order } from './orders'

type TokenBalance = { accountIndex: number; mint: string; owner?: string; uiTokenAmount: { amount: string } }
export type ParsedIx = { program?: string; programId: string; parsed?: unknown }
type ParsedTx = {
  blockTime?: bigint | number | null
  meta: { err: unknown; preTokenBalances?: TokenBalance[]; postTokenBalances?: TokenBalance[] } | null
  transaction: { message: { instructions: ParsedIx[]; accountKeys: { pubkey: string }[] } }
}

export type VerifyResult = { ok: true } | { ok: false; reason: string; notFound?: boolean }

export async function fetchTx(sig: string): Promise<ParsedTx | null> {
  // "confirmed" or better. maxSupportedTransactionVersion: 1 so v0 and the new
  // v1 transactions both come back instead of erroring.
  const tx = await rpc
    .getTransaction(toSignature(sig), { commitment: 'confirmed', encoding: 'jsonParsed', maxSupportedTransactionVersion: 1 })
    .send()
  return tx as unknown as ParsedTx | null
}

export const memosOf = (tx: ParsedTx) =>
  tx.transaction.message.instructions.filter(ix => ix.program === 'spl-memo').map(ix => String(ix.parsed))

// How much of `mint` the `owner` received in this transaction, from balances.
// Balances (not instruction args) also cover Token-2022 and transfers made inside other programs.
export function received(tx: ParsedTx, mint: string, owner: string): bigint {
  const sum = (list: TokenBalance[] = []) =>
    list.filter(b => b.mint === mint && b.owner === owner).reduce((n, b) => n + BigInt(b.uiTokenAmount.amount), 0n)
  return sum(tx.meta?.postTokenBalances) - sum(tx.meta?.preTokenBalances)
}

export async function verifyPayment(order: Order, sig: string): Promise<VerifyResult> {
  try {
    toSignature(sig)
  } catch {
    return { ok: false, reason: 'Not a valid signature' }
  }

  // 1. It must exist. (Use "finalized" when the amount is large enough to care about a rollback.)
  const tx = await fetchTx(sig)
  if (!tx) return { ok: false, reason: 'Transaction not found yet. Try again in a few seconds.', notFound: true }

  // 2. It must have succeeded. A failed transaction still has a signature.
  if (tx.meta?.err) return { ok: false, reason: 'Transaction failed on-chain' }

  // 3. Its memo must name this order, so one payment maps to one order.
  if (!memosOf(tx).includes(memoFor(order))) return { ok: false, reason: 'Memo does not match this order' }

  // 4. The merchant's balance of the right mint must go up by the full price.
  const got = received(tx, order.mint, order.recipient)
  if (got < order.amount) return { ok: false, reason: `Merchant received ${got} base units, this order costs ${order.amount}` }

  return { ok: true }
}
