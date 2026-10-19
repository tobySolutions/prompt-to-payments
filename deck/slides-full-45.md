---
theme: default
title: Prompt to Payments · Stablecoin Edition
info: Blockfest Africa 2026 technical workshop. Build a USDC payment app on Solana with an AI assistant, review what it got wrong, then pay an API per request with x402.
colorSchema: dark
routerMode: hash
fonts:
  provider: none
transition: slide-left
mdc: true
layout: cover
---

# Prompt <span class="to">to</span> Payments

<p class="mono fs-sm" style="margin-top:1.2rem; color: var(--ai)">Stablecoin Edition · Solana</p>
<p>Tobiloba Adedeji <span class="muted">· tobySolutions</span></p>
<p class="muted fs-sm">Blockfest Africa · 22 Oct 2026 · Lagos</p>

::right::

<Receipt title="MAMA PUT · LEKKI" stamp="PAID" :lines="[
  ['Jollof rice + chicken', '2.50 USDC'],
  ['Network', 'Solana devnet', 'chain'],
  ['Fee', '0.000005 SOL'],
  ['Checked by', 'the server', 'ok'],
]" />

<!--
Timing: 90 minutes total. Walk-in music, this slide up while people find seats and plug in.

Say: "By the end of this session you'll have built a stablecoin payment app with an AI assistant, and you'll know exactly why the first version the AI gives you is not safe to ship. Then we make an API that charges per request, in USDC, with no checkout page."

Ask people to open their laptops now and join the Wi-Fi. Setup is the first thing we do.
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

TOBI: confirm these titles before the 22nd. Your Solana Foundation SDP role ends on the 21st, so it is deliberately not listed as current.
-->

---

# Today

<div class="plan">
  <div v-click><b>1</b><span>Set up</span><em>10 min</em></div>
  <div v-click><b>2</b><span>How a USDC payment works</span><em>10 min</em></div>
  <div v-click><b>3</b><span>Prompt it</span><em>10 min</em></div>
  <div v-click class="rev"><b>4</b><span>Review what the AI wrote</span><em>30 min</em></div>
  <div v-click class="x"><b>5</b><span>x402: APIs that charge per request</span><em>20 min</em></div>
  <div v-click class="ship"><b>6</b><span>Ship checklist</span><em>5 min</em></div>
</div>

<style>
.plan { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 0.8rem; margin-top: 2.5rem; }
.plan > div { border-top: 6px solid var(--chain); padding-top: 0.6rem; display: grid; gap: 0.3rem; align-content: start; }
.plan b { font-size: var(--fs-3xl); font-weight: 900; font-stretch: 62%; color: var(--chain); line-height: 1; }
.plan span { font-size: var(--fs-base); font-weight: 700; }
.plan em { font-style: normal; font-family: var(--mono); font-size: var(--fs-xs); color: var(--muted); }
.plan .rev { border-color: var(--bug); } .plan .rev b { color: var(--bug); }
.plan .x { border-color: var(--http); } .plan .x b { color: var(--http); }
.plan .ship { border-color: var(--ok); } .plan .ship b { color: var(--ok); }
</style>

<!--
Point at part 4. "The review is the main event. Building with AI takes ten minutes now. Knowing what's wrong with what it built is the skill."

That leaves about 5 minutes of Q&A at the end. If you're short on time, cut slides marked CUTTABLE in their notes.
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
    <b class="ai">~$15.5B</b>
    <span>Stablecoins on Solana today. USDC is $6.8B of it</span>
    <cite>DefiLlama, 19 Oct 2026</cite>
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
Sources, all checked 19 Oct 2026:
- Chainalysis 2026 Global Crypto Adoption Index, published 23 Sep 2026: Nigeria #3 (Brazil #1, USA #2), South Africa #9. https://www.chainalysis.com/blog/2026-global-crypto-adoption-index/
- The 43% stablecoin share is from the 2024 Sub-Saharan Africa report (Jul 2023 to Jun 2024), NOT 2025. People often mis-date it. The same report: Nigeria took about 40% of the region's stablecoin inflows. https://www.chainalysis.com/blog/subsaharan-africa-crypto-adoption-2024/
- Chainalysis 2025: the region received over $205B on-chain, up about 52%; Nigeria over $92.1B. Use this if asked for a newer volume number.
- DefiLlama, 19 Oct 2026: about $15.5B stablecoins on Solana, 3rd chain after Ethereum and Tron. USDC $6.79B, USDT $2.69B, PYUSD $0.68B.

Say: "Nobody here needs convincing that dollars on a phone matter. Today is about building it properly."
-->

---
layout: section
tone: chain
num: 1
---

# Set up

Wallet on devnet, test money, an AI assistant.

---

# Get these before we prompt

