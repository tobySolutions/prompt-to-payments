'use client'

import type { ReactNode } from 'react'
import { createClient } from '@solana/kit'
import { solanaRpc } from '@solana/kit-plugin-rpc'
import { walletSigner } from '@solana/kit-plugin-wallet'
import { ClientProvider } from '@solana/react'

const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? 'https://api.devnet.solana.com'

// One client for the whole app. The connected wallet becomes the payer.
// version 0: every current wallet can sign it, and our payment fits easily.
export const client = createClient()
  .use(walletSigner({ chain: 'solana:devnet' }))
  .use(solanaRpc({ rpcUrl, transactionConfig: { version: 0 } }))

export type AppClient = typeof client

export function Providers({ children }: { children: ReactNode }) {
  return <ClientProvider client={client}>{children}</ClientProvider>
}
