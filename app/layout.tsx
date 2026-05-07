import type { Metadata } from 'next'
import { Manrope, Syne } from 'next/font/google'
import './globals.css'
import PortfolioChatbot from '@/components/PortfolioChatbot'

const bodyFont = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
})

const displayFont = Syne({
  variable: '--font-display',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Muneeb Ur Rehman | Premium Websites & AI Systems',
  description:
    'Premium solo-studio portfolio for websites, AI chatbot systems, and launch-ready digital experiences by Muneeb Ur Rehman.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        {children}
        <PortfolioChatbot />
      </body>
    </html>
  )
}