<div class="setup">
  <div v-click><span class="n">1</span><b>A wallet</b><span>Phantom, Solflare or Backpack. Switch it to <b class="chain">devnet</b>.</span></div>
  <div v-click><span class="n">2</span><b>Devnet SOL</b><span><code>faucet.solana.com</code> · 2 requests per 8 hours</span></div>
  <div v-click><span class="n">3</span><b>Devnet USDC</b><span><code>faucet.circle.com</code> · Solana Devnet · 20 USDC, once per 2 hours</span></div>
  <div v-click><span class="n">4</span><b>Node 24 + an AI assistant</b><span>Claude Code, Cursor, Copilot, any of them</span></div>
</div>

<Callout v-click tone="warn" title="Faucet down or rate limited?" class="mt-6">Raise your hand. I have pre-funded devnet wallets.</Callout>

<style>
.setup { display: grid; gap: 0.7rem; margin-top: 1.2rem; }
.setup > div { display: grid; grid-template-columns: 2.2rem 15rem minmax(0, 1fr); gap: 0.8rem; align-items: baseline; border-bottom: 1px solid var(--line); padding-bottom: 0.6rem; }
.setup .n { font-weight: 900; font-size: var(--fs-xl); color: var(--chain); font-stretch: 62%; }
.setup b { font-size: var(--fs-md); }
.setup span { font-size: var(--fs-base); color: var(--text-2); }
</style>

<!--
Checked 19 Oct 2026:
- faucet.solana.com: "Maximum of 2 requests every 8 hours". GitHub sign-in is optional and raises the limit.
- faucet.circle.com: pick USDC, network "Solana Devnet". 20 USDC per request. "One request per pairing of asset and test network every 2 hours". No account needed. It uses reCAPTCHA, so it can't be scripted.
- Devnet USDC mint: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU (classic Token program, 6 decimals, read on-chain).

BEFORE THE DAY: fund 20 or so throwaway devnet wallets with SOL and USDC from your own wallet, so a faucet failure doesn't stall the room. Circle limits you to 20 USDC every 2 hours per address, so start a day early and spread it across several addresses.

Give people 5 to 8 minutes here. Walk the room.
-->

---

# One Wi-Fi, one IP, one rate limit

<div class="rl">
  <div v-click class="big"><b class="bug">100</b><span>requests per 10 s, <strong>per IP</strong>, on the public devnet RPC</span></div>
  <div v-click class="big"><b class="bug">40</b><span>per 10 s for any single method</span></div>
  <div v-click class="fix"><b class="ok">Use the workshop RPC URL</b><span>Put it in <code>NEXT_PUBLIC_SOLANA_RPC_URL</code>. It's browser-visible, so it must be origin-restricted.</span></div>
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
layout: section
tone: chain
num: 2
---

# How a USDC payment works

Four ideas. Then the AI's code will make sense.

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

# Money is an integer

<p class="ink-soft">USDC has 6 decimals. 2.50 USDC is <code>2_500_000</code> base units. Try a price.</p>

<BaseUnits class="mt-4" />

<!--
Live widget. Click 2.50 first: float maths happens to work. Then click 2.01: `2.01 * 1e6` in JavaScript is 2009999.9999999998 (checked in Node 24).

What happens next depends on the code:
- `BigInt(2009999.9999999998)` throws a RangeError.
- `Math.floor` gives 2009999: the customer underpays by one base unit, and an exact-amount check on the server fails.
- Passing the raw number into an instruction encoder throws.

71 of the prices from 0.01 to 19.99 USDC have this problem.

Rule: amounts are bigint base units end to end. Prices live as integers on the server. Parse user input as a decimal string, never through a float. When reading a token balance from RPC, use `amount` (a string), not `uiAmount` (a float).
-->

---
clicks: 4
---

# One payment, three instructions

<div class="ix">
  <Receipt title="ONE TRANSACTION" :step="$clicks" :lines="[
    ['1  create merchant USDC account', 'if missing', 'chain'],
    ['2  transferChecked', '2_500_000 · 6 dp', 'chain'],
    ['3  memo', 'order id', 'chain'],
  ]" stamp="ALL OR NOTHING" />
  <div class="why">
    <p v-click="1"><b class="chain">Idempotent create</b> · no-op if it already exists</p>
    <p v-click="2"><b class="chain">transferChecked</b> · the program checks the mint and decimals too</p>
    <p v-click="3"><b class="chain">Memo</b> · ties this payment to one order</p>
    <p v-click="4"><b class="ok">Atomic</b> · all three happen, or none do</p>
  </div>
</div>

<style>
.ix { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 2rem; align-items: center; margin-top: 1rem; }
.why p { font-size: var(--fs-md) !important; margin: 0 0 1rem; }
</style>

