import type { Metadata } from 'next'
import { Manrope, Syne } from 'next/font/google'
import './globals.css'

const bodyFont = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
})

const displayFont = Syne({
  variable: '--font-display',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Muneeb Ur Rehman | Web Developer & AI Builder',
  description:
    'CS student, fast learner, and builder. I design premium websites, build AI chatbot systems, and ship real projects. Available for freelance work.',
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
      </body>
    </html>
  )
}
