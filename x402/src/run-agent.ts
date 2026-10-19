// One agent run, recorded step by step so the demo page can show what happened
// on the wire. Used by `npm run agent` and by POST /run-agent.
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { createKeyPairSignerFromBytes, createSolanaRpc, address, type KeyPairSigner } from '@solana/kit'
import { decodePaymentResponseHeader, wrapFetchWithPayment, x402Client } from '@x402/fetch'
import { ExactSvmScheme } from '@x402/svm/exact/client'

export type Step = { n: number; title: string; detail: string; tone: 'http' | 'bug' | 'ai' | 'chain' | 'ok' }
export type Run = { ok: boolean; steps: Step[]; proverb?: string; tx?: string; error?: string }

const DEVNET_USDC = address('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU')
const decode = (h: string | null) => (h ? JSON.parse(Buffer.from(h, 'base64').toString()) : null)
const clip = (s: string, n = 64) => (s.length > n ? `${s.slice(0, n)}…` : s)

// The agent's key: AGENT_KEYPAIR (JSON array) on a server, or a CLI keypair file locally. Devnet only.
let signer: Promise<KeyPairSigner> | undefined
export function agentSigner() {
  const bytes = process.env.AGENT_KEYPAIR ?? readFileSync(process.env.AGENT_KEYPAIR_PATH ?? `${homedir()}/.config/solana/id.json`, 'utf8')
  return (signer ??= createKeyPairSignerFromBytes(new Uint8Array(JSON.parse(bytes))))
}

export async function agentInfo() {
  const s = await agentSigner()
  const rpc = createSolanaRpc(process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com')
  const { value } = await rpc.getTokenAccountsByOwner(s.address, { mint: DEVNET_USDC }, { encoding: 'jsonParsed' }).send()
  const raw = value.reduce((n, a) => n + BigInt((a.account.data as any).parsed.info.tokenAmount.amount), 0n)
  return { address: s.address, usdc: `${raw / 1_000_000n}.${(raw % 1_000_000n).toString().padStart(6, '0')}` }
}

export async function runAgent(api: string): Promise<Run> {
  const steps: Step[] = []
  const add = (title: string, detail: string, tone: Step['tone']) => steps.push({ n: steps.length + 1, title, detail, tone })
  try {
    const client = new x402Client()
    client.setSpendControls({ maxAmountPerPayment: '$0.01' }) // the agent's budget guard
    client.register('solana:*', new ExactSvmScheme(await agentSigner()))

    // 1-2. Ask without paying. The API answers 402 and says how to pay.
    add(`GET ${new URL(api).pathname}`, `→ ${new URL(api).host}`, 'http')
    const first = await fetch(api)
    const terms = decode(first.headers.get('payment-required'))
    const a = terms?.accepts?.[0]
    if (first.status !== 402 || !a) throw new Error(`Expected 402, got ${first.status}`)
    add(`${first.status} Payment Required`, `PAYMENT-REQUIRED: ${a.scheme} · ${a.amount} base units (${Number(a.amount) / 1e6} USDC) · ${a.network} · payTo ${a.payTo}`, 'bug')

    // 3-4. Same request through the x402 wrapper: it signs a USDC transfer and retries.
    // We wrap fetch once more only to record the header it sends.
    let sent = ''
    const recording: typeof fetch = (input, init) => {
      const h = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined))
      sent = h.get('payment-signature') ?? sent
      return fetch(input, init)
    }
    const res = await wrapFetchWithPayment(recording, client)(api)
    const payload = decode(sent)
    add('Agent signs a USDC transferChecked', `partially signed transaction · fee payer = facilitator ${a.extra?.feePayer ?? ''}`, 'ai')
    add(`GET ${new URL(api).pathname} again`, `PAYMENT-SIGNATURE: ${clip(sent)}${payload ? `  (x402Version ${payload.x402Version})` : ''}`, 'http')

    if (res.status !== 200) {
      const why = decode(res.headers.get('payment-required'))
      throw new Error(why?.error ?? `API answered ${res.status}`)
    }
    // 5-6. The facilitator verified, the API answered, then it settled on Solana.
    const settle = decodePaymentResponseHeader(res.headers.get('payment-response') ?? '')
    add('Facilitator verified, API answered, then settled', `tx ${settle.transaction} on ${settle.network}`, 'chain')
    const body = (await res.json()) as { proverb: string }
    add('200 OK', body.proverb, 'ok')
    return { ok: true, steps, proverb: body.proverb, tx: settle.transaction }
  } catch (e) {
    return { ok: false, steps, error: e instanceof Error ? e.message : String(e) }
  }
}
