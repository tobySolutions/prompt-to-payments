import { NextResponse } from 'next/server'
import { kitchenOrders } from '@/lib/kitchen'
import { recentRefusals } from '@/lib/orders'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const orders = await kitchenOrders()
    return NextResponse.json(
      { orders, refused: recentRefusals(), at: Date.now() },
      // A short shared cache so a room full of phones doesn't hammer the RPC.
      { headers: { 'cache-control': 'public, s-maxage=3, stale-while-revalidate=10' } },
    )
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 })
  }
}
