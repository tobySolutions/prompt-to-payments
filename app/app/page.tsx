'use client'

import { useState } from 'react'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { client } from './providers'
import { buildPayment, type OrderDTO } from '@/lib/pay'
import { BALANCE_EVENT } from '@/lib/use-balance'

const MENU = [
  { id: 'jollof', name: 'Jollof rice + chicken', desc: 'Smoky party jollof, fried plantain on the side', price: '2.50' },
  { id: 'suya', name: 'Suya, one stick', desc: 'Spicy beef, onions, yaji', price: '1.00' },
  { id: 'zobo', name: 'Zobo, chilled', desc: 'Hibiscus, ginger, pineapple', price: '0.50' },
] // display only; the server sets the real price

type Phase = 'idle' | 'order' | 'sign' | 'chain' | 'verify' | 'paid' | 'error'
const STEPS: { phase: Phase; title: string }[] = [
  { phase: 'order', title: 'Order created by the server' },
  { phase: 'sign', title: 'Approve in your wallet' },
  { phase: 'chain', title: 'Landing on Solana' },
  { phase: 'verify', title: 'Checked by the server' },
]
const ORDER: Phase[] = ['order', 'sign', 'chain', 'verify', 'paid']
const fmt = (base: string) => (Number(base) / 1e6).toFixed(2) // display only

export default function Shop() {
  const connected = useConnectedWallet(client)
  const [active, setActive] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [failedAt, setFailedAt] = useState<Phase | null>(null)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<OrderDTO | null>(null)
  const [sig, setSig] = useState('')
  const [pendingCheck, setPending] = useState(false) // sent, but the server couldn't check it yet
  const busy = !['idle', 'paid', 'error'].includes(phase)

  async function pay(item: string) {
    setActive(item); setError(''); setSig(''); setOrder(null); setFailedAt(null); setPending(false)
    let at: Phase = 'order'
    const go = (p: Phase) => { at = p; setPhase(p) }
    try {
      go('order')
      const res = await fetch('/api/orders', { method: 'POST', body: JSON.stringify({ item }) })
      const o = (await res.json()) as OrderDTO & { error?: string }
      if (!res.ok) throw new Error(o.error)
      setOrder(o)

      go('sign')
      const instructions = await buildPayment(o, client.payer)
      const pending = client.sendTransaction(instructions)
      // The wallet prompt resolves into "sent"; after that we're waiting on the chain.
      go('chain')
      const result = await pending
      const s = result.context.signature
      setSig(s)

      go('verify')
      let rpcBusy = false
      for (let i = 0; i < 8; i++) {
        const v = await fetch('/api/verify', { method: 'POST', body: JSON.stringify({ token: o.token, signature: s }) })
        const body = (await v.json().catch(() => ({}))) as { error?: string; reason?: string }
        if (v.ok) {
          setPhase('paid')
          window.dispatchEvent(new Event(BALANCE_EVENT))
          return
        }
        // 503: the server couldn't reach Solana. The payment may be fine, so keep asking.
        rpcBusy = v.status === 503
        const notFound = v.status === 402 && body.error?.startsWith('Transaction not found')
        if (!rpcBusy && !notFound) throw new Error(body.error ?? body.reason ?? `Server error ${v.status}`)
        await new Promise(r => setTimeout(r, 1500))
      }
      if (rpcBusy) setPending(true)
      throw new Error(rpcBusy
        ? 'Solana RPC busy, try again. Your payment was sent: check the explorer before paying again.'
        : 'The payment was sent but the server has not seen it yet. Check the explorer, then try again.')
    } catch (e) {
      setFailedAt(at)
      setPhase('error')
      const msg = e instanceof Error ? e.message : String(e)
      setError(/reject|denied|cancel/i.test(msg) ? 'You cancelled in your wallet. Nothing was paid.' : msg)
    }
  }

  const stepState = (p: Phase) => {
    if (phase === 'error') return p === failedAt ? 'fail' : ORDER.indexOf(p) < ORDER.indexOf(failedAt!) ? 'done' : ''
    const i = ORDER.indexOf(phase), j = ORDER.indexOf(p)
    return i > j ? 'done' : i === j ? 'now' : ''
  }

  const detail = (p: Phase) => {
    if (!order) return ''
    if (p === 'order') return `${order.id} · ${fmt(order.amount)} USDC`
    if (p === 'sign') return 'create account · transferChecked · memo'
    if (p === 'chain') return sig ? `${sig.slice(0, 8)}…${sig.slice(-6)}` : 'sending…'
    if (p === 'verify') return phase === 'paid' ? 'memo ✓  mint ✓  amount ✓' : 'fetching the transaction…'
    return ''
  }

  return (
    <main className="page">
      <h1 className="title">What are you eating today?</h1>
      <p className="sub">The kitchen&apos;s server sets the price. You pay in USDC on Solana devnet.</p>

      <div className="split">
        <section className="items" aria-label="Menu">
          {MENU.map(m => (
            <div key={m.id} className={`item ${active === m.id && phase !== 'idle' ? 'active' : ''}`}>
              <div className="txt">
                <div className="name">{m.name}</div>
                <div className="desc">{m.desc}</div>
              </div>
              <span className="price">{m.price} USDC</span>
              <button className="btn primary" disabled={!connected || busy} onClick={() => pay(m.id)}>
                {busy && active === m.id ? 'Paying…' : 'Pay'}
              </button>
            </div>
          ))}
          {!connected && <p className="muted">Connect a wallet on devnet (top right) to pay.</p>}
        </section>

        <aside aria-live="polite">
          <p className="panel-label">Your order</p>
          {phase === 'idle' ? (
            <div className="empty"><b>Nothing ordered yet</b>Pick something from the menu.</div>
          ) : (
            <>
              {phase === 'error' && (
                <div className="alert"><b>{pendingCheck ? 'Not checked yet' : 'Payment not accepted'}</b>{error}</div>
              )}
              <div className="steps">
                {STEPS.map(s => (
                  <div key={s.phase} className={`step on ${stepState(s.phase)}`}>
                    <i>{stepState(s.phase) === 'done' ? '✓' : stepState(s.phase) === 'fail' ? '!' : ''}</i>
                    <div><b>{s.title}</b><span>{detail(s.phase)}</span></div>
                  </div>
                ))}
              </div>
              {phase === 'paid' && order && (
                <div className="receipt">
                  <h3>MAMA PUT · LEKKI</h3>
                  <hr />
                  <div className="r"><span>{MENU.find(m => m.id === order.item)?.name}</span><b>{fmt(order.amount)} USDC</b></div>
                  <div className="r"><span>Order</span><b>{order.id}</b></div>
                  <div className="r"><span>Network</span><b className="blue">Solana devnet</b></div>
                  <div className="r"><span>Verified by</span><b className="green">the server</b></div>
                  <hr />
                  <div className="foot">
                    <a href={`https://explorer.solana.com/tx/${sig}?cluster=devnet`} target="_blank" rel="noreferrer">View on explorer ↗</a>
                    <span className="stamp">PAID</span>
                  </div>
                </div>
              )}
              {phase === 'error' && <button className="btn" onClick={() => setPhase('idle')}>Start a new order</button>}
            </>
          )}
        </aside>
      </div>
    </main>
  )
}
