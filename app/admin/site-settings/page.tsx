'use client'

import { useEffect, useState } from 'react'
import { getSchemaSetupMessage, isMissingTableError } from '@/lib/admin-schema'
import { supabase } from '@/lib/supabase'

interface SiteSettingsForm {
  id: string | null
  hero_title: string
  hero_badge: string
  contact_title: string
  contact_subtitle: string
  footer_text: string
  ticker_items: string
}

const defaultSettings: SiteSettingsForm = {
  id: null,
  hero_title: 'I build what most people think takes years to learn.',
  hero_badge: 'Available for projects',
  contact_title: "Got a project in mind? Let's build it.",
  contact_subtitle:
    'Tell me what you need - a website, a chatbot, or both. I will get back to you with a clear plan and timeline.',
  footer_text: 'Built with Next.js, Supabase, and a lot of late nights.',
  ticker_items:
    'React, Next.js, TypeScript, Python, Tailwind CSS, Supabase, Node.js, AI Chatbots, Responsive Design, Git & GitHub, AWS, REST APIs',
}

function toCsv(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string').join(', ')
    : defaultSettings.ticker_items
}

function fromCsv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function SiteSettingsPage() {
  const [formData, setFormData] = useState<SiteSettingsForm>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [schemaMessage, setSchemaMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      const { data, error } = await supabase.from('site_settings').select('*').maybeSingle()

      if (cancelled) {
        return
      }

      if (isMissingTableError(error)) {
        setSchemaMessage(getSchemaSetupMessage('Site settings'))
        setLoading(false)
        return
      }

      if (data) {
        setFormData({
          id: data.id,
          hero_title: data.hero_title ?? defaultSettings.hero_title,
          hero_badge: data.hero_badge ?? defaultSettings.hero_badge,
          contact_title: data.contact_title ?? defaultSettings.contact_title,
          contact_subtitle: data.contact_subtitle ?? defaultSettings.contact_subtitle,
          footer_text: data.footer_text ?? defaultSettings.footer_text,
          ticker_items: toCsv(data.ticker_items),
        })
      }

      setLoading(false)
    }

    void fetchData()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (schemaMessage) {
      return
    }

    setSaving(true)

    const payload = {
      hero_title: formData.hero_title,
      hero_badge: formData.hero_badge,
      contact_title: formData.contact_title,
      contact_subtitle: formData.contact_subtitle,
      footer_text: formData.footer_text,
      ticker_items: fromCsv(formData.ticker_items),
      updated_at: new Date().toISOString(),
    }

    if (formData.id) {
      const { error } = await supabase.from('site_settings').update(payload).eq('id', formData.id)
      if (!error) {
        alert('Site settings updated successfully.')
      } else {
        alert(error.message)
      }
    } else {
      const { data, error } = await supabase.from('site_settings').insert([payload]).select('*').single()
      if (!error && data) {
        setFormData((current) => ({ ...current, id: data.id }))
        alert('Site settings created successfully.')
      } else if (error) {
        alert(error.message)
      }
    }

    setSaving(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading site settings...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>

      {schemaMessage ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{schemaMessage}</div>
      ) : null}

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Hero Title</label>
            <input
              type="text"
              value={formData.hero_title}
              onChange={(event) => setFormData((current) => ({ ...current, hero_title: event.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Hero Badge Text</label>
            <input
              type="text"
              value={formData.hero_badge}
              onChange={(event) => setFormData((current) => ({ ...current, hero_badge: event.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Contact Section Title</label>
            <input
              type="text"
              value={formData.contact_title}
              onChange={(event) => setFormData((current) => ({ ...current, contact_title: event.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Contact Section Subtitle</label>
            <textarea
              value={formData.contact_subtitle}
              onChange={(event) => setFormData((current) => ({ ...current, contact_subtitle: event.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Footer Text</label>
            <input
              type="text"
              value={formData.footer_text}
              onChange={(event) => setFormData((current) => ({ ...current, footer_text: event.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Ticker Items (comma separated)</label>
            <textarea
              value={formData.ticker_items}
              onChange={(event) => setFormData((current) => ({ ...current, ticker_items: event.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving || Boolean(schemaMessage)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  )
}
