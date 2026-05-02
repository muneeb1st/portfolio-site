'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export default function ViewMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
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

      const { data } = await supabase
        .from('contact_messages')
        .select('id, name, email, message, created_at')
        .order('created_at', { ascending: false })

      if (cancelled) {
        return
      }

      setMessages((data as ContactMessage[] | null) ?? [])
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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <button type="button" onClick={() => router.push('/admin/dashboard')} className="text-blue-600 hover:underline">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-[24px] bg-white shadow">
          <div className="border-b p-6">
            <h2 className="text-xl font-bold">Messages Received ({messages.length})</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No messages yet.</div>
          ) : (
            <div className="divide-y">
              {messages.map((message) => (
                <div key={message.id} className="p-6 transition hover:bg-gray-50">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{message.name}</h3>
                      <p className="text-sm text-gray-600">{message.email}</p>
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
