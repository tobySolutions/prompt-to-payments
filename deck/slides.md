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
TIME: 0:00 · 20 seconds

SAY
- "Hi, I'm Tobi. In the next 23 minutes I'll show you an AI build a stablecoin payment app, show you why that first version would lose you money, fix it, and then watch an AI agent pay for an API by itself."
- "You don't need to code along. Watch, and open the links I give you on your phone."

DO
- Nothing to click. Move on after 20 seconds.

PRE-FLIGHT (before you walk on)
- Press "Run the agent" on mamaput-lagos.vercel.app/agent until you see a proverb. The first run after a quiet spell can time out.
- Solflare on Devnet (switch the network in Solflare's settings) with devnet USDC from faucet.circle.com, unlocked in your browser.
- Tabs ready: mamaput-first-draft.vercel.app · mamaput-lagos.vercel.app/kitchen · mamaput-lagos.vercel.app/agent · terminal in app/ (only for the attack demo).
-->
---

<div class="me">
  <img src="/tobi.jpg" alt="Tobiloba Adedeji" class="face" v-motion :initial="{ scale: 0.85, opacity: 0 }" :enter="{ scale: 1, opacity: 1, transition: { duration: 500 } }" />
  <div>
    <p class="hi">Tobiloba Adedeji</p>
    <p class="handle mono">tobySolutions · @toby_solutions</p>
    <div class="roles">
      <div v-click><b>Senior Technical Lead, Boh</b><span>Building EKGO!: driver, customer and ops apps for 500+ restaurants in California</span></div>
      <div v-click><b>Solana</b><span>Co-founded Solana Students Africa · Solana Foundation, Solana Developer Platform · Turbine Q4 2025 graduate</span></div>
      <div v-click><b>Before that</b><span>DevRel at Fleek and Gaia AI · Million.js (16K+ stars)</span></div>
    </div>
    <p v-click class="ai fs-md mt-6" style="font-weight:700">I ship with AI every day. I read every line it writes that touches money.</p>
  </div>
</div>

<style>
.me { display: grid; grid-template-columns: 210px minmax(0, 1fr); gap: 2.4rem; align-items: center; height: 100%; }
.face { width: 210px; height: 210px; border-radius: 50%; object-fit: cover; border: 3px solid var(--chain); }
.hi { font-size: var(--fs-2xl) !important; font-weight: 800; font-stretch: 112%; margin: 0 !important; line-height: 1.1; }
.handle { font-size: var(--fs-sm) !important; color: var(--chain); margin: 0.3rem 0 1.1rem !important; }
.roles { display: grid; gap: 0.7rem; }
.roles > div { display: grid; gap: 0.15rem; border-left: 3px solid var(--chain); padding-left: 0.8rem; }
.roles b { font-size: var(--fs-md); }
.roles span { font-size: var(--fs-sm); color: var(--text-2); }
</style>

<!--
TIME: 0:20 · 40 seconds. Three clicks, one per line.

SAY
- "I'm Senior Technical Lead at Boh, building EKGO! for restaurants in California."
- "On the Solana side I co-founded Solana Students Africa, and until this week I was on the Solana Developer Platform at the Solana Foundation."
- Last line, slowly: "I ship with AI every day. I read every line it writes that touches money. That's this whole talk."
-->

---

# Build it. Break it. Fix it.

<div class="plan">
  <div v-click><b>1</b><span>Build</span><em>Prompt an AI. Get a working app.</em><i>8 min</i></div>
  <div v-click class="rev"><b>2</b><span>Break</span><em>Find what it got wrong.</em><i>6 min</i></div>
  <div v-click class="ship"><b>3</b><span>Fix</span><em>Make the server check the chain.</em><i>4 min</i></div>
  <div v-click class="x"><b>4</b><span>x402</span><em>Let an agent pay your API per request.</em><i>4 min</i></div>
</div>

<p v-click class="fs-md ink-soft mt-8">23 minutes. I drive. You follow on your phone.</p>

<style>
.plan { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; margin-top: 2rem; }
.plan > div { border-top: 6px solid var(--ai); padding-top: 0.6rem; display: grid; gap: 0.35rem; align-content: start; }
.plan b { font-size: var(--fs-3xl); font-weight: 900; font-stretch: 62%; color: var(--ai); line-height: 1; }
.plan span { font-size: var(--fs-xl); font-weight: 800; }
.plan em { font-style: normal; font-size: var(--fs-base); color: var(--text-2); }
.plan i { font-style: normal; font-family: var(--mono); font-size: var(--fs-xs); color: var(--muted); }
.plan .rev { border-color: var(--bug); } .plan .rev b { color: var(--bug); }
.plan .ship { border-color: var(--ok); } .plan .ship b { color: var(--ok); }
.plan .x { border-color: var(--http); } .plan .x b { color: var(--http); }
</style>

<!--
TIME: 1:00 · 40 seconds. Four clicks, then the last line.

SAY
- "Four parts. Build: I prompt an AI and get a working payment app. Break: we find what it got wrong. Fix: the server checks the blockchain. Then x402: an AI agent paying an API, per request."
- "I drive. You watch. Every app I show you is live, so you can open it on your phone."
-->
---

# Follow along on your phone

<div class="setup">
  <div v-click><span class="n">1</span><b>The AI's first draft</b><span><code>mamaput-first-draft.vercel.app</code> · what my AI built, unreviewed</span></div>
  <div v-click><span class="n">2</span><b>The fixed shop</b><span><code>mamaput-lagos.vercel.app/kitchen</code> · only verified payments show up</span></div>
  <div v-click><span class="n">3</span><b>The paying agent</b><span><code>mamaput-lagos.vercel.app/agent</code> · press Run when I do</span></div>
  <div v-click><span class="n">4</span><b>All the code</b><span><code>github.com/tobySolutions/prompt-to-payments</code> · build it yourself later</span></div>
</div>

<Callout v-click tone="warn" title="No setup needed" class="mt-3">Everything I show is already built and live. Watch, poke at it, build it after.</Callout>

<style>
.setup { display: grid; gap: 0.4rem; margin-top: 0.4rem; }
.setup > div { display: grid; grid-template-columns: 2.2rem 15rem minmax(0, 1fr); gap: 0.8rem; align-items: baseline; border-bottom: 1px solid var(--line); padding-bottom: 0.35rem; }
.setup .n { font-weight: 900; font-size: var(--fs-xl); color: var(--chain); font-stretch: 62%; }
.setup b { font-size: var(--fs-md); }
.setup span { font-size: var(--fs-base); color: var(--text-2); }
</style>

<!--
TIME: 1:40 · 30 seconds. Leave it up so people can type or snap the links.

SAY
- "Three links. The AI's first draft. The fixed shop with its kitchen screen. And the agent page, where an AI pays for an API."
- "All the code is in the repo if you want to build it yourself later. No setup needed today."
-->
---
clicks: 2
---

# The prompt I gave my AI

<PromptBox class="mt-6" :typed="$clicks >= 1" text="Build a Next.js app where a customer connects a Solana wallet and pays 2.50 USDC on devnet for a jollof rice order. Show a success message when they've paid. The merchant wallet is <your second account's address>." />

<div class="go mt-8">
  <p v-click class="fs-lg">About four minutes later: a working app.</p>
</div>

<style>
.go { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 2rem; align-items: center; }
</style>

<!--
TIME: 2:10 · 1 minute. Click 1 types the prompt. Click 2 shows the last line.

SAY
- "Here's the prompt I gave my AI. Nothing clever. It's what most of us would type."
- Read it out as it types.
- "About four minutes later I had a working app."

FACT
- A fresh Claude Sonnet, given only this prompt, wrote it on 19 Oct 2026. Unedited, in the repo under ai-first-draft/.
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
    <p v-click class="fs-lg">Connect wallet. Click pay. Approve.</p>
    <p v-click class="fs-lg ok">"Payment successful! Your jollof rice is on the way."</p>
    <p v-click class="fs-xl" style="font-weight:800; margin-top:1.5rem">So we ship it?</p>
    <p v-click class="fs-sm ink-soft" style="margin-top:0.8rem">Try it on your phone: <span class="mono chain">mamaput-first-draft.vercel.app</span></p>
  </div>
</div>

<style>
.back { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 2.4rem; align-items: center; margin-top: 0.8rem; }
</style>

<!--
TIME: 3:10 · 2 minutes. This is your first live demo.

DO
- Switch to the browser: mamaput-first-draft.vercel.app
- Click "Select Wallet", pick Solflare, approve the connection. Press pay. Approve in Solflare. Show "Payment successful! Your jollof rice is on the way."
- Back to the slide, click through the lines.

SAY
- "It builds. It connects my wallet. It moves real devnet USDC. It says payment successful."
- "Hands up if you'd ship this." Pause. "Let's check."

IF IT BREAKS
- Solflare won't connect, it's on mainnet, or no USDC: don't debug on stage. "It worked this morning." Click through the slide; the receipt shows what came back.
-->
---
layout: section
tone: bug
num: 2
hide: true
---

# Break it

It works. That's a different question from whether it's correct.
---
clicks: 4
hide: true
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
clicks: 3
---

# Read it like the money is yours

<div class="qs">
  <div v-click="1" class="q">
    <p><b>1</b>Who decides the order is paid?</p>
    <pre class="code">await connection.confirmTransaction(…)
setStatus("paid")  <span class="hl">← the browser does</span></pre>
  </div>
  <div v-click="2" class="q">
    <p><b>2</b>Where does the 2.50 come from?</p>
    <pre class="code">const AMOUNT = 2_500_000  <span class="hl">← the browser sets the price</span></pre>
  </div>
  <div v-click="3" class="q">
    <p><b>3</b>Two people pay 2.50 at once. Which jollof is whose?</p>
    <pre class="code">tx.add(createAccount…, transferChecked…)  <span class="hl">← no order id. Nobody knows.</span></pre>
  </div>
</div>

<p class="muted fs-xs mono mt-4">ai-first-draft/app/page.tsx · lines 21, 37–45 · unedited</p>

<style>
.qs { display: grid; gap: 0.9rem; margin-top: 0.4rem; }
.q { display: grid; gap: 0.35rem; }
.q p { display: grid; grid-template-columns: 2.4rem minmax(0, 1fr); font-size: var(--fs-lg) !important; font-weight: 700; margin: 0 !important; }
.q b { color: var(--bug); font-weight: 900; font-stretch: 62%; }
.q .code { margin: 0 0 0 2.4rem; font-family: var(--mono); font-size: var(--fs-sm); background: var(--ground-2); border: 1px solid var(--line); border-left: 4px solid var(--bug); border-radius: var(--r-sm); padding: 0.45rem 0.8rem; white-space: pre-wrap; color: var(--text); }
.q .hl { color: var(--bug); font-weight: 600; }
</style>

<!--
TIME: 5:10 · 3 minutes. Three clicks. Each click shows a question and the real line from the AI's code. No editor needed.

SAY
- "Let's read it like the money is ours. Three questions."
- Click 1: "Who decides the order is paid? The browser. Once the transaction confirms, it just sets 'paid'. No server checks anything. Anyone can flip that in their browser's dev tools."
- Click 2: "Where does 2.50 come from? A number sitting in the browser code. The customer controls the price."
- Click 3: "Two people pay 2.50 at the same time. Which jollof is whose? Nobody can tell. There's no order id on the payment."
- "Three bugs. All in the money logic. None of them is a blockchain bug."

FACT
- Lines are from ai-first-draft/app/page.tsx, unedited: AMOUNT on line 21, the transaction on lines 37–40, setStatus("paid") on line 45. The "…" marks shortened arguments.
-->
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
TIME: 8:10 · 1.5 minutes. Clicks reveal both columns.

SAY
- "To be fair to the AI, the blockchain part is good. Right USDC mint, the safe transfer instruction, it even creates the shop's account properly."
- "What it got wrong is the money logic. Who decides it's paid, who sets the price, which order is which. These aren't Solana problems. A Paystack integration has the same rules."
- "The AI answered the prompt I wrote, not the system I needed."
-->
---
clicks: 6
---

# Changed since your AI was trained

<ChainChanges :step="$clicks" />

<!--
TIME: 9:40 · 1 minute. Clicks reveal rows. Don't read them all.

SAY
- "One more reason to review: Solana keeps moving."
- "Since Monday, npm install @solana/web3.js gives you version 3, a different API. Yesterday afternoon Alpenglow went live on mainnet."
- "Your AI was trained before all of this. That's not its fault. It's why you review."

IF YOU'RE BEHIND
- Skip this slide.

FACTS
- web3.js latest = 3.1.1 since 19 Oct 2026 (npm). Alpenglow live on mainnet since epoch 1064, 21 Oct ~13:36 UTC (solana.com/upgrades/alpenglow).
-->
---
hide: true
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

The made-up string is 52 characters, so it isn't even a valid key. Had it shipped, the server's mint-owner check would have rejected every Token-2022 mint. A plausible 43-character typo is worse: it parses fine and points at an account nobody controls.

Rule: addresses, mints and program ids come from an official package, an env var you set yourself, or the chain. Never from the model's memory.
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
  { from: 'b', to: 's', label: 'POST /api/orders { item: jollof }' },
  { from: 's', to: 'b', label: 'signed order: id, price, mint, merchant', tone: 'ok' },
  { from: 'b', to: 'w', label: 'sign: create + transferChecked + memo', tone: 'ai' },
  { from: 'w', to: 'c', label: 'send transaction', tone: 'chain' },
  { from: 'b', to: 's', label: 'POST /api/verify { token, signature }' },
  { from: 's', to: 'c', label: 'getTransaction(signature)', tone: 'chain' },
  { from: 's', to: 's', label: 'checks pass → order paid', tone: 'ok' },
]" />

