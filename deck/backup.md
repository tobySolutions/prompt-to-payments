---
theme: default
title: Prompt to Payments · Backup
info: Blockfest Africa 2026 technical workshop. Build a USDC payment app on Solana with an AI assistant, review what it got wrong, then pay an API per request with x402.
colorSchema: dark
routerMode: hash
fonts:
  provider: none
transition: slide-left
mdc: true
layout: section
tone: bug
---

# Backup

If the Wi-Fi or a live demo dies, teach from these.

<!--
Everything below was in the original 45-slide version: the bug-by-bug code slides, the full verify function, x402 code and sources. Run it with `npm run backup` (http://localhost:3031). Press `o` for the overview.
-->
---

# Who's talking

<div class="who-grid">
  <div v-click>
    <b class="fs-lg">Senior Technical Lead, Boh</b>
    <span class="ink-soft">Building the EKGO! platform</span>
  </div>
  <div v-click>
    <b class="fs-lg">Solana Students Africa</b>
    <span class="ink-soft">Co-established, backed by the Solana Foundation</span>
  </div>
  <div v-click>
    <b class="fs-lg">I ship with AI every day</b>
    <span class="ink-soft">And I review every line it writes that touches money</span>
  </div>
</div>

<style>
.who-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.4rem; margin-top: 2.5rem; }
.who-grid > div { border-top: 4px solid var(--chain); padding-top: 0.7rem; display: grid; gap: 0.4rem; }
.who-grid > div:last-child { border-color: var(--ai); }
</style>

<!--
Keep this under a minute. One line each.

The third column is the thesis of the session: AI makes me faster, and the speed is only safe because I know what to check. That is what you're here to get.
-->
---

# Why stablecoins, why here

<div class="stats">
  <div v-click>
    <b class="chain">#3</b>
    <span>Nigeria's rank worldwide for crypto adoption</span>
    <cite>Chainalysis Global Crypto Adoption Index, Sep 2026</cite>
  </div>
  <div v-click>
    <b class="ok">~43%</b>
    <span>Share of Sub-Saharan Africa's crypto volume that was stablecoins</span>
    <cite>Chainalysis, 2024 Sub-Saharan Africa report</cite>
  </div>
  <div v-click>
    <b class="ai">~$15.8B</b>
    <span>Stablecoins on Solana today. USDC is $7.0B of it</span>
    <cite>DefiLlama, 21 Oct 2026</cite>
  </div>
</div>

<style>
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.6rem; margin-top: 2.2rem; }
.stats > div { display: grid; gap: 0.5rem; align-content: start; }
.stats b { font-size: var(--fs-display); font-weight: 900; font-stretch: 70%; line-height: 0.9; }
.stats span { font-size: var(--fs-md); font-weight: 600; }
.stats cite { font-style: normal; font-size: var(--fs-xs); color: var(--muted); }
</style>

<!--
Sources, checked 19 to 21 Oct 2026:
- Chainalysis 2026 Global Crypto Adoption Index, published 23 Sep 2026: Nigeria #3 (Brazil #1, USA #2), South Africa #9. https://www.chainalysis.com/blog/2026-global-crypto-adoption-index/
- The 43% stablecoin share is from the 2024 Sub-Saharan Africa report (Jul 2023 to Jun 2024), NOT 2025. People often mis-date it. The same report: Nigeria took about 40% of the region's stablecoin inflows. https://www.chainalysis.com/blog/subsaharan-africa-crypto-adoption-2024/
- Chainalysis 2025: the region received over $205B on-chain, up about 52%; Nigeria over $92.1B. Use this if asked for a newer volume number.
- DefiLlama, 21 Oct 2026: ~$15.8B stablecoins on Solana, USDC $7.0B of it. (On 19 Oct it was 3rd chain after Ethereum and Tron.)

Say: "Nobody here needs convincing that dollars on a phone matter. Today is about building it properly."
-->
---

# One Wi-Fi, one IP, one rate limit

<div class="rl">
  <div v-click class="big"><b class="bug">100</b><span>requests per 10 s, <strong>per IP</strong>, on the public devnet RPC</span></div>
  <div v-click class="big"><b class="bug">40</b><span>per 10 s for any single method</span></div>
  <div v-click class="fix"><b class="ok">Use your own RPC key</b><span>Put it in <code>NEXT_PUBLIC_SOLANA_RPC_URL</code>. It's browser-visible, so it must be origin-restricted.</span></div>
