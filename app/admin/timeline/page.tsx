'use client'

import { useEffect, useState } from 'react'
import { getSchemaSetupMessage, isMissingTableError } from '@/lib/admin-schema'
import { supabase } from '@/lib/supabase'

interface TimelineItem {
  id: string
  phase: string
  description: string
  order_num: number
}

export default function TimelinePage() {
  const [items, setItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [schemaMessage, setSchemaMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    phase: '',
    description: '',
    order_num: 1,
  })

  async function fetchItems() {
    const { data, error } = await supabase.from('timeline_items').select('*').order('order_num', { ascending: true })
    if (isMissingTableError(error)) {
      setSchemaMessage(getSchemaSetupMessage('Timeline'))
      setItems([])
      setLoading(false)
      return
    }
    const nextItems = (data as TimelineItem[] | null) ?? []
    setItems(nextItems)
    setFormData((current) => ({
      ...current,
      order_num: nextItems.length + 1,
    }))
    setLoading(false)
  }

  useEffect(() => {
    void fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (schemaMessage) {
      return
    }

    const { error } = await supabase.from('timeline_items').insert([
      {
        phase: formData.phase,
        description: formData.description,
        order_num: formData.order_num,
      },
    ])

    if (!error) {
      setFormData({ phase: '', description: '', order_num: items.length + 2 })
      void fetchItems()
    }
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this timeline item?')) {
      return
    }

    const { error } = await supabase.from('timeline_items').delete().eq('id', id)
    if (!error) {
      void fetchItems()
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading timeline...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Learning Timeline</h1>

      {schemaMessage ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{schemaMessage}</div>
      ) : null}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Add Timeline Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.phase}
              onChange={(event) => setFormData((current) => ({ ...current, phase: event.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Phase 4"
              required
            />
            <input
              type="number"
              min="1"
              value={formData.order_num}
              onChange={(event) => setFormData((current) => ({ ...current, order_num: Number(event.target.value) }))}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <textarea
            value={formData.description}
            onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
            className="w-full px-4 py-2 border rounded-lg"
            rows={4}
            placeholder="Describe this phase..."
            required
          />
          <button
            type="submit"
            disabled={Boolean(schemaMessage)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
          >
            Add Timeline Item
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Existing Timeline Items ({items.length})</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between border rounded-lg p-4">
              <div>
                <div className="font-semibold">{item.phase}</div>
                <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                <div className="text-xs text-gray-400 mt-2">Order: {item.order_num}</div>
              </div>
              <button type="button" onClick={() => deleteItem(item.id)} className="text-red-600 hover:text-red-700 text-sm">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
