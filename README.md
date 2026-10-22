# Prompt to Payments: Stablecoin Edition

Workshop material for Blockfest Africa 2026 (Lagos, 22 Oct 2026). Build a USDC
payment app on Solana with an AI assistant, review what it got wrong, then pay
an API per request with x402.

**Before you come:** Node 22.18+ (24 recommended), then

```bash
git clone https://github.com/tobySolutions/prompt-to-payments && cd prompt-to-payments/app && npm i
```

You also need a wallet (Phantom, Solflare or Backpack) on devnet with **two accounts**: one pays, the
other is your shop. Paying yourself fails on purpose (the merchant's balance goes up by 0).
Phantom: Settings -> Developer Settings -> Testnet Mode -> Solana Devnet.

| Folder | What it is |
|---|---|
| `deck/` | Slidev slides with speaker notes. `npm i && npm run dev` (23 slides). Fallback slides: `npm run backup` |
| `ai-first-draft/` | What an AI assistant produced from the workshop prompt, unedited. Read it, don't ship it. |
| `app/` | The reviewed checkout ("Mama Put"): Shop, a Kitchen screen that reads paid orders from Solana, and an Agent page that drives x402. Server-signed orders, memo per order, on-chain verification. |
| `x402/` | A paid API (`GET /proverb`, $0.001 in devnet USDC) and an agent that pays it. |
| `design/` | Pen.dev design (`blockfest-demo.pen`) and PNGs of every screen and state |
| `CHECKLIST.md` | The ship checklist from the last slides. |
| `deck/prompt-to-payments.pdf` / `.pptx` | The slides as PDF and PowerPoint (speaker notes included in the .pptx) |

**Live:** slides https://prompt-to-payments.vercel.app · shop https://mamaput-lagos.vercel.app (Shop, Kitchen, Agent · x402) · paid API https://mamaput-x402.vercel.app/proverb

Devnet only. Nothing here has been audited.

## The fix prompt

After the workshop, give this to your AI assistant to fix the app it wrote:

> Move the price to the server. Add POST /api/orders that returns an order id, price in base units, mint and merchant. Add the order id as an SPL memo. Add POST /api/verify that takes { token, signature }, fetches the transaction with getTransaction and checks it succeeded, the memo matches, and the merchant's USDC balance rose by the full price. Refuse a signature that was already used.

Then check the result against `CHECKLIST.md`, and ask it to write a script that attacks its own fix.

## Run the checkout

```bash
cd app
npm i
cp .env.example .env.local   # set MERCHANT_WALLET (a public address, not the wallet you pay from)
npm run dev                  # http://localhost:3000, needs Phantom/Solflare/Backpack on devnet
node scripts/e2e.ts          # with dev running: pays on devnet with ~/.config/solana/id.json, tries 8 attacks, checks the kitchen (13 checks)
```

Stack: `@solana/kit` 8.4, `@solana/kit-plugin-wallet` 0.20, `@solana/react` 8.4,
`@solana-program/token` 0.17, Next.js 16.3.8. `e2e.ts` reads `SOLANA_RPC_URL` / `SOLANA_WS_URL`
(default public devnet). Version 0 transactions so every
current wallet can sign them.

## Run x402

```bash
cd x402
npm i
cp .env.example .env         # PAY_TO must already have a devnet USDC token account
npm run server               # http://localhost:4021/proverb
npm run agent                # the agent's wallet needs devnet USDC, not SOL
```

Pay the hosted API without running a server (needs a Solana CLI keypair with devnet USDC; no CLI? use https://mamaput-lagos.vercel.app/agent):

```bash
cd x402 && npm i && cp .env.example .env
API_URL=https://mamaput-x402.vercel.app/proverb npm run agent
# PowerShell: $env:API_URL="https://mamaput-x402.vercel.app/proverb"; npm run agent
```

Create the merchant's USDC account first (the x402 Solana scheme doesn't let the payer create it):

```bash
spl-token create-account 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU --owner <PAY_TO> --url devnet
```

x402 lives in its own project because `@x402/svm` 2.28 is built on `@solana/kit` 5
and npm won't install it next to kit 8.

## Test money

- Devnet SOL: https://faucet.solana.com (2 requests per 8 hours)
- Devnet USDC: https://faucet.circle.com, network "Solana Devnet" (20 USDC every 2 hours, per address, per blockchain)
- Devnet USDC mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
