"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const MERCHANT = new PublicKey("BzMDFqQe2D1QnXkUiponJCasNiCZn8zEtW4VVehXLikf");
// Devnet USDC mint
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
const DECIMALS = 6;
const AMOUNT = 2_500_000; // 2.50 USDC

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [status, setStatus] = useState<"idle" | "paying" | "paid" | "error">("idle");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  async function pay() {
    if (!publicKey) return;
    setStatus("paying");
    setError("");
    try {
      const from = getAssociatedTokenAddressSync(USDC_MINT, publicKey);
      const to = getAssociatedTokenAddressSync(USDC_MINT, MERCHANT);
      const tx = new Transaction().add(
        createAssociatedTokenAccountIdempotentInstruction(publicKey, to, MERCHANT, USDC_MINT),
        createTransferCheckedInstruction(from, USDC_MINT, to, publicKey, AMOUNT, DECIMALS)
      );
      const sig = await sendTransaction(tx, connection);
      const latest = await connection.getLatestBlockhash();
      await connection.confirmTransaction({ signature: sig, ...latest }, "confirmed");
      setSignature(sig);
      setStatus("paid");
    } catch (e: any) {
      setError(e?.message ?? "Payment failed");
      setStatus("error");
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "60px auto", padding: 24, textAlign: "center" }}>
      <h1>Jollof Rice</h1>
      <p style={{ fontSize: 48, margin: 0 }}>🍛</p>
      <p>Smoky party jollof, one order.</p>
      <h2>2.50 USDC</h2>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <WalletMultiButton />
      </div>
      {publicKey && status !== "paid" && (
        <button
          onClick={pay}
          disabled={status === "paying"}
          style={{ padding: "12px 24px", fontSize: 16, borderRadius: 8, cursor: "pointer" }}
        >
          {status === "paying" ? "Processing..." : "Pay 2.50 USDC"}
        </button>
      )}
      {status === "paid" && (
        <div style={{ background: "#e6ffed", padding: 16, borderRadius: 8, marginTop: 16 }}>
          <strong>Payment successful! Your jollof rice is on the way.</strong>
          <p style={{ wordBreak: "break-all", fontSize: 12 }}>
            <a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} target="_blank">
              View transaction
            </a>
          </p>
        </div>
      )}
      {status === "error" && <p style={{ color: "crimson" }}>{error}</p>}
    </main>
  );
}
