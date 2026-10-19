# Prompt to Payments: Stablecoin Edition

Workshop material for Blockfest Africa 2026 (Lagos, 22 Oct 2026). Build a USDC
payment app on Solana with an AI assistant, review what it got wrong, then pay
an API per request with x402.

| Folder | What it is |
|---|---|
| `deck/` | Slidev slides with speaker notes. `npm i && npm run dev` (22 slides). Fallback slides: `npm run backup` |
| `ai-first-draft/` | What an AI assistant produced from the workshop prompt, unedited. Read it, don't ship it. |
| `app/` | The reviewed checkout ("Mama Put"): server-set prices, memo per order, on-chain verification, replay guard. |
| `x402/` | A paid API (`GET /proverb`, $0.001 in devnet USDC) and an agent that pays it. |
| `CHECKLIST.md` | The ship checklist from the last slides. |
| `deck/prompt-to-payments.pdf` / `.pptx` | The slides as PDF and PowerPoint (speaker notes included in the .pptx) |

Devnet only. Nothing here has been audited.

## Run the checkout

```bash
cd app
npm i
cp .env.example .env.local   # set MERCHANT_WALLET (a public address)
npm run dev                  # http://localhost:3000, needs Phantom/Solflare/Backpack on devnet
node scripts/e2e.ts          # with dev running: pays on devnet with ~/.config/solana/id.json and tries 6 attacks
```

Stack: `@solana/kit` 8.4, `@solana/kit-plugin-wallet` 0.20, `@solana/react` 8.4,
`@solana-program/token` 0.17, Next.js 16.3. Version 0 transactions so every
current wallet can sign them.

## Run x402

```bash
cd x402
npm i
cp .env.example .env         # PAY_TO must already have a devnet USDC token account
npm run server               # http://localhost:4021/proverb
npm run agent                # the agent's wallet needs devnet USDC, not SOL
```

Create the merchant's USDC account first (the x402 Solana scheme doesn't let the payer create it):

```bash
spl-token create-account 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU --owner <PAY_TO> --url devnet
```

x402 lives in its own project because `@x402/svm` 2.28 is built on `@solana/kit` 5
and npm won't install it next to kit 8.

## Test money

- Devnet SOL: https://faucet.solana.com (2 requests per 8 hours)
- Devnet USDC: https://faucet.circle.com, network "Solana Devnet" (20 USDC per request, once per 2 hours)
- Devnet USDC mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