</div>

<style>
.rl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.4rem; margin-top: 2rem; }
.rl > div { display: grid; gap: 0.5rem; align-content: start; }
.rl .big > b { font-size: var(--fs-display); font-weight: 900; font-stretch: 70%; line-height: 0.9; }
.rl span { font-size: var(--fs-md); }
.rl .fix > b { font-size: var(--fs-lg); }
</style>

<!--
Source: https://solana.com/docs/references/clusters (checked 19 Oct 2026). Public devnet limits per IP: 100 requests / 10 s, 40 / 10 s for a single RPC method, 40 concurrent connections.

A hotel room full of laptops shares one public IP. Fifty people polling balances will hit 429s inside a minute, and it will look like "Solana is down".

BEFORE THE DAY: get a devnet RPC key from any provider (Helius, QuickNode, Triton, Alchemy), restrict it to localhost origins, and put the URL on a card or the Wi-Fi sign. If you can't, tell people to expect 429 errors and retry.

This is also the first lesson: anything with NEXT_PUBLIC_ in Next.js is inlined into the browser bundle (Next.js docs, environment variables guide). Never put a secret there.
-->
---
clicks: 3
---

# Your wallet doesn't hold USDC

<TokenAccounts :step="$clicks" />

<!--
Click 1: your wallet. It holds SOL and it signs. That's it.

Click 2: your USDC lives in a separate account: a token account. Its address is derived from three things: the owner (your wallet), the mint (which token), and the token program. This "associated token account" is the one everyone uses by default.

These are real devnet addresses: wallet AMX5b8Rw…6DoC, its USDC account Ajb438Ky…BjVd (derived with `spl-token address`).

Click 3: there are two token programs. USDC and USDT use the original Token program. PYUSD and USDG use Token-2022 (read from the chain on 19 Oct 2026). Same wallet, PYUSD devnet mint, Token-2022: F99WMPju…QdmF. Code that assumes the classic program derives an account that doesn't exist.

Why it matters for payments: if the merchant has never held USDC, their USDC account doesn't exist yet. Somebody has to create it in the payment transaction, or the transfer fails.
-->
---

# Bug 1: the browser decides it's paid

```tsx {all|3|4|5,6|all}
// app/page.tsx, AI first draft (unedited)
const sig = await sendTransaction(tx, connection);
const latest = await connection.getLatestBlockhash();
await connection.confirmTransaction({ signature: sig, ...latest }, "confirmed");
setSignature(sig);
setStatus("paid");
```

<p v-click class="fs-md mt-6">There is no server. The kitchen never finds out. And <code class="bug">setStatus("paid")</code> is one line in DevTools.</p>

<!--
Lines are from ai-first-draft/app/page.tsx, unedited.

Walk it: send, confirm, then set React state to "paid". The success message is a React state change in the customer's own browser.

Two problems:
1. Nobody else knows. The merchant has no record of which order was paid. "Your jollof is on the way" is a lie the page tells itself.
2. The customer controls the browser. Open React DevTools, flip the state, get the success screen without paying. If a real system ever trusts that screen (a screenshot shown at the counter, a webhook the client fires), it's free food.

Solana's own payments docs say it plainly: "Always verify server-side by querying the RPC." (https://solana.com/docs/payments/accept-payments/verification-tools)

We'll come back to lines 3 and 4 as bug 4.
-->
---

# Bug 2: the price lives in the browser

````md magic-move {lines: true}
```tsx
// AI first draft: the client decides how much
const AMOUNT = 2_500_000; // 2.50 USDC

createTransferCheckedInstruction(from, USDC_MINT, to, publicKey, AMOUNT, DECIMALS)
```

```ts
// Reviewed: the server decides, the client asks
export const MENU = {
  jollof: { name: 'Jollof rice + chicken', price: 2_500_000n },
  suya: { name: 'Suya, one stick', price: 1_000_000n },
} as const

// POST /api/orders { item: 'jollof' }  →  { id, amount: '2500000', mint, recipient }
```
````

