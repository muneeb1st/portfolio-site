import { fetchAllPortfolioData } from '@/lib/data'
import { Metadata } from 'next'
import { ResumeClientView } from './ResumeClientView'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Resume - Muneeb Ur Rehman',
  description: 'Full-Stack Developer & AI Automation Engineer Resume and Credentials.',
}

export default async function ResumePage() {
  const data = await fetchAllPortfolioData()

  return <ResumeClientView data={data} />
}
