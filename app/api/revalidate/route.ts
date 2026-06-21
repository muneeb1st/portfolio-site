import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server admin API is not configured.' }, { status: 500 })
    }

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const authClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data: userData, error: userError } = await authClient.auth.getUser(token)

    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminCheck = await supabaseAdmin
      .from('admin_profiles')
      .select('id')
      .eq('user_id', userData.user.id)
      .maybeSingle()

    const allowedEmail = process.env.ADMIN_EMAIL?.toLowerCase()
    const emailAllowed = allowedEmail && userData.user.email?.toLowerCase() === allowedEmail

    if ((adminCheck.error || !adminCheck.data) && !emailAllowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    revalidatePath('/')
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