<p v-click class="fs-md mt-5">Then the server checks the chain says the merchant got <b>at least</b> that amount.</p>

<!--
Click to morph the code.

In the first draft the amount is a constant in client code. Anyone can change it to 1 base unit, pay a millionth of a dollar, and the page still says "Payment successful". Since the page itself is the only judge (bug 1), nothing catches it.

In the reviewed version prices live on the server as bigint base units (app/lib/config.ts). The client sends only an item id. The server creates the order with the price, and at verify time it compares what actually moved on-chain with what it asked for.

Our test suite tries this exact attack: create a 2.50 order, then pay 0.50 for it. The server answers 402 "Merchant received 500000 base units, this order costs 2500000".
-->
---

# Bug 3: which jollof is this?

<div class="two">
  <div v-click>
    <Who by="ai" />
    <p class="fs-md">Two customers each pay 2.50 USDC to the same wallet, ten seconds apart.</p>
    <p class="fs-md bug">Which payment is whose?</p>
  </div>
  <div v-click>
    <Who by="fixed" />

```ts
getAddMemoInstruction({ memo: order.memo }) // "mamaput:<order>:<item>"
```

```ts
// app/lib/verify.ts, simplified
const memoOk = ixs.some(ix =>
  ix.program === 'spl-memo' && ix.parsed === memoFor(order))
```
  </div>
</div>

<style>
.two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; margin-top: 1rem; align-items: start; }
.two p { margin: 0.8rem 0 0; }
</style>

<!--
Without an order id on the payment you can only match by amount and time, and that breaks the moment two people buy the same thing.

The fix: put the server's order id in an SPL Memo instruction. On verify, the server only accepts a transaction with exactly one order memo, equal to this order's (app/lib/verify.ts check 3). The real code also refuses a payment that carries memos for several orders, so one payment can't mark three orders paid.

The other standard approach is a Solana Pay "reference": a random public key added as a read-only account on the transfer, which you can look up with getSignaturesForAddress. Either works.

Memos are public forever. Use an opaque id, never a name or phone number.
-->
---

# The same payment, twice

<div class="replay">
  <Receipt v-click title="ORDER #A1" :lines="[['signature', '3xuC…mF5K'], ['verify', 'paid', 'ok']]" />
  <Receipt v-click title="ORDER #B7" :lines="[['signature', '3xuC…mF5K', 'bug'], ['verify', '?', 'bug']]" />
  <div v-click class="rule">
    <p class="fs-md">Each signature pays for <b>one</b> order, once.</p>
    <p class="ink-soft">Memo check + a used-signature record. In production: a <code>UNIQUE</code> column.</p>
  </div>
</div>

<style>
.replay { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.1fr); gap: 1.4rem; align-items: center; margin-top: 1.2rem; }
</style>

<!--
Replay: one real payment, submitted as proof for a second order. If your verify endpoint only asks "is this a successful USDC transfer to me for 2.50?", the same signature unlocks every order.

Two defences in the reference app:
1. The memo must equal this order's id, so a payment for #A1 can't verify #B7.
2. claimSignature() (app/lib/orders.ts) remembers which order each signature paid; the verify route returns 409 if the same signature is offered for a different order. In production that's a UNIQUE constraint on the signature column, inside the same database transaction that marks the order paid.

The signature 3xuC…mF5K is a real devnet transaction from our 19 Oct 2026 test run. It used a 6-decimal test token standing in for USDC and an older UUID memo.
-->
---

# The whole check, in four rules

```ts {1-4|6|8-9|11-14|all}{maxHeight:'420px'}
// app/lib/verify.ts, simplified
const tx = await rpc
  .getTransaction(sig, { commitment: 'confirmed', encoding: 'jsonParsed', maxSupportedTransactionVersion: 1 })
  .send()

if (tx.meta?.err) return fail('Transaction failed on-chain')

const ours = memosOf(tx).filter(isOrderMemo) // every "mamaput:" memo
if (ours.length !== 1 || ours[0] !== memoFor(order)) return fail('Wrong memo')

// Merchant's balance of THIS mint must rise by the full price (post minus pre)
const got = received(tx, order.mint, order.recipient)
if (got < order.amount) return fail(`Merchant received ${got} base units`)
return ok()
```

