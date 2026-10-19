// A paid API. Every GET /proverb costs $0.001 in USDC on Solana devnet.
// No accounts, no API keys: the caller pays inside the HTTP request.
import express from 'express'
import { paymentMiddleware, x402ResourceServer } from '@x402/express'
import { HTTPFacilitatorClient } from '@x402/core/server'
import { ExactSvmScheme } from '@x402/svm/exact/server'
import { agentInfo, runAgent } from './run-agent.ts'

const SOLANA_DEVNET = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1' // CAIP-2 id, not "solana-devnet"
const PAY_TO = process.env.PAY_TO! // a wallet that already has a devnet USDC token account

// The facilitator checks the signed payment and submits it. x402.org is free,
// needs no key, and is testnet only. It also pays the SOL fee.
const facilitator = new HTTPFacilitatorClient({ url: process.env.FACILITATOR_URL ?? 'https://x402.org/facilitator' })
const resourceServer = new x402ResourceServer(facilitator).register(SOLANA_DEVNET, new ExactSvmScheme())

const app = express()
app.set('trust proxy', true) // behind Vercel's proxy, so URLs say https

// The demo page (Mama Put /agent) calls these from the browser.
const ALLOWED = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000,https://mamaput-lagos.vercel.app').split(',')
app.use((req, res, next) => {
  const origin = req.headers.origin ?? ''
  if (ALLOWED.includes(origin)) res.setHeader('access-control-allow-origin', origin)
  res.setHeader('access-control-expose-headers', 'payment-required, payment-response')
  // Chrome asks before a public site may call a server on your laptop.
  res.setHeader('access-control-allow-private-network', 'true')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// Runs the agent once against our own paid endpoint and returns every step.
// One run at a time, so a room full of clicks can't drain the agent's wallet.
let running = false
app.post('/run-agent', async (_req, res) => {
  if (running) return res.status(429).json({ ok: false, error: 'The agent is already running. Try again in a few seconds.' })
  running = true
  try {
    res.json(await runAgent(`${process.env.PUBLIC_URL ?? 'http://localhost:4021'}/proverb`))
  } finally {
    running = false
  }
})
app.get('/agent-info', async (_req, res) => {
  try { res.json(await agentInfo()) } catch (e) { res.status(500).json({ error: String(e) }) }
})
app.use(
  paymentMiddleware(
    {
      'GET /proverb': {
        accepts: [{ scheme: 'exact', price: '$0.001', network: SOLANA_DEVNET, payTo: PAY_TO }],
        description: 'One proverb, paid per request',
        mimeType: 'application/json',
      },
    },
    resourceServer,
  ),
)

const PROVERBS = [
  'However long the night, the dawn will break.',
  'Rain does not fall on one roof alone.',
  'When the roots of a tree begin to decay, it spreads death to the branches.',
  'A child who is not embraced by the village will burn it down to feel its warmth.',
]

app.get('/proverb', (_req, res) => {
  res.json({ proverb: PROVERBS[Math.floor(Math.random() * PROVERBS.length)] })
})

// Locally: a normal server. On Vercel: the app is the request handler (api/index.mjs).
if (!process.env.VERCEL) app.listen(4021, () => console.log('Paid API on http://localhost:4021/proverb'))
export default app
