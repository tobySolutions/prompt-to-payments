import { NextResponse } from 'next/server'
import { getOrder, markPaid, toJSON } from '@/lib/orders'
import { verifyPayment } from '@/lib/verify'

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const order = getOrder(id)
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (order.status === 'paid') return NextResponse.json(toJSON(order))

  const { signature } = (await req.json().catch(() => ({}))) as { signature?: string }
  if (!signature) return NextResponse.json({ error: 'signature required' }, { status: 400 })

  const result = await verifyPayment(order, signature)
  if (!result.ok) return NextResponse.json({ error: result.reason }, { status: 402 })

  if (!markPaid(order, signature)) {
    return NextResponse.json({ error: 'This payment was already used' }, { status: 409 })
  }
  return NextResponse.json(toJSON(order))
}
