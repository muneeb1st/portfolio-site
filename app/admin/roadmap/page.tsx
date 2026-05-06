'use client'

import { useEffect, useState } from 'react'
import { getSchemaSetupMessage, isMissingTableError } from '@/lib/admin-schema'
import { supabase } from '@/lib/supabase'

interface BuildingNextItem {
  id: string
  title: string
  description: string
  tags: string[]
  accent: string
  order_num: number
}

const defaultForm = { title: '', description: '', tags: '', accent: '247, 178, 77', order_num: 1 }

function parseCsv(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

export default function RoadmapPage() {
  const [items, setItems] = useState<BuildingNextItem[]>([])
  const [loading, setLoading] = useState(true)
  const [schemaMessage, setSchemaMessage] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(defaultForm)

  async function fetchItems() {
    const { data, error } = await supabase.from('building_next').select('*').order('order_num', { ascending: true })
    if (isMissingTableError(error)) {
      setSchemaMessage(getSchemaSetupMessage('Roadmap'))
      setItems([])
      setLoading(false)
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nextItems = ((data ?? []) as any[]).map((item) => ({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.filter((tag: unknown): tag is string => typeof tag === 'string') : [],
    })) as BuildingNextItem[]
    setItems(nextItems)
    setFormData((current) => ({ ...current, order_num: nextItems.length + 1 }))
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchItems()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (schemaMessage) return
    const payload = { title: formData.title, description: formData.description, tags: parseCsv(formData.tags), accent: formData.accent, order_num: formData.order_num }
    if (editingId) {
      const { error } = await supabase.from('building_next').update(payload).eq('id', editingId)
      if (!error) { setShowForm(false); setEditingId(null); setFormData(defaultForm); void fetchItems() }
    } else {
      const { error } = await supabase.from('building_next').insert([payload])
      if (!error) { setShowForm(false); setFormData(defaultForm); void fetchItems() }
    }
  }

  function editItem(item: BuildingNextItem) {
    setEditingId(item.id)
    setFormData({ title: item.title, description: item.description, tags: item.tags.join(', '), accent: item.accent, order_num: item.order_num })
    setShowForm(true)
  }

  function resetForm() {
    setEditingId(null); setShowForm(false)
    setFormData({ ...defaultForm, order_num: items.length + 1 })
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this roadmap item?')) return
    const { error } = await supabase.from('building_next').delete().eq('id', id)
    if (!error) void fetchItems()
  }

  if (loading) return <div className="flex items-center justify-center h-96">Loading roadmap...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Roadmap / Building Next</h1>

      {schemaMessage ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{schemaMessage}</div>
      ) : null}

      <button
        type="button"
        onClick={() => (showForm ? resetForm() : setShowForm(true))}
        disabled={Boolean(schemaMessage)}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
      >
        {showForm ? 'Cancel' : '+ Add Roadmap Item'}
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-900">{editingId ? 'Edit Roadmap Item' : 'Add Roadmap Item'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((c) => ({ ...c, title: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Healthcare Chatbot"
                required
              />
              <input
                type="text"
                value={formData.accent}
                onChange={(e) => setFormData((c) => ({ ...c, accent: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="247, 178, 77"
                required
              />
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((c) => ({ ...c, description: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
              placeholder="A patient-facing AI assistant..."
              required
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData((c) => ({ ...c, tags: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="AI/LLM, Healthcare, Booking Logic"
                required
              />
              <input
                type="number"
                min="1"
                value={formData.order_num}
                onChange={(e) => setFormData((c) => ({ ...c, order_num: Number(e.target.value) }))}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              {editingId ? 'Update Item' : 'Save Item'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Existing Roadmap Items ({items.length})</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">Accent: {item.accent} | Order: {item.order_num}</p>
              </div>
              <div className="flex gap-2 h-fit mt-2 sm:mt-0">
                <button type="button" onClick={() => editItem(item)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">Edit</button>
                <button type="button" onClick={() => deleteItem(item.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
