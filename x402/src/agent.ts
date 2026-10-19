// An "agent" that pays per request with x402. No account, no API key, no card.
// It needs devnet USDC (faucet.circle.com) but no SOL: the facilitator pays the fee.
// usage: npm run agent   (AGENT_KEYPAIR_PATH defaults to ~/.config/solana/id.json)
import { agentInfo, runAgent } from './run-agent.ts'

const API = process.env.API_URL ?? 'http://localhost:4021/proverb'
console.log('agent', await agentInfo())
const run = await runAgent(API)
for (const s of run.steps) console.log(`${s.n}. ${s.title}\n   ${s.detail}`)
if (!run.ok) {
  console.log('not paid:', run.error)
  process.exit(1)
}
console.log(`https://explorer.solana.com/tx/${run.tx}?cluster=devnet`)
