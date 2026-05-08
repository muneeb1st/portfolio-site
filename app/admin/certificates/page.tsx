'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { triggerRevalidation } from '@/lib/revalidate'

interface Certificate {
  id: string
  title: string
  issuer: string
  issue_date: string
  credential_url: string | null
  order: number
}

interface CertificateForm {
  title: string
  issuer: string
  issue_date: string
  credential_url: string
}

const emptyForm: CertificateForm = {
  title: '',
  issuer: '',
  issue_date: '',
  credential_url: '',
}

export default function ManageCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CertificateForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function loadCertificates() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin')
        return
      }

      const { data } = await supabase.from('certificates').select('*').order('order', { ascending: true })

      if (cancelled) {
        return
      }

      setCertificates((data as Certificate[] | null) ?? [])
      setLoading(false)
    }

    void loadCertificates()

    return () => {
      cancelled = true
    }
  }, [router])

  async function refreshCertificates() {
    const { data } = await supabase.from('certificates').select('*').order('order', { ascending: true })
    setCertificates((data as Certificate[] | null) ?? [])
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (editingId) {
      const { error } = await supabase.from('certificates').update(formData).eq('id', editingId)

      if (!error) {
        setShowForm(false)
        setEditingId(null)
        setFormData(emptyForm)
        void refreshCertificates()
        await triggerRevalidation()
      }
      return
    }

    const { error } = await supabase.from('certificates').insert([
      {
        ...formData,
        order: certificates.length + 1,
      },
    ])

    if (!error) {
      setShowForm(false)
      setFormData(emptyForm)
      void refreshCertificates()
      await triggerRevalidation()
    }
  }

  async function deleteCertificate(id: string) {
    if (!confirm('Are you sure you want to delete this certificate?')) {
      return
    }

    const { error } = await supabase.from('certificates').delete().eq('id', id)

    if (!error) {
      void refreshCertificates()
      await triggerRevalidation()
    }
  }

  function editCertificate(certificate: Certificate) {
    setEditingId(certificate.id)
    setFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      issue_date: certificate.issue_date,
      credential_url: certificate.credential_url ?? '',
    })
    setShowForm(true)
  }

  function cancelEdit() {
    setShowForm(false)
    setEditingId(null)
    setFormData(emptyForm)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Certificates</h1>
      <p className="text-sm text-slate-500 mb-6">Manage your certifications and professional credentials.</p>

      <div>
        <button
          type="button"
          onClick={() => {
            if (showForm && !editingId) {
              setShowForm(false)
              return
            }

            cancelEdit()
            setShowForm(true)
          }}
          className="mb-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add New Certificate'}
        </button>

        {showForm ? (
          <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">{editingId ? 'Edit Certificate' : 'Add New Certificate'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="certificate-title" className="mb-2 block text-gray-700">
                  Certificate Title *
                </label>
                <input
                  id="certificate-title"
                  type="text"
                  value={formData.title}
                  onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                  placeholder="AWS Certified Developer"
                  className="w-full rounded-lg border px-4 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="certificate-issuer" className="mb-2 block text-gray-700">
                  Issuing Organization *
                </label>
                <input
                  id="certificate-issuer"
                  type="text"
                  value={formData.issuer}
                  onChange={(event) => setFormData((current) => ({ ...current, issuer: event.target.value }))}
                  placeholder="Amazon Web Services"
                  className="w-full rounded-lg border px-4 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="certificate-issue-date" className="mb-2 block text-gray-700">
                  Issue Date *
                </label>
                <input
                  id="certificate-issue-date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(event) => setFormData((current) => ({ ...current, issue_date: event.target.value }))}
                  className="w-full rounded-lg border px-4 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="certificate-url" className="mb-2 block text-gray-700">
                  Credential URL
                </label>
                <input
                  id="certificate-url"
                  type="url"
                  value={formData.credential_url}
                  onChange={(event) => setFormData((current) => ({ ...current, credential_url: event.target.value }))}
                  placeholder="https://..."
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700">
                  {editingId ? 'Update Certificate' : 'Save Certificate'}
                </button>
                {editingId ? (
                  <button type="button" onClick={cancelEdit} className="rounded-lg bg-gray-500 px-6 py-2 text-white hover:bg-gray-600">
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        ) : null}

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Existing Certificates ({certificates.length})</h2>

          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading certificates...</div>
          ) : (
            <div className="space-y-4">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="rounded-lg border p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{certificate.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{certificate.issuer}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(certificate.issue_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 sm:ml-4">
                      <button
                        type="button"
                        onClick={() => editCertificate(certificate)}
                        className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCertificate(certificate.id)}
                        className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
