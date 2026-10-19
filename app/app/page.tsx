'use client'

import { useEffect, useState } from 'react'
import { useConnect, useConnectedWallet, useDisconnect, useWallets, WalletReadyGate } from '@solana/kit-plugin-wallet/react'
import { client } from './providers'
import { buildPayment, type OrderDTO } from '@/lib/pay'

const MENU = [
  { id: 'jollof', name: 'Jollof rice + chicken', price: '2.50' },
  { id: 'suya', name: 'Suya, one stick', price: '1.00' },
  { id: 'zobo', name: 'Zobo, chilled', price: '0.50' },
] // display only; the server decides the real price

type Step = { kind: 'idle' } | { kind: 'busy'; label: string } | { kind: 'paid'; sig: string } | { kind: 'error'; msg: string }

function Wallet() {
  const wallets = useWallets(client)
  const connected = useConnectedWallet(client)
  const { dispatch: connect } = useConnect(client)
  const { dispatch: disconnect } = useDisconnect(client)

  if (connected) {
    const a = connected.account.address
    return (
      <section className="wallet">
        <span className="mono">{a.slice(0, 4)}…{a.slice(-4)}</span>
        <button onClick={() => disconnect()}>Disconnect</button>
      </section>
    )
  }
  return (
    <section className="wallet">
      {wallets.length === 0 && <span className="muted">No Solana wallet found. Install Phantom, Solflare or Backpack.</span>}
      {wallets.map(w => (
        <button key={w.name} onClick={() => connect(w)}>Connect {w.name}</button>
      ))}
    </section>
  )
}

export default function Page() {
  const connected = useConnectedWallet(client)
  const [step, setStep] = useState<Step>({ kind: 'idle' })
  // Wallets only exist in the browser, so render that part after mount.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const lookingForWallets = <section className="wallet muted">Looking for wallets…</section>

  async function pay(item: string) {
    try {
      setStep({ kind: 'busy', label: 'Creating order' })
      const res = await fetch('/api/orders', { method: 'POST', body: JSON.stringify({ item }) })
      const order = (await res.json()) as OrderDTO & { error?: string }
      if (!res.ok) throw new Error(order.error)

      setStep({ kind: 'busy', label: 'Approve in your wallet' })
      const instructions = await buildPayment(order, client.payer)
      const result = await client.sendTransaction(instructions)
      const sig = result.context.signature

      // The server checks the chain itself. Retry while its RPC catches up.
      setStep({ kind: 'busy', label: 'Checking the payment on-chain' })
      for (let i = 0; i < 8; i++) {
        const v = await fetch(`/api/orders/${order.id}/verify`, { method: 'POST', body: JSON.stringify({ signature: sig }) })
        if (v.ok) return setStep({ kind: 'paid', sig })
        const { error } = (await v.json()) as { error: string }
        if (v.status !== 402 || !error.startsWith('Transaction not found')) throw new Error(error)
        await new Promise(r => setTimeout(r, 1500))
      }
      throw new Error('Payment not seen on-chain yet. Check the explorer.')
    } catch (e) {
      setStep({ kind: 'error', msg: e instanceof Error ? e.message : String(e) })
    }
  }

  return (
    <main className="shell">
      <header>
        <h1>Mama Put</h1>
        <p className="muted">Pay with USDC on Solana devnet</p>
      </header>

      {mounted ? (
        <WalletReadyGate client={client} fallback={lookingForWallets}>
          <Wallet />
        </WalletReadyGate>
      ) : lookingForWallets}

      <ul className="menu">
        {MENU.map(m => (
          <li key={m.id}>
            <span className="name">{m.name}</span>
            <span className="price">{m.price} USDC</span>
            <button disabled={!connected || step.kind === 'busy'} onClick={() => pay(m.id)}>Pay</button>
          </li>
        ))}
      </ul>

      <p className={`status ${step.kind}`} aria-live="polite">
        {step.kind === 'busy' && step.label}
        {step.kind === 'error' && step.msg}
        {step.kind === 'paid' && (
          <>
            Paid and verified on-chain.{' '}
            <a href={`https://explorer.solana.com/tx/${step.sig}?cluster=devnet`} target="_blank" rel="noreferrer">View transaction</a>
          </>
        )}
      </p>
    </main>
  )
}
