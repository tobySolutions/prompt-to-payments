import { NextResponse } from 'next/server'
import { claimSignature, logRefusal, readOrder } from '@/lib/orders'
import { verifyPayment } from '@/lib/verify'

// POST { token, signature }. The token is the order the server signed earlier.
export async function POST(req: Request) {
  const { token, signature } = (await req.json().catch(() => ({}))) as { token?: string; signature?: string }
  const order = token ? readOrder(token) : null
  if (!order) {
    logRefusal({ reason: 'Order was not issued by this kitchen, or was edited' })
    return NextResponse.json({ error: 'Unknown or tampered order' }, { status: 400 })
  }
  if (!signature) return NextResponse.json({ error: 'signature required' }, { status: 400 })

  const result = await verifyPayment(order, signature)
  if (!result.ok) {
    if (!result.notFound) logRefusal({ reason: result.reason, orderId: order.id })
    return NextResponse.json({ error: result.reason }, { status: 402 })
  }
  if (!claimSignature(signature)) {
    // Same order, same signature again (a retry) is fine; the memo already stops reuse on other orders.
    return NextResponse.json({ status: 'paid', orderId: order.id, signature, repeat: true })
  }
  return NextResponse.json({ status: 'paid', orderId: order.id, signature })
}
