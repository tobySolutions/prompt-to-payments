# Before AI-written payment code ships

1. The server sets the price and creates the order. The client only says what it wants.
2. The server fetches the transaction itself (`getTransaction`, `maxSupportedTransactionVersion: 1`).
3. It succeeded: `meta.err` is null.
4. Right mint, right recipient, full amount, read from pre/post token balances.
5. A memo or Solana Pay reference ties the payment to exactly one order.
6. One signature, one order: a UNIQUE constraint, checked in the same database transaction that marks the order paid.
7. Amounts are bigint base units end to end. Never `price * 1e6`.
8. Token program and decimals are read from the mint (USDC is Token; PYUSD and USDG are Token-2022).
9. Addresses, mints and program ids come from packages, your own config or the chain. Never from a model's memory.
10. No secrets behind `NEXT_PUBLIC_`. Browser-visible RPC keys are origin-restricted.
11. An attack script (wrong amount, reused signature, fake signature) runs in CI and fails.
12. x402: v2 headers and `@x402/*` packages, CAIP-2 network ids, a client spend limit, a pinned SDK, and the merchant's token account created up front.