<!--
This is the shape of every correct stablecoin payment on Solana. Keep it in mind; we'll check the AI's code against it.

1. CreateAssociatedTokenIdempotent: creates the merchant's USDC account if it doesn't exist, does nothing if it does. The payer covers the rent: 1,488,440 lamports (0.00148844 SOL) for a token account today, measured with getMinimumBalanceForRentExemption(165) on 19 Oct 2026. AI code often hardcodes the old 0.00203928.

2. transferChecked instead of transfer: you pass the mint and decimals, and the token program rejects the transfer if they don't match. Token-2022 mints with transfer fees reject plain `transfer` outright.

3. Memo: a public note on the transaction. We put the order id in it so the server can match payment to order. Never put personal data in a memo; it's public forever.

4. A Solana transaction is atomic. If the transfer fails, the account creation is rolled back too. The base fee is 5,000 lamports per signature.
-->

---
clicks: 5
---

# Changed since your AI was trained

<ChainChanges :step="$clicks" />

<!--
All checked 19 Oct 2026 against solana.com and the chain itself:
- Rent: SIMD-0437 cuts lamports-per-byte from 6,960 to 696 in five steps. Steps 1 and 2 hit mainnet in September 2026; steps 3 to 5 are expected with Agave 4.4 in November. Measured today: a token account costs 1,488,440 lamports. https://solana.com/upgrades/reduced-rent
- v1 transactions (4,096 bytes) live on mainnet since 15 Sep 2026. Server code calling getTransaction without maxSupportedTransactionVersion: 1 errors on them.
- 200 ms slots on mainnet since 9 Oct 2026. Blockhash still lasts 150 blocks, which is now ~30 s instead of ~60 s. Measured mainnet slot time today: 0.214 to 0.225 s. https://solana.com/upgrades/reduced-slot-times
- 16 Oct 2026: the Solana Foundation's dev skill for AI agents (github.com/solana-foundation/solana-dev-skill, v2.7.0) says "Do not use @solana/client / @solana/react-hooks (framework-kit) or @solana/wallet-adapter-* for new work."
- Alpenglow activates on mainnet at epoch 1064, Wed 21 Oct 2026 ~15:00 UTC: yesterday, from the room's point of view. Target finality ~150 ms, down from ~12.8 s. "confirmed and finalized become the same thing." https://solana.com/upgrades/alpenglow

TOBI: on the morning of the 22nd, check that Alpenglow actually activated (the feature account A1pengvuM6JEcyNuTnMqepBKhwHE3N6PmUrdATGawhJS should be owned by the Feature program, not System). If it slipped, change the last line to "scheduled".

Say: "Every model in this room was trained before at least one of these. That's not the model's fault. It's why you review."
-->

---
layout: section
tone: ai
num: 3
---

# Prompt it

Type what a normal person would type.

---
clicks: 1
---

# The prompt

<PromptBox class="mt-8" :typed="$clicks >= 1" text="Build a Next.js app where a customer connects a Solana wallet and pays 2.50 USDC on devnet for a jollof rice order. Show a success message when they've paid. The merchant wallet is BzMDFqQe2D1QnXkUiponJCasNiCZn8zEtW4VVehXLikf." />

<p v-click class="ink-soft mt-6">Everyone: paste this into your assistant now. Use your own wallet address as the merchant.</p>

<!--
This is deliberately a normal, slightly lazy prompt. It's what people actually type.

Give the room 5 to 7 minutes to generate and run. Walk around. While they wait, run it yourself on the projector, or switch to the next slide to show what I got.

People will get different stacks from different assistants. That's good: the review checklist works on all of them.
-->

---

# What came back

<div class="back">
  <Receipt title="AI FIRST DRAFT" :lines="[
    ['Files', '6'],
    ['Next.js', '15.5', 'ai'],
    ['@solana/web3.js', '1.99 (v1)', 'ai'],
    ['wallet-adapter', '0.15 / 0.19', 'ai'],
    ['tsc --noEmit', 'passed', 'ok'],
    ['Time', 'about 4 min'],
  ]" stamp="IT BUILDS" />
  <div>
    <p v-click class="fs-lg">Connect Phantom. Click pay. Approve.</p>
    <p v-click class="fs-lg ok">"Payment successful! Your jollof rice is on the way."</p>
    <p v-click class="fs-xl" style="font-weight:800; margin-top:1.5rem">So we ship it?</p>
  </div>
</div>

<style>
.back { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 2.4rem; align-items: center; margin-top: 0.8rem; }
</style>

<!--
This is a real first draft. An AI assistant (Claude Sonnet, run as a fresh assistant with only this prompt) produced it on 19 Oct 2026. The code is in the repo under ai-first-draft/. Nothing was edited.

