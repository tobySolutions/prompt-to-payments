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
30 seconds. Don't read the slide. Click through the three lines and land on the last sentence; it's the thesis of the session.

Facts match tobysolutions.dev/resume (checked 19 Oct 2026): Senior Technical Lead at Boh since Sep 2026 (EKGO! for 500+ restaurants across California); Software Engineer, Solana Foundation, Solana Developer Platform, Jul to Oct 2026; co-founder of Solana Students Africa; Solana Turbine Q4 2025 graduate; DevRel Engineer at Fleek and Gaia AI; Million.js contributor (Million.js has 16K+ GitHub stars).

TOBI: your Solana Foundation role ends on 21 Oct, the day before the talk. Say "I was at the Solana Foundation on the Solana Developer Platform" (past tense). Check you're happy saying "500+ restaurants" for Boh on stage; it's already on your public resume.

Photo: your GitHub avatar, saved locally so it works offline.
-->

---

# Build it. Break it. Fix it.

<div class="plan">
  <div v-click><b>1</b><span>Build</span><em>Prompt an AI. Get a working app.</em><i>15 min</i></div>
  <div v-click class="rev"><b>2</b><span>Break</span><em>Find what it got wrong.</em><i>20 min</i></div>
  <div v-click class="ship"><b>3</b><span>Fix</span><em>Make the server check the chain.</em><i>25 min</i></div>
  <div v-click class="x"><b>4</b><span>x402</span><em>Let an agent pay your API per request.</em><i>20 min</i></div>
</div>

<p v-click class="fs-md ink-soft mt-8">About 70 of the 90 minutes are hands-on.</p>

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
You introduced yourself on the previous slide. Now: "We're going to build first and talk later. In five minutes your AI will be writing a payment app."

Timing: 90 minutes. Build 15, Break 20, Fix 25, x402 20, checklist and questions 10.
-->
---

# Get these before we prompt

<div class="setup">
  <div v-click><span class="n">1</span><b>A wallet</b><span>Phantom, Solflare or Backpack. Switch it to <b class="chain">devnet</b>.</span></div>
  <div v-click><span class="n">2</span><b>Devnet SOL</b><span><code>faucet.solana.com</code> · 2 requests per 8 hours</span></div>
  <div v-click><span class="n">3</span><b>Devnet USDC</b><span><code>faucet.circle.com</code> · Solana Devnet · 20 USDC, once per 2 hours</span></div>
  <div v-click><span class="n">4</span><b>Node 24 + an AI assistant</b><span>Claude Code, Cursor, Copilot, any of them</span></div>
</div>

<Callout v-click tone="warn" title="Faucet down or rate limited?" class="mt-6">Raise your hand. I have pre-funded devnet wallets and a workshop RPC URL.</Callout>

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
clicks: 2
---

# Open your AI tool. Paste this.

<PromptBox class="mt-6" :typed="$clicks >= 1" text="Build a Next.js app where a customer connects a Solana wallet and pays 2.50 USDC on devnet for a jollof rice order. Show a success message when they've paid. The merchant wallet is <your wallet address>." />

<div class="go mt-8">
  <Countdown :minutes="10" :run="$clicks >= 2" />
  <p class="fs-md ink-soft">Get it running. Pay for one jollof. Raise your hand when you see the success message.</p>
</div>

<style>
.go { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 2rem; align-items: center; }
</style>

<!--
Click 1 types the prompt. Click 2 starts a 10-minute timer (click the timer itself to pause it).

This is deliberately a normal, slightly lazy prompt. It's what people actually type. They should put their own wallet address as the merchant, so they can see the money arrive.

While they work, build it yourself on the projector in a fresh folder, live, with your own AI tool. If your live build stalls (Wi-Fi, rate limits), switch to the pre-built one: `cd ai-first-draft && npm run dev`.

