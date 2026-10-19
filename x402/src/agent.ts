// An "agent" that pays per request with x402. No account, no API key, no card.
// It needs devnet USDC (faucet.circle.com) but no SOL: the facilitator pays the fee.
// usage: node scripts/agent.ts [path/to/keypair.json]
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { createKeyPairSignerFromBytes } from '@solana/kit'
import { wrapFetchWithPayment, x402Client, x402HTTPClient } from '@x402/fetch'
import { ExactSvmScheme } from '@x402/svm/exact/client'

const API = process.env.API_URL ?? 'http://localhost:4021/proverb'
const keyPath = process.argv[2] ?? `${homedir()}/.config/solana/id.json`
const signer = await createKeyPairSignerFromBytes(new Uint8Array(JSON.parse(readFileSync(keyPath, 'utf8'))))

const client = new x402Client()
client.setSpendControls({ maxAmountPerPayment: '$0.01' }) // the agent's budget guard
client.register('solana:*', new ExactSvmScheme(signer))

// 1. Without paying: the server answers 402 and says how to pay.
const free = await fetch(API)
const terms = JSON.parse(Buffer.from(free.headers.get('payment-required') ?? '', 'base64').toString() || '{}')
console.log('status', free.status)
console.dir(terms.accepts, { depth: null })

// 2. With x402: same request, the wrapper signs a USDC transfer and retries.
const paidFetch = wrapFetchWithPayment(fetch, client)
const res = await paidFetch(API)
console.log('status', res.status, await res.clone().json().catch(() => null))
if (res.status !== 200) {
  const why = JSON.parse(Buffer.from(res.headers.get('payment-required') ?? '', 'base64').toString() || '{}')
  console.log('not paid:', why.error)
  process.exit(1)
}
const receipt = new x402HTTPClient(client).getPaymentSettleResponse(name => res.headers.get(name))
console.dir(receipt, { depth: null })
