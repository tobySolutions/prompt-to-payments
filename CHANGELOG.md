# Changelog

## 22 Oct 2026 (talk day, all on `main` and deployed)

**Format:** a 23-minute, demo-led talk. Every demo is pre-built and hosted; the audience follows on their phones.

**Shipped**
- The 21 Oct fixes merged to `main` and deployed to all three sites.
- The AI first draft is now hosted, unedited: https://mamaput-first-draft.vercel.app
- Deck retimed for 23 minutes: 7 slides hidden (`hide: true`, still in `slides.md`), no timers, a "follow along on your phone" slide, the draft's code shown on the slide, and "I attacked it" with the live kitchen. Speaker notes rewritten as TIME / SAY / DO / IF IT BREAKS for every visible slide.
- Shop: Solflare and Phantom are listed first among detected wallets.
- README: "The fix prompt" section.

**Verified on 22 Oct**
- `BASE=https://mamaput-lagos.vercel.app node app/scripts/e2e.ts`: 13/13 against the live shop with Circle devnet USDC.
- A full paid x402 run from the hosted agent page (402 → signed payment → settled on devnet → 200 with a proverb).
- A real payment on the AI first draft with Solflare. It landed in the merchant's account with no memo, which is why the fixed kitchen can't tell whose order it was.

**Known**
- The first x402 run after a quiet spell can time out while the server reaches the facilitator. Press Run again.
- The kitchen's "Refused" list is kept in server memory and resets on every deploy. Orders come from the chain.

## 21 Oct 2026 (audit fixes, merged to `main` on 22 Oct)

**Code**
- Checkout: a payment must carry exactly one order memo; one payment naming several orders is refused (and ignored by the kitchen).
- `/api/verify`: remembers which order each signature paid, 409 for a different order; non-string input is a 400; RPC failure is a 503 "try again".
- Shop page retries on 503. Agent page can't crash on an error body without steps.
- x402: 429/503 bodies carry `steps: []`; `RUN_AGENT_ENABLED=false` switches off `POST /run-agent`; exits with a clear error when `PAY_TO` is empty.
- `e2e.ts`: multi-memo, non-string-token and kitchen checks (13 checks); reads `SOLANA_RPC_URL` / `SOLANA_WS_URL`.
- `engines.node >=22.18` in `app/` and `x402/`; `NEXT_PUBLIC_X402_URL` documented in `app/.env.example`.

**Slides (facts re-checked 21 Oct)**
- Alpenglow live on mainnet since epoch 1064 (21 Oct ~13:36 UTC); 150 ms is the finality target, not a measurement.
- `@solana/web3.js` "latest" is 3.1.1 since 19 Oct: `npm i @solana/web3.js` installs v3. Next.js 16.4.2 is current stable.
- Slot time ~0.21 s; DefiLlama ~$15.8B stablecoins on Solana, USDC $7.0B; x402 76% figure cited to solana.com's Sep 2026 payments recap.
- Corrected: about half of the 90 minutes is hands-on (was "about 70"); Circle faucet limit wording; x402 spec reference; production-readiness quote; dev-skill quote; Token-2022 typo story; e2e counts; the sample transaction used a test token standing in for USDC.
- Code snippets labelled "simplified" where they are; routes match the app (`POST /api/verify { token, signature }`).
- Attendee path: two wallet accounts (paying yourself fails), honest faucet fallback (no pre-funded wallets promised), Node 22.18+, commands for paying the hosted x402 API, kitchen on localhost, a "before you come" install line.
- Personal presenter notes removed (speaker notes ship in the built JS).

**Not verified yet**
- A paid x402 USDC run end to end.
- The shop and the AI first draft clicked through with a real Phantom wallet.
- Deploys: nothing on this branch has been deployed.

## 19 Oct 2026

**Slides** (`deck/`, live at https://prompt-to-payments.vercel.app)
- 23-slide main deck (Build → Break → Fix → x402, about half of the 90 minutes hands-on; corrected on 21 Oct) and a separate 23-slide backup deck (`/backup/`).
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