<!--
TIME: 10:40 · 2 minutes. Seven clicks, one per arrow.

SAY
- "The fix is one rule: the server checks the chain, never the browser."
- Arrows 1–2: "The browser only asks for an item. The server sets the price and creates an order with an id."
- Arrows 3–4: "The wallet signs the payment, with that order id written into a memo on the transaction."
- Arrows 5–7: "Then the server fetches the transaction from Solana itself and checks it: it succeeded, right token, right shop, the full amount, and the memo matches this order. Only then is it paid."
- "The exact prompt to make your AI build this is in the repo README."

FACT
- Real code: app/lib/verify.ts in the repo.
-->
---
hide: true
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
layout: live
where: Editor
clicks: 6
hide: true
---

# Fix it

<div class="tasks">
  <div v-click><span>1</span><p>Add an <code>/api/orders</code> route. The server sets the price.</p></div>
  <div v-click><span>2</span><p>Put the order id in a memo</p></div>
  <div v-click><span>3</span><p>Add <code>/api/verify</code>: fetch the tx, it succeeded, memo matches, merchant got paid</p></div>
  <div v-click><span>4</span><p>Refuse a signature you've already used</p></div>
  <div v-click class="stuck"><span>?</span><p>Stuck? <code>app/</code> in the repo is the reviewed version</p></div>
