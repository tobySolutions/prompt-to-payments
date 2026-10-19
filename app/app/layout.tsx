import type { ReactNode } from 'react'
import { Archivo, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'
import { Header } from './header'
import './globals.css'

// Self-hosted at build time, so the venue Wi-Fi doesn't have to fetch fonts.
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', axes: ['wdth'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata = { title: 'Mama Put · pay in USDC', description: 'A Solana devnet stablecoin checkout from the Prompt to Payments workshop' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${mono.variable}`}>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
