'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSchemaSetupMessage, isMissingTableError } from '@/lib/admin-schema'
import { supabase } from '@/lib/supabase'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  project_type: string | null
  budget_range: string | null
  created_at: string
}

export default function ViewMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [schemaMessage, setSchemaMessage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function loadMessages() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin')
        return
      }

      const { data, error } = await supabase
        .from('contact_messages')
        .select('id, name, email, message, project_type, budget_range, created_at')
        .order('created_at', { ascending: false })

      const needsLegacySelect = error?.code === 'PGRST204'
      const legacyResult = needsLegacySelect
        ? await supabase
            .from('contact_messages')
            .select('id, name, email, message, created_at')
            .order('created_at', { ascending: false })
        : null
      const finalData = legacyResult?.data ?? data
      const finalError = legacyResult?.error ?? error

      if (cancelled) {
        return
      }

      if (isMissingTableError(finalError)) {
        setSchemaMessage(getSchemaSetupMessage('Contact messages'))
        setMessages([])
        setLoading(false)
        return
      }

      setMessages((finalData as ContactMessage[] | null) ?? [])
      setLoading(false)
    }

    void loadMessages()

    return () => {
      cancelled = true
    }
  }, [router])

  async function deleteMessage(id: string) {
    if (!confirm('Delete this message?')) {
      return
    }

    const { error } = await supabase.from('contact_messages').delete().eq('id', id)

    if (!error) {
      setMessages((current) => current.filter((message) => message.id !== id))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Messages</h1>
      <p className="text-sm text-slate-500 mb-6">View and manage messages received through your portfolio contact form.</p>

      {schemaMessage ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 mb-6">
          {schemaMessage}
        </div>
      ) : null}

      <div>
        <div className="rounded-[24px] bg-white shadow">
          <div className="border-b p-6">
            <h2 className="text-xl font-bold text-gray-900">Messages Received ({messages.length})</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No messages yet.</div>
          ) : (
            <div className="divide-y">
              {messages.map((message) => (
                <div key={message.id} className="p-6 transition hover:bg-gray-50">
                  <div className="mb-2 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{message.name}</h3>
                      <p className="text-sm text-gray-600">{message.email}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                        {message.project_type ? <span className="rounded-full bg-slate-100 px-3 py-1">{message.project_type}</span> : null}
                        {message.budget_range ? <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{message.budget_range}</span> : null}
                      </div>
                      <p className="mt-1 text-xs text-gray-400">{new Date(message.created_at).toLocaleString()}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteMessage(message.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-gray-700">{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