</div>

<div class="timer-gap"><Countdown :minutes="15" :run="$clicks >= 6" /></div>

<style>
.tasks { display: grid; gap: 0.6rem; margin-top: 0.4rem; }
.tasks > div { display: grid; grid-template-columns: 2.2rem minmax(0, 1fr); border-bottom: 1px solid var(--line); padding-bottom: 0.45rem; }
.tasks p { margin: 0 !important; font-size: var(--fs-md) !important; }
.tasks span { font-weight: 900; color: var(--bug); font-stretch: 62%; font-size: var(--fs-xl); line-height: 1; }
.tasks .stuck span { color: var(--ok); }
</style>

<!--
Hands-on, 15 minutes (the 6th click starts the timer). People should use their AI assistant. The point is that now they know what to ask for and what to check.

A good prompt to give the room: "Move the price to the server. Add POST /api/orders that returns an order id, price in base units, mint and merchant. Add the order id as an SPL memo. Add POST /api/verify that takes { token, signature }, fetches the transaction with getTransaction and checks it succeeded, the memo matches, and the merchant's USDC balance rose by the full price. Refuse a signature that was already used."

You fix it live on screen at the same time, or open app/lib/verify.ts and walk through the four checks.

Common snags:
- getTransaction returns null right after sending: the server's RPC hasn't seen it yet. Retry a few times (the reference page retries 8 times, 1.5 s apart).
- getTransaction errors on newer transactions without maxSupportedTransactionVersion: 1.
- "Could not find token account": the payer has no devnet USDC yet.
-->
---
layout: live
where: Terminal · app/
---

