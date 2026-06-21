import type { Metadata } from 'next'
import { Manrope, Syne } from 'next/font/google'
import './globals.css'
import ChatbotLoader from '@/components/ChatbotLoader'

const bodyFont = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
})

const displayFont = Syne({
  variable: '--font-display',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://muneeb1st.vercel.app'),
  title: 'Muneeb Ur Rehman | Full-Stack Developer',
  description:
    'Portfolio of Muneeb Ur Rehman, a CS student and full-stack developer building Next.js apps, Supabase-backed workflows, and practical AI automations.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Muneeb Ur Rehman | Full-Stack Developer',
    description:
      'Next.js, Supabase, Python, and AI automation projects by Muneeb Ur Rehman.',
    url: '/',
    siteName: 'Muneeb Ur Rehman Portfolio',
    type: 'website',
    images: [
      {
        url: 'https://ipditzvdtddpahizkbej.supabase.co/storage/v1/object/public/project-images/9b049257-2449-450c-9b0b-ae32ed6048f9.png',
        width: 1200,
        height: 760,
        alt: 'Muneeb Ur Rehman portfolio project preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muneeb Ur Rehman | Full-Stack Developer',
    description:
      'Next.js, Supabase, Python, and AI automation projects by Muneeb Ur Rehman.',
    images: ['https://ipditzvdtddpahizkbej.supabase.co/storage/v1/object/public/project-images/9b049257-2449-450c-9b0b-ae32ed6048f9.png'],
  },
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
        <ChatbotLoader />
      </body>
    </html>
  )
}


