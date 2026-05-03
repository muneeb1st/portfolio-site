'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    const { error } = await supabase.from('contact_messages').insert([form])

    if (error) {
      setStatus({ tone: 'error', message: 'Message did not send. Try again and I will make sure we get it through.' })
    } else {
      setStatus({ tone: 'success', message: 'Message sent. I will get back to you with ideas for your build.' })
      setForm({ name: '', email: '', message: '' })
    }

    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs uppercase tracking-[0.22em] text-white/50">Name</label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#5de2e7] focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs uppercase tracking-[0.22em] text-white/50">Email</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#5de2e7] focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <label htmlFor="message" className="text-xs uppercase tracking-[0.22em] text-white/50">Message</label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#5de2e7] focus:outline-none resize-none"
          placeholder="Tell me about your project..."
        />
      </div>
      <button type="submit" disabled={submitting} className="glow-button mt-6 inline-flex w-full sm:w-auto justify-center text-sm px-6 py-3 disabled:opacity-50">
        {submitting ? 'Sending...' : 'Send message'}
      </button>
      {status && (
        <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${status.tone === 'success' ? 'bg-[#5de2e7]/10 text-[#5de2e7]' : 'bg-red-500/10 text-red-400'}`}>
          {status.message}
        </div>
      )}
    </form>
  )
}