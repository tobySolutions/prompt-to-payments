'use client'

// The connected wallet's USDC balance, refreshed every 5 s and whenever a payment lands.
import { useEffect, useState } from 'react'
import { address } from '@solana/kit'
import { client } from '@/app/providers'

const USDC_MINT = address(process.env.NEXT_PUBLIC_USDC_MINT ?? '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU')
export const BALANCE_EVENT = 'mamaput:balance'

export function useUsdcBalance(owner?: string) {
  const [ui, setUi] = useState<string | null>(null)
  useEffect(() => {
    if (!owner) return setUi(null)
    let live = true
    const load = async () => {
      try {
        const { value } = await client.rpc
          .getTokenAccountsByOwner(address(owner), { mint: USDC_MINT }, { encoding: 'jsonParsed', commitment: 'confirmed' })
          .send()
        // Read the exact string amount, never the float uiAmount.
        const raw = value.reduce((n, a) => n + BigInt((a.account.data as any).parsed.info.tokenAmount.amount), 0n)
        const whole = raw / 1_000_000n, frac = (raw % 1_000_000n).toString().padStart(6, '0').slice(0, 2)
        if (live) setUi(`${whole}.${frac}`)
      } catch {
        if (live) setUi('?')
      }
    }
    load()
    const t = setInterval(load, 5000)
    window.addEventListener(BALANCE_EVENT, load)
    return () => { live = false; clearInterval(t); window.removeEventListener(BALANCE_EVENT, load) }
  }, [owner])
  return ui
}
