'use client'

import { useEffect, useState } from 'react'

type Step = { n: number; title: string; detail: string; tone: 'http' | 'bug' | 'ai' | 'chain' | 'ok' }
type Run = { ok: boolean; steps: Step[]; proverb?: string; tx?: string; error?: string }

// The x402 service (x402/ in the repo). Locally: npm run server on :4021.
const X402 = process.env.NEXT_PUBLIC_X402_URL ?? 'http://localhost:4021'

export default function Agent() {
  const [info, setInfo] = useState<{ address: string; usdc: string } | null>(null)
  const [offline, setOffline] = useState(false)
  const [run, setRun] = useState<Run | null>(null)
  const [shown, setShown] = useState(0)
  const [busy, setBusy] = useState(false)

  const loadInfo = () =>
    fetch(`${X402}/agent-info`).then(r => r.json()).then(i => { setInfo(i); setOffline(false) }).catch(() => setOffline(true))
  useEffect(() => { loadInfo() }, [])

  // Reveal the recorded steps one by one, so the room can follow the wire.
  useEffect(() => {
    if (!run || shown >= run.steps.length) return
    const t = setTimeout(() => setShown(s => s + 1), 650)
    return () => clearTimeout(t)
  }, [run, shown])

  async function go() {
    setBusy(true); setRun(null); setShown(0)
    try {
      const r = await fetch(`${X402}/run-agent`, { method: 'POST' })
      setRun((await r.json()) as Run)
      loadInfo()
    } catch {
      setRun({ ok: false, steps: [], error: `Can't reach the x402 service at ${X402}. Start it with npm run server in x402/.` })
    } finally {
      setBusy(false)
    }
  }

  const done = run && shown >= run.steps.length
  const color = (t: Step['tone']) => `var(--${t})`
  const why = (e?: string) =>
    e?.includes('simulation_failed')
      ? 'The facilitator simulated the payment and it failed. Most often the agent wallet has no devnet USDC: fund it at faucet.circle.com (Solana Devnet).'
      : e

  return (
    <main className="page">
      <div className="agent">
        <section>
          <h1 className="title">An agent buys a proverb</h1>
          <p className="sub">No account, no API key, no card. The request carries the payment: $0.001 in USDC, per call.</p>
          <button className="btn http" style={{ width: '100%', marginTop: 20, padding: '14px 18px' }} disabled={busy || offline} onClick={go}>
            {busy ? 'Agent is paying…' : '▶  Run the agent'}
          </button>
          <div className="kv">
            <div><span>Agent wallet</span><b className="mono" style={{ color: 'var(--chain)' }}>{info ? `${info.address.slice(0, 4)}…${info.address.slice(-4)}` : '…'}</b></div>
            <div><span>USDC balance</span><b className="mono">{info?.usdc ?? '…'}</b></div>
            <div><span>SOL needed</span><b className="mono" style={{ color: 'var(--ok)' }}>none, the facilitator pays fees</b></div>
            <div><span>Spend limit</span><b className="mono" style={{ color: 'var(--ai)' }}>$0.01 per request</b></div>
          </div>
          {offline && <div className="alert" style={{ marginTop: 16 }}><b>x402 service not running</b>Start it with <span className="mono">npm run server</span> in <span className="mono">x402/</span>.</div>}
        </section>

        <section className="timeline" aria-live="polite">
          {!run && !busy && <div className="empty"><b>Nothing yet</b>Press “Run the agent” to watch one paid request, step by step.</div>}
          {busy && [0, 1, 2].map(i => <div key={i} className="tl"><div className="skel" style={{ height: 30, borderRadius: '50%' }} /><div style={{ display: 'grid', gap: 8 }}><div className="skel" /><div className="skel" style={{ width: '60%' }} /></div></div>)}
          {run?.steps.slice(0, shown).map(s => (
            <div key={s.n} className={`tl ${s.tone === 'ok' ? 'final' : ''}`}>
              <span className="n" style={{ color: color(s.tone) }}>{s.n}</span>
              <div>
                <b style={{ color: color(s.tone) }}>{s.title}</b>
                {s.tone === 'ok' ? <div className="quote">“{s.detail}”</div> : <code>{s.detail}</code>}
              </div>
            </div>
          ))}
          {done && run?.tx && <a href={`https://explorer.solana.com/tx/${run.tx}?cluster=devnet`} target="_blank" rel="noreferrer">See the payment on the explorer ↗</a>}
          {done && !run?.ok && <div className="alert"><b>The agent didn’t pay</b>{why(run?.error)}</div>}
        </section>
      </div>
    </main>
  )
}