Versions it chose: next 15.5.28, @solana/web3.js 1.99.0, @solana/spl-token 0.4.15, @solana/wallet-adapter-react 0.15.40, wallet-adapter-wallets 0.19.40. `npx tsc --noEmit` passed.

Ask the room: "Whose works? Whose shows the success message?" Most hands go up.

Then: "Good. Now let's find out if it's right."

TOBI: verified so far: the draft passes `tsc --noEmit` and `next build`. Nobody has clicked through it with a real Phantom wallet yet. Do that once before the day (`cd ai-first-draft && npm run dev`, wallet on devnet with USDC) so you can say "it works" from experience.
-->

---
layout: section
tone: bug
num: 4
---

# Review what the AI wrote

It works. That's a different question from whether it's correct.

---

# The scorecard

<div class="score">
  <div>
    <h3 class="ok">Got right</h3>
    <p v-click>Correct devnet USDC mint, 6 decimals</p>
    <p v-click>transferChecked, not transfer</p>
    <p v-click>Creates the merchant account, idempotently</p>
    <p v-click>Amount in base units: <code>2_500_000</code></p>
  </div>
  <div>
    <h3 class="bug">Got wrong</h3>
    <p v-click>The browser decides it's paid</p>
    <p v-click>The price lives in the browser</p>
    <p v-click>No order id: which jollof is this?</p>
    <p v-click>Confirms with the wrong blockhash</p>
    <p v-click>Assumes the classic token program</p>
    <p v-click>A stack the Foundation now says not to start with</p>
  </div>
</div>

<style>
.score { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2.4rem; margin-top: 0.6rem; }
.score h3 { font-size: var(--fs-lg) !important; margin: 0 0 0.6rem; }
.score p { font-size: var(--fs-md) !important; margin: 0 0 0.55rem; padding-left: 0.8rem; border-left: 3px solid var(--line); }
</style>

<!--
Be fair to the AI. The on-chain part is mostly fine. It picked transferChecked, an idempotent account create, the right mint and decimals. Two years ago assistants got these wrong all the time.

What it got wrong is the money part: who decides an order is paid, who sets the price, and how you tie a payment to an order. These aren't Solana trivia. They're the same rules a bank or Paystack integration follows, and the AI skipped them because the prompt said "show a success message", so it did exactly that.

That's the main lesson: the AI answers the prompt you wrote, not the system you need.
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
clicks: 7
---

# The fix: the server checks the chain

<Sequence :step="$clicks" :actors="[
  { id: 'b', label: 'Browser', tone: 'muted' },
  { id: 's', label: 'Your server', tone: 'ok' },
  { id: 'w', label: 'Wallet', tone: 'ai' },
  { id: 'c', label: 'Solana', tone: 'chain' },
]" :steps="[
  { from: 'b', to: 's', label: 'POST /orders { item: jollof }' },
  { from: 's', to: 'b', label: 'order id, price, mint, merchant', tone: 'ok' },
  { from: 'b', to: 'w', label: 'sign: create + transferChecked + memo', tone: 'ai' },
  { from: 'w', to: 'c', label: 'send transaction', tone: 'chain' },
  { from: 'b', to: 's', label: 'POST /orders/:id/verify { signature }' },
  { from: 's', to: 'c', label: 'getTransaction(signature)', tone: 'chain' },
  { from: 's', to: 's', label: 'checks pass → order paid', tone: 'ok' },
]" />

<!--
Click through each arrow.

1. The browser says only WHAT it wants: an item.
2. The server answers with everything that matters: a fresh order id, the price in base units, the mint, the merchant address, the token program. The client can't choose any of these.
3. The browser builds the three instructions and the wallet signs.
4. The transaction goes to Solana.
5. The browser hands the server the signature. That's just a pointer; the server trusts nothing about it.
6. The server fetches that transaction from its own RPC.
7. The server runs its checks. Only then is the order paid.

This is the reference app: app/lib/verify.ts and app/app/api/orders/.
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

Our test suite tries this exact attack: create a 2.50 order, then pay 0.50 for it. The server answers 402 "Merchant received 500000 base units, expected 2500000".
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
getAddMemoInstruction({ memo: order.id })
```

```ts
const memoOk = ixs.some(ix =>
  ix.program === 'spl-memo' && ix.parsed === order.id)
