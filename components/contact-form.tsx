'use client'

import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Send, Check, Copy, Sparkles, AlertCircle } from 'lucide-react'
import { sounds } from '@/lib/sound'

const PROJECT_TYPES = [
  'Full-Stack Web App',
  'AI Chatbot / Agent',
  'Conversion Website',
  'Supabase Backend / API',
  'Other / Custom Idea',
]

const BUDGET_RANGES = [
  '<$1,000',
  '$1,000 - $2,500',
  '$2,500 - $5,000',
  '$5,000+',
  'Flexible / Retainer',
]

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    project_type: 'Full-Stack Web App',
    budget_range: '$1,000 - $2,500',
    message: '',
  })

  const copyEmail = () => {
    sounds.playClick()
    navigator.clipboard.writeText('muneeburehman1st@gmail.com')
    setCopiedEmail(true)
    sounds.playSuccess()
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    sounds.playClick()
    setSubmitting(true)
    setStatus(null)

    try {
      const apiResult = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!apiResult.ok) {
        const payload = await apiResult.json().catch(() => null)
        sounds.playClick()
        setStatus({
          tone: 'error',
          message: payload?.error
            ? `Message could not be saved: ${payload.error}`
            : 'Something went wrong. Please reach out directly to muneeburehman1st@gmail.com',
        })
      } else {
        sounds.playSuccess()
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f4c978', '#8fcad0', '#ffd98c', '#ffffff'],
          })
        } catch {
          // ignore confetti errors
        }

        setStatus({
          tone: 'success',
          message: 'Message delivered! I will review your project details and get back to you promptly.',
        })

        setForm({
          name: '',
          email: '',
          project_type: 'Full-Stack Web App',
          budget_range: '$1,000 - $2,500',
          message: '',
        })
      }
    } catch {
      setStatus({
        tone: 'error',
        message: 'Network issue. Please send an email directly to muneeburehman1st@gmail.com.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const messageProgress = Math.min(100, Math.max(5, (form.message.length / 150) * 100))

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#f4c978]/30 bg-gradient-to-br from-[#181511]/95 via-[#120f0c]/90 to-[#080706] p-6 sm:p-9 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      {/* Decorative Aura */}
      <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[#f4c978]/10 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#ffd98c]">
            <Sparkles className="h-3.5 w-3.5 text-[#f4c978]" />
            Direct Inquiry Channel
          </span>
          <h3 className="font-display text-2xl font-bold text-white tracking-tight mt-1">
            Let&apos;s build something exceptional.
          </h3>
        </div>

        <button
          type="button"
          onClick={copyEmail}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-mono text-stone-300 hover:border-[#f4c978] hover:text-white transition-all self-start sm:self-auto"
        >
          {copiedEmail ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          {copiedEmail ? 'Email Copied!' : 'Copy Email'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name & Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
              Your Name *
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Alexander Wright"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-stone-600 focus:border-[#f4c978] focus:bg-black/60 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
              Your Email *
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="e.g. alexander@company.com"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-stone-600 focus:border-[#f4c978] focus:bg-black/60 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Row 2: Project Type Chips */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
            Select Offer / Project Scope
          </label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPES.map((type) => {
              const isSelected = form.project_type === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    sounds.playClick()
                    setForm((f) => ({ ...f, project_type: type }))
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border border-[#ffd98c] bg-[#ffd98c] !text-[#080706] font-bold shadow-[0_0_15px_rgba(255,217,140,0.35)]'
                      : 'border border-white/10 bg-white/5 text-stone-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        {/* Row 3: Budget Range Chips */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
            Estimated Budget
          </label>
          <div className="flex flex-wrap gap-2">
            {BUDGET_RANGES.map((b) => {
              const isSelected = form.budget_range === b
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    sounds.playClick()
                    setForm((f) => ({ ...f, budget_range: b }))
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border border-[#8fcad0] bg-[#8fcad0] !text-[#080706] font-bold shadow-[0_0_15px_rgba(143,202,208,0.35)]'
                      : 'border border-white/10 bg-white/5 text-stone-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {b}
                </button>
              )
            })}
          </div>
        </div>

        {/* Row 4: Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="message" className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
              Project Description / Goals *
            </label>
            <span className="text-[11px] font-mono text-stone-500">{form.message.length} chars</span>
          </div>
          <textarea
            id="message"
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Tell me what you are building, timeline expectations, or any specific integrations..."
            className="w-full resize-none rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white placeholder:text-stone-600 focus:border-[#f4c978] focus:bg-black/60 focus:outline-none transition-all"
          />
          {/* Depth meter */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#f4c978] to-[#8fcad0] transition-all duration-300"
              style={{ width: `${messageProgress}%` }}
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#ffd98c]/50 bg-gradient-to-r from-[#ffd98c] via-[#f5c76d] to-[#e5b358] py-3.5 text-xs font-mono font-bold uppercase tracking-widest !text-[#080706] shadow-[0_0_30px_rgba(255,217,140,0.35)] hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(255,217,140,0.5)] transition-all disabled:opacity-50"
          >
            <Send className="h-4 w-4 !text-[#080706]" />
            <span className="font-bold !text-[#080706]">{submitting ? 'Transmitting Message...' : 'Send Message Now'}</span>
          </button>
        </div>

        {/* Status Toast */}
        {status && (
          <div
            className={`flex items-start gap-2.5 rounded-xl border p-4 text-xs ${
              status.tone === 'success'
                ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                : 'border-red-500/40 bg-red-950/40 text-red-300'
            }`}
          >
            {status.tone === 'success' ? (
              <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            )}
            <p className="leading-relaxed">{status.message}</p>
          </div>
        )}
      </form>
    </div>
  )
}