<!--
Simplified from app/lib/verify.ts so it fits (the real file returns objects and has fuller error messages). Each click is one rule.

1. Fetch it ourselves, at "confirmed", and allow v1 transactions. Without maxSupportedTransactionVersion: 1, a v1 transaction makes getTransaction error. For big amounts, use "finalized"; after Alpenglow they're the same thing anyway.
2. It succeeded. A failed transaction still has a signature, and AI code often forgets that.
3. Exactly one order memo, and it equals this order's. A payment naming several orders is refused.
   Consequence: paying yourself fails. If payer and merchant are the same wallet, post minus pre is 0.
4. The merchant's balance of THIS mint went up by at least the price. Checking pre/post token balances instead of instruction arguments works for both token programs, and catches transfers made inside another program. Checking the mint matters: anyone can create a token called "USDC".

Then the replay guard on top (previous slide).
-->
---

# Does it actually work? Attack it.

<div class="proof">
  <Receipt title="node scripts/e2e.ts · devnet" stamp="ALL PASS" :lines="[
    ['real payment verifies', 'PASS', 'ok'],
    ['same signature, other order', 'refused', 'ok'],
    ['made-up signature', 'refused', 'ok'],
    ['client sends its own price', 'ignored', 'ok'],
    ['unknown menu item', 'refused', 'ok'],
    ['pay 0.50 for a 2.50 order', 'refused', 'ok'],
    ['one payment, three order memos', 'refused', 'ok'],
  ]" />
  <div>
    <p v-click class="fs-lg">Real devnet transactions (a 6-decimal test token standing in for USDC).</p>
    <p v-click class="fs-lg">Same routes the browser uses.</p>
    <p v-click class="fs-lg ok">Write the attack, then the fix.</p>
  </div>
</div>

<style>
.proof { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 2.4rem; align-items: center; margin-top: 0.8rem; }
</style>

<!--
`node scripts/e2e.ts` in the app folder, with `npm run dev` running, against devnet: 13 checks in app/scripts/e2e.ts, ALL PASS on 21 Oct 2026, including an edited signed order, one payment carrying three order memos, and the kitchen view. Sample transaction from the 19 Oct run (a 6-decimal test token standing in for USDC, older UUID memo): https://explorer.solana.com/tx/3xuCXcRpqA5RJf9EGbz4qinTMN5toWXXdBHi8zUqiU5zYD5V2wz3BwnfNi3B2wzCLFyYuRLAUKMcBK3UdNxSmF5K?cluster=devnet

The script uses a CLI keypair instead of a browser wallet, so it exercises the same instruction builder (lib/pay.ts) and the same API routes.

The habit to teach: ask your AI to write the attacks first. "Write a script that tries to get this order marked paid without paying the full price." It's very good at that, and it's how you find out whether its own fix holds.
-->
---

# Bug 4: confirming with the wrong blockhash

```tsx {1|2|3|all}
const sig = await sendTransaction(tx, connection);        // wallet adapter adds a blockhash here
const latest = await connection.getLatestBlockhash();      // ...then the AI fetches a NEWER one
await connection.confirmTransaction({ signature: sig, ...latest }, "confirmed");
```

<div class="two-col mt-6">
  <p v-click class="fs-md">It waits on a deadline the transaction doesn't have. If it's dropped, the page spins past the real expiry.</p>
  <p v-click class="fs-md ok">Fix: one client that builds, signs, sends and confirms with the same lifetime.</p>
</div>

<style>
.two-col { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; }
</style>

<!--
Subtle one, from ai-first-draft/app/page.tsx. Not a security hole, but a correctness bug that shows up as "my payment is stuck".

A transaction is valid only until its blockhash expires: 150 blocks, which is ~30 s on mainnet since the 200 ms slot change. To know when to give up waiting, you must confirm against the SAME blockhash the transaction was built with (its lastValidBlockHeight).

The draft lets the wallet adapter put one blockhash in, then fetches a later one and confirms against that. If the transaction is dropped, the code keeps waiting past the real expiry, and the user may pay again: a double charge risk.