# Now attack it

<div class="atk">
  <div>

```bash
BASE=https://mamaput-lagos.vercel.app \
  node scripts/e2e.ts
```

  <p v-click class="fs-md mt-6">Real devnet USDC, against the live shop. Same routes the browser uses.</p>
  <p v-click class="fs-md ok">Ask your AI to write the attacks, then make them fail.</p>
  <p v-click class="fs-md">Watch them bounce on <span class="mono chain">mamaput-lagos.vercel.app/kitchen</span></p>
  </div>
  <Receipt title="e2e.ts · devnet" stamp="ALL PASS" :lines="[
    ['real payment verifies', 'PASS', 'ok'],
    ['same signature, other order', 'refused', 'ok'],
    ['made-up signature', 'refused', 'ok'],
    ['client sends its own price', 'ignored', 'ok'],
    ['unknown menu item', 'refused', 'ok'],
    ['pay 0.50 for a 2.50 order', 'refused', 'ok'],
    ['edit the signed order', 'refused', 'ok'],
    ['one payment, three memos', 'refused', 'ok'],
  ]" />
</div>

<style>
.atk { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 2rem; align-items: center; margin-top: 0.6rem; }
</style>

<!--
TIME: 12:40 · 2.5 minutes. Second live demo.

DO
- Terminal, in app/: BASE=https://mamaput-lagos.vercel.app node scripts/e2e.ts
- Put mamaput-lagos.vercel.app/kitchen next to it. "Open the kitchen on your phone."

