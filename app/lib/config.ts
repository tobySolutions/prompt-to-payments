// Server-only configuration. Nothing here is a secret, but it is read on the
// server so the client can never choose the mint, the price or the recipient.
import { address, createSolanaRpc, type Address } from '@solana/kit'

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}. Copy .env.example to .env.local and fill it in.`)
  return value
}

export const RPC_URL = process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com'
export const rpc = createSolanaRpc(RPC_URL)

export const USDC_MINT: Address = address(required('USDC_MINT'))
export const MERCHANT_WALLET: Address = address(required('MERCHANT_WALLET'))

// Prices live on the server, in base units (1 USDC = 1_000_000).
export const MENU = {
  jollof: { name: 'Jollof rice + chicken', price: 2_500_000n },
  suya: { name: 'Suya, one stick', price: 1_000_000n },
  zobo: { name: 'Zobo, chilled', price: 500_000n },
} as const

export type MenuItem = keyof typeof MENU
