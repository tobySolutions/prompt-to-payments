// A paid API. Every GET /proverb costs $0.001 in USDC on Solana devnet.
// No accounts, no API keys: the caller pays inside the HTTP request.
import express from 'express'
import { paymentMiddleware, x402ResourceServer } from '@x402/express'
import { HTTPFacilitatorClient } from '@x402/core/server'
import { ExactSvmScheme } from '@x402/svm/exact/server'

const SOLANA_DEVNET = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1' // CAIP-2 id, not "solana-devnet"
const PAY_TO = process.env.PAY_TO! // a wallet that already has a devnet USDC token account

// The facilitator checks the signed payment and submits it. x402.org is free,
// needs no key, and is testnet only. It also pays the SOL fee.
const facilitator = new HTTPFacilitatorClient({ url: process.env.FACILITATOR_URL ?? 'https://x402.org/facilitator' })
const resourceServer = new x402ResourceServer(facilitator).register(SOLANA_DEVNET, new ExactSvmScheme())

const app = express()
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

app.listen(4021, () => console.log('Paid API on http://localhost:4021/proverb'))