SAY
- "Now I attack the fixed shop. Real devnet USDC, against the live site you have on your phone."
- As the lines pass: "A real payment: accepted. Same signature for a different order: refused. A made-up signature: refused. Sending my own price: ignored. Paying 0.50 for a 2.50 order: refused. One payment naming three orders: refused."
- "Thirteen checks, all pass. Ask your AI to write attacks against its own code. It's very good at it."

IF IT BREAKS
- Slow network: point at the receipt on the slide. It's the real result from this morning: 13 of 13 against the live shop.
- Don't want to show a terminal at all? Skip the command: show the receipt on the slide and open mamaput-lagos.vercel.app/kitchen, which lists this morning's verified order and the underpaid one, read from the chain. The refused list is empty until someone attacks it again (it lives in server memory).

COST
- Each run spends about 5.50 devnet USDC from the CLI wallet AMX5b8Rwt5yZd3Zdyfa7QcL6BYvLPS1uUqZGVRbe6DoC (a 2.50 payment, a 0.50 underpay, a 2.50 multi-order payment). Top it up at faucet.circle.com (20 USDC) before the talk.
-->
---
layout: section
tone: http
num: 4
hide: true
---

# x402

When the customer is a program, not a person.
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
TIME: 15:10 · 40 seconds.

SAY
- "Last part. HTTP has had a status code called 402 Payment Required since 1997. The spec still says 'reserved for future use'."
- "x402 is that future: paying for things inside HTTP itself."
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
TIME: 15:50 · 1.5 minutes. Eight clicks, one per arrow.

SAY
- "An agent calls an API. The API answers 402: pay a tenth of a cent in USDC, here's where."
- "The agent signs a USDC payment and calls again with it attached."
- "A facilitator checks the payment, the API answers, and the payment settles on Solana."
- "No account. No API key. The agent doesn't even need SOL for fees."
-->
---
layout: live
where: Terminal · x402/
---

