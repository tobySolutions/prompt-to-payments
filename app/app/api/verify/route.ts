import { NextResponse } from 'next/server'
import { claimSignature, logRefusal, readOrder } from '@/lib/orders'
import { verifyPayment } from '@/lib/verify'

// POST { token, signature }. The token is the order the server signed earlier.
export async function POST(req: Request) {
  const { token, signature } = (await req.json().catch(() => ({}))) as { token?: unknown; signature?: unknown }
  if (typeof token !== 'string' || typeof signature !== 'string' || !signature) {
    return NextResponse.json({ error: 'token and signature must be strings' }, { status: 400 })
  }
  // Not logged as a refusal: the kitchen screen only lists refusals for real orders.
  const order = readOrder(token)
  if (!order) return NextResponse.json({ error: 'Unknown or tampered order' }, { status: 400 })

  let result
  try {
    result = await verifyPayment(order, signature)
  } catch {
    // The RPC is down or rate-limiting us. Not the payer's fault, so say "try again".
    return NextResponse.json({ status: 'error', reason: 'RPC busy, try again' }, { status: 503 })
  }
  if (!result.ok) {
    if (!result.notFound) logRefusal({ reason: result.reason, orderId: order.id })
    return NextResponse.json({ error: result.reason }, { status: 402 })
  }

  const claim = claimSignature(signature, order.id)
  if (claim === 'other') {
    logRefusal({ reason: 'Signature already paid for another order', orderId: order.id })
    return NextResponse.json({ error: 'This payment was already used for another order' }, { status: 409 })
  }
  // Same order, same signature again (a retry) is fine.
  if (claim === 'repeat') return NextResponse.json({ status: 'paid', orderId: order.id, signature, repeat: true })
  return NextResponse.json({ status: 'paid', orderId: order.id, signature })
}
