import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // In a real production app, you would add a secret token check here
    // for security to prevent anyone from purging your cache.
    // For now, we'll keep it simple as requested.
    
    revalidatePath('/')
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
