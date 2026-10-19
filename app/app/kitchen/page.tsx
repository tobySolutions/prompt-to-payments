'use client'

import { useEffect, useRef, useState } from 'react'

type KOrder = { orderId: string; name: string; amount: string; customer: string; signature: string; blockTime: number | null; verified: boolean; reason?: string }
type Refusal = { at: number; reason: string; orderId?: string }
type Data = { orders: KOrder[]; refused: Refusal[]; at: number }

const usdc = (base: string) => (Number(base) / 1e6).toFixed(2) // display only
const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`
function ago(t: number | null) {
  if (!t) return '—'
  const s = Math.max(0, Math.round(Date.now() / 1000 - t))
  return s < 45 ? 'just now' : s < 3600 ? `${Math.round(s / 60)} min` : `${Math.round(s / 3600)} h`
}

export default function Kitchen() {
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState('')
  const seen = useRef<Set<string> | null>(null)
  const [fresh, setFresh] = useState<Set<string>>(new Set())

  useEffect(() => {
    let live = true
    const load = async () => {
      try {
        const r = await fetch('/api/kitchen', { cache: 'no-store' })
        const d = (await r.json()) as Data & { error?: string }
        if (!r.ok) throw new Error(d.error)
        if (!live) return
        // Highlight orders that arrived since the last poll (not on first load).
        if (seen.current) setFresh(new Set(d.orders.filter(o => !seen.current!.has(o.signature)).map(o => o.signature)))
        seen.current = new Set(d.orders.map(o => o.signature))
        setData(d); setError('')
      } catch (e) {
        if (live) setError(e instanceof Error ? e.message : String(e))
      }
    }
    load()
    const t = setInterval(load, 3000)
    return () => { live = false; clearInterval(t) }
  }, [])

  const paid = data?.orders.filter(o => o.verified) ?? []
  const total = paid.reduce((n, o) => n + BigInt(o.amount), 0n).toString()
  const refusedCount = (data?.refused.length ?? 0) + (data?.orders.filter(o => !o.verified).length ?? 0)

  const status = (o: KOrder) =>
    o.verified
      ? <span className="chip ok">✓ Verified on-chain</span>
      : <span className="chip bad">✕ {o.reason}</span>

  return (
    <main className="page">
      <div className="title-row">
        <div>
          <h1 className="title">Kitchen</h1>
          <p className="sub">Only payments the server has checked on Solana count as paid.</p>
        </div>
        <span className={`pill live ${error ? 'err' : ''}`}>{error ? 'Can’t reach Solana, retrying' : 'Reading Solana devnet · every 3 s'}</span>
      </div>

      <div className="stats">
        <div className="stat"><span>Paid orders</span><b style={{ color: 'var(--ok)' }}>{data ? paid.length : '…'}</b></div>
        <div className="stat"><span>USDC received</span><b style={{ color: 'var(--chain)' }}>{data ? usdc(total) : '…'}</b></div>
        <div className="stat"><span>Refused</span><b style={{ color: 'var(--bug)' }}>{data ? refusedCount : '…'}</b></div>
      </div>

      <div className="split">
        <section aria-label="Orders">
          {!data ? (
            <div aria-busy="true">
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px minmax(0,1fr) 70px', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
                  <div className="skel" /><div className="skel" /><div className="skel" />
                </div>
              ))}
              <p className="muted">Reading orders from Solana…</p>
            </div>
          ) : data.orders.length === 0 ? (
            <div className="empty"><b>No paid orders yet</b>Pay for something on the Shop tab. It shows up here once the server checks it on-chain.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Order</th><th>Item</th><th>Amount</th><th>Customer</th><th>Status</th><th>Paid</th></tr></thead>
                  <tbody>
                    {data.orders.map(o => (
                      <tr key={o.signature} className={fresh.has(o.signature) ? 'fresh' : ''}>
                        <td className="mono"><a href={`https://explorer.solana.com/tx/${o.signature}?cluster=devnet`} target="_blank" rel="noreferrer">{o.orderId}</a></td>
                        <td><span className="item-name">{o.name}</span></td>
                        <td className="mono" style={{ color: 'var(--chain)', whiteSpace: 'nowrap' }}>{usdc(o.amount)} USDC</td>
                        <td className="mono muted">{short(o.customer)}</td>
                        <td>{status(o)}</td>
                        <td className="muted" style={{ whiteSpace: 'nowrap' }}>{ago(o.blockTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="cards">
                {data.orders.map(o => (
                  <div key={o.signature} className="card" style={fresh.has(o.signature) ? { background: '#7ee2a814' } : undefined}>
                    <div className="top"><b className="mono">{o.orderId}</b><span className="muted">{ago(o.blockTime)}</span></div>
                    <div>{o.name}</div>
                    <div className="bottom"><span className="mono" style={{ color: 'var(--chain)' }}>{usdc(o.amount)} USDC · {short(o.customer)}</span>{status(o)}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <aside>
          <p className="panel-label" style={{ color: 'var(--bug)' }}>Refused by the server</p>
          {data?.refused.length ? (
            data.refused.slice(0, 6).map((r, i) => (
              <div key={i} className="refusal"><span>{r.orderId ?? 'no order'} · {ago(r.at / 1000)}</span>{r.reason}</div>
            ))
          ) : (
            <p className="muted">Nothing refused yet. Run the attack script to see this fill up.</p>
          )}
          <p className="how">
            <b>How this screen knows.</b> It reads the merchant&apos;s USDC account on Solana, finds each payment&apos;s memo
            (<span className="mono">mamaput:order:item</span>), and checks the amount against the menu. The browser never decides.
          </p>
        </aside>
      </div>
    </main>
  )
}
