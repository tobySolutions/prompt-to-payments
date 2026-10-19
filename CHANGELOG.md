# Changelog

## 19 Oct 2026

**Slides** (`deck/`, live at https://prompt-to-payments.vercel.app)
- 23-slide main deck (Build → Break → Fix → x402, about 70 of 90 minutes hands-on) and a separate 23-slide backup deck (`/backup/`).
- Facts re-checked against primary sources on 19 Oct (solana.com upgrade pages, the chain, x402-foundation specs, RFC 2068/9110, Chainalysis, DefiLlama). Sources are in the speaker notes.
- Corrected: the Solana dev skill's "don't use framework-kit or wallet-adapter" line dates from 14 Jul 2026, not 16 Oct.
- Exports: `prompt-to-payments.pdf`, `prompt-to-payments.pptx` (image slides, speaker notes included), `prompt-to-payments-backup.pdf`.

**Demo** (`app/`, live at https://mamaput-lagos.vercel.app)
- Shop, Kitchen (paid orders read from Solana) and Agent (x402) pages, designed in `design/blockfest-demo.pen`.
- Server-signed orders, memo `mamaput:<order>:<item>`, on-chain verification. `node scripts/e2e.ts`: 10/10 on devnet.

**x402** (`x402/`, live at https://mamaput-x402.vercel.app/proverb)
- v2 headers, `exact` scheme on Solana devnet, x402.org facilitator. `POST /run-agent` records each step for the Agent page.

## Not verified yet
- A paid x402 run: the demo agent wallet has no devnet USDC.
- The shop and the AI first draft clicked through with a real Phantom wallet.
