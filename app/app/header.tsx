'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useConnect, useConnectedWallet, useDisconnect, useWallets, WalletReadyGate } from '@solana/kit-plugin-wallet/react'
import { client } from './providers'
import { useUsdcBalance } from '@/lib/use-balance'

const LINKS = [
  ['/', 'Shop'],
  ['/kitchen', 'Kitchen'],
  ['/agent', 'Agent · x402'],
] as const

function WalletButton() {
  const wallets = useWallets(client)
  const connected = useConnectedWallet(client)
  const { dispatch: connect } = useConnect(client)
  const { dispatch: disconnect } = useDisconnect(client)
  const balance = useUsdcBalance(connected?.account.address)

  if (connected) {
    const a = connected.account.address
    return (
      <div className="wallet">
        <b>{balance ?? '…'} USDC</b>
        <span className="mono addr">{a.slice(0, 4)}…{a.slice(-4)}</span>
        <button className="btn sm" onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }
  if (wallets.length === 0) return <span className="muted">No Solana wallet found</span>
  return (
    <div className="wallet">
      {wallets.slice(0, 2).map(w => (
        <button key={w.name} className="btn sm" onClick={() => connect(w)}>Connect {w.name}</button>
      ))}
    </div>
  )
}

export function Header() {
  const path = usePathname()
  // Wallets only exist in the browser, so render that part after mount.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="hdr">
      <Link href="/" className="brand"><b>Mama Put</b><span className="pill">devnet</span></Link>
      <nav className="nav">
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}>{label}</Link>
        ))}
      </nav>
      {mounted ? (
        <WalletReadyGate client={client} fallback={<span className="muted">Looking for wallets…</span>}>
          <WalletButton />
        </WalletReadyGate>
      ) : <span className="muted">Looking for wallets…</span>}
    </header>
  )
}