```
  </div>
</div>

<style>
.two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; margin-top: 1rem; align-items: start; }
.two p { margin: 0.8rem 0 0; }
</style>

<!--
Without an order id on the payment you can only match by amount and time, and that breaks the moment two people buy the same thing.

The fix: put the server's order id in an SPL Memo instruction. On verify, the server only accepts a transaction whose memo equals this order's id (app/lib/verify.ts check 3).

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
2. markPaid() refuses a signature it has already seen (app/lib/orders.ts). In production that's a UNIQUE constraint on the signature column, inside the same database transaction that marks the order paid.

The signature 3xuC…mF5K is a real devnet payment from our test run on 19 Oct 2026.
-->

---

# The whole check, in four rules

```ts {1-4|6|8-10|12-17|all}{maxHeight:'420px'}
// app/lib/verify.ts
const tx = await rpc
  .getTransaction(sig, { commitment: 'confirmed', encoding: 'jsonParsed', maxSupportedTransactionVersion: 1 })
  .send()

if (tx.meta?.err) return fail('Transaction failed on-chain')

const memoOk = tx.transaction.message.instructions
  .some(ix => ix.program === 'spl-memo' && ix.parsed === order.id)
if (!memoOk) return fail('Memo does not match this order')

// Merchant's balance of THIS mint must rise by the full price
const isMerchantUsdc = b => b.mint === order.mint && b.owner === order.recipient
const before = sum(pre.filter(isMerchantUsdc))
const after = sum(post.filter(isMerchantUsdc))
if (after - before < order.amount) return fail('Underpaid')
return ok()
```

<!--
Lightly trimmed from app/lib/verify.ts so it fits. Each click is one rule.

1. Fetch it ourselves, at "confirmed", and allow v1 transactions. Without maxSupportedTransactionVersion: 1, a v1 transaction makes getTransaction error. For big amounts, use "finalized"; after Alpenglow they're the same thing anyway.
2. It succeeded. A failed transaction still has a signature, and AI code often forgets that.
3. Memo equals this order's id.
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
  ]" />
  <div>
    <p v-click class="fs-lg">Real devnet transactions.</p>
    <p v-click class="fs-lg">Same routes the browser uses.</p>
    <p v-click class="fs-lg ok">Write the attack, then the fix.</p>
  </div>
</div>

<style>
.proof { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 2.4rem; align-items: center; margin-top: 0.8rem; }
</style>

<!--
This ran on 19 Oct 2026 against devnet: `node scripts/e2e.ts` in the app folder, with `npm run dev` running. All 7 checks pass (creating the order is the 7th). Sample real payment: https://explorer.solana.com/tx/3xuCXcRpqA5RJf9EGbz4qinTMN5toWXXdBHi8zUqiU5zYD5V2wz3BwnfNi3B2wzCLFyYuRLAUKMcBK3UdNxSmF5K?cluster=devnet

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

The reviewed app uses @solana/kit's client.sendTransaction, which plans, signs, sends and confirms with one lifetime and throws a clear BLOCK_HEIGHT_EXCEEDED if it expires. Production rule from solana.com/docs/payments/production-readiness: store the signature before sending, and reconcile before re-signing.
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
The draft works today because USDC is on the classic Token program. The day the business says "also accept PYUSD", it derives the wrong token account and every payment fails (slide 9: the same wallet's PYUSD account is a different address).

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

<Callout v-click tone="warn" title="Not broken today. Debt from day one." class="mt-6">The Solana Foundation's dev skill for AI agents, 16 Oct 2026: don't use framework-kit or wallet-adapter for new work.</Callout>

<style>
.stack-cmp { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; margin-top: 0.8rem; }
.stack-cmp li { font-size: var(--fs-md) !important; }
</style>

<!--
Fairness: web3.js v1 code still runs. This is about what you start a new project on.

Facts (19 Oct 2026):
- github.com/solana-foundation/solana-dev-skill v2.7.0, references/frontend.md: "Do not use @solana/client / @solana/react-hooks (framework-kit) for new work — that stack is stale... Do not use @solana/wallet-adapter-* for new apps either; Wallet Standard discovery covers modern wallets."
- npm: @solana/web3.js "latest" is 1.99.0 and "next" is 3.1.0. v3 is a different API rebuilt on Kit. If "latest" moves to 3.x, `npm i @solana/web3.js` will install a different major from the one AI-written code assumes.
- web3.js v1 can read v1 transactions but can't build them.
- Next.js 16.3 is current stable; the draft pinned ^15.1.

Funny but true: while building the reference app for this talk, I first used framework-kit because my own local copy of that AI skill was months stale. I found out from the research, and I switched. The AI tools need reviewing too.

Fix for your own setup: install or update the official skill so your assistant gets current advice: https://github.com/solana-foundation/solana-dev-skill
-->

---

# My AI got one wrong too

<div class="addr">
  <p v-click class="mono fs-md"><span class="muted">typed from memory</span><br><span class="bug">TokenzQdBNbLqP5VEhdkAS6EPFLC1PeFLLyVWSyU6Jkkt5sVhpWv</span></p>
  <p v-click class="mono fs-md"><span class="muted">the real Token-2022 program</span><br><span class="ok">TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb</span></p>
  <p v-click class="fs-lg" style="font-weight:800">Never retype an address. Import it.</p>
</div>

```ts
import { TOKEN_2022_PROGRAM_ADDRESS } from '@solana-program/token-2022'
```

<style>
.addr { display: grid; gap: 1rem; margin: 1.2rem 0 1.4rem; }
.addr p { margin: 0 !important; word-break: break-all; }
</style>

<!--
True story from preparing this workshop (19 Oct 2026). While building the reference app, my AI assistant wrote the Token-2022 program address from memory. The first 30 characters were right and the rest was invented. It looks completely plausible.

It was caught because the official package exports the constant: TOKEN_2022_PROGRAM_ADDRESS = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb".

Had it shipped, the server's "is this mint owned by a token program?" check would have rejected every Token-2022 mint, or worse, in other code, sent funds to an address nobody controls.

Rule: addresses, mints and program ids come from an official package, an env var you set yourself, or the chain. Never from the model's memory.
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

# Your turn: fix it

<div class="tasks">
  <div v-click><span>1</span><p>Add an <code>/api/orders</code> route that sets the price</p></div>
  <div v-click><span>2</span><p>Add the memo with the order id</p></div>
  <div v-click><span>3</span><p>Add <code>/verify</code>: fetch, succeeded, memo, balance</p></div>
  <div v-click><span>4</span><p>Refuse a reused signature</p></div>
  <div v-click class="stuck"><span>?</span><p>Stuck? The reference app is in the repo</p></div>
</div>

<style>
.tasks { display: grid; gap: 0.7rem; margin-top: 1.4rem; }
.tasks > div { display: grid; grid-template-columns: 2.2rem minmax(0, 1fr); font-size: var(--fs-md); border-bottom: 1px solid var(--line); padding-bottom: 0.5rem; }
.tasks p { margin: 0 !important; font-size: var(--fs-md) !important; }
.tasks span { font-weight: 900; color: var(--bug); font-stretch: 62%; font-size: var(--fs-xl); line-height: 1; }
.tasks .stuck span { color: var(--ok); }
</style>

<!--
10 to 12 minutes, hands on. People can use their AI assistant, and they should. The point is that they now know what to ask for and what to check.

Walk the room. Common snags:
- Wallet still on mainnet: "account not found" or 0 USDC. Switch to devnet.
- No USDC token account yet: the faucet creates it; otherwise the payment fails with "could not find token account".
- 429 errors: public RPC rate limit. Use the workshop RPC URL.
- getTransaction returns null right after sending: the server's RPC hasn't seen it yet. Retry a few times (the reference page retries 8 times, 1.5 s apart).

CUTTABLE: if short on time, skip the hands-on and show the reference app running instead.
-->

---
layout: section
tone: http
num: 5
---

# x402

When the customer is a program, not a person.

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

# 402 has been waiting since 1997

<div class="rfc">
  <p v-click class="mono fs-xl http">HTTP/1.1 402 Payment Required</p>
  <p v-click class="fs-md ink-soft">"This code is reserved for future use." · RFC 2068, 1997</p>
  <p v-click class="fs-md ink-soft">Still "reserved for future use" in RFC 9110, 2022</p>
  <p v-click class="fs-lg" style="font-weight:800; margin-top:1.4rem">x402 is that future: a standard for paying inside HTTP.</p>
</div>

<style>
.rfc { display: grid; gap: 0.6rem; margin-top: 2rem; }
.rfc p { margin: 0 !important; }
</style>

<!--
Checked 19 Oct 2026 on rfc-editor.org:
- RFC 2068 (HTTP/1.1, January 1997), section 10.4.3: "402 Payment Required. This code is reserved for future use."
- RFC 9110 (HTTP Semantics, June 2022), section 15.5.3: "The 402 (Payment Required) status code is reserved for future use."

x402 was created by Coinbase (the repo dates from Feb 2025) and moved to the x402 Foundation under the Linux Foundation in 2026. The canonical repo is now github.com/x402-foundation/x402.
-->

---
clicks: 8
---

# One request, paid

<Sequence :step="$clicks" :rowH="38" :actors="[
  { id: 'a', label: 'Agent', tone: 'ai' },
  { id: 'api', label: 'Your API', tone: 'http' },
  { id: 'f', label: 'Facilitator', tone: 'muted' },
  { id: 'c', label: 'Solana', tone: 'chain' },
]" :steps="[
  { from: 'a', to: 'api', label: 'GET /proverb', tone: 'http' },
  { from: 'api', to: 'a', label: '402 + PAYMENT-REQUIRED', tone: 'bug' },
  { from: 'a', to: 'a', label: 'sign USDC transferChecked', tone: 'ai' },
  { from: 'a', to: 'api', label: 'GET + PAYMENT-SIGNATURE', tone: 'http' },
  { from: 'api', to: 'f', label: 'POST /verify', tone: 'muted' },
  { from: 'api', to: 'api', label: 'run handler', tone: 'http' },
  { from: 'f', to: 'c', label: '/settle → submit transaction', tone: 'chain' },
  { from: 'api', to: 'a', label: '200 + PAYMENT-RESPONSE', tone: 'ok' },
]" />

<!--
x402 v2 (spec dated 2025-12-09, specs/transports-v2/http.md in the x402-foundation repo). Default "authorization" flow:

1. Agent calls the API like normal.
2. API answers 402 with a PAYMENT-REQUIRED header (base64 JSON): what it costs, which token, which network, who to pay.
3. Agent signs a USDC transferChecked. On Solana it's a partially signed transaction; the facilitator will add the fee payer's signature.
4. Agent retries the same request with a PAYMENT-SIGNATURE header.
5. API asks the facilitator to /verify it (read-only).
6. API runs the handler.
7. API asks the facilitator to /settle: it adds its fee-payer signature and submits the transaction to Solana.
8. API returns 200 with the data and a PAYMENT-RESPONSE header carrying the transaction signature.

The agent needs USDC but no SOL. The facilitator pays the network fee.

v1 used different header names: X-PAYMENT and X-PAYMENT-RESPONSE. Most AI code you'll see still uses v1.
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

```ts {all|1-2|4|5|7-8|all}
const client = new x402Client()
client.register('solana:*', new ExactSvmScheme(signer))

