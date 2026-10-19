import { NextResponse } from 'next/server'
import { fetchEncodedAccount } from '@solana/kit'
import { TOKEN_PROGRAM_ADDRESS, getMintDecoder } from '@solana-program/token'
import { TOKEN_2022_PROGRAM_ADDRESS } from '@solana-program/token-2022'
import { MENU, MERCHANT_WALLET, USDC_MINT, rpc, type MenuItem } from '@/lib/config'
import { createOrder, toJSON } from '@/lib/orders'

// The client only says WHAT it wants. Price, mint and recipient come from here.
export async function POST(req: Request) {
  const { item } = (await req.json().catch(() => ({}))) as { item?: string }
  if (!item || !(item in MENU)) return NextResponse.json({ error: 'Unknown item' }, { status: 400 })

  // The mint's owner tells us which token program it uses (Token or Token-2022).
  const mint = await fetchEncodedAccount(rpc, USDC_MINT)
  if (!mint.exists) return NextResponse.json({ error: 'Mint not found on this cluster' }, { status: 500 })
  if (mint.programAddress !== TOKEN_PROGRAM_ADDRESS && mint.programAddress !== TOKEN_2022_PROGRAM_ADDRESS) {
    return NextResponse.json({ error: 'Mint is not owned by a token program' }, { status: 500 })
  }

  const order = createOrder({
    item: item as MenuItem,
    amount: MENU[item as MenuItem].price,
    mint: USDC_MINT,
    tokenProgram: mint.programAddress,
    decimals: getMintDecoder().decode(mint.data).decimals,
    recipient: MERCHANT_WALLET,
  })
  return NextResponse.json(toJSON(order))
}
