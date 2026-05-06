import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server contact API is not configured.' }, { status: 500 })
  }

  const body = await request.json()
  const payload = {
    name: String(body.name ?? '').trim(),
    email: String(body.email ?? '').trim(),
    project_type: String(body.project_type ?? 'Not sure yet'),
    budget_range: String(body.budget_range ?? 'Not sure yet'),
    message: String(body.message ?? '').trim(),
  }

  if (!payload.name || !payload.email || !payload.message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }

  const result = await supabaseAdmin.from('contact_messages').insert([payload]).select('id').single()

  if (result.error?.code === 'PGRST204') {
    const legacy = await supabaseAdmin
      .from('contact_messages')
      .insert([{
        name: payload.name,
        email: payload.email,
        message: [`Project type: ${payload.project_type}`, `Budget range: ${payload.budget_range}`, '', payload.message].join('\n'),
      }])
      .select('id')
      .single()

    if (legacy.error) {
      return NextResponse.json({ error: legacy.error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