The reviewed app uses @solana/kit's client.sendTransaction, which plans, signs, sends and confirms with one lifetime and throws a clear BLOCK_HEIGHT_EXCEEDED if it expires. solana.com/docs/payments/production-readiness says "Store the lastValidBlockHeight returned by getLatestBlockhash". Resubmitting the same signed transaction is safe; re-signing with a new blockhash makes a new transaction, so check the old signature's status first.
-->
---

# Bug 5: one token program assumed

<div class="tp">
  <div v-click>
    <Who by="ai" />

```ts
getAssociatedTokenAddressSync(USDC_MINT, publicKey)
// defaults to the classic Token program
```
  </div>
  <div v-click>
    <Who by="fixed" />

```ts
const mint = await fetchEncodedAccount(rpc, USDC_MINT)
// mint.programAddress → Token or Token-2022
```
  </div>
</div>

<p v-click class="fs-md mt-5">Fine for USDC. Wrong for <b class="ai">PYUSD</b> and <b class="ai">USDG</b>, which are Token-2022.</p>

<style>
.tp { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; margin-top: 1rem; }
</style>

<!--
The draft works today because USDC is on the classic Token program. The day the business says "also accept PYUSD", it derives the wrong token account and every payment fails (see the backup slide "Your wallet doesn't hold USDC": the same wallet's PYUSD account is a different address).

Read from the chain on 19 Oct 2026: PYUSD (mainnet 2b1kV6Dk…, devnet CXk2AMBf…) and USDG (2u1tszSe…) are Token-2022, 6 decimals. They carry a transfer-fee config (0 today), a transfer hook (switched off today) and a permanent delegate. The issuer can switch the fee or hook on later, and a permanent delegate can move tokens out of any holder's account. Know what a mint can do before you accept it.

The reviewed server reads the mint's owner program and its decimals from the chain (app/app/api/orders/route.ts) and refuses mints that aren't owned by one of the two token programs. Even @solana/kit's own transferToATA helper defaults to the classic program unless you pass tokenProgram.
-->
---

# Bug 6: yesterday's stack

<div class="stack-cmp">
  <div v-click>
    <Who by="ai" />
    <ul>
      <li><code>@solana/web3.js</code> v1</li>
      <li><code>@solana/wallet-adapter-*</code></li>
      <li>Next.js 15</li>
    </ul>
  </div>
  <div v-click>
    <Who by="fixed" />
    <ul>
      <li><code>@solana/kit</code> 8</li>
      <li><code>@solana/kit-plugin-wallet</code> + <code>@solana/react</code></li>
      <li>Next.js 16</li>
    </ul>
  </div>
</div>

<Callout v-click tone="warn" title="Not broken today. Debt from day one." class="mt-6">The Solana Foundation's dev skill for AI agents, since Jul 2026: don't use framework-kit or wallet-adapter for new work.</Callout>

<style>
.stack-cmp { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; margin-top: 0.8rem; }
.stack-cmp li { font-size: var(--fs-md) !important; }
</style>

<!--
Fairness: web3.js v1 code still runs. This is about what you start a new project on.

Facts (19 Oct 2026):
- github.com/solana-foundation/solana-dev-skill, references/frontend.md (line present since commit 43233c0, 14 Jul 2026; re-checked in v2.7.0 on 19 Oct): "Do not use @solana/client / @solana/react-hooks (framework-kit) for new work — that stack is stale... Do not use @solana/wallet-adapter-* for new apps either; Wallet Standard discovery covers modern wallets."
- npm: @solana/web3.js "latest" moved to 3.1.1 on 19 Oct 2026, so `npm i @solana/web3.js` now installs v3, a different API rebuilt on Kit. AI-written v1 code must pin ^1.x (the draft pinned ^1.98.0 and got 1.99.0).
- web3.js v1 can read v1 transactions but can't build them.
- Next.js 16.4 is current stable (16.4.2); the draft pinned ^15.1 (got 15.5.28); the reference app is on 16.3.8.

Funny but true: while building the reference app for this talk, I first used framework-kit because my own local copy of that AI skill was months stale. I found out from the research, and I switched. The AI tools need reviewing too.

Fix for your own setup: install or update the official skill so your assistant gets current advice: https://github.com/solana-foundation/solana-dev-skill
-->
---

# Prompt like a reviewer

<PromptBox :typed="false" who="You, second pass" text="Act as an attacker. List every way a customer could get this order marked paid without paying the full price to the right wallet. Then write a script that tries each one against my API, and fix the code until they all fail." />

<p v-click class="ink-soft mt-6 fs-md">Better prompts help. They don't replace reading the code.</p>

<!--
A second prompt that works well in practice: make the AI attack its own output, and turn the attacks into a test script. That's how our e2e.ts came about.

Other prompt habits worth sharing:
- Give it the current facts: "use @solana/kit 8 and @solana/kit-plugin-wallet; Solana slots are 200 ms; rent is lower; use maxSupportedTransactionVersion: 1".
- Install the official Solana dev skill (or paste its docs) so it stops guessing.
- Ask it to cite where each address and package name comes from.

But be honest with the room: a better prompt raises the floor, it doesn't make review optional. The AI wrote a confident wrong address for me on the same day I wrote this slide.
-->
---

# An agent wants to call your API

<div class="agent">
  <div v-click><b class="bug">Sign up</b><span>needs an email and a human</span></div>
  <div v-click><b class="bug">Add a card</b><span>needs KYC and a billing address</span></div>
  <div v-click><b class="bug">Monthly plan</b><span>for one call worth $0.001</span></div>
  <div v-click><b class="bug">API key</b><span>one more secret to leak</span></div>
</div>

<p v-click class="fs-lg mt-8" style="font-weight:800">What if the request carried the payment?</p>

<style>
.agent { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; margin-top: 1.6rem; }
.agent > div { border-top: 4px solid var(--bug); padding-top: 0.6rem; display: grid; gap: 0.3rem; }
.agent b { font-size: var(--fs-lg); }
.agent span { font-size: var(--fs-sm); color: var(--text-2); }
</style>

<!--
Card rails have a fixed cost per transaction, so sub-cent payments don't work on them. That's why APIs sell monthly plans and API keys instead of charging per request.

An AI agent can't easily do any of these four steps. It can hold a wallet and sign.
-->
---

# The real 402 from our API

```json {all|6|7|8|9,10|13|all}
{
  "x402Version": 2,
  "error": "Payment required",
  "resource": { "url": "http://localhost:4021/proverb", "description": "One proverb, paid per request" },
  "accepts": [{
    "scheme": "exact",
    "network": "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
    "amount": "1000",
    "asset": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    "payTo": "BzMDFqQe2D1QnXkUiponJCasNiCZn8zEtW4VVehXLikf",
    "maxTimeoutSeconds": 300,
    "extra": {
      "feePayer": "CKPKJWNdJEqa81x7CkZ14BVPiY6y16Sxs7owznqtWYp5"
    }
  }]
}
```

<!--
Decoded from the PAYMENT-REQUIRED header our x402 server returned on 19 Oct 2026 (`curl -D - localhost:4021/proverb`, then base64 -d). Nothing edited.

Walk the clicks:
- scheme "exact": pay exactly this amount.
- network: a CAIP-2 id for Solana devnet. Not "solana-devnet"; that was the v1 name.
- amount "1000": base units, a string. 1000 / 10^6 = $0.001.
- asset: the devnet USDC mint. payTo: the merchant wallet.
- extra.feePayer: the x402.org facilitator's address. It pays the SOL fee.
-->
---

# The server: one middleware

```ts {all|2-4|6|8-9|11-16|18|all}{maxHeight:'420px'}
// x402/src/server.ts
import { paymentMiddleware, x402ResourceServer } from '@x402/express'
import { HTTPFacilitatorClient } from '@x402/core/server'
import { ExactSvmScheme } from '@x402/svm/exact/server'

const SOLANA_DEVNET = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1'

const facilitator = new HTTPFacilitatorClient({ url: 'https://x402.org/facilitator' })
const resourceServer = new x402ResourceServer(facilitator).register(SOLANA_DEVNET, new ExactSvmScheme())

app.use(paymentMiddleware({
  'GET /proverb': {
    accepts: [{ scheme: 'exact', price: '$0.001', network: SOLANA_DEVNET, payTo: PAY_TO }],
    description: 'One proverb, paid per request',
  },
}, resourceServer))

app.get('/proverb', (_req, res) => res.json({ proverb: pick(PROVERBS) }))
```

<!--
From x402/src/server.ts in the repo, lightly trimmed. Packages: @x402/core, @x402/svm, @x402/express, all 2.28.0 (published 29 Sep 2026). Based on the official example at github.com/x402-foundation/x402/examples/typescript/servers/express.

- x402.org/facilitator: free, no API key, testnet only, and it's the SDK's default. Backups that also do Solana devnet with no key: PayAI (facilitator.payai.network) and Dexter (x402.dexter.cash). Coinbase CDP's facilitator needs an API key. All checked live on 19 Oct 2026 via their /supported endpoints.
- The route handler is ordinary Express. It only runs after a valid payment.
-->
---

# The agent: wrap fetch

```ts {all|2,4|3|6|8-9|all}
// x402/src/run-agent.ts, trimmed
const client = new x402Client()
client.setSpendControls({ maxAmountPerPayment: '$0.01' })
client.register('solana:*', new ExactSvmScheme(signer))

const paidFetch = wrapFetchWithPayment(fetch, client)

const res = await paidFetch('http://localhost:4021/proverb')
console.log(await res.json()) // { proverb: 'Rain does not fall on one roof alone.' }
```

<p v-click class="fs-md mt-5">The budget line matters. <b class="ai">An agent with a wallet and no limit is a liability.</b></p>

<!--
Trimmed from x402/src/run-agent.ts (x402/src/agent.ts is the CLI wrapper). `signer` is a @solana/kit KeyPairSigner loaded from a devnet keypair file. The spend limit is set before the scheme is registered, as in the real code.

wrapFetchWithPayment does the dance from the sequence slide: see the 402, pick a matching option, sign, retry with PAYMENT-SIGNATURE.

setSpendControls comes straight from the official fetch example. Ask the room what happens without it if a malicious API returns a 402 for $500. With a budget guard the client refuses to sign.

Live option: `npm run server` and `npm run agent` in x402/ if the Wi-Fi allows. The agent wallet needs devnet USDC (not SOL). As of 19 Oct the server side and the 402 were tested; the paid retry was waiting on faucet USDC (see README).
-->
---

# Trust the facilitator, carefully

<div class="fac">
  <p v-click class="fs-xl" style="font-weight:800">15 of 15</p>
  <p v-click class="fs-md ink-soft">real-world x402 facilitators tested broke at least one of eight security rules</p>
  <p v-click class="fs-sm muted">"When HTTP 402 Meets the Blockchain: Risks on Emerging x402 Payments" · arXiv 2607.19545 · USENIX Security 2026</p>
  <p v-click class="fs-md mt-4">Pin the SDK version. Fail closed if the facilitator errors. Settle before you hand over anything valuable.</p>
</div>

<style>
.fac { display: grid; gap: 0.5rem; margin-top: 1.6rem; max-width: 42rem; }
.fac p { margin: 0 !important; }
</style>

<!--
The facilitator verifies and submits payments for many merchants at once, so a bug in one facilitator hits all of them. The paper (Wang, Yang, Chen, Ji, Payer; arXiv 2607.19545, 21 Jul 2026, USENIX Security 2026) defines eight security rules for facilitators and found violations in all 15 major facilitators it tested. Attack classes include getting goods without paying ("Free Shopping"), asset theft, service denial and gas abuse. Be fair: the authors disclosed responsibly and the affected parties adopted mitigations, including changes by Coinbase. The point isn't "x402 is broken", it's "a facilitator is shared infrastructure you are trusting".

There's also a real advisory: GHSA-qr2g-p6q7-w82m (high, 6 Mar 2026) affected Solana facilitators, fixed in @x402/svm 2.6.0. Our app uses 2.28.0.

Same lesson as part 4: the default flow runs your handler before money settles. For cheap data that's fine. For anything valuable, use the "upfront" flow or check settlement before releasing it.
-->
---

# Two speeds, one ecosystem

<div class="skew">
  <div v-click><b class="chain">Checkout app</b><span><code>@solana/kit</code> 8.4</span></div>
  <div v-click><b class="http">x402 service</b><span><code>@x402/svm</code> 2.28 → <code>@solana/kit</code> 5</span></div>
  <div v-click class="wide-row"><b class="bug">Same project?</b><span><code>npm ERR! ERESOLVE could not resolve</code></span></div>
  <div v-click class="wide-row"><b class="ok">Our call</b><span>Two small services. Don't force it with <code>--legacy-peer-deps</code>.</span></div>
</div>

<style>
.skew { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.2rem 2rem; margin-top: 1.6rem; }
.skew > div { display: grid; gap: 0.3rem; border-top: 4px solid var(--line); padding-top: 0.6rem; }
.skew b { font-size: var(--fs-lg); }
.skew span { font-size: var(--fs-md); color: var(--text-2); }
.skew .wide-row { grid-column: span 1; }
</style>

<!--
CUTTABLE.

What happened while building this (19 Oct 2026): @x402/svm 2.28.0 depends on @solana-program/token ^0.9 and compute-budget ^0.11, which require @solana/kit ^5. The checkout app is on kit 8.4 per current Solana guidance. npm refuses to install both in one project (ERESOLVE).

An AI assistant's usual fix is `--legacy-peer-deps` or `--force`, which installs anyway and leaves you with two copies of kit whose types and objects don't match at runtime. We split x402 into its own service instead. It's cleaner anyway: the paid API is a different product from the checkout.

The point: libraries in one ecosystem move at different speeds. Read the error. Don't let the assistant silence it.
-->
---

# Who's behind x402

<div class="adopt">
  <div v-click>
    <b class="http">Apr 2026</b>
    <span>Linux Foundation launches the x402 Foundation. Initially developed by Coinbase, Cloudflare and Stripe.</span>
  </div>
  <div v-click>
    <b class="http">Jul 2026</b>
    <span>40 members. Premier: Solana Foundation, Visa, Google, Mastercard, AWS, Stripe, Circle and more.</span>
  </div>
  <div v-click>
    <b class="chain">76%</b>
    <span>of x402 transactions run on Solana, 22 Aug to 19 Sep 2026: 23.2M. solana.com, Sep 2026 payments recap.</span>
  </div>
</div>

<style>
.adopt { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.6rem; margin-top: 1.8rem; }
.adopt > div { display: grid; gap: 0.5rem; align-content: start; }
.adopt b { font-size: var(--fs-2xl); font-weight: 900; font-stretch: 75%; }
.adopt span { font-size: var(--fs-base); color: var(--text-2); }
</style>

<!--
Sources (checked 19 Oct 2026):
- Linux Foundation press release, 2 Apr 2026: "Linux Foundation is Launching the x402 Foundation and Welcoming the Contribution of the x402 Protocol". "The x402 protocol, created by Coinbase... The x402 Foundation... initially developed by Coinbase, Cloudflare, and Stripe". The Solana Foundation quote in it says Solana is "driving nearly 65% of x402 transaction volume this year".
- 14 Jul 2026, operational launch: "40 organizations have joined as members". Premier members include Adyen, AWS, American Express, Circle, Cloudflare, Coinbase, Fiserv, Google, Mastercard, Monad Foundation, MoonPay, Ripple, Shopify, Solana Foundation, Stellar Development Foundation, Stripe, Visa.
- solana.com, Sep 2026 payments recap: Solana handled 76% of x402 transactions, 23.2M in four weeks (22 Aug to 19 Sep 2026); the next-largest network did 3.39M. Present it as Solana's own figure, not an independent one.

Do NOT quote the "165M transactions / $50M volume" figures floating around; no primary source was found.
-->
---

# Where this is going

<div class="going" style="display:grid; gap:1.2rem; margin-top:2rem">
  <p v-click class="fs-lg">Payments are turning into <b class="http">an HTTP header</b>.</p>
  <p v-click class="fs-lg">Customers are turning into <b class="ai">programs with wallets</b>.</p>
  <p v-click class="fs-lg">Writing the code is getting cheap. <b class="ok">Knowing it's right isn't.</b></p>
</div>

<!--
Close the loop on the session promise. AI made the build part ten minutes long. Everything we spent the other hour on is judgment: who decides it's paid, where the price lives, which mint, which version of the spec.

That's the skill that stays valuable as the tools get better. And for builders in Lagos, Nairobi and Accra, where stablecoins already move real money, it matters more, not less.
-->