# Pay for a proverb

<p class="fs-md">Open <span class="mono chain">mamaput-lagos.vercel.app/agent</span> and press <b>Run the agent</b>. Or in a terminal:</p>

```bash
curl -i https://mamaput-x402.vercel.app/proverb   # 402 + PAYMENT-REQUIRED
cd x402 && npm i && cp .env.example .env
API_URL=https://mamaput-x402.vercel.app/proverb npm run agent
```

<div class="see">
  <p v-click><b class="bug">402</b> and the price, in a header</p>
  <p v-click><b class="ai">Signed</b> by the agent. No SOL needed</p>
  <p v-click><b class="ok">200</b> plus the proverb and a receipt</p>
</div>

<style>
.see { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.2rem; margin-top: 1.4rem; }
.see p { font-size: var(--fs-md) !important; margin: 0 !important; }
.see b { display: block; font-size: var(--fs-2xl); font-weight: 900; font-stretch: 75%; line-height: 1; margin-bottom: 0.4rem; }
</style>

<!--
TIME: 17:20 · 2.5 minutes. Third live demo.

DO
- Browser: mamaput-lagos.vercel.app/agent. Press "Run the agent". Tell the room to press it on their phones too.
- Optional, in a terminal: curl -i https://mamaput-x402.vercel.app/proverb (shows the 402).

SAY, as the steps appear
- "It asked for a proverb. Got a 402 with the price. Signed a USDC payment. Asked again with the payment. The facilitator settled it on Solana. And there's the proverb."
- "That's an AI paying for an API, per request, with no human in the loop."

IF IT BREAKS
- First press times out: the server was asleep. Press again.
- "Already running": someone else pressed it. Wait a few seconds.

FACT
- Paid runs verified on 22 Oct 2026. The agent wallet holds about 1 USDC, roughly 1,000 runs.
-->
---
hide: true
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
- Merchant USDC account: we hit this ourselves. For normal wallets the spec's fast path allows only compute budget, one TransferChecked and Memo/Lighthouse. Nothing creates the merchant's account, so it must already exist. We created it with `spl-token create-account <mint> --owner <merchant>`.
-->
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
TIME: 19:50 · 1.5 minutes. Click through quickly; don't read every line.

SAY
- "If you take one thing home, take this. Before AI-written payment code ships:"
- "The server sets the price. The server checks the chain. Amounts are integers, never floats. Addresses come from packages, never the model's memory. And you attack it before your users do."
- "It's CHECKLIST.md in the repo."
-->
---
layout: cover
---

# Thank you

<p class="mono fs-sm">Slides, reference app, AI first draft, x402 service, checklist</p>
<p class="chain mono fs-md">github.com/tobySolutions/prompt-to-payments</p>
<p class="mono fs-sm">Live demo: mamaput-lagos.vercel.app</p>
<p class="muted fs-sm" style="margin-top:1rem">@toby_solutions · tobySolutions.dev</p>

::right::

<Receipt title="SESSION RECEIPT" stamp="SHIPPED" :lines="[
  ['Apps built', '1'],
  ['Bugs found', '6', 'bug'],
  ['Payments verified', 'on-chain', 'ok'],
  ['APIs paid per request', 'x402', 'chain'],
]" />

<!--
TIME: 21:20 · then Q&A.

SAY
- "Thank you. The slides, the code and all three live apps are in the repo. I'm tobySolutions everywhere."

LIKELY QUESTIONS
- "Can I use this on mainnet?" Same code with the mainnet USDC mint, a paid RPC, a real database, and a facilitator that supports mainnet (x402.org is testnet only).
- "Why not Solana Pay?" Great for QR checkout at a counter. The same rule applies: confirm the transaction on your server before releasing the food.
- "Who pays the fees?" In the shop, the customer pays the network fee. In x402, the facilitator pays it.
- "Is Alpenglow live?" Yes, since 21 Oct. 150 ms finality is the target, not a measured number yet.
-->
