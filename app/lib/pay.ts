// Builds the three instructions for paying an order. Runs in the browser.
import { address, type Address, type TransactionSigner } from '@solana/kit'
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstructionAsync,
  getTransferCheckedInstruction,
} from '@solana-program/token'
import { getAddMemoInstruction } from '@solana-program/memo'

export type OrderDTO = {
  id: string
  amount: string // base units, as a string because JSON has no bigint
  mint: string
  tokenProgram: string
  decimals: number
  recipient: string
}

export async function buildPayment(order: OrderDTO, payer: TransactionSigner) {
  const mint = address(order.mint)
  const tokenProgram = address(order.tokenProgram) // Token or Token-2022, the server checked
  const merchant = address(order.recipient)

  const ata = (owner: Address) => findAssociatedTokenPda({ owner, mint, tokenProgram }).then(([a]) => a)
  const [source, destination] = await Promise.all([ata(payer.address), ata(merchant)])

  return [
    // Creates the merchant's USDC account if it doesn't exist. A no-op if it does.
    await getCreateAssociatedTokenIdempotentInstructionAsync({ payer, owner: merchant, mint, tokenProgram }),
    // transferChecked makes the program check the mint and decimals too.
    getTransferCheckedInstruction(
      { source, mint, destination, authority: payer, amount: BigInt(order.amount), decimals: order.decimals },
      { programAddress: tokenProgram },
    ),
    // Ties this payment to exactly one order.
    getAddMemoInstruction({ memo: order.id }),
  ]
}
