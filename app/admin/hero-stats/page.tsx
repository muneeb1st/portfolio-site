'use client'

import { useEffect, useState } from 'react'
import { getSchemaSetupMessage, isMissingTableError } from '@/lib/admin-schema'
import { supabase } from '@/lib/supabase'

interface HeroStat {
  id: string
  value: string
  label: string
  order_num: number
}

export default function HeroStatsPage() {
  const [stats, setStats] = useState<HeroStat[]>([])
  const [loading, setLoading] = useState(true)
  const [schemaMessage, setSchemaMessage] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    value: '',
    label: '',
    order_num: 1,
  })

  async function fetchStats() {
    const { data, error } = await supabase.from('hero_stats').select('*').order('order_num', { ascending: true })
    if (isMissingTableError(error)) {
      setSchemaMessage(getSchemaSetupMessage('Hero stats'))
      setStats([])
      setLoading(false)
      return
    }
    const nextStats = (data as HeroStat[] | null) ?? []
    setStats(nextStats)
    setFormData((current) => ({
      ...current,
      order_num: nextStats.length + 1,
    }))
    setLoading(false)
  }

  useEffect(() => {
    void fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function editStat(stat: HeroStat) {
    setEditingId(stat.id)
    setFormData({ value: stat.value, label: stat.label, order_num: stat.order_num })
  }

  function cancelEdit() {
    setEditingId(null)
    setFormData({ value: '', label: '', order_num: stats.length + 1 })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (schemaMessage) {
      return
    }

    if (editingId) {
      const { error } = await supabase.from('hero_stats').update({
        value: formData.value, label: formData.label, order_num: formData.order_num,
      }).eq('id', editingId)
      
      if (!error) {
        cancelEdit()
        void fetchStats()
      }
      return
    }

    const { error } = await supabase.from('hero_stats').insert([
      {
        value: formData.value,
        label: formData.label,
        order_num: formData.order_num,
      },
    ])

    if (!error) {
      setFormData({ value: '', label: '', order_num: stats.length + 2 })
      void fetchStats()
    }
  }

  async function deleteStat(id: string) {
    if (!confirm('Delete this hero stat?')) {
      return
    }

    const { error } = await supabase.from('hero_stats').delete().eq('id', id)
    if (!error) {
      void fetchStats()
      if (editingId === id) {
        cancelEdit()
      }
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading hero stats...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Hero Stats</h1>

      {schemaMessage ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{schemaMessage}</div>
      ) : null}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900">{editingId ? 'Edit Hero Stat' : 'Add Hero Stat'}</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            value={formData.value}
            onChange={(event) => setFormData((current) => ({ ...current, value: event.target.value }))}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="430+"
            required
          />
          <input
            type="text"
            value={formData.label}
            onChange={(event) => setFormData((current) => ({ ...current, label: event.target.value }))}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="GitHub contributions in the last year"
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
          <div className="md:col-span-3 flex gap-2">
            <button
              type="submit"
              disabled={Boolean(schemaMessage)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
            >
              {editingId ? 'Update Stat' : 'Add Stat'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Existing Hero Stats ({stats.length})</h2>
        <div className="grid gap-3">
          {stats.map((stat) => (
            <div key={stat.id} className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <div className="font-semibold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                <div className="text-xs text-gray-400 mt-1">Order: {stat.order_num}</div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => editStat(stat)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Edit
                </button>
                <button type="button" onClick={() => deleteStat(stat.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