Walk the room. Common snags:
- Wallet on mainnet instead of devnet: balances show 0.
- No devnet USDC: faucet.circle.com, or hand out a pre-funded wallet.
- 429 errors: public devnet RPC rate limit, shared by everyone on the hotel Wi-Fi. Give out the workshop RPC URL.

People will get different stacks from different assistants. Good: the review works on all of them.
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
num: 2
---

# Break it

It works. That's a different question from whether it's correct.
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
layout: live
where: Editor · app/page.tsx
---

# Read it like the money is yours

<div class="qs">
  <p v-click><b>1</b>Who decides the order is paid?</p>
  <p v-click><b>2</b>Where does the 2.50 come from?</p>
  <p v-click><b>3</b>Two people pay 2.50 at once. Which jollof is whose?</p>
</div>

<div v-click class="timer-gap"><Countdown :minutes="5" :run="$clicks >= 4" /></div>

<style>
.qs { display: grid; gap: 1rem; margin-top: 1rem; }
.qs p { display: grid; grid-template-columns: 2.6rem minmax(0, 1fr); font-size: var(--fs-xl) !important; font-weight: 700; margin: 0 !important; }
.qs b { color: var(--bug); font-weight: 900; font-stretch: 62%; }
</style>

<!--
The room's first review. Switch to your editor and open the AI's page.tsx (the pre-built one is ai-first-draft/app/page.tsx). Give everyone 5 minutes to answer the three questions about THEIR OWN generated code, then take answers out loud.

Answers in the reference draft:
1. The browser. After confirmTransaction it calls setStatus("paid"). No server ever hears about it. Anyone can flip that state in React DevTools.
2. A constant in client code: const AMOUNT = 2_500_000. The customer controls it.
3. Nobody can tell. There's no order id on the payment.

Point at the lines in the editor while people answer. That's more engaging than any code slide. (Code slides for each bug are in the backup deck (`npm run backup`, localhost:3031).)
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
Be fair to the AI. The on-chain part is mostly fine. It picked transferChecked, an idempotent account create, the right mint and decimals. Two years ago assistants got these wrong all the time.

What it got wrong is the money part: who decides an order is paid, who sets the price, and how you tie a payment to an order. These aren't Solana trivia. They're the same rules a bank or Paystack integration follows, and the AI skipped them because the prompt said "show a success message", so it did exactly that.

That's the main lesson: the AI answers the prompt you wrote, not the system you need.
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
- Since 14 Jul 2026 (commit 43233c0, still in v2.7.0 checked 19 Oct): the Solana Foundation's dev skill for AI agents (github.com/solana-foundation/solana-dev-skill) says "Do not use @solana/client / @solana/react-hooks (framework-kit) or @solana/wallet-adapter-* for new work."
- Alpenglow activates on mainnet at epoch 1064, Wed 21 Oct 2026 ~15:00 UTC: yesterday, from the room's point of view. Target finality ~150 ms, down from ~12.8 s. "confirmed and finalized become the same thing." https://solana.com/upgrades/alpenglow

TOBI: on the morning of the 22nd, check that Alpenglow actually activated (the feature account A1pengvuM6JEcyNuTnMqepBKhwHE3N6PmUrdATGawhJS should be owned by the Feature program, not System). If it slipped, change the last line to "scheduled".

Say: "Every model in this room was trained before at least one of these. That's not the model's fault. It's why you review."
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
  { from: 's', to: 'b', label: 'signed order: id, price, mint, merchant', tone: 'ok' },
  { from: 'b', to: 'w', label: 'sign: create + transferChecked + memo', tone: 'ai' },
  { from: 'w', to: 'c', label: 'send transaction', tone: 'chain' },
  { from: 'b', to: 's', label: 'POST /verify { order, signature }' },
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
---

# Fix it

