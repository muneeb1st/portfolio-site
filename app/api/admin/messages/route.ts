import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
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

  if (adminCheck.error || !adminCheck.data) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const result = await supabaseAdmin
    .from('contact_messages')
    .select('id, name, email, message, project_type, budget_range, created_at')
    .order('created_at', { ascending: false })

  if (result.error?.code === 'PGRST204') {
    const legacyResult = await supabaseAdmin
      .from('contact_messages')
      .select('id, name, email, message, created_at')
      .order('created_at', { ascending: false })

    if (legacyResult.error) {
      return NextResponse.json({ error: legacyResult.error.message }, { status: 500 })
    }

    return NextResponse.json({ messages: legacyResult.data ?? [] })
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 })
  }

  return NextResponse.json({ messages: result.data ?? [] })
}
