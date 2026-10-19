import type { ReactNode } from 'react'
import { Providers } from './providers'
import './globals.css'

export const metadata = { title: 'Mama Put · pay in USDC', description: 'A devnet stablecoin checkout' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