<div class="tasks">
  <div v-click><span>1</span><p>Add an <code>/api/orders</code> route. The server sets the price.</p></div>
  <div v-click><span>2</span><p>Put the order id in a memo</p></div>
  <div v-click><span>3</span><p>Add <code>/verify</code>: fetch the tx, it succeeded, memo matches, merchant got paid</p></div>
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

A good prompt to give the room: "Move the price to the server. Add POST /api/orders that returns an order id, price in base units, mint and merchant. Add the order id as an SPL memo. Add POST /api/orders/:id/verify that fetches the transaction with getTransaction and checks it succeeded, the memo matches, and the merchant's USDC balance rose by the full price. Refuse a signature that was already used."

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
npm run dev
node scripts/e2e.ts
```

  <p v-click class="fs-md mt-6">Real devnet payments. Same routes the browser uses.</p>
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
  ]" />
</div>

<style>
.atk { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 2rem; align-items: center; margin-top: 0.6rem; }
</style>

<!--
Run it live in the reference app folder: `npm run dev` in one terminal, `node scripts/e2e.ts` in another. It pays on devnet with your CLI wallet (~/.config/solana/id.json) and tries six attacks, then checks the kitchen. All 10 checks passed on 19 Oct 2026. Keep the kitchen screen open on the projector while it runs: the underpaid order shows up red and the refusals list fills.

The receipt on the slide is the fallback if the network dies mid-demo.

The habit to leave them with: "Write a script that tries to get this order marked paid without paying the full price." AI is very good at writing attacks. It's how you find out whether its own fix holds.
-->
---
layout: section
tone: http
num: 4
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
layout: live
where: Terminal · x402/
---

# Pay for a proverb

<p class="fs-md">Open <span class="mono chain">mamaput-lagos.vercel.app/agent</span> and press <b>Run the agent</b>. Or in a terminal:</p>

```bash
curl -i https://mamaput-x402.vercel.app/proverb   # 402 + PAYMENT-REQUIRED
npm run agent                                     # in x402/: signs $0.001 USDC, retries, gets the proverb
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
Live in x402/. Three terminal commands; the clicks are what to point at on screen.

- `curl -i` shows the 402 and the PAYMENT-REQUIRED header (base64 JSON). Decode it for the room: `curl -s -D - localhost:4021/proverb -o /dev/null | grep -i payment-required | cut -d' ' -f2 | tr -d '\r' | base64 -d`
- The agent's wallet needs devnet USDC but no SOL. The x402.org facilitator pays the fee.
- The merchant (PAY_TO) must already have a devnet USDC token account. The x402 Solana scheme doesn't let the payer create one.

STATUS (19 Oct 2026): the hosted service (mamaput-x402.vercel.app) and the hosted agent page are live and tested up to step 4. The paid retry fails only because the hosted agent wallet 9MKM8N5ZaFDhFave7SR2uS4cBHjURCXemJHdEQYSXP1k has 0 devnet USDC. TOBI: fund it at faucet.circle.com and press Run once before the day.

Fallback slides with the decoded JSON, the server code and the agent code are in the backup deck (`npm run backup`, localhost:3031).
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
TOBI: the repo URL is a placeholder until you approve publishing it. If you choose a different name, change it here and in the README.

Leave this up during Q&A.

Likely questions:
- "Can I use this on mainnet?" Same code, mainnet USDC mint EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v, a paid RPC, a real database, and the x402 facilitator changed to one that supports mainnet (PayAI, or Coinbase CDP with a key). x402.org is testnet only.
- "Why not Solana Pay?" It's a great fit for QR checkout at a counter. The spec is maintained, and @solana/pay 1.x is now built on kit 6. Same verification rules apply: its own spec says confirm and validate the transaction before releasing goods.
- "Who pays the gas?" In our checkout, the customer pays the 5,000-lamport fee plus rent if the merchant's USDC account is new. In x402, the facilitator pays the fee.
- "Is Alpenglow live?" Check on the morning: it was scheduled for epoch 1064, 21 Oct ~15:00 UTC.
-->
