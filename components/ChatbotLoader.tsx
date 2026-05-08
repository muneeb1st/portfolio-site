'use client'

import dynamic from 'next/dynamic'

const PortfolioChatbot = dynamic(() => import('./PortfolioChatbot'), {
  ssr: false,
  loading: () => null,
})

export default function ChatbotLoader() {
  return <PortfolioChatbot />
}