client.setSpendControls({ maxAmountPerPayment: '$0.01' })
const paidFetch = wrapFetchWithPayment(fetch, client)

const res = await paidFetch('http://localhost:4021/proverb')
console.log(await res.json()) // { proverb: 'Rain does not fall on one roof alone.' }
```

<p v-click class="fs-md mt-5">The budget line matters. <b class="ai">An agent with a wallet and no limit is a liability.</b></p>

<!--
From x402/src/agent.ts. `signer` is a @solana/kit KeyPairSigner loaded from a devnet keypair file.

wrapFetchWithPayment does the dance from the sequence slide: see the 402, pick a matching option, sign, retry with PAYMENT-SIGNATURE.

setSpendControls comes straight from the official fetch example. Ask the room what happens without it if a malicious API returns a 402 for $500. With a budget guard the client refuses to sign.

TOBI: run `npm run server` and `npm run agent` in x402/ live if the Wi-Fi allows. The agent wallet needs devnet USDC (not SOL). As of 19 Oct the server side and the 402 were tested; the paid retry was waiting on faucet USDC (see README).
-->

---

# What the AI gets wrong with x402

<div class="xw">
  <div v-click><b class="bug">v1 headers</b><span><code>X-PAYMENT</code> is now <code>PAYMENT-SIGNATURE</code></span></div>
  <div v-click><b class="bug">Deprecated packages</b><span><code>x402-next</code>, <code>x402-fetch</code>: v1, security fixes only, and npm gives no warning</span></div>
  <div v-click><b class="bug">Network names</b><span><code>"solana-devnet"</code> is v1. v2 uses <code>solana:EtWT…qa1</code></span></div>
  <div v-click><b class="bug">Charging for errors</b><span>Next.js <code>paymentProxy</code> charges even for failed responses. <code>withX402</code> only settles below 400</span></div>
  <div v-click><b class="bug">Silent unprotected route</b><span>In <code>withX402</code>, a typo in a keyed route path means the handler runs <b>free</b></span></div>
  <div v-click><b class="bug">No merchant USDC account</b><span>The payer can't create it in an x402 payment. Create it first</span></div>
</div>

<style>
.xw { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.9rem 2rem; margin-top: 0.8rem; }
.xw > div { display: grid; gap: 0.2rem; border-left: 3px solid var(--bug); padding-left: 0.8rem; }
.xw > div > b { font-size: var(--fs-md); }
.xw span { font-size: var(--fs-sm); color: var(--text-2); }
</style>

<!--
All checked 19 Oct 2026 in github.com/x402-foundation/x402:
- Headers: v2 transport spec uses PAYMENT-REQUIRED, PAYMENT-SIGNATURE, PAYMENT-RESPONSE. v1 used X-PAYMENT and X-PAYMENT-RESPONSE.
- typescript/packages/legacy/x402-*: README says "Deprecated (v1)... will only receive security patches. Please migrate to v2". npm has no deprecated flag, so `npm install x402-next` installs quietly. Even some solana.com guides (the Kora x402 guide) still show v1.
- Network ids: v2 uses CAIP-2. Devnet solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1; mainnet solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp.
- @x402/next README: withX402 "guarantees payment settlement only AFTER successful API responses (status < 400)"; paymentProxy "will charge clients for failed API responses". Also: "If a keyed pattern does not match... the handler runs without payment protection; withX402 logs a warning once."
- Merchant USDC account: we hit this ourselves. The Solana "exact" scheme spec only allows compute-budget instructions, one TransferChecked, and Memo or Lighthouse instructions. There's no account-creation step, so the merchant's USDC account must already exist. We created it with `spl-token create-account <mint> --owner <merchant>`.
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
    <span>of x402 transactions run on Solana, 22 Aug to 19 Sep 2026: 23.2M. Solana's figure, citing Artemis.</span>
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
- @solana on X, 22 Sep 2026: "Solana handles 76% of all @x402 transactions. 23.2M in four weeks. The next-largest network did 3.39M." Chart: 22 Aug to 19 Sep 2026, source Artemis. Present it as Solana's claim citing Artemis, not independent.

Do NOT quote the "165M transactions / $50M volume" figures floating around; no primary source was found.
-->

---
layout: section
tone: ok
num: 6
---

# Ship checklist

Take a photo of the next slide.

---

# Before AI-written payment code ships

<div class="check">
  <p v-click><b>1</b><span>The server sets the price and creates the order</span></p>
  <p v-click><b>2</b><span>The server fetches the transaction itself</span></p>
  <p v-click><b>3</b><span>It succeeded: <code>meta.err</code> is null</span></p>
  <p v-click><b>4</b><span>Right mint, right recipient, full amount, from balances</span></p>
  <p v-click><b>5</b><span>Memo or reference ties it to one order</span></p>
  <p v-click><b>6</b><span>One signature, one order: unique in the database</span></p>
  <p v-click><b>7</b><span>Amounts are bigint base units, never floats</span></p>
  <p v-click><b>8</b><span>Token program and decimals read from the mint</span></p>
  <p v-click><b>9</b><span>Addresses come from packages or the chain, never memory</span></p>
  <p v-click><b>10</b><span>No secrets behind <code>NEXT_PUBLIC_</code></span></p>
  <p v-click><b>11</b><span>An attack script that fails, in CI</span></p>
  <p v-click><b>12</b><span>x402: v2 headers, a spend limit, pinned SDK</span></p>
</div>

<style>
.check { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.35rem 2rem; margin-top: 0.4rem; }
.check p { display: grid; grid-template-columns: 2rem minmax(0, 1fr); font-size: var(--fs-base) !important; margin: 0 !important; padding: 0.35rem 0; border-bottom: 1px solid var(--line); }
.check b { color: var(--ok); font-weight: 900; font-stretch: 70%; font-size: var(--fs-md); }
</style>

<!--
This is the take-home. It's also in the repo as CHECKLIST.md.

Each line maps to a bug we saw today:
1, 2: bug 1 and 2 (browser decides, browser prices)
3, 4: the verify function
5, 6: which jollof, and replay
7: the 2.01 widget
8: bug 5 (token program)
9: my AI's made-up Token-2022 address
10: the RPC URL slide
11: e2e.ts
12: the x402 section
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

---
layout: cover
---

# Thank you

<p class="mono fs-sm">Slides, reference app, AI first draft, x402 service, checklist</p>
<p class="chain mono fs-md">github.com/tobySolutions/prompt-to-payments</p>
<p class="muted fs-sm" style="margin-top:1rem">@toby_solutions · tobySolutions.dev</p>

::right::

<Receipt title="SESSION RECEIPT" stamp="SHIPPED" :lines="[
  ['Apps built', '1'],
  ['Bugs found', '6', 'bug'],
  ['Payments verified', 'on-chain', 'ok'],
  ['APIs paid per request', 'x402', 'chain'],
]" />

<!--
TOBI: the repo URL is a placeholder until you approve publishing it. If you choose a different name, change it here and in the README.

Leave this up during Q&A.

Likely questions:
- "Can I use this on mainnet?" Same code, mainnet USDC mint EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v, a paid RPC, a real database, and the x402 facilitator changed to one that supports mainnet (PayAI, or Coinbase CDP with a key). x402.org is testnet only.
- "Why not Solana Pay?" It's a great fit for QR checkout at a counter. The spec is maintained, and @solana/pay 1.x is now built on kit 6. Same verification rules apply: its own spec says confirm and validate the transaction before releasing goods.
- "Who pays the gas?" In our checkout, the customer pays the 5,000-lamport fee plus rent if the merchant's USDC account is new. In x402, the facilitator pays the fee.
- "Is Alpenglow live?" Check on the morning: it was scheduled for epoch 1064, 21 Oct ~15:00 UTC.
-->
