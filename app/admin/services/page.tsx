'use client'

import { useEffect, useState } from 'react'
import { getSchemaSetupMessage, isMissingTableError } from '@/lib/admin-schema'
import { supabase } from '@/lib/supabase'

interface ServiceShowcase {
  id: string
  eyebrow: string
  title: string
  summary: string
  highlight: string
  deliverables: string[]
  accent: string
  tags: string[]
  order_num: number
}

interface OfferPackage {
  id: string
  family: string
  title: string
  pitch: string
  best_for: string
  timeline: string
  deliverables: string[]
  accent: string
  order_num: number
}

const defaultShowcaseForm = { eyebrow: '', title: '', summary: '', highlight: '', deliverables: '', accent: '247, 178, 77', tags: '', order_num: 1 }
const defaultPackageForm = { family: '', title: '', pitch: '', best_for: '', timeline: '', deliverables: '', accent: '247, 178, 77', order_num: 1 }

function parseCsv(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function toStrArr(val: unknown): string[] {
  return Array.isArray(val) ? val.filter((v): v is string => typeof v === 'string') : []
}

export default function ServicesPage() {
  const [showcases, setShowcases] = useState<ServiceShowcase[]>([])
  const [packages, setPackages] = useState<OfferPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [schemaMessage, setSchemaMessage] = useState<string | null>(null)
  const [showShowcaseForm, setShowShowcaseForm] = useState(false)
  const [showPackageForm, setShowPackageForm] = useState(false)
  const [editingShowcaseId, setEditingShowcaseId] = useState<string | null>(null)
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null)
  const [showcaseForm, setShowcaseForm] = useState(defaultShowcaseForm)
  const [packageForm, setPackageForm] = useState(defaultPackageForm)

  async function fetchData() {
    const [sRes, pRes] = await Promise.all([
      supabase.from('service_showcases').select('*').order('order_num', { ascending: true }),
      supabase.from('offer_packages').select('*').order('order_num', { ascending: true }),
    ])
    if (isMissingTableError(sRes.error) || isMissingTableError(pRes.error)) {
      setSchemaMessage(getSchemaSetupMessage('Services and packages'))
      setShowcases([]); setPackages([]); setLoading(false); return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ns = ((sRes.data ?? []) as any[]).map((i) => ({ ...i, deliverables: toStrArr(i.deliverables), tags: toStrArr(i.tags) })) as ServiceShowcase[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const np = ((pRes.data ?? []) as any[]).map((i) => ({ ...i, deliverables: toStrArr(i.deliverables) })) as OfferPackage[]
    setShowcases(ns); setPackages(np)
    setShowcaseForm((c) => ({ ...c, order_num: ns.length + 1 }))
    setPackageForm((c) => ({ ...c, order_num: np.length + 1 }))
    setLoading(false)
  }

  useEffect(() => { void fetchData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleShowcaseSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (schemaMessage) return
    const payload = { eyebrow: showcaseForm.eyebrow, title: showcaseForm.title, summary: showcaseForm.summary, highlight: showcaseForm.highlight, deliverables: parseCsv(showcaseForm.deliverables), accent: showcaseForm.accent, tags: parseCsv(showcaseForm.tags), order_num: showcaseForm.order_num }
    if (editingShowcaseId) {
      const { error } = await supabase.from('service_showcases').update(payload).eq('id', editingShowcaseId)
      if (!error) { setShowShowcaseForm(false); setEditingShowcaseId(null); setShowcaseForm(defaultShowcaseForm); void fetchData() }
    } else {
      const { error } = await supabase.from('service_showcases').insert([payload])
      if (!error) { setShowShowcaseForm(false); setShowcaseForm(defaultShowcaseForm); void fetchData() }
    }
  }

  async function handlePackageSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (schemaMessage) return
    const payload = { family: packageForm.family, title: packageForm.title, pitch: packageForm.pitch, best_for: packageForm.best_for, timeline: packageForm.timeline, deliverables: parseCsv(packageForm.deliverables), accent: packageForm.accent, order_num: packageForm.order_num }
    if (editingPackageId) {
      const { error } = await supabase.from('offer_packages').update(payload).eq('id', editingPackageId)
      if (!error) { setShowPackageForm(false); setEditingPackageId(null); setPackageForm(defaultPackageForm); void fetchData() }
    } else {
      const { error } = await supabase.from('offer_packages').insert([payload])
      if (!error) { setShowPackageForm(false); setPackageForm(defaultPackageForm); void fetchData() }
    }
  }

  function editShowcase(item: ServiceShowcase) {
    setEditingShowcaseId(item.id)
    setShowcaseForm({ eyebrow: item.eyebrow, title: item.title, summary: item.summary, highlight: item.highlight, deliverables: item.deliverables.join(', '), accent: item.accent, tags: item.tags.join(', '), order_num: item.order_num })
    setShowShowcaseForm(true)
  }

  function editPackage(item: OfferPackage) {
    setEditingPackageId(item.id)
    setPackageForm({ family: item.family, title: item.title, pitch: item.pitch, best_for: item.best_for, timeline: item.timeline, deliverables: item.deliverables.join(', '), accent: item.accent, order_num: item.order_num })
    setShowPackageForm(true)
  }

  async function deleteShowcase(id: string) { if (!confirm('Delete this service showcase?')) return; const { error } = await supabase.from('service_showcases').delete().eq('id', id); if (!error) void fetchData() }
  async function deletePackage(id: string) { if (!confirm('Delete this package?')) return; const { error } = await supabase.from('offer_packages').delete().eq('id', id); if (!error) void fetchData() }
  function resetShowcaseForm() { setEditingShowcaseId(null); setShowShowcaseForm(false); setShowcaseForm({ ...defaultShowcaseForm, order_num: showcases.length + 1 }) }
  function resetPackageForm() { setEditingPackageId(null); setShowPackageForm(false); setPackageForm({ ...defaultPackageForm, order_num: packages.length + 1 }) }

  if (loading) return <div className="flex items-center justify-center h-96">Loading services...</div>

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Services &amp; Packages</h1>
      {schemaMessage ? <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{schemaMessage}</div> : null}

      <section className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Service Showcases</h2>
          <button type="button" onClick={() => (showShowcaseForm ? resetShowcaseForm() : setShowShowcaseForm(true))} disabled={Boolean(schemaMessage)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm disabled:opacity-60">{showShowcaseForm ? 'Cancel' : '+ Add Showcase'}</button>
        </div>
        {showShowcaseForm && (
          <form onSubmit={handleShowcaseSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" value={showcaseForm.eyebrow} onChange={(e) => setShowcaseForm((c) => ({ ...c, eyebrow: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Website Systems" required />
              <input type="text" value={showcaseForm.accent} onChange={(e) => setShowcaseForm((c) => ({ ...c, accent: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="247, 178, 77" required />
            </div>
            <input type="text" value={showcaseForm.title} onChange={(e) => setShowcaseForm((c) => ({ ...c, title: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Signature websites..." required />
            <textarea value={showcaseForm.summary} onChange={(e) => setShowcaseForm((c) => ({ ...c, summary: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={3} placeholder="Summary" required />
            <textarea value={showcaseForm.highlight} onChange={(e) => setShowcaseForm((c) => ({ ...c, highlight: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={2} placeholder="Highlight" required />
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" value={showcaseForm.deliverables} onChange={(e) => setShowcaseForm((c) => ({ ...c, deliverables: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Creative direction, Custom UI build" required />
              <input type="text" value={showcaseForm.tags} onChange={(e) => setShowcaseForm((c) => ({ ...c, tags: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Storytelling, Performance" required />
            </div>
            <input type="number" min="1" value={showcaseForm.order_num} onChange={(e) => setShowcaseForm((c) => ({ ...c, order_num: Number(e.target.value) }))} className="w-full px-4 py-2 border rounded-lg" required />
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">{editingShowcaseId ? 'Update Showcase' : 'Save Showcase'}</button>
          </form>
        )}
        <div className="space-y-4">
          {showcases.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 flex justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wide text-gray-500">{item.eyebrow}</div>
                <h3 className="font-semibold mt-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{item.summary}</p>
                <p className="text-sm text-gray-500 mt-2">{item.highlight}</p>
              </div>
              <div className="flex gap-2 h-fit">
                <button type="button" onClick={() => editShowcase(item)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">Edit</button>
                <button type="button" onClick={() => deleteShowcase(item.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Offer Packages</h2>
          <button type="button" onClick={() => (showPackageForm ? resetPackageForm() : setShowPackageForm(true))} disabled={Boolean(schemaMessage)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm disabled:opacity-60">{showPackageForm ? 'Cancel' : '+ Add Package'}</button>
        </div>
        {showPackageForm && (
          <form onSubmit={handlePackageSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" value={packageForm.family} onChange={(e) => setPackageForm((c) => ({ ...c, family: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Web Development" required />
              <input type="text" value={packageForm.accent} onChange={(e) => setPackageForm((c) => ({ ...c, accent: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="247, 178, 77" required />
            </div>
            <input type="text" value={packageForm.title} onChange={(e) => setPackageForm((c) => ({ ...c, title: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Starter Site" required />
            <textarea value={packageForm.pitch} onChange={(e) => setPackageForm((c) => ({ ...c, pitch: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={3} placeholder="Pitch" required />
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" value={packageForm.best_for} onChange={(e) => setPackageForm((c) => ({ ...c, best_for: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Best for: founders, freelancers" required />
              <input type="text" value={packageForm.timeline} onChange={(e) => setPackageForm((c) => ({ ...c, timeline: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Delivery: 1-2 weeks" required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" value={packageForm.deliverables} onChange={(e) => setPackageForm((c) => ({ ...c, deliverables: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Custom design, Mobile responsive" required />
              <input type="number" min="1" value={packageForm.order_num} onChange={(e) => setPackageForm((c) => ({ ...c, order_num: Number(e.target.value) }))} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">{editingPackageId ? 'Update Package' : 'Save Package'}</button>
          </form>
        )}
        <div className="space-y-4">
          {packages.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 flex justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wide text-gray-500">{item.family}</div>
                <h3 className="font-semibold mt-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{item.pitch}</p>
                <p className="text-sm text-gray-500 mt-2">{item.best_for}</p>
                <p className="text-xs text-gray-400 mt-2">{item.timeline}</p>
              </div>
              <div className="flex gap-2 h-fit">
                <button type="button" onClick={() => editPackage(item)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">Edit</button>
                <button type="button" onClick={() => deletePackage(item.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
