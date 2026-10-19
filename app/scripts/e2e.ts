// End-to-end check against a running `npm run dev`, using a CLI keypair in place
// of a browser wallet. Same instruction builder and server routes as the app.
// usage: node scripts/e2e.ts [path/to/keypair.json]
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import {
  appendTransactionMessageInstructions, assertIsTransactionWithBlockhashLifetime, createKeyPairSignerFromBytes, createSolanaRpc, createSolanaRpcSubscriptions,
  createTransactionMessage, getSignatureFromTransaction, pipe, sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner, setTransactionMessageLifetimeUsingBlockhash, signTransactionMessageWithSigners,
} from '@solana/kit'
import { buildPayment, type OrderDTO } from '../lib/pay.ts'

const BASE = process.env.BASE ?? 'http://localhost:3000'
const rpc = createSolanaRpc('https://api.devnet.solana.com')
const rpcSubscriptions = createSolanaRpcSubscriptions('wss://api.devnet.solana.com')
const keyPath = process.argv[2] ?? `${homedir()}/.config/solana/id.json`
const payer = await createKeyPairSignerFromBytes(new Uint8Array(JSON.parse(readFileSync(keyPath, 'utf8'))))

const post = (path: string, body: unknown) =>
  fetch(BASE + path, { method: 'POST', body: JSON.stringify(body) }).then(async r => ({ status: r.status, body: await r.json() }))

async function payFor(order: OrderDTO) {
  const instructions = await buildPayment(order, payer)
  const { value: blockhash } = await rpc.getLatestBlockhash().send()
  const msg = pipe(
    createTransactionMessage({ version: 0 }),
    m => setTransactionMessageFeePayerSigner(payer, m),
    m => setTransactionMessageLifetimeUsingBlockhash(blockhash, m),
    m => appendTransactionMessageInstructions(instructions, m),
  )
  const tx = await signTransactionMessageWithSigners(msg)
  assertIsTransactionWithBlockhashLifetime(tx)
  await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(tx, { commitment: 'confirmed' })
  return getSignatureFromTransaction(tx)
}

let failed = 0
const check = (name: string, ok: boolean, detail: unknown) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`, ok ? '' : JSON.stringify(detail))
  if (!ok) failed++
}

console.log('payer', payer.address)
const a = await post('/api/orders', { item: 'jollof' })
check('create order', a.status === 200 && a.body.amount === '2500000', a)
const sig = await payFor(a.body)
console.log('paid', `https://explorer.solana.com/tx/${sig}?cluster=devnet`)

const v1 = await post(`/api/orders/${a.body.id}/verify`, { signature: sig })
check('verify real payment', v1.status === 200 && v1.body.status === 'paid', v1)

const b = await post('/api/orders', { item: 'suya' })
const v2 = await post(`/api/orders/${b.body.id}/verify`, { signature: sig })
check('reuse signature on another order is refused', v2.status === 402, v2)

const v3 = await post(`/api/orders/${b.body.id}/verify`, { signature: '1111111111111111111111111111111111111111111111111111111111111111' })
check('unknown signature is refused', v3.status === 402, v3)

const c = await post('/api/orders', { item: 'jollof', price: '1' })
check('client cannot set price', c.body.amount === '2500000', c)

const d = await post('/api/orders', { item: 'free-food' })
check('unknown item refused', d.status === 400, d)

// Underpay: pay 0.50 against a 2.50 order by tampering with the DTO client-side.
const e = await post('/api/orders', { item: 'jollof' })
const cheap = await payFor({ ...e.body, amount: '500000' })
const v4 = await post(`/api/orders/${e.body.id}/verify`, { signature: cheap })
check('underpayment refused', v4.status === 402, v4)

console.log(failed ? `${failed} FAILED` : 'ALL PASS')
process.exit(failed ? 1 : 0)
